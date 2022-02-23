// importing local code, code we have written
import { Window, Widget, WidgetState, IWidgetStateEvent, States, InputType } from "./core";
// importing code from SVG.js library
import { SVG, Svg, G, Rect, Container, Text, Box, Circle } from "./core";

class Radiobutton extends Widget {
    private _group: G;
    private _circle: Circle;
    private _text: Text;
    private _input: string;
    private _text_y: number;
    private defaultWidth: number = 15;
    private defaultHeight: number = 15;
    private defaultText: string = "Radio Button";
    private _checked: boolean = false;
    private _id: number;

    constructor(parent: Window, id: number) {
        super(parent);

        this.width = this.defaultWidth;
        this.height = this.defaultHeight;
        this._input = this.defaultText;
        this._id = id;

        this.render();

        this.idleupstate();
    }

    set text(text: string) {
        this._input = text;
        this.update();
    }

    private positionText() {
        let box: Box = this._text.bbox();

        this._text_y = +this._circle.y() + +this._circle.height() / 2 - box.height / 2;
        this._text.x(+this._circle.x() + 25);
        if (this._text_y > 0) this._text.y(this._text_y);
    }

    move(x: number, y: number): void {
        if (this._group != null) this._group.move(x, y);
        this.update();
    }

    render(): void {
        this._group = this.parent.window.group();

        this._circle = this._group
            .circle(this.width, this.height)
            .stroke("black")
            .attr("id", this._id);
        this._text = this._group.text(this._input);

        this.backcolor = "white";

        this.registerEvent(this._circle);
    }

    update(): void {
        if (this._text != null) this._text.text(this._input);
        if (this._circle != null) this._circle.fill(this.backcolor);
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
        //console.log("Widget: " + InputType[inputType] + " State: " + States[this.currentState()]);
    }

    private idleupstate() {
        this.backcolor = !this._checked ? "white" : "#9C27B0";
    }

    private idledownstate() {
        this.backcolor = !this._checked ? "white" : "#9C27B0";
    }

    private hoverstate() {
        this.backcolor = !this._checked ? "white" : "#9C27B0";
    }

    private hoverpressedstate() {
        this.backcolor = !this._checked ? "white" : "#9C27B0";
    }

    private pressedstate() {
        this.backcolor = "#E1BEE7";
    }

    private pressedoutstate() {
        this.backcolor = "#E1BEE7";
    }

    private pressrelease() {
        if (!this._checked) {
            this.backcolor = "#9C27B0";
            this._checked = true;
        }

        this._group.fire("checked", { id: this._circle.id() });
    }
}

export { Radiobutton };
