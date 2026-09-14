function initCalculator() {
  const display = document.getElementById("display");
  const expression = document.getElementById("expression");
  const buttons = document.querySelectorAll(".btn");

  if (!display || !expression) return;

  let currentVal = "0";
  let prevVal = null;
  let currentOp = null;
  let shouldResetDisplay = false;

  function updateDisplay() {
    display.textContent = currentVal;
    if (currentOp && prevVal !== null) {
      const opSymbol = currentOp === "*" ? "×" : currentOp === "/" ? "÷" : currentOp === "-" ? "−" : "+";
      expression.textContent = `${prevVal} ${opSymbol}`;
    } else {
      expression.textContent = "";
    }
  }

  function handleNumber(num) {
    if (currentVal === "0" || shouldResetDisplay) {
      currentVal = num;
      shouldResetDisplay = false;
    } else {
      if (currentVal.length < 12) {
        currentVal += num;
      }
    }
    updateDisplay();
  }

  function handleDecimal() {
    if (shouldResetDisplay) {
      currentVal = "0.";
      shouldResetDisplay = false;
    } else if (!currentVal.includes(".")) {
      currentVal += ".";
    }
    updateDisplay();
  }

  function calculate() {
    if (prevVal === null || currentOp === null) return;
    const prev = parseFloat(prevVal);
    const curr = parseFloat(currentVal);
    let result = 0;

    switch (currentOp) {
      case "+":
        result = prev + curr;
        break;
      case "-":
        result = prev - curr;
        break;
      case "*":
        result = prev * curr;
        break;
      case "/":
        if (curr === 0) {
          currentVal = "Error";
          prevVal = null;
          currentOp = null;
          shouldResetDisplay = true;
          updateDisplay();
          return;
        }
        result = prev / curr;
        break;
      default:
        return;
    }

    // Handle floating precision
    result = Math.round(result * 100000000) / 100000000;
    currentVal = String(result);
    prevVal = null;
    currentOp = null;
    shouldResetDisplay = true;
    updateDisplay();
  }

  function handleOperator(op) {
    if (currentOp && !shouldResetDisplay) {
      calculate();
    }
    prevVal = currentVal;
    currentOp = op;
    shouldResetDisplay = true;
    updateDisplay();
  }

  function clearAll() {
    currentVal = "0";
    prevVal = null;
    currentOp = null;
    shouldResetDisplay = false;
    updateDisplay();
  }

  function deleteLast() {
    if (shouldResetDisplay) return;
    if (currentVal.length > 1) {
      currentVal = currentVal.slice(0, -1);
    } else {
      currentVal = "0";
    }
    updateDisplay();
  }

  function handlePercent() {
    const curr = parseFloat(currentVal);
    if (!isNaN(curr)) {
      currentVal = String(curr / 100);
      updateDisplay();
    }
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.dataset.action;
      const val = btn.dataset.value;

      if (action === "number") {
        handleNumber(val);
      } else if (action === "decimal") {
        handleDecimal();
      } else if (action === "operator") {
        handleOperator(val);
      } else if (action === "equals") {
        calculate();
      } else if (action === "clear") {
        clearAll();
      } else if (action === "delete") {
        deleteLast();
      } else if (action === "percent") {
        handlePercent();
      }
    });
  });

  // Keyboard support
  window.addEventListener("keydown", (e) => {
    if (e.key >= "0" && e.key <= "9") handleNumber(e.key);
    else if (e.key === ".") handleDecimal();
    else if (e.key === "+" || e.key === "-" || e.key === "*" || e.key === "/") handleOperator(e.key);
    else if (e.key === "Enter" || e.key === "=") { e.preventDefault(); calculate(); }
    else if (e.key === "Backspace") deleteLast();
    else if (e.key === "Escape") clearAll();
    else if (e.key === "%") handlePercent();
  });
}

// Ensure execution runs whether DOMContentLoaded has already fired or not
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCalculator);
} else {
  initCalculator();
}
