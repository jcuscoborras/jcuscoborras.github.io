(() => {
  const image = document.querySelector("#research-image");
  const gallery = image.closest("figure");
  const caption = document.querySelector("#gallery-caption");
  const count = document.querySelector("#gallery-count");
  const play = document.querySelector("#gallery-play");
  const controls = gallery.querySelector(".gallery-controls");

  const photos = [
    {
      src: image.getAttribute("src"),
      alt: image.alt,
      caption: caption.textContent,
      position: "50% 55%",
    },
    {
      src: "daffodils-white.webp",
      alt: "Close-up of white hoop-petticoat daffodils with yellow centres",
      caption: "White hoop-petticoat daffodils",
      scientificName: "Narcissus cantabricus",
      fit: "contain",
    },
    {
      src: "daffodils-meadow.webp",
      alt: "Yellow hoop-petticoat daffodils flowering in a mountain meadow",
      caption: "Hoop-petticoat daffodils in their habitat",
      fit: "contain",
    },
    {
      src: "daffodils-greenhouse.webp",
      alt: "Potted daffodils with coloured tags in a greenhouse",
      caption: "Daffodils grown for greenhouse experiments",
      position: "50% 72%",
    },
  ];

  let current = 0;
  let timer = null;

  function show(offset) {
    current = (current + offset + photos.length) % photos.length;
    const photo = photos[current];
    image.src = photo.src;
    image.alt = photo.alt;
    image.style.objectPosition = photo.position ?? "";
    image.classList.toggle("show-full-photo", photo.fit === "contain");
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

  image.style.objectPosition = photos[0].position;
  controls.hidden = false;
})();
