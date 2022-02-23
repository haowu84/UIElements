// importing local code, code we have written
import { Window, Widget, WidgetState, IWidgetStateEvent, States, InputType } from "./core";
// importing code from SVG.js library
import { SVG, Svg, G, Rect, Container, Text, Box, Circle } from "./core";

import { Radiobutton } from "./radiobutton";

class Radiobuttons extends Widget {
    private _radiolist: any[] = [];
    private _input: string;
    private _index: number;
    private _cur: number;
    private _spacing: number = 30;

    constructor(parent: Window, n: number) {
        super(parent);

        for (let i = 0; i < n; i++) this._radiolist.push(new Radiobutton(parent, i));

        this.render();
    }

    text(text: string, i: number) {
        this._index = i;
        this._input = text;
        this.update();
    }

    move(x: number, y: number): void {
        for (let i = 0; i < this._radiolist.length; i++)
            this._radiolist[i].move(x, y + this._spacing * i);
    }

    render(): void {
        let radiolist: any[] = this._radiolist;
        for (var i = 0; i < this._radiolist.length; i++) {
            this._radiolist[i].move(0, this._spacing * i);

            this._radiolist[i]._group.on("checked", function (event: any) {
                for (let i = 0; i < radiolist.length; i++) {
                    if (i != event.detail.id) {
                        radiolist[i].backcolor = "white";
                        radiolist[i]._checked = false;
                    }
                }
            });

            this.registerEvent(this._radiolist[i]._circle);
        }
    }

    update(): void {
        this._radiolist[this._index].text = this._input;
    }

    transition(inputType: InputType, event: string): void {
        if (inputType == InputType.MouseDown) {
            if (this.currentState() == States.Hover) {
                this.current = States.Pressed;
                this.raise(inputType, "pressed");
            }
        } else if (inputType == InputType.MouseUp) {
            if (this.currentState() == States.HoverPressed) {
                this.current = States.Hover;
                this.raise(inputType, "hover");
            } else if (this.currentState() == States.IdleDn) {
                this.current = States.IdleUp;
                this.raise(inputType, "idle up");
            } else if (this.currentState() == States.Pressed) {
                this.current = States.Hover;
                this.pressrelease();
                this.raise(inputType, "click" + this._cur.toString());
            }
        } else if (inputType == InputType.MouseOver) {
            if (this.currentState() == States.IdleDn) {
                this.current = States.HoverPressed;
                this.raise(inputType, "hover pressed");
            } else if (this.currentState() == States.IdleUp) {
                this.current = States.Hover;
                this.raise(inputType, "hover");
            } else if (this.currentState() == States.PressedOut) {
                this.current = States.Pressed;
                this.raise(inputType, "pressed");
            }
        } else if (inputType == InputType.MouseOut) {
            if (this.currentState() == States.HoverPressed) {
                this.current = States.IdleDn;
                this.raise(inputType, "idle down");
            } else if (this.currentState() == States.Hover) {
                this.current = States.IdleUp;
                this.raise(inputType, "idle up");
            } else if (this.currentState() == States.Pressed) {
                this.current = States.PressedOut;
                this.raise(inputType, "pressed out");
            }
        } else if (inputType == InputType.KeyPress) {
            //console.log(event);
        }
        //console.log("Widget: " + InputType[inputType] + " State: " + States[this.currentState()]);
    }

    private pressrelease() {
        for (var i = 0; i < this._radiolist.length; i++)
            if (this._radiolist[i]._checked) this._cur = i + 1;
    }
}

export { Radiobuttons };
