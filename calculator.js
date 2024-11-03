var display = document.getElementById("display");

var opf = {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "*": (a, b) => a * b,
    "/": (a, b) => a / b
}

function pushNumber(numStr) {
    display.innerHTML += numStr;
}

function pushOperation(op) {
    display.innerHTML += ` ${op} `
    calcDisplay()
}

function clearDisplay(msg) {
    display.innerHTML = msg || "";
}

function calcDisplay() {
    var disp = display.innerHTML.split(" ");
    var res = [];

    if(disp[disp.length - 1] === '') {
        disp.pop();
        res.push(disp[disp.length - 1] + ' ')
        disp.pop();
    }
    console.log(disp)
    if(!isValidArithmeticExp(disp)) {
        return;
    }
    var sum;
    var prevOp;
    for(var i = 0; i < disp.length; i++) {
        var value = +disp[i];

        if(isNaN(value)) {
            if(disp[i] in opf) {
                prevOp = disp[i]
            } else {
                return;
            }
        } else {
            sum = prevOp ?
                opf[prevOp](sum, value) :
                value
        }
    }
    res.push(sum);

    display.innerHTML = res.reverse().join(" ")
}

function backspace() {
    var disp = display.innerHTML;
    if(/ [+\-*\/] $/.test(disp)) {
        display.innerHTML = disp.slice(0, -3);
    } else {
        display.innerHTML = disp.slice(0, -1);
    }

}

/**
 * @param {string[]} exp
 */
function isValidArithmeticExp(exp) {
    if (exp.length === 0) return false;
    if (exp[0] === "" || isNaN(+exp[0])) return false;
    for (let i = 1; i < exp.length; i++) {
        const current = exp[i];
        const previous = exp[i - 1];

        // Check if current is a number or an operator
        const isCurrentNumber = current !== "" ? !isNaN(+current) : false;
        const isPreviousNumber = previous !== "" ? !isNaN(+previous) : false;
        const isOperator = /[+\-*\/]/.test(current);

        if (isCurrentNumber && isPreviousNumber) {
            return false;
        }

        if (isOperator && !isPreviousNumber) {
            return false;
        }
    }
    if (exp[exp.length - 1] === "" || isNaN(+exp[exp.length - 1])) {
        return false;
    }
    return true;
}