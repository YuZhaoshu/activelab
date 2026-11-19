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
    backdrop.addColorStop(0, "#2f4b41");
    backdrop.addColorStop(1, "#111d1c");
    ctx.fillStyle = backdrop;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "#c6ebd721";
    for (let x = 14; x < width; x += 19) {
      for (let y = 14; y < height; y += 19) ctx.fillRect(x, y, 1, 1);
    }

    const scale = Math.min(width / (width < 580 ? 735 : 1010), height / 410);
    ctx.translate((width - 900 * scale) / 2, (height - 402 * scale) / 2 - 7);
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

    // Draw the work surface and its isometric grid.
    const front = [354, 370], left = [140, 248], right = [801, 267], back = [588, 146];
    polygon([left, front, right, [801, 281], [354, 385], [140, 262]], "#1f342d", "#709787");
    polygon([left, back, right, front, left], "#314b40", "#83a89a");
    polygon([front, [354, 385]], null, "#83a89a");
    for (let index = 1; index < 19; index += 1) {
      const fraction = index / 19;
      const start = [left[0] + (front[0] - left[0]) * fraction, left[1] + (front[1] - left[1]) * fraction];
      polygon([start, [start[0] + 448, start[1] - 102]], null, "#89b6a13d");
    }
    for (let index = 1; index < 25; index += 1) {
      const x = left[0] + 448 * index / 25;
      const y = left[1] - 102 * index / 25;
      polygon([[x, y], [x + 213, y + 122]], null, "#89b6a13d");
    }

    function vessel(x, y, r, h, liquid = false) {
      ellipse(x + 9, y + 6, r * 1.4, r * .47, "#12231c87");
      const glass = ctx.createLinearGradient(x - r, y, x + r, y);
      glass.addColorStop(0, "#98cab256");
      glass.addColorStop(.54, "#b7e7d619");
      glass.addColorStop(1, "#9ddec689");
      polygon([[x - r, y - h], [x + r, y - h], [x + r * .85, y], [x - r * .85, y], [x - r, y - h]], glass, "#b2d9c99e");
      if (liquid) {
        ellipse(x, y - 19, r * .9, r * .31, "#82dcbf8c", "#bbefdb");
        polygon([[x - r * .9, y - 19], [x + r * .9, y - 19], [x + r * .85, y], [x - r * .85, y]], "#69b79f79");
      }
      ellipse(x, y, r * .85, r * .32, "#8bc4aa3b", "#a5ceba");
      ellipse(x, y - h, r, r * .33, "#223d36b0", "#b2d9c9");
      for (let tick = 14; tick < h - 8; tick += 9) {
        polygon([[x + r * .44, y - tick], [x + r * .67, y - tick - 1]], null, "#bfdac8b7");
      }
    }

    vessel(554, 237, 16, 51);
    vessel(596, 264, 12, 44);
    vessel(329, 289, 22, 61);
    vessel(370, 313, 13, 40);
    vessel(468, 281, 25, 67, true);

    // Give the arm a distinct solid form and the viewing geometry a dashed outline.
    ellipse(674, 276, 65, 18, "#0e1b1799");
    ellipse(666, 266, 46, 15, "#33463e", "#9daea3");
    polygon([[620, 251], [712, 251], [710, 266], [622, 266]], "#62756b");
    ellipse(666, 249, 46, 15, "#a4b4a8", "#d6e1d3");

    function link(from, to, size) {
      const body = ctx.createLinearGradient(from[0], from[1] - size, to[0], to[1] + size);
      body.addColorStop(0, "#e7ebd4");
      body.addColorStop(.55, "#c3cbb6");
      body.addColorStop(1, "#7b9182");
      ctx.lineCap = "round";
      polygon([from, to], null, "#14271f", size + 5);
      polygon([from, to], null, body, size);
      polygon([from.map((v, i) => i ? v - size * .2 : v), to.map((v, i) => i ? v - size * .2 : v)], null, "#f2f5dc87", 2);
      ctx.lineCap = "butt";
    }

    link([666, 239], [714, 134], 47);
    link([714, 134], [633, 73], 40);
    link([633, 73], [505, 124], 31);
    link([505, 124], [487, 160], 19);

    for (const [x, y, radius] of [[666, 239, 24], [714, 134, 23], [633, 73, 20], [505, 124, 16]]) {
      ellipse(x, y, radius, radius * .86, "#aabaa9", "#f1f4dc");
      ellipse(x + 2, y - 1, radius * .64, radius * .55, "#51695d", "#d0ddc9");
      ellipse(x + 2, y - 1, radius * .25, radius * .21, "#42594c");
    }
    polygon([[473, 155], [499, 164], [489, 184], [463, 176], [473, 155]], "#819b89", "#d4e3ce");
    polygon([[469, 178], [459, 194], [463, 197]], null, "#cfe6d0", 3);
    polygon([[486, 182], [474, 198], [469, 198]], null, "#cfe6d0", 3);

    const camera = [246, 111];
    const frame = [[440, 195], [539, 226], [499, 305], [404, 270]];
    polygon([camera, frame[0], frame[3]], "#6fecb922");
    polygon([camera, frame[1], frame[2]], "#a6f2ca24");
    ctx.setLineDash([5, 5]);
    for (const point of frame) polygon([camera, point], null, "#96ecc3a8");
    polygon([...frame, frame[0]], null, "#b7f6d3cb");
    ctx.setLineDash([]);
    ellipse(467, 250, 12, 12, null, "#ceffe5");
    polygon([[449, 250], [485, 250]], null, "#ceffe58c");
    polygon([[467, 232], [467, 268]], null, "#ceffe58c");

    polygon([[207, 81], [231, 75], [259, 92], [236, 99], [207, 81]], "#c1d7c6", "#e5f3e1");
    polygon([[207, 81], [236, 99], [236, 126], [207, 108], [207, 81]], "#627f70", "#b5d1c0");
    polygon([[236, 99], [259, 92], [259, 119], [236, 126], [236, 99]], "#304940", "#b5d1c0");
    ellipse(247, 111, 6, 7, "#9bf5cc", "#d2ffe7");
  }

  draw();
  if ("ResizeObserver" in window) new ResizeObserver(draw).observe(canvas);
}
