// importing local code, code we have written
import { Window, Widget, WidgetState, IWidgetStateEvent, States, InputType } from "./core";
// importing code from SVG.js library
import { SVG, Svg, G, Rect, Container, Text, Box, Circle } from "./core";

class Custom extends Widget {
    private _group: G;
    private _bar: Circle;
    private defaultWidth: number = 50;
    private defaultHeight: number = 50;
    private _incWidth: number = 0;
    private _value: number;
    private _c: number;

    constructor(parent: Window) {
        super(parent);

        this.width = this.defaultWidth;
        this.height = this.defaultHeight;
        this._c = 3.14 * this.width;

        this.render();

        this.idleupstate();
    }

    set incValue(value: number) {
        this._value = value;
    }

    get incValue(): number {
        return this._value;
    }

    incProgress(): void {
        if (0 <= this._incWidth && this._incWidth < 100) {
            this._incWidth = this._incWidth + this._value;
            this._bar.attr("stroke-dashoffset", ((100 - this._incWidth) / 100) * this._c);

            this.update();
            this.raise(6, this._incWidth.toString());
        }
    }

    move(x: number, y: number): void {
        if (this._group != null) this._group.move(x, y);
        this.update();
    }

    render(): void {
        this._group = this.parent.window.group();
        this._bar = this._group.circle(this.width, this.height).stroke({
            color: "#9C27B0",
            width: 5,
        });

        this._bar.attr("stroke-dasharray", this._c);
        this._bar.attr("stroke-dashoffset", ((100 - this._incWidth) / 100) * this._c);

        this.backcolor = "#E1BEE7";

        this.registerEvent(this._bar);
    }

    update(): void {
        if (this._bar != null) {
            this._bar.fill(this.backcolor);
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
        this._bar.fill("#E1BEE7");
    }

    private idledownstate() {
        this._bar.fill("#E1BEE7");
    }

    private hoverstate() {
        this._bar.fill("#BA68C8");
    }

    private hoverpressedstate() {
        this._bar.fill("#BA68C8");
    }
}

export { Custom };
