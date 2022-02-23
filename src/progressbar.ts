// importing local code, code we have written
import { Window, Widget, WidgetState, IWidgetStateEvent, States, InputType } from "./core";
// importing code from SVG.js library
import { SVG, Svg, G, Rect, Container, Text, Box } from "./core";

class Progressbar extends Widget {
    private _group: G;
    private _bar: Rect;
    private _inc: Rect;
    private defaultWidth: number = 200;
    private defaultHeight: number = 20;
    private _barWidth: number;
    private _incWidth: number = 0;
    private _value: number;

    constructor(parent: Window) {
        super(parent);

        this.width = this.defaultWidth;
        this.height = this.defaultHeight;

        this.render();

        this.idleupstate();
    }

    set barWidth(width: number) {
        this._barWidth = width;
        this.update();
    }

    set incValue(value: number) {
        this._value = value;
    }

    get incValue(): number {
        return this._value;
    }

    incProgress(): void {
        if (this._inc.width() < this._barWidth) {
            this._incWidth = this._incWidth + (this._value / 100) * this._barWidth;
            this.update();
            this.raise(6, ((this._incWidth / this._barWidth) * 100).toString());
        }
    }

    move(x: number, y: number): void {
        if (this._group != null) this._group.move(x, y);
        this.update();
    }

    render(): void {
        this._group = this.parent.window.group();
        this._bar = this._group.rect(this.width, this.height).radius(10).stroke("black");
        this._inc = this._group.rect(this.width / 5, this.height).radius(10);
        this.backcolor = "white";

        this.registerEvent(this._inc);
    }

    update(): void {
        if (this._bar != null) {
            this._bar.width(this._barWidth);
            this._bar.fill(this.backcolor);
        }
        if (this._inc != null) {
            this._inc.width(this._incWidth);
            this._inc.fill("#9C27B0");
        }
    }

    transition(inputType: InputType, event: string): void {
        if (inputType == InputType.MouseDown) {
        } else if (inputType == InputType.MouseUp) {
            if (this.currentState() == States.HoverPressed) {
                this.current = States.Hover;
                this.hoverstate();
                this.raise(inputType, "hover");
            } else if (this.currentState() == States.IdleDn) {
                this.current = States.IdleUp;
                this.idleupstate();
                this.raise(inputType, "idle up");
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
            //console.log(event);
        }
    }

    private idleupstate() {
        this._inc.fill("#9C27B0");
    }

    private idledownstate() {
        this._inc.fill("#9C27B0");
    }

    private hoverstate() {
        this._inc.fill("#7B1FA2");
    }

    private hoverpressedstate() {
        this._inc.fill("#7B1FA2");
    }
}

export { Progressbar };
