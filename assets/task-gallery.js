import { catalog } from "./tasks.js";
import { button, element, media } from "./ui.js";

function tasksWithMedia(demos) {
  return catalog.flatMap(({ label: category, tasks }) => tasks.map((title) => {
    const id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const demo = demos[id];
    return {
      id,
      title: title.charAt(0).toUpperCase() + title.slice(1),
      category,
      kind: category === "Composed tasks" ? "composed" : "atomic",
      views: (demo?.views || []).filter(({ src, image }) => src || image),
      steps: demo?.steps || [],
    };
  })).sort((left, right) => Number(Boolean(right.views.length)) - Number(Boolean(left.views.length)));
}

export function renderTaskGallery(gallery, demos) {
  const tasks = tasksWithMedia(demos);
  const get = (id) => gallery.querySelector("#" + id);
  const kinds = [...gallery.querySelectorAll("[data-kind]")];
  const search = get("task-search");
  const category = get("task-category");
  const withMedia = get("task-media-filter");
  const toolbar = get("gallery-toolbar");
  const toggle = get("gallery-toggle");
  const listTitle = get("gallery-list-title");
  const results = get("gallery-results");
  const status = get("gallery-status");
  const title = get("gallery-task-title");
  const stage = get("gallery-stage");
  const hoverPreview = get("gallery-hover-preview");
  const viewOptions = get("gallery-view-options");
  const note = get("gallery-media-note");
  const steps = get("gallery-steps");
  const previous = get("gallery-previous");
  const next = get("gallery-next");
  const position = get("gallery-position");
  const mobile = window.matchMedia("(max-width: 820px)");
  const hoverPointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const featured = tasks.slice(0, 3);

  const requested = new URLSearchParams(window.location.search).get("task");
  let kind = "all";
  let selected = tasks.find(({ id }) => id === requested);
  let displayed;
  let expanded = Boolean(selected && !featured.includes(selected));
  let hoverTimer;
  let matches = [];
  const rows = new Map();

  function chooseKind(value) {
    if (kind === value && category.options.length) return;
    kind = value;
    for (const control of kinds) {
      control.setAttribute("aria-pressed", String(control.dataset.kind === kind));
    }
    const categories = [...new Set(tasks
      .filter((task) => kind === "all" || task.kind === kind)
      .map((task) => task.category))].sort((a, b) => a.localeCompare(b));
    category.replaceChildren(new Option("All categories", ""));
    if (categories.length > 1) {
      for (const name of categories) category.add(new Option(name));
    }
    category.disabled = categories.length < 2;
    updateList();
  }

  function updateList() {
    const query = search.value.trim().toLowerCase();
    const featuredSelection = selected && !featured.includes(selected) ? [selected, ...featured.slice(0, 2)] : featured;
    matches = expanded ? tasks.filter((task) =>
      (kind === "all" || task.kind === kind) &&
      (!category.value || task.category === category.value) &&
      (!withMedia.checked || task.views.length) &&
      (!query || (task.title + " " + task.category).toLowerCase().includes(query))
    ) : featuredSelection;

    clearHover();
    rows.clear();
    results.replaceChildren(...matches.map(createRow));
    if (!matches.length) {
      results.append(element("li", "gallery-no-results", "No matching tasks. Try changing the filters."));
    }
    const available = matches.filter(({ views }) => views.length).length;
    status.textContent = expanded
      ? matches.length + (matches.length === 1 ? " task" : " tasks") + " · " + available + " with media"
      : tasks.length + " tasks in the library";
    results.scrollTop = 0;
    selectTask(matches.includes(selected) ? selected : matches[0]);
    revealSelectedRow();
  }

  function createRow(task) {
    const item = element("li");
    const control = button("", "gallery-task");
    const thumbnail = task.views.map((view) => view.poster || view.image).find(Boolean);
    if (thumbnail) {
      const image = element("img", "gallery-thumbnail");
      image.src = thumbnail;
      image.alt = "";
      image.loading = "lazy";
      control.append(image);
    } else {
      const icon = element("span", "gallery-thumbnail gallery-thumbnail-blank");
      icon.setAttribute("aria-hidden", "true");
      control.append(icon);
    }
    const text = element("span", "gallery-task-text");
    text.append(element("strong", "", task.title), element("span", "", task.category));
    control.append(text);
    if (thumbnail) {
      control.addEventListener("pointerenter", (event) => {
        if (!hoverPointer.matches || event.pointerType !== "mouse" || task === selected) return;
        hoverTimer = window.setTimeout(() => {
          const video = stage.querySelector("video");
          if (video && !video.paused) return;
          const frame = element("img");
          frame.alt = "";
          frame.src = thumbnail;
          hoverPreview.replaceChildren(frame, element("p", "gallery-hover-label", task.title));
          hoverPreview.hidden = false;
        }, 300);
      });
      control.addEventListener("pointerleave", clearHover);
    }
    control.addEventListener("click", () => {
      selectTask(task, true);
      if (mobile.matches) {
        title.focus({ preventScroll: true });
        title.scrollIntoView({ block: "start" });
      }
    });
    rows.set(task, control);
    item.append(control);
    return item;
  }

  function clearHover() {
    window.clearTimeout(hoverTimer);
    hoverPreview.hidden = true;
    hoverPreview.replaceChildren();
  }

  function selectTask(task, updateAddress = false) {
    clearHover();
    rows.get(selected)?.removeAttribute("aria-current");
    selected = task;
    rows.get(selected)?.setAttribute("aria-current", "true");
    const index = matches.indexOf(task);
    previous.disabled = index < 1;
    next.disabled = index < 0 || index >= matches.length - 1;
    position.textContent = index < 0 ? "0 tasks" : (index + 1) + " of " + matches.length;

    if (task && updateAddress) {
      const url = new URL(window.location.href);
      url.searchParams.set("task", task.id);
      url.hash = "tasks";
      window.history.replaceState(window.history.state, "", url);
    }
    if (task === displayed) return;
    displayed = task;

    get("gallery-category").textContent = task?.category || "";
    title.textContent = task?.title || "No matching tasks";
    const views = task?.views || [];
    viewOptions.replaceChildren();
    viewOptions.hidden = views.length < 2;
    const controls = views.map((view, viewIndex) => {
      const control = button(view.label || "View " + (viewIndex + 1));
      control.setAttribute("aria-pressed", String(viewIndex === 0));
      control.addEventListener("click", () => {
        for (const item of controls) item.setAttribute("aria-pressed", String(item === control));
        showView(view, task);
      });
      return control;
    });
    if (!viewOptions.hidden) viewOptions.append(...controls);
    showView(views[0], task);

    const sequence = task?.steps || [];
    steps.hidden = !sequence.length;
    steps.querySelector("ol").replaceChildren(...sequence.map((step) => element("li", "", step)));
  }

  function showView(view, task) {
    stage.querySelector("video")?.pause();
    stage.replaceChildren();
    note.hidden = !view;
    if (!view) {
      stage.append(element("p", "gallery-empty", task ? "Demonstration video pending" : "Adjust the filters to find a task."));
      return;
    }
    const label = view.label || "Task view";
    const type = view.src ? "Video" : "Demonstration frame";
    note.textContent = label + " · " + type + (view.caption ? " · " + view.caption : "");
    if (view.src) {
      stage.append(media(view, task.title + " — " + label, "metadata").wrapper);
    } else {
      const image = element("img");
      image.alt = view.alt || task.title;
      image.src = view.image;
      image.addEventListener("error", () => {
        if (image.parentNode === stage) {
          stage.replaceChildren(element("p", "gallery-empty", "This image could not be loaded."));
        }
      });
      stage.append(image);
    }
  }

  function revealSelectedRow() {
    const row = rows.get(selected);
    if (!row) return;
    const viewport = results.getBoundingClientRect();
    const rect = row.getBoundingClientRect();
    if (rect.top < viewport.top) results.scrollTop -= viewport.top - rect.top;
    if (rect.bottom > viewport.bottom) results.scrollTop += rect.bottom - viewport.bottom;
  }

  function move(delta) {
    const task = matches[matches.indexOf(selected) + delta];
    if (!task) return;
    selectTask(task, true);
    revealSelectedRow();
  }

  function setExpanded(value) {
    expanded = value;
    toolbar.hidden = !expanded;
    results.toggleAttribute("data-lenis-prevent", expanded);
    toggle.setAttribute("aria-expanded", String(expanded));
    toggle.textContent = expanded ? "Show featured" : "Browse all tasks";
    listTitle.textContent = expanded ? "Task library" : "Featured tasks";
  }

  toggle.addEventListener("click", () => {
    setExpanded(!expanded);
    updateList();
  });
  hoverPointer.addEventListener("change", clearHover);

  for (const control of kinds) {
    control.addEventListener("click", () => chooseKind(control.dataset.kind));
  }
  for (const link of document.querySelectorAll('[data-task-kind][href="#tasks"]')) {
    link.addEventListener("click", () => {
      setExpanded(true);
      search.value = "";
      withMedia.checked = false;
      category.value = "";
      if (kind === link.dataset.taskKind) updateList();
      else chooseKind(link.dataset.taskKind);
    });
  }

  search.addEventListener("input", updateList);
  category.addEventListener("change", updateList);
  withMedia.addEventListener("change", updateList);
  previous.addEventListener("click", () => move(-1));
  next.addEventListener("click", () => move(1));
  setExpanded(expanded);
  chooseKind("all");
}
