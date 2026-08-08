"use strict";

const copy = {
  pt: {
    whatsapp: "WhatsApp",
    call: "Ligar",
    location: "Localizacao",
    save: "Salvar contato",
    about: "Quem somos",
    review: "Nos avalie",
    email: "E-mail",
    qr: "QRCode",
    contactTitle: "Contato salvo",
    contactText: "No piloto, este botao simula o vCard. Na versao final ele baixa o contato da Junior Auto Pecas com telefone, endereco e redes.",
    aboutTitle: "Quem somos",
    aboutText: "A Junior Auto Pecas atende Joinville com pecas automotivas, agilidade no orcamento e suporte para encontrar o item certo.",
    qrTitle: "QRCode",
    qrText: "Na versao final, este botao abre ou baixa o QRCode do cartao digital."
  },
  en: {
    whatsapp: "WhatsApp",
    call: "Call",
    location: "Location",
    save: "Save contact",
    about: "About us",
    review: "Review us",
    email: "Email",
    qr: "QRCode",
    contactTitle: "Contact saved",
    contactText: "In this pilot, the button simulates a vCard. The final version downloads Junior Auto Pecas contact details.",
    aboutTitle: "About us",
    aboutText: "Junior Auto Pecas serves Joinville with automotive parts, agile quotes and support to find the right item.",
    qrTitle: "QRCode",
    qrText: "In the final version, this button opens or downloads the digital card QRCode."
  },
  es: {
    whatsapp: "WhatsApp",
    call: "Llamar",
    location: "Ubicacion",
    save: "Guardar contacto",
    about: "Quienes somos",
    review: "Calificanos",
    email: "E-mail",
    qr: "QRCode",
    contactTitle: "Contacto guardado",
    contactText: "En el piloto, este boton simula el vCard. En la version final descarga los datos de Junior Auto Pecas.",
    aboutTitle: "Quienes somos",
    aboutText: "Junior Auto Pecas atiende Joinville con autopartes, presupuestos agiles y soporte para encontrar la pieza correcta.",
    qrTitle: "QRCode",
    qrText: "En la version final, este boton abre o descarga el QRCode de la tarjeta digital."
  }
};

const modalActions = {
  contact: ["contactTitle", "contactText"],
  about: ["aboutTitle", "aboutText"],
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
