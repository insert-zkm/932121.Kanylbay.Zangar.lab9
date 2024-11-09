var opf = {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "*": (a, b) => a * b,
    "/": (a, b) => a / b
}

function Display() {
    this.disp = document.getElementById("display");

    /** @return {[string, HTMLElement]} */
    this.getLast = function () {

        if(
            this.disp.lastChild?.tagName === "SPAN" &&
            ["number", "operation"].includes(this.disp.lastChild?.dataset?.type)
        ) {
            return [
                this.disp.lastChild.dataset.type,
                this.disp.lastChild
            ]
        }
        return ["none", null]
    }

    this.addItem = function (content, type) {
        var item = document.createElement("span");
        item.dataset.type = type;
        item.textContent = content;
        this.disp.appendChild(item);
    }
    this.clear = function () {
        this.disp.innerHTML = "";
    }
}

var display = new Display();

/** @param {string} symbol - digit(0-9) or '.' symbol*/
function buildNum(symbol) {
    if (!/^[\d\.]$/.test(symbol)) {
        return;
    }
    function _buildNum(num) {
        if (symbol === ".") {
            return numWithDot(num);
        }

        if(symbol === "0" && num === "0") {
            return num;
        }

        return num + symbol;
    }

    function numWithDot(oldNum) {
        if(oldNum === "") {
            return "0.";
        } else if(oldNum.includes(".")) {
            return oldNum;
        } else {
            return oldNum + "."
        }
    }

    var last = display.getLast();
    if (["operation", "none"].includes(last[0])) {
        display.addItem(_buildNum(""), "number");
        return;
    }

    var num = last[1].textContent;
    last[1].textContent = _buildNum(num);
}

/** @param {string} op - arithmetic operations: *, /, -, +
 * */
function writeOp(op) {
    if(!/^[*\-+\/]$/.test(op)) {
        return;
    }

    var last = display.getLast();
    if("none" === last[0]) {
        return;
    }
    if("number" === last[0]) {
        calcD();
        display.addItem(op, "operation");
        return;
    }
    last[1].remove();
    display.addItem(op, "operation");
}

function backspace() {
    var last = display.getLast();
    if("none" === last[0]) {
        return;
    }

    if("operation" === last[0]) {
        last[1].remove();
        return;
    }

    var num = last[1].textContent;
    if(1 === num.length) {
        last[1].remove();
    }
    last[1].textContent = num.slice(0, -1);
}

function clearD() {
    display.clear();
}

function calcD() {
    var items = display.disp.childNodes;
    if(
        3 !== items.length ||
        "number" !== items[0].dataset.type ||
        "operation" !== items[1].dataset.type ||
        "number" !== items[2].dataset.type
    ) {
        return;
    }

    var n1 = Number(items[0].textContent);
    var op = items[1].textContent;
    var n2 = Number(items[2].textContent);

    if(isNaN(n1) || !/^[*\-+\/]$/.test(op) || isNaN(n2)) {
        return;
    }

    display.clear();
    display.addItem(opf[op](n1, n2), "number");
}