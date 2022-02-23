// importing local code, code we have written
import { Window, Widget, WidgetState, IWidgetStateEvent, States, InputType } from "./core";
// importing code from SVG.js library
import { SVG, Svg, G, Rect, Container, Text, Box } from "./core";

class Button extends Widget {
    private _group: G;
    private _rect: Rect;
    private _text: Text;
    private _input: string;
    private _text_y: number;
    private defaultWidth: number = 100;
    private defaultHeight: number = 50;
    private defaultText: string = "Button";

    constructor(parent: Window) {
        super(parent);
        // set defaults
        this.width = this.defaultWidth;
        this.height = this.defaultHeight;
        this._input = this.defaultText;
        // render widget
        this.render();
        // set default or starting state
        this.idleupstate();
    }

    set text(text: string) {
        this._input = text;
        this.update();
    }

    private positionText() {
        let box: Box = this._text.bbox();
        // in TS, the prepending with + performs a type conversion from string to number
        this._text_y = +this._rect.y() + +this._rect.height() / 2 - box.height / 2;
        this._text.x(+this._rect.x() + +this._rect.width() / 2 - box.width / 2);
        if (this._text_y > 0) this._text.y(this._text_y);
    }

    move(x: number, y: number): void {
        if (this._group != null) this._group.move(x, y);
        this.update();
    }

    render(): void {
        this._group = this.parent.window.group();
        this._rect = this._group.rect(this.width, this.height).radius(10);
        this._text = this._group.text(this._input).fill("white");

        this.backcolor = "#9C27B0";
        // register objects that should receive event notifications.
        // for this widget, we want to know when the group or rect objects
        // receive events
        this.registerEvent(this._rect);
    }

    update(): void {
        if (this._text != null) this._text.text(this._input);
        if (this._rect != null) this._rect.fill(this.backcolor);
        this.positionText();
    }

    transition(inputType: InputType, event: string): void {
        if (inputType == InputType.MouseDown) {
            if (this.currentState() == States.Hover) {
                this.current = States.Pressed;
                this.pressedstate();
                this.raise(inputType, "pressed");
            }
        } else if (inputType == InputType.MouseUp) {
            if (this.currentState() == States.HoverPressed) {
                this.current = States.Hover;
                this.hoverstate();
                this.raise(inputType, "hover");
            } else if (this.currentState() == States.IdleDn) {
                this.current = States.IdleUp;
                this.idleupstate();
                this.raise(inputType, "idle up");
            } else if (this.currentState() == States.Pressed) {
                this.current = States.Hover;
                this.hoverstate();
                this.pressrelease();
                // This is the 'click' event
                this.raise(inputType, "click");
            }
        } else if (inputType == InputType.MouseOver) {
            if (this.currentState() == States.IdleDn) {
                this.current = States.HoverPressed;
                this.hoverpressedstate();
                this.raise(inputType, "hover pressed");
            } else if (this.currentState() == States.IdleUp) {
                this.current = States.Hover;
                this.hoverstate();
                this.raise(inputType, "hover");
            } else if (this.currentState() == States.PressedOut) {
                this.current = States.Pressed;
                this.pressedstate();
                this.raise(inputType, "pressed");
            }
        } else if (inputType == InputType.MouseOut) {
            if (this.currentState() == States.HoverPressed) {
                this.current = States.IdleDn;
                this.idledownstate();
                this.raise(inputType, "idle down");
            } else if (this.currentState() == States.Hover) {
                this.current = States.IdleUp;
                this.idleupstate();
                this.raise(inputType, "idle up");
            } else if (this.currentState() == States.Pressed) {
                this.current = States.PressedOut;
                this.pressedoutstate();
                this.raise(inputType, "pressed out");
            }
        } else if (inputType == InputType.KeyPress) {
            //console.log(event);
        }
        // uncomment the following line for state change debug output in the console.
        //console.log("Widget: " + InputType[inputType] + " State: "+ States[this.currentState()]);
    }

    private idleupstate() {
        this.backcolor = "#9C27B0";
    }

    private idledownstate() {
        this.backcolor = "#9C27B0";
    }

    private hoverstate() {
        this.backcolor = "#7B1FA2";
    }

    private hoverpressedstate() {
        this.backcolor = "#7B1FA2";
    }

    private pressedstate() {
        this.backcolor = "#4A148C";
    }

    private pressedoutstate() {
        this.backcolor = "#4A148C";
    }

    private pressrelease() {
        this.backcolor = "#9C27B0";
    }
}

export { Button };
