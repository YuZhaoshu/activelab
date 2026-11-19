import { project } from "./content.js";
import { drawViewpoint } from "./illustration.js";

const get = (id) => document.getElementById(id);

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function button(label, className = "control") {
  const node = element("button", className, label);
  node.type = "button";
  return node;
}

function media(record, title, preload = "none") {
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

function renderHero() {
  const { hero, authors, affiliations, links } = project;
  const meta = get("project-meta");
  if (authors.length) meta.append(element("p", "", authors.join(", ")));
  if (affiliations.length) meta.append(element("p", "affiliations", affiliations.join(" · ")));
  meta.hidden = !meta.childElementCount;

  const resources = get("project-links");
  resources.replaceChildren();
  resources.hidden = !links.length;
  for (const { label, url, purpose } of links) {
    const accessibleLabel = purpose ? label + " (" + purpose + ")" : label;
    if (url) {
      const link = element("a", "resource", label);
      link.href = url;
      link.setAttribute("aria-label", accessibleLabel);
      resources.append(link);
    } else {
      const placeholder = button(label, "resource");
      placeholder.disabled = true;
      placeholder.title = purpose ? purpose + " link pending" : "Link pending";
      placeholder.setAttribute("aria-label", accessibleLabel + " — link pending");
      resources.append(placeholder);
    }
  }

  if (hero?.src) {
    get("hero-media").replaceChildren(media(hero, "ActiveLab overview video", "metadata").wrapper);
    get("hero-caption").textContent = hero.caption || "";
    get("hero-caption").hidden = !hero.caption;
  } else {
    drawViewpoint(get("viewpoint-illustration"));
  }
}

function renderResearch(id, record) {
  if (!record?.text && !record?.figure?.src) return;
  const target = get(id + "-content");
  for (const paragraph of (record.text || "").trim().split(/\n\s*\n/).filter(Boolean)) {
    target.append(element("p", "", paragraph));
  }
  if (record.figure?.src) {
    const { src, alt, caption } = record.figure;
    const figure = element("figure", "research-figure");
    const image = element("img");
    image.src = src;
    image.alt = alt || "";
    image.loading = "lazy";
    figure.append(image);
    if (caption) figure.append(element("figcaption", "", caption));
    target.append(figure);
  }
  get(id).hidden = false;
}

function renderEntries(target, label, entries, renderEntry) {
  const body = element("div");
  target.replaceChildren();
  if (entries.length > 1) {
    const picker = element("div", "entry-picker");
    const name = element("label", "", label);
    const select = element("select");
    select.id = target.id + "-entry";
    name.htmlFor = select.id;
    entries.forEach(({ title }, index) => {
      const option = element("option", "", title);
      option.value = index;
      select.append(option);
    });
    select.addEventListener("change", () => update(Number(select.value)));
    picker.append(name, select);
    target.append(picker);
  }
  target.append(body);
  update(0);

  function update(index) {
    body.querySelectorAll("video").forEach((video) => video.pause());
    body.replaceChildren();
    renderEntry(body, entries[index]);
  }
}

function renderPair(target, comparison) {
  const grid = element("div", "comparison-grid");
  const videos = [comparison.fixed, comparison.active].map((clip, index) => {
    const label = clip.label || ["Fixed viewpoint", "Active viewpoint"][index];
    const card = element("figure", "media-card");
    const { wrapper, video } = media(clip, comparison.title + " — " + label);
    const caption = element("figcaption", "comparison-label");
    const dot = element("span", index ? "comparison-dot active-dot" : "comparison-dot");
    dot.setAttribute("aria-hidden", "true");
    caption.append(dot, label);
    card.append(caption, wrapper);
    grid.append(card);
    return video;
  });
  const tools = element("div", "compare-tools");
  const play = button("Play both from start", "control primary");
  const pause = button("Pause both");
  const status = element("span", "playback-status");
  status.setAttribute("role", "status");
  let playbackRequest = 0;
  play.addEventListener("click", async () => {
    const request = ++playbackRequest;
    status.textContent = "";
    try {
      await Promise.all(videos.map(async (video) => {
        video.currentTime = 0;
        await video.play();
      }));
    } catch {
      if (request !== playbackRequest) return;
      videos.forEach((video) => video.pause());
      status.textContent = "Could not start both videos. Check the clips and try again.";
    }
  });
  pause.addEventListener("click", () => {
    playbackRequest += 1;
    videos.forEach((video) => video.pause());
    status.textContent = "";
  });
  tools.append(play, pause, status);
  target.append(element("h3", "entry-title", comparison.title), grid, tools);
  if (comparison.caption) target.append(element("p", "media-note", comparison.caption));
}

function renderSkills(entries) {
  if (!entries.length) return;
  const target = get("skills-content");
  const filters = element("div", "filters");
  filters.setAttribute("role", "group");
  filters.setAttribute("aria-label", "Filter skill videos");
  const grid = element("div", "skills-grid");
  const cards = entries.map((skill) => {
    const card = element("article", "media-card");
    const { wrapper, video } = media(skill, skill.title);
    const body = element("div", "skill-body");
    body.append(element("h3", "", skill.title));
    if (skill.caption) body.append(element("p", "", skill.caption));
    card.append(wrapper, body);
    grid.append(card);
    return { card, video, category: skill.category };
  });
  const categories = [...new Set(entries.map(({ category }) => category).filter(Boolean))];
  const buttons = (categories.length ? [null, ...categories] : []).map((category) => {
    const filter = button(category || "All skills");
    filter.setAttribute("aria-pressed", String(category === null));
    filter.addEventListener("click", () => {
      buttons.forEach((other) => other.setAttribute("aria-pressed", String(other === filter)));
      for (const { card, video, category: cardCategory } of cards) {
        card.hidden = category !== null && cardCategory !== category;
        if (card.hidden) video.pause();
      }
    });
    filters.append(filter);
    return filter;
  });
  target.replaceChildren();
  if (buttons.length) target.append(filters);
  target.append(grid);
}

function renderRollout(target, rollout) {
  const { wrapper, video } = media(rollout, rollout.title, "metadata");
  const grid = element("div", "rollout-grid");
  const steps = [...(rollout.steps || [])]
    .filter(({ time, label }) => Number.isFinite(time) && time >= 0 && label)
    .sort((a, b) => a.time - b.time);
  grid.classList.toggle("no-chapters", !steps.length);
  const player = element("div", "rollout-player");
  player.append(wrapper);
  grid.append(player);

  if (steps.length) {
    const panel = element("div", "chapter-panel");
    const list = element("ol", "chapter-list");
    const notes = element("dl", "step-notes");
    notes.setAttribute("aria-label", "Current step annotations");
    notes.hidden = true;
    if (steps.some(({ observation, manipulation }) => observation || manipulation)) {
      player.append(notes);
    }

    let activeStep = -1;
    const chapters = steps.map(({ time, label }) => {
      const minute = Math.floor(time / 60);
      const second = String(Math.floor(time % 60)).padStart(2, "0");
      const control = button("", "chapter-button");
      control.append(element("span", "chapter-time", minute + ":" + second), element("span", "", label));
      control.addEventListener("click", () => {
        video.currentTime = time;
        video.play().catch(() => {});
        updateChapter(time);
      });
      const item = element("li");
      item.append(control);
      list.append(item);
      return control;
    });
    function updateChapter(currentTime) {
      let active = -1;
      steps.forEach(({ time }, index) => {
        if (time <= currentTime && !chapters[index].disabled) active = index;
      });
      if (active === activeStep) return;
      chapters[activeStep]?.removeAttribute("aria-current");
      chapters[active]?.setAttribute("aria-current", "step");
      activeStep = active;

      const step = steps[active];
      notes.replaceChildren();
      for (const [label, description] of [
        ["Observation", step?.observation],
        ["Manipulation", step?.manipulation],
      ]) {
        if (!description) continue;
        const row = element("div");
        row.append(element("dt", "", label), element("dd", "", description));
        notes.append(row);
      }
      notes.hidden = !notes.childElementCount;
    }
    video.addEventListener("timeupdate", () => updateChapter(video.currentTime));
    video.addEventListener("durationchange", () => {
      chapters.forEach((control, index) => {
        control.disabled = steps[index].time >= video.duration;
      });
      updateChapter(video.currentTime);
    });
    video.addEventListener("error", () => {
      chapters.forEach((control) => { control.disabled = true; });
      updateChapter(video.currentTime);
    });
    updateChapter(0);
    panel.append(element("h3", "", "Hand–eye timeline"), list);
    grid.append(panel);
  }
  target.append(element("h3", "entry-title", rollout.title), grid);
  if (rollout.caption) target.append(element("p", "media-note", rollout.caption));
}

renderHero();
renderResearch("research", project.overview);
renderResearch("results", project.results);

const pairs = project.comparisons.filter(({ fixed, active }) => fixed?.src && active?.src);
if (pairs.length) renderEntries(get("comparisons"), "Comparison", pairs, renderPair);
renderSkills(project.skills.filter(({ src }) => src));
const rollouts = project.rollouts.filter(({ src }) => src);
if (rollouts.length) renderEntries(get("rollouts-content"), "Experiment", rollouts, renderRollout);
if (project.bibtex.trim()) {
  get("bibtex").textContent = project.bibtex;
  get("citation").hidden = false;
}
