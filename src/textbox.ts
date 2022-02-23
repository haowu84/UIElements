// importing local code, code we have written
import { Window, Widget, WidgetState, IWidgetStateEvent, States, InputType } from "./core";
// importing code from SVG.js library
import { SVG, Svg, G, Rect, Container, Text, Box, Line } from "./core";

class Textbox extends Widget {
    private _group: G;
    private _rect: Rect;
    private _text: Text;
    private _caret: Line;
    private _input: string;
    private _text_y: number;
    private defaultWidth: number = 250;
    private defaultHeight: number = 30;
    private defaultText: string = "";
    private _focused: boolean = false;

    constructor(parent: Window) {
        super(parent);

        this.width = this.defaultWidth;
        this.height = this.defaultHeight;
        this._input = this.defaultText;

        this.render();

        this.idleupstate();
    }

    set text(text: string) {
        this._input = text;
        this.update();
    }

    get text(): string {
        return this._input;
    }

    private positionText() {
        let box: Box = this._text.bbox();

        this._text_y = +this._rect.y() + +this._rect.height() / 2 - box.height / 2;
        this._text.x(+this._rect.x() + 4);
        if (this._text_y > 0) this._text.y(this._text_y);
        this._caret.x(+this._text.x() + this._text.length());
        this._caret.y(this._text.y());
    }

    move(x: number, y: number): void {
        if (this._group != null) this._group.move(x, y);
        this.update();
    }

    render(): void {
        this._group = this.parent.window.group();
        this._rect = this._group.rect(this.width, this.height).radius(10);
        this._text = this._group.text(this._input).fill("white");
        this._caret = this._group.line(0, 0, 0, 20).stroke("white");

        this.backcolor = "#9C27B0";

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
            }
        } else if (inputType == InputType.KeyPress) {
            if (this._focused) {
                let e: any = event;

                if (this._text.length() < +this._rect.width() - 12) {
                    if (e.key == "Backspace") {
                        this.text = this.text.slice(0, -1);
                    } else {
                        this.text = this.text + e.key;
                    }
                    this.raise(inputType, event);
                }
            }
        }
        //console.log("Widget: " + InputType[inputType] + " State: " + States[this.currentState()]);
    }

    private idleupstate() {
        if (this._focused) {
            this._rect.stroke({ color: "#E1BEE7", width: 3 });
            this._caret.show();
        } else {
            this._rect.attr("stroke", null);
            this._caret.hide();
        }
    }

    private idledownstate() {
        if (this._focused) {
            this._rect.stroke({ color: "#E1BEE7", width: 3 });
            this._caret.show();
        } else {
            this._rect.attr("stroke", null);
            this._caret.hide();
        }
    }

    private hoverstate() {
        if (this._focused) {
            this._rect.stroke({ color: "#E1BEE7", width: 3 });
            this._caret.show();
        } else {
            this._rect.attr("stroke", null);
            this._caret.hide();
        }
    }

    private hoverpressedstate() {
        if (this._focused) {
            this._rect.stroke({ color: "#E1BEE7", width: 3 });
            this._caret.show();
        } else {
            this._rect.attr("stroke", null);
            this._caret.hide();
        }
    }

    private pressedstate() {
        if (this._focused) {
            this._rect.stroke({ color: "#E1BEE7", width: 3 });
            this._caret.show();
        } else {
            this._rect.attr("stroke", null);
            this._caret.hide();
        }
    }

    private pressrelease() {
        this._focused = !this._focused;

        if (this._focused) {
            this._rect.stroke({ color: "#E1BEE7", width: 3 });
            this._caret.show();
        } else {
            this._rect.attr("stroke", null);
            this._caret.hide();
        }
    }
}

export { Textbox };
