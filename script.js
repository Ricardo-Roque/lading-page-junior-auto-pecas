"use strict";

const copy = {
  pt: {
    storeWhatsapp: "Atendimento Joinville",
    marketplace: "Loja Oficial Mercado Livre",
    marketplaceWhatsapp: "Atendimento Mercado Livre",
    location: "Como Chegar",
    call: "Ligue para Nós",
    review: "Avalie no Google",
    about: "Sobre a Junior",
    qr: "Acesse pelo QR Code",
    qrTitle: "QR Code",
    qrText: "Aponte a câmera do celular para acessar o cartão digital."
  },
  en: {
    storeWhatsapp: "Joinville Support",
    marketplace: "Official Mercado Livre Store",
    marketplaceWhatsapp: "Mercado Livre Support",
    location: "How to Get Here",
    call: "Call Us",
    review: "Review on Google",
    about: "About Junior",
    qr: "Access via QR Code",
    qrTitle: "QR Code",
    qrText: "Point your phone camera to open the digital card."
  },
  es: {
    storeWhatsapp: "Atención Joinville",
    marketplace: "Tienda Oficial Mercado Livre",
    marketplaceWhatsapp: "Atención Mercado Livre",
    location: "Cómo Llegar",
    call: "Llámanos",
    review: "Evalúa en Google",
    about: "Sobre Junior",
    qr: "Accede por Código QR",
    qrTitle: "QR Code",
    qrText: "Apunta la cámara del celular para abrir la tarjeta digital."
  }
};

const modalActions = {
  qr: ["qrTitle", "qrText", true]
};

let currentLang = "pt";

const modal = document.querySelector("#modal");
const modalTitle = document.querySelector("#modalTitle");
const modalText = document.querySelector("#modalText");
const modalQr = document.querySelector("#modalQr");
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

function openModal(title, text, showQr = false) {
  if (!modal || !modalTitle || !modalText) {
    return;
  }

  modalTitle.textContent = title;
  modalText.textContent = text;

  if (modalQr) {
    modalQr.hidden = !showQr;
  }

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
    openModal(text[actionKeys[0]], text[actionKeys[1]], actionKeys[2]);
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
