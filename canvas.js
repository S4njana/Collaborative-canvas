const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth - 40;
canvas.height = window.innerHeight - 150;

let drawing = false;
let brushColor = document.getElementById("colorPicker").value;
let brushSize = document.getElementById("brushSize").value;
let paths = []; // all drawn strokes
let undonePaths = []; // for redo

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mousemove", draw);

document.getElementById("colorPicker").addEventListener("change", (e) => {
  brushColor = e.target.value;
  if (drawing) stopDrawing(); // end current stroke so new color applies
});

document.getElementById("brushSize").addEventListener("change", (e) => {
  brushSize = e.target.value;
  if (drawing) stopDrawing(); // end current stroke so new size applies
});


document.getElementById("undoBtn").addEventListener("click", undo);
document.getElementById("redoBtn").addEventListener("click", redo);
document.getElementById("clearBtn").addEventListener("click", clearCanvas);

function startDrawing(e) {
  drawing = true;
  const path = { color: brushColor, size: brushSize, points: [] };
  paths.push(path);
}

function stopDrawing() {
  drawing = false;
  undonePaths = []; // reset redo stack
}

function draw(e) {
  if (!drawing) return;

  const x = e.offsetX;
  const y = e.offsetY;
  const currentPath = paths[paths.length - 1];
  currentPath.points.push({ x, y });

  redraw();
}

function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const path of paths) {
    ctx.strokeStyle = path.color;
    ctx.lineWidth = path.size;
    ctx.lineCap = "round";
    ctx.beginPath();
    for (let i = 0; i < path.points.length; i++) {
      const p = path.points[i];
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
  }
}

function undo() {
  if (paths.length === 0) return;
  const last = paths.pop();
  undonePaths.push(last);
  redraw();
}

function redo() {
  if (undonePaths.length === 0) return;
  const restored = undonePaths.pop();
  paths.push(restored);
  redraw();
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  paths = [];
  undonePaths = [];
}
