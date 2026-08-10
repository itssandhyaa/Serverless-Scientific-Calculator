 // --- UI Element references ---
const display = document.getElementById("display");
const resultBox = document.getElementById("resultBox");
const eqBtn = document.getElementById("eq");
const statusEl = document.getElementById("status");
const ansEl = document.getElementById("ans");
const histSizeEl = document.getElementById("histSize");
const modeBtn = document.getElementById("modeBtn");
const modeMenu = document.getElementById("modeMenu");

// --- Your API Gateway endpoint URL (update with your deployed API) ---
const API_URL = "https://7maxm6n2og.execute-api.us-east-1.amazonaws.com/dev1"; // Use your own actual URL here

// --- Application state ---
const state = {
  angleMode: "DEG",
  ans: 0,
  history: [],
  memory:0
};

// --- Status message helper ---
function setStatus(msg, ok = true) {
  statusEl.textContent = msg;
  statusEl.style.color = ok ? '#888' : '#d32f2f';
}

// --- Insert text at cursor in contenteditable div ---
function insertText(text) {
  // Insert at cursor position
  document.execCommand("insertText", false, text);
  display.focus();
}

// --- Button click handlers for all keyed buttons ---
document.querySelectorAll("button[data-key]").forEach((btn) => {
  btn.addEventListener("click", () => {
    insertText(btn.getAttribute("data-key"));
  });
});

// --- Special buttons ---
document.getElementById("ac").addEventListener("click", () => {
  display.innerText = "";
  resultBox.value = "";
  setStatus("Cleared");
});

document.getElementById("del").addEventListener("click", () => {
  let txt = display.innerText;
  display.innerText = txt.slice(0, -1);
  display.focus();
});

// Superscript buttons
document.getElementById("sqr").addEventListener("click", () => {
  display.innerHTML += "<sup>2</sup>";
  display.focus();
});
document.getElementById("cube").addEventListener("click", () => {
  display.innerHTML += "<sup>3</sup>";
  display.focus();
});
document.getElementById("tenPow").addEventListener("click", () => {
  display.innerHTML += "10<sup>x</sup>";
  display.focus();
});
document.getElementById("ePow").addEventListener("click", () => {
  display.innerHTML += "e<sup>x</sup>";
  display.focus();
});
document.getElementById("fracBtn").addEventListener("click", () => {
  insertText("()/()");
  display.focus();
});
document.getElementById("ansBtn").addEventListener("click", () => {
  insertText(ansEl.innerText || "0");
  display.focus();
});

const powBtn = document.getElementById("powBtn");
powBtn.addEventListener("click", () => {
  display.focus();
  const sel = window.getSelection();
  if (!sel.rangeCount) return;

  const range = sel.getRangeAt(0);
  range.deleteContents();

  const sup = document.createElement("sup");
  
  const box = document.createElement("span");
  box.className = "exp-box";
  box.contentEditable = "true";
  sup.appendChild(box);

  range.insertNode(sup);

  const newRange = document.createRange();
  newRange.selectNodeContents(box);
  newRange.collapse(true);
  sel.removeAllRanges();
  sel.addRange(newRange);

  box.focus();
});

// --- Angle mode dropdown handling ---
modeBtn.addEventListener("click", () => {
  modeMenu.style.display = modeMenu.style.display === "block" ? "none" : "block";
});
document.querySelectorAll("input[name='angleMode']").forEach((radio) => {
  radio.addEventListener("change", () => {
    if (radio.checked) {
      state.angleMode = radio.value;
      modeBtn.textContent = `Mode: ${state.angleMode} ▼`;
      modeMenu.style.display = "none";
      setStatus(`Angle mode → ${state.angleMode}`, true);
    }
  });
});
document.addEventListener("click", (e) => {
  if (!modeBtn.contains(e.target) && !modeMenu.contains(e.target)) {
    modeMenu.style.display = "none";
  }
});

// --- Keyboard events ---
display.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    runEval();
  } else if (e.key === "Escape") {
    display.innerText = "";
    resultBox.value = "";
    setStatus("Cleared");
  }
});

// --- Evaluation function: sends expression to Lambda via API Gateway ---
async function runEval() {
  const expression = display.innerHTML.trim();  // <-- Changed here
  if (!expression) {
    setStatus("Enter an expression", false);
    resultBox.value = "";
    return;
  }
  setStatus("Calculating...");
  
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        expression: expression,
        angleMode: state.angleMode,
        ans: parseFloat(ansEl.innerText) || 0,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      setStatus(`API error: ${response.status} ${errorText}`, false);
      resultBox.value = "";
      return;
    }
   
      const data = await response.json();

    if (data.status === "OK" && data.result !== undefined) {
      state.ans = data.result;
      resultBox.value = data.result;
      ansEl.textContent = data.result;
      state.history.push({ expr: expression, val: data.result });
      histSizeEl.textContent = state.history.length;
      setStatus("OK", true);
    } 
    else {
      resultBox.value = "";
      setStatus("Error: " + (data.message || "Unknown error"), false);
    }
  }
  catch (err) {
    setStatus("Error: " + err.message, false);
    resultBox.value = "";
  }
}


function getCurrentNumber() {
  // If there is a calculated result, use it first
  const result = parseFloat(resultBox.value);

  if (Number.isFinite(result)) {
    return result;
  }

  // Otherwise read the current calculator display
  const current = display.innerText.trim();

  // Accept only a complete number: 8, -8, 8.5, -8.5
  if (/^-?\d+(\.\d+)?$/.test(current)) {
    return parseFloat(current);
  }

  return null;
}

// === Memory functions ===


function memoryClear() {
  state.memory = 0;
  setStatus("Memory cleared", true);
}

function memoryRecall() {
  const current = display.innerText.trim();

  // If display is empty or already contains just a number,
  // replace it with the recalled memory.
  if (current === "" || /^-?\d+(\.\d+)?$/.test(current)) {
    display.innerText = String(state.memory);
  } 
  else {
    // If it's part of an expression such as 5+,
    // insert memory at the cursor.
    insertText(String(state.memory));
  }

  setStatus(`Memory recalled: ${state.memory}`, true);
  display.focus();
}

function memoryAdd() {
  const val = getCurrentNumber();

  if (val === null) {
    setStatus("Enter a valid number first", false);
    return;
  }

  state.memory += val;
  setStatus(`Memory: ${state.memory}`, true);
}

function memorySubtract() {
  const val = getCurrentNumber();

  if (val === null) {
    setStatus("Enter a valid number first", false);
    return;
  }

  state.memory -= val;
  setStatus(`Memory: ${state.memory}`, true);
}

// "=" button triggers runEval()
eqBtn.addEventListener("click", runEval);

// ----- On page load, focus input -----
window.addEventListener("load", () => {
  display.focus();
  
});


