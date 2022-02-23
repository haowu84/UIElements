import { InputType, Window } from "./core";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { Radiobuttons } from "./radiobuttons";
import { Textbox } from "./textbox";
import { Scrollbar } from "./scrollbar";
import { Progressbar } from "./progressbar";
import { Custom } from "./custom";

let w = new Window("500", "500");
// This just monitors events
/*
w.attach(function (input, event) {
    console.log(input);
});
*/

// For testing, we'll create a text box and add it to the window
// to use for displaying button click messages

let title = w.window.group().text("Covid Servey").move(200, 20);
title.font("size", 20);

let subtitle = w.window
    .group()
    .text("Please select the options, enter your name, and submit response")
    .move(60, 50);
subtitle.font("size", 15);

let outer = w.window.group().rect(350, 180).fill("white").radius(10).stroke("black").move(70, 320);
let inner = w.window.group().rect(350, 50).fill("#9C27B0").radius(10).move(70, 320);

// Attach anonymous function to state change event handler.
// button click event is raised by transition table of widget.
// You can attach as many functions as you want to each widget.
// this functionality is handled by Widget base class

let cb_checked: boolean = false;
let rb_checked: boolean = false;
let tb_input: boolean = false;
let submitted: boolean = false;
let result_text: string = "";
let result: any;

let btn = new Button(w);
btn.text = "Submit";
btn.move(340, 170);

btn.stateEvent().attach(function (input, event) {
    if (event == "click") {
        console.log("Button was clicked");
        if (cb_checked && rb_checked && tb_input && !submitted) {
            custom.incProgress();

            progressbar.incValue = 25;
            for (let i = 1; i <= 4; i++) {
                setTimeout(() => {
                    progressbar.incProgress();
                }, 1000 * i);
            }
            submitted = true;

            setTimeout(() => {
                result = w.window
                    .group()
                    .text(result_text)
                    .fill("white")
                    .font("size", 15)
                    .move(170, 327);
            }, 4000);
        }
    }
});

btn.stateEvent().attach(function (input, event) {
    if (event != "click") console.log("Button: widget state was changed: " + event);
});

let checkbox = new Checkbox(w);
checkbox.text = "I am a UCI Affiliate";
checkbox.move(60, 100);

checkbox.stateEvent().attach(function (input, event) {
    if (event.includes("click")) {
        console.log("Checkbox was " + event.substring(5));
        if (!cb_checked) {
            custom.incValue = 25;
            custom.incProgress();
        } else {
            custom.incValue = -25;
            custom.incProgress();
        }
        cb_checked = event.substring(5) == "checked" ? true : false;
    }
});

checkbox.stateEvent().attach(function (input, event) {
    if (!event.includes("click")) console.log("Checkbox: widget state was changed: " + event);
});

let radiobuttons = new Radiobuttons(w, 2);
radiobuttons.text("I feel fine", 0);
radiobuttons.text("I feel sick", 1);
radiobuttons.move(350, 90);

radiobuttons.stateEvent().attach(function (input, event) {
    if (event.includes("click")) {
        console.log("Radio Button " + event.substring(5) + " was checked");
        if (!rb_checked) {
            custom.incProgress();
        }
        rb_checked = true;

        result_text =
            event.substring(5) == "1"
                ? "You are healthy,\nKeep up the good work."
                : "You are sick,\nPlease call the covid hotline.";
    }
});

radiobuttons.stateEvent().attach(function (input, event) {
    if (!event.includes("click")) console.log("Radio button: widget state was changed: " + event);
});

let textbox = new Textbox(w);
textbox.text = "Your Name";
textbox.move(60, 180);

textbox.stateEvent().attach(function (input, event) {
    if (input == 6) {
        console.log("Text was changed: " + textbox.text);
        if (!tb_input) {
            custom.incProgress();
        }
        tb_input = true;
    }
});

textbox.stateEvent().attach(function (input, event) {
    if (input != 6) console.log("Textbox: widget state was changed: " + event);
});

let progressbar = new Progressbar(w);
progressbar.barWidth = 300;
progressbar.move(140, 260);

progressbar.stateEvent().attach(function (input, event) {
    if (input == 6) console.log("Progress bar has incremented: " + event + "%");
});

progressbar.stateEvent().attach(function (input, event) {
    if (input != 6) console.log("Progress bar: widget state was changed: " + event);
});

let custom = new Custom(w);
custom.move(60, 240);

custom.stateEvent().attach(function (input, event) {
    if (input == 6) console.log("Circular progress bar has incremented: " + event + "%");
});

custom.stateEvent().attach(function (input, event) {
    if (input != 6) console.log("Circular progress bar: widget state was changed: " + event);
});

custom.incValue = 25;

let scrollbar = new Scrollbar(w);
scrollbar.barHeight = 180;
scrollbar.move(450, 320);

scrollbar.stateEvent().attach(function (input, event) {
    if (event == "down" || event == "up") {
        let x: number = scrollbar.thumbPos[0];
        let y: number = scrollbar.thumbPos[1];
        console.log("Scroll thumb has moved " + event + " to x: " + x + " y: " + y);

        if (submitted) {
            inner.y(y);
            result.y(+inner.y() + 7);
        }
    }
});

scrollbar.stateEvent().attach(function (input, event) {
    if (event != "down" || event != "up")
        console.log("Scroll bar: widget state was changed: " + event);
});
