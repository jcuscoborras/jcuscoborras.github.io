(() => {
  const gallery = document.querySelector(".research-photos");
  const images = gallery.querySelectorAll(".gallery-frame img");
  const caption = document.querySelector("#gallery-caption");
  const count = document.querySelector("#gallery-count");
  const play = document.querySelector("#gallery-play");
  const controls = gallery.querySelector(".gallery-controls");

  const photos = [
    { caption: caption.textContent },
    { caption: "White hoop-petticoat daffodils", scientificName: "Narcissus cantabricus" },
    { caption: "Hoop-petticoat daffodils in their habitat" },
    { caption: "Daffodils grown for greenhouse experiments" },
  ];

  let current = 0;
  let requested = 0;
  let requestId = 0;
  let timer = null;

  async function show(offset) {
    const next = (requested + offset + photos.length) % photos.length;
    requested = next;
    const id = ++requestId;
    try {
      await images[next].decode();
    } catch {
      if (id === requestId) requested = current;
      return;
    }
    if (id !== requestId) return;

    images[current].hidden = true;
    images[next].hidden = false;
    current = next;
    const photo = photos[current];
    caption.textContent = photo.caption;
    if (photo.scientificName) {
      const name = document.createElement("i");
      name.textContent = photo.scientificName;
      caption.append(" (", name, ")");
    }
    count.textContent = `${current + 1} / ${photos.length}`;
    count.setAttribute("aria-label", `Photo ${current + 1} of ${photos.length}`);
  }

  function stop() {
    window.clearInterval(timer);
    timer = null;
    play.textContent = "Play";
    caption.setAttribute("aria-live", "polite");
  }

  play.addEventListener("click", () => {
    if (timer !== null) {
      stop();
      return;
    }
    play.textContent = "Pause";
    caption.setAttribute("aria-live", "off");
    timer = window.setInterval(() => show(1), 8000);
  });

  document.querySelector("#gallery-prev").addEventListener("click", () => {
    stop();
    show(-1);
  });
  document.querySelector("#gallery-next").addEventListener("click", () => {
    stop();
    show(1);
  });
  gallery.addEventListener("focusin", stop);
  gallery.addEventListener("pointerenter", stop);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
  });

  controls.hidden = false;
})();
