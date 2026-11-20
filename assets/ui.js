export function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

export function button(label, className = "control") {
  const node = element("button", className, label);
  node.type = "button";
  return node;
}

export function media(record, title, preload = "none") {
  const wrapper = element("div", "video-wrap");
  const video = element("video");
  video.controls = true;
  video.playsInline = true;
  video.preload = preload;
  video.setAttribute("aria-label", title);
  if (record.poster) video.poster = record.poster;
  video.src = record.src;

  for (const { src, label, lang } of record.captions || []) {
    const track = element("track");
    track.kind = "captions";
    track.label = label;
    track.srclang = lang;
    track.src = src;
    video.append(track);
  }

  const error = element("p", "media-error", "This video could not be loaded.");
  error.hidden = true;
  error.setAttribute("role", "status");
  video.addEventListener("error", () => { error.hidden = false; });
  wrapper.append(video, error);
  return { wrapper, video };
}
