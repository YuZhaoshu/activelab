export function drawViewpoint(canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  function draw() {
    const { width, height } = canvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.scale(ratio, ratio);

    const backdrop = ctx.createRadialGradient(width * .53, height * .51, 0, width * .52, height * .51, width * .69);
    backdrop.addColorStop(0, "#1d3970");
    backdrop.addColorStop(1, "#091730");
    ctx.fillStyle = backdrop;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "#8ebeff44";
    for (let x = 14; x < width; x += 19) {
      for (let y = 14; y < height; y += 19) ctx.fillRect(x, y, 1, 1);
    }

    const scale = Math.min(width / 743, height / 392);
    ctx.translate((width - 932 * scale) / 2, (height - 445 * scale) / 2);
    ctx.scale(scale, scale);

    function polygon(points, fill, stroke, lineWidth = 1) {
      ctx.beginPath();
      points.forEach(([x, y], index) => index === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y));
      if (fill) {
        ctx.closePath();
        ctx.fillStyle = fill;
        ctx.fill();
      }
      if (stroke) {
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = stroke;
        ctx.stroke();
      }
    }

    function ellipse(x, y, radiusX, radiusY, fill, stroke) {
      ctx.beginPath();
      ctx.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2);
      if (fill) {
        ctx.fillStyle = fill;
        ctx.fill();
      }
      if (stroke) {
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    // Faint construction lines keep the camera geometry legible against the bench.
    for (const radius of [128, 168, 208]) {
      ellipse(465, 202, radius, radius, null, "#7fb6ff27");
    }
    polygon([[110, 202], [825, 202]], null, "#7fb6ff2a");
    polygon([[465, 25], [465, 419]], null, "#7fb6ff2a");

    // Draw the work surface and its isometric grid.
    const front = [354, 370], left = [140, 248], right = [801, 267], back = [588, 146];
    polygon([left, front, right, [801, 281], [354, 385], [140, 262]], "#132c54", "#5077ac");
    polygon([left, back, right, front, left], "#224577", "#6f99d4");
    polygon([front, [354, 385]], null, "#6f99d4");
    for (let index = 1; index < 19; index += 1) {
      const fraction = index / 19;
      const start = [left[0] + (front[0] - left[0]) * fraction, left[1] + (front[1] - left[1]) * fraction];
      polygon([start, [start[0] + 448, start[1] - 102]], null, "#8db6ef42");
    }
    for (let index = 1; index < 25; index += 1) {
      const x = left[0] + 448 * index / 25;
      const y = left[1] - 102 * index / 25;
      polygon([[x, y], [x + 213, y + 122]], null, "#8db6ef42");
    }

    function vessel(x, y, r, h, liquid = false) {
      ellipse(x + 9, y + 6, r * 1.4, r * .47, "#0b1c4787");
      const glass = ctx.createLinearGradient(x - r, y, x + r, y);
      glass.addColorStop(0, "#81b8fb66");
      glass.addColorStop(.54, "#c8e6ff22");
      glass.addColorStop(1, "#89ccff9e");
      polygon([[x - r, y - h], [x + r, y - h], [x + r * .85, y], [x - r * .85, y], [x - r, y - h]], glass, "#b4daffaf");
      if (liquid) {
        ellipse(x, y - 19, r * .9, r * .31, "#4facffb5", "#c2edff");
        polygon([[x - r * .9, y - 19], [x + r * .9, y - 19], [x + r * .85, y], [x - r * .85, y]], "#499bff95");
      }
      ellipse(x, y, r * .85, r * .32, "#8bb8ff3b", "#afcefb");
      ellipse(x, y - h, r, r * .33, "#172e56ad", "#b9dcff");
      for (let tick = 14; tick < h - 8; tick += 9) {
        polygon([[x + r * .44, y - tick], [x + r * .67, y - tick - 1]], null, "#d4ebffb7");
      }
    }

    vessel(554, 237, 16, 51);
    vessel(596, 264, 12, 44);
    vessel(329, 289, 22, 61);
    vessel(370, 313, 13, 40);
    vessel(468, 281, 25, 67, true);

    // Give the arm a distinct solid form and the viewing geometry a dashed outline.
    ellipse(674, 276, 65, 18, "#07122d99");
    ellipse(666, 266, 46, 15, "#263f66", "#94abd1");
    polygon([[620, 251], [712, 251], [710, 266], [622, 266]], "#536f98");
    ellipse(666, 249, 46, 15, "#9bb6df", "#e3eeff");

    function link(from, to, size) {
      const body = ctx.createLinearGradient(from[0], from[1] - size, to[0], to[1] + size);
      body.addColorStop(0, "#f0f5ff");
      body.addColorStop(.55, "#bdcfee");
      body.addColorStop(1, "#637da7");
      ctx.lineCap = "round";
      polygon([from, to], null, "#0d2042", size + 5);
      polygon([from, to], null, body, size);
      polygon([from.map((v, i) => i ? v - size * .2 : v), to.map((v, i) => i ? v - size * .2 : v)], null, "#f5faff9c", 2);
      ctx.lineCap = "butt";
    }

    link([666, 239], [714, 134], 47);
    link([714, 134], [633, 73], 40);
    link([633, 73], [505, 124], 31);
    link([505, 124], [487, 160], 19);

    for (const [x, y, radius] of [[666, 239, 24], [714, 134, 23], [633, 73, 20], [505, 124, 16]]) {
      ellipse(x, y, radius, radius * .86, "#abc4e9", "#f0f5ff");
      ellipse(x + 2, y - 1, radius * .64, radius * .55, "#4b6896", "#d6e6ff");
      ellipse(x + 2, y - 1, radius * .25, radius * .21, "#2f4e7b");
    }
    polygon([[473, 155], [499, 164], [489, 184], [463, 176], [473, 155]], "#7796c0", "#d4e7ff");
    polygon([[469, 178], [459, 194], [463, 197]], null, "#d4e9ff", 3);
    polygon([[486, 182], [474, 198], [469, 198]], null, "#d4e9ff", 3);

    const camera = [246, 111];
    const frame = [[440, 195], [539, 226], [499, 305], [404, 270]];
    polygon([camera, frame[0], frame[3]], "#3db4ff48");
    polygon([camera, frame[1], frame[2]], "#82d8ff2f");
    ctx.setLineDash([5, 5]);
    for (const point of frame) polygon([camera, point], null, "#8ad7ffda");
    polygon([...frame, frame[0]], null, "#a9e9ffeb");
    ctx.setLineDash([]);
    ellipse(467, 250, 12, 12, null, "#c5f1ff");
    polygon([[449, 250], [485, 250]], null, "#d3f6ff99");
    polygon([[467, 232], [467, 268]], null, "#d3f6ff99");

    polygon([[207, 81], [231, 75], [259, 92], [236, 99], [207, 81]], "#bcd6f7", "#e5f4ff");
    polygon([[207, 81], [236, 99], [236, 126], [207, 108], [207, 81]], "#6282ad", "#b5d6f8");
    polygon([[236, 99], [259, 92], [259, 119], [236, 126], [236, 99]], "#233c67", "#b5d6f8");
    ellipse(247, 111, 6, 7, "#81d8ff", "#daf5ff");
  }

  draw();
  if ("ResizeObserver" in window) new ResizeObserver(draw).observe(canvas);
}
