# Pomodoro

A Pomodoro productivity timer built with vanilla JavaScript, HTML, and CSS. It helps you stay focused by alternating timed work sessions with short and long breaks, and includes a simple task list so you can track what you are working on.

## Tech Stack

- HTML5
- CSS3 (custom properties, flexbox, responsive design)
- Vanilla JavaScript (ES6+)

No build tools or dependencies required.

## Project Structure

```
Pomodoro/
├── index.html   # App shell and markup
├── main.js      # Timer logic and task management
├── main.css     # Styles
├── LICENSE
└── README.md
```

## Features

- 25-minute work sessions, 5-minute short breaks, 15-minute long breaks
- Start / Pause / Reset controls
- Visual countdown in MM:SS format
- Auto-switches between work and break sessions when the timer reaches zero
- Long break triggered automatically every 4 completed Pomodoros
- Session counter that tracks completed Pomodoros
- Task list — add tasks and start a Pomodoro directly from a task; completed tasks are marked automatically

## Setup and Usage

No installation or build step is needed. Open `index.html` directly in any modern browser:

```bash
# macOS / Linux
open index.html

# Windows
start index.html
```

Or serve the folder with any static file server:

```bash
npx serve .
# then visit http://localhost:3000
```

### Using the Timer

1. Open `index.html` in your browser.
2. Click **Start** to begin a 25-minute work session.
3. Click **Pause** to pause and **Start** again to resume.
4. Click **Reset** to restart the current session from the beginning.
5. Use the **Work / Short Break / Long Break** buttons to switch sessions manually.

### Using the Task List

1. Type a task name in the input field and click **Agregar Tarea** (or press Enter).
2. Click the **Start** button next to any task to begin a work session tied to that task.
3. When the session ends the task is automatically marked as **Done**.

## License

MIT License. See [LICENSE](LICENSE) for details.
