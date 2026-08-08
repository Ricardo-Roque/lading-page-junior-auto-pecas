"use strict";

const copy = {
  pt: {
    storeWhatsapp: "Fale com a Loja",
    marketplace: "Mercado Livre",
    marketplaceWhatsapp: "Atendimento ML",
    location: "Como chegar",
    call: "Ligue para nos",
    review: "Avalie nossa loja",
    about: "Quem somos",
    qr: "QR Code",
    qrTitle: "QR Code",
    qrText: "Na versao final, este botao abre ou baixa o QR Code do cartao digital."
  },
  en: {
    storeWhatsapp: "Talk to the Store",
    marketplace: "Mercado Livre",
    marketplaceWhatsapp: "ML Support",
    location: "How to get there",
    call: "Call us",
    review: "Review our store",
    about: "About us",
    qr: "QR Code",
    qrTitle: "QR Code",
    qrText: "In the final version, this button opens or downloads the digital card QR Code."
  },
  es: {
    storeWhatsapp: "Habla con la tienda",
    marketplace: "Mercado Livre",
    marketplaceWhatsapp: "Atencion ML",
    location: "Como llegar",
    call: "Llamanos",
    review: "Evalua nuestra tienda",
    about: "Quienes somos",
    qr: "QR Code",
    qrTitle: "QR Code",
    qrText: "En la version final, este boton abre o descarga el QR Code de la tarjeta digital."
  }
};

const modalActions = {
  qr: ["qrTitle", "qrText"]
};

let currentLang = "pt";

const modal = document.querySelector("#modal");
const modalTitle = document.querySelector("#modalTitle");
const modalText = document.querySelector("#modalText");
const actionGrid = document.querySelector(".action-grid");
const scrollRail = document.querySelector(".scroll-rail");
const scrollTrack = document.querySelector(".scroll-rail__track");
const scrollThumb = document.querySelector(".scroll-rail__thumb");

function setLanguage(lang) {
  if (!copy[lang]) {
    return;
  }

  currentLang = lang;
  document.documentElement.lang = lang === "pt" ? "pt-BR" : lang;

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.dataset.i18n;
    node.textContent = copy[lang][key] || node.textContent;
  });

  document.querySelectorAll(".lang-button").forEach((button) => {
    const active = button.dataset.lang === lang;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  requestAnimationFrame(updateScrollRail);
}

function openModal(title, text) {
  if (!modal || !modalTitle || !modalText) {
    return;
  }

  modalTitle.textContent = title;
  modalText.textContent = text;

  if (typeof modal.showModal === "function") {
    modal.showModal();
    return;
  }

  alert(`${title}\n\n${text}`);
}

document.querySelectorAll(".lang-button").forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.lang));
});

document.querySelectorAll("[data-action]").forEach((button) => {
  button.addEventListener("click", () => {
    const actionKeys = modalActions[button.dataset.action];

    if (!actionKeys) {
      return;
    }

    const text = copy[currentLang];
    openModal(text[actionKeys[0]], text[actionKeys[1]]);
  });
});

document.querySelector("[data-close]")?.addEventListener("click", () => {
  if (typeof modal?.close === "function") {
    modal.close();
  }
});

modal?.addEventListener("click", (event) => {
  const rect = modal.getBoundingClientRect();
  const outside =
    event.clientX < rect.left ||
    event.clientX > rect.right ||
    event.clientY < rect.top ||
    event.clientY > rect.bottom;

  if (outside) {
    if (typeof modal.close === "function") {
      modal.close();
    }
  }
});

function updateScrollRail() {
  if (!actionGrid || !scrollRail || !scrollTrack || !scrollThumb) {
    return;
  }

  const scrollable = actionGrid.scrollHeight > actionGrid.clientHeight + 1;
  scrollRail.style.opacity = scrollable ? "1" : "0";

  if (!scrollable) {
    return;
  }

  const trackHeight = scrollTrack.clientHeight;
  const thumbHeight = Math.max(40, (actionGrid.clientHeight / actionGrid.scrollHeight) * trackHeight);
  const maxThumbTop = trackHeight - thumbHeight;
  const maxScrollTop = actionGrid.scrollHeight - actionGrid.clientHeight;
  const thumbTop = maxScrollTop > 0 ? (actionGrid.scrollTop / maxScrollTop) * maxThumbTop : 0;

  scrollThumb.style.height = `${thumbHeight}px`;
  scrollThumb.style.top = `${thumbTop}px`;
}

actionGrid?.addEventListener("scroll", updateScrollRail, { passive: true });
window.addEventListener("resize", updateScrollRail);
window.addEventListener("load", updateScrollRail);

if ("ResizeObserver" in window && actionGrid) {
  const resizeObserver = new ResizeObserver(updateScrollRail);
  resizeObserver.observe(actionGrid);
}

updateScrollRail();
