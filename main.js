// Pomodoro Timer
// Durations in seconds
const DURATIONS = {
  work: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

const tasks = [];
let timeLeft = DURATIONS.work;
let timer = null;
let sessionType = "work"; // "work" | "shortBreak" | "longBreak"
let pomodoroCount = 0;
let isRunning = false;
let activeTaskId = null;

// DOM references
const valueEl = document.querySelector("#value");
const taskNameEl = document.querySelector("#taskName");
const form = document.querySelector("#form");
const itTask = document.querySelector("#it");
const tasksContainer = document.querySelector("#tasks");

// Inject timer controls into the #time div
const timeDiv = document.querySelector("#time");

const controlsHTML = `
  <div id="session-label">Work Session</div>
  <div id="timer-display">25:00</div>
  <div id="pomodoro-count">Pomodoros completed: 0</div>
  <div id="controls">
    <button id="btn-start">Start</button>
    <button id="btn-pause" disabled>Pause</button>
    <button id="btn-reset">Reset</button>
  </div>
  <div id="session-buttons">
    <button class="session-btn active" data-type="work">Work</button>
    <button class="session-btn" data-type="shortBreak">Short Break</button>
    <button class="session-btn" data-type="longBreak">Long Break</button>
  </div>
`;
timeDiv.innerHTML = controlsHTML;

// Hide the old #value and #taskName (replaced by injected markup)
const timerDisplay = document.querySelector("#timer-display");
const sessionLabel = document.querySelector("#session-label");
const pomodoroCountEl = document.querySelector("#pomodoro-count");
const btnStart = document.querySelector("#btn-start");
const btnPause = document.querySelector("#btn-pause");
const btnReset = document.querySelector("#btn-reset");
const sessionBtns = document.querySelectorAll(".session-btn");

// Render initial time
updateDisplay();

// ── Timer Controls ────────────────────────────────────────────────────────────

btnStart.addEventListener("click", () => {
  startTimer();
});

btnPause.addEventListener("click", () => {
  pauseTimer();
});

btnReset.addEventListener("click", () => {
  resetTimer();
});

sessionBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (isRunning) pauseTimer();
    sessionType = btn.getAttribute("data-type");
    timeLeft = DURATIONS[sessionType];
    updateSessionLabel();
    updateDisplay();
    setActiveSessionBtn(btn);
  });
});

function startTimer() {
  if (isRunning) return;
  isRunning = true;
  btnStart.disabled = true;
  btnPause.disabled = false;

  timer = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateDisplay();
    } else {
      handleSessionEnd();
    }
  }, 1000);
}

function pauseTimer() {
  isRunning = false;
  clearInterval(timer);
  timer = null;
  btnStart.disabled = false;
  btnPause.disabled = true;
}

function resetTimer() {
  pauseTimer();
  timeLeft = DURATIONS[sessionType];
  updateDisplay();
}

function handleSessionEnd() {
  pauseTimer();

  if (sessionType === "work") {
    pomodoroCount++;
    pomodoroCountEl.textContent = `Pomodoros completed: ${pomodoroCount}`;

    // Mark active task complete after a work session
    if (activeTaskId) {
      const task = tasks.find((t) => t.id === activeTaskId);
      if (task) {
        task.completed = true;
        activeTaskId = null;
      }
      renderTasks();
    }

    // Every 4 pomodoros take a long break, otherwise short break
    if (pomodoroCount % 4 === 0) {
      switchSession("longBreak");
    } else {
      switchSession("shortBreak");
    }
  } else {
    switchSession("work");
  }

  // Auto-start next session
  startTimer();
}

function switchSession(type) {
  sessionType = type;
  timeLeft = DURATIONS[type];
  updateSessionLabel();
  updateDisplay();
  const btn = document.querySelector(`.session-btn[data-type="${type}"]`);
  if (btn) setActiveSessionBtn(btn);
}

function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  document.title = `${timerDisplay.textContent} — Pomodoro`;
}

function updateSessionLabel() {
  const labels = {
    work: "Work Session",
    shortBreak: "Short Break",
    longBreak: "Long Break",
  };
  sessionLabel.textContent = labels[sessionType] || "Work Session";
}

function setActiveSessionBtn(activeBtn) {
  sessionBtns.forEach((b) => b.classList.remove("active"));
  activeBtn.classList.add("active");
}

// ── Task Management ───────────────────────────────────────────────────────────

renderTasks();

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const val = itTask.value.trim();
  if (val !== "") {
    createTask(val);
    itTask.value = "";
    renderTasks();
  }
});

function createTask(value) {
  const newTask = {
    id: (Math.random() * 100).toString(36).slice(2),
    title: value,
    completed: false,
  };
  tasks.unshift(newTask);
}

function renderTasks() {
  const html = tasks.map((task) => {
    const statusHTML = task.completed
      ? "<span class='done'>Done</span>"
      : `<button class="start-button" data-id="${task.id}">Start</button>`;
    return `
      <div class="task${task.completed ? " task--done" : ""}">
        <div class="completed">${statusHTML}</div>
        <div class="title">${task.title}</div>
      </div>`;
  });
  tasksContainer.innerHTML = html.join("");

  document.querySelectorAll(".task .start-button").forEach((startButton) => {
    startButton.addEventListener("click", () => {
      if (!isRunning || sessionType !== "work") {
        // Switch to work session and start
        switchSession("work");
        activeTaskId = startButton.getAttribute("data-id");
        startTimer();
        // Update button text
        document.querySelectorAll(".task .start-button").forEach((b) => {
          b.textContent = "Start";
        });
        startButton.textContent = "In progress...";
      }
    });
  });
}
