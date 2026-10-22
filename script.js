const menuButton = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector("#primary-nav");

menuButton?.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  primaryNav?.classList.toggle("is-open", !isOpen);
});

primaryNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuButton?.setAttribute("aria-expanded", "false");
    primaryNav.classList.remove("is-open");
  });
});

const trackedLinks = [...(primaryNav?.querySelectorAll('a[href^="#"]') ?? [])];
const trackedSections = trackedLinks
  .map((link) => ({ link, section: document.querySelector(link.getAttribute("href")) }))
  .filter(({ section }) => section);
let activeSectionFrame = 0;

function updateActiveSection() {
  activeSectionFrame = 0;
  const headerBottom = document.querySelector(".site-header")?.getBoundingClientRect().bottom ?? 0;
  const activationLine = headerBottom + 48;
  let active = null;

  for (const item of trackedSections) {
    if (item.section.getBoundingClientRect().top <= activationLine) active = item;
  }

  trackedLinks.forEach((link) => link.removeAttribute("aria-current"));
  active?.link.setAttribute("aria-current", "location");
}

window.addEventListener("scroll", () => {
  if (!activeSectionFrame) activeSectionFrame = requestAnimationFrame(updateActiveSection);
}, { passive: true });
window.addEventListener("resize", updateActiveSection);
updateActiveSection();

const counter = document.querySelector("#learning-days");
if (counter) {
  const start = new Date(2023, 7, 19);

  function updateLearningDays() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const elapsedDays = Math.max(0, Math.floor((today - start) / 86_400_000));
    counter.textContent = `${new Intl.NumberFormat("en-IN").format(elapsedDays)}+`;

    const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    window.setTimeout(updateLearningDays, nextMidnight.getTime() - now.getTime() + 50);
  }

  updateLearningDays();
}

const imageDialog = document.querySelector("#image-dialog");
const dialogImage = document.querySelector("#dialog-image");
let imageZoom = 1;

document.querySelectorAll("[data-zoom-image]").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    if (!imageDialog || !dialogImage) return;
    dialogImage.src = trigger.dataset.zoomImage;
    dialogImage.alt = trigger.querySelector("img")?.alt ?? "Expanded portfolio image";
    imageZoom = 1;
    dialogImage.style.setProperty("--zoom", imageZoom);
    imageDialog.showModal();
  });
});

imageDialog?.querySelectorAll("[data-zoom-step]").forEach((button) => {
  button.addEventListener("click", () => {
    imageZoom = Math.min(2.4, Math.max(0.8, imageZoom + Number(button.dataset.zoomStep)));
    dialogImage?.style.setProperty("--zoom", imageZoom);
  });
});

imageDialog?.querySelector("[data-zoom-reset]")?.addEventListener("click", () => {
  imageZoom = 1;
  dialogImage?.style.setProperty("--zoom", imageZoom);
});

imageDialog?.addEventListener("click", (event) => {
  if (event.target === imageDialog) imageDialog.close();
});
