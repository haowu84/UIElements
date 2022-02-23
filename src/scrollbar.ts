// importing local code, code we have written
import { Window, Widget, WidgetState, IWidgetStateEvent, States, InputType } from "./core";
// importing code from SVG.js library
import { SVG, Svg, G, Rect, Container, Text, Box } from "./core";

class Scrollbar extends Widget {
    private _group: G;
    private _bar: Rect;
    private _thumb: Rect;
    private defaultWidth: number = 20;
    private defaultHeight: number = 250;
    private _barHeight: number;
    private _lastY: number = 0;

    constructor(parent: Window) {
        super(parent);

        this.width = this.defaultWidth;
        this.height = this.defaultHeight;

        this.render();

        this.idleupstate();
    }

    set barHeight(height: number) {
        this._barHeight = height;
        this.update();
    }

    get thumbPos(): any {
        return [this._thumb.x(), this._thumb.y()];
    }

    move(x: number, y: number): void {
        if (this._group != null) this._group.move(x, y);
        this.update();
    }

    render(): void {
        this._group = this.parent.window.group();
        this._bar = this._group.rect(this.width, this.height).radius(10).stroke("black");
        this._thumb = this._group.rect(this.width, this.height / 4).radius(10);
        this.backcolor = "white";

        this.registerEvent(this._group);
        this.registerEvent(this._thumb);
    }

    update(): void {
        if (this._bar != null) {
            this._bar.height(this._barHeight);
            this._bar.fill(this.backcolor);
        }
        if (this._thumb != null) {
            this._thumb.height(this._barHeight / 4);
            this._thumb.fill("#9C27B0");
        }
    }

    transition(inputType: InputType, event: string): void {
        if (inputType == InputType.MouseDown) {
            if (this.currentState() == States.Hover) {
                this.current = States.Pressed;
                this.pressedstate();

                let e: any = event;
                let direction: number = e.clientY - this._lastY;
                this._lastY = e.clientY;

                let pos: number = e.clientY - +this._thumb.height() / 2;

                if (pos < +this._bar.y() + +this._thumb.height() / 2) {
                    this._thumb.y(+this._bar.y());
                } else if (pos > +this._bar.y() + +this._bar.height() - +this._thumb.height()) {
                    this._thumb.y(+this._bar.y() + +this._bar.height() - +this._thumb.height());
                } else {
                    this._thumb.y(pos);
                }

                this.raise(inputType, direction > 0 ? "down" : "up");
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
            //console.log(event);
        }
        //console.log("Widget: " + InputType[inputType] + " State: " + States[this.currentState()]);
    }

    private idleupstate() {
        this._thumb.fill("#9C27B0");
    }

    private idledownstate() {
        this._thumb.fill("#9C27B0");
    }

    private hoverstate() {
        this._thumb.fill("#7B1FA2");
    }

    private hoverpressedstate() {
        this._thumb.fill("#7B1FA2");
    }

    private pressedstate() {
        this._thumb.fill("#4A148C");
    }

    private pressrelease() {
        this._thumb.fill("#9C27B0");
    }
}

export { Scrollbar };
