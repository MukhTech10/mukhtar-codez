/* I keep browser storage keys beside the sample service data so a future API adapter can replace both without changing page markup. */
const STORAGE_KEYS = {
  messages: "fieldwork-basic-messages",
  services: "fieldwork-basic-services",
};
const DEFAULT_SERVICES = [
  {
    title: "Brand direction",
    description:
      "A clear point of view, a sharper story, and a visual system ready to grow.",
  },
  {
    title: "Digital experiences",
    description: "Useful, thoughtful websites and products shaped around real people.",
  },
  {
    title: "Strategy & research",
    description:
      "The right questions and evidence to help your next decision feel obvious.",
  },
];

/* I use guarded JSON reads because local storage may be empty, edited, or malformed; callers receive their fallback instead of a broken page. */
function readStored(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return Array.isArray(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

/* I render service text with DOM nodes, not HTML interpolation, keeping future API-provided copy out of the markup parser. */
function renderServices() {
  const container = document.querySelector("#services-list");
  if (!container) return;
  container.replaceChildren(
    ...readStored(STORAGE_KEYS.services, DEFAULT_SERVICES).map((service, index) => {
      const article = document.createElement("article");
      article.className = "service-card";
      const number = document.createElement("span");
      number.textContent = String(index + 1).padStart(2, "0");
      const title = document.createElement("h3");
      title.textContent = service.title;
      const description = document.createElement("p");
      description.textContent = service.description;
      article.append(number, title, description);
      return article;
    }),
  );
}

/* I describe the email handoff in the console because static browser code cannot safely send owner email or protect email-service credentials. */
function dispatchOwnerNotification(kind, payload) {
  const summary = [
    "MOCK OWNER EMAIL NOTIFICATION",
    "Backend handoff: POST this event to a protected notification endpoint.",
    `Event type: ${kind}`,
    "Owner recipient: hello@fieldwork.studio",
    `Created at: ${new Date().toISOString()}`,
    `Submission data: ${JSON.stringify(payload, null, 2)}`,
  ].join("\n");

  console.info(summary);
}

/* I first let native required, email-type, and minimum-length checks reject invalid input; the payload names match the future contact-message API fields. */
async function handleContactSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const status = document.querySelector("#form-status");
  if (!form.reportValidity()) return;
  /* The id and timestamp support stable dashboard rows and future server-side event reconciliation. */
  const payload = {
    id: crypto.randomUUID(),
    name: form.elements.name.value.trim(),
    email: form.elements.email.value.trim(),
    topic: form.elements.topic.value,
    message: form.elements.message.value.trim(),
    createdAt: new Date().toISOString(),
    status: "new",
  };
  const messages = readStored(STORAGE_KEYS.messages, []);
  messages.unshift(payload);
  localStorage.setItem(STORAGE_KEYS.messages, JSON.stringify(messages));
  dispatchOwnerNotification("contact-message", payload);
  await Promise.resolve();
  form.reset();
  status.textContent =
    "Thanks for reaching out. Your note is saved in this browser demo.";
}

/* I validate the login fields and save only demo identity metadata, never the password; real authentication and access rules belong on a server. */
async function handleLoginSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const identity = {
    email: form.elements.email.value.trim(),
    name: form.elements.email.value.trim().split("@")[0],
    authenticatedAt: new Date().toISOString(),
  };
  localStorage.setItem("fieldwork-basic-session", JSON.stringify(identity));
  await Promise.resolve();
  window.location.assign("dashboard.html");
}

function applyNavigationState() {
  const currentPage = location.pathname.split("/").pop() || "index.html";
  const currentHash = location.hash;

  document.querySelectorAll(".site-header nav a[href]").forEach((link) => {
    const destination = link.getAttribute("href");
    const isSectionLink = destination.startsWith("#");
    const isCurrent = isSectionLink
      ? destination === currentHash || (!currentHash && destination === "#home")
      : destination === currentPage;

    link.classList.toggle("is-active", isCurrent);
    if (isCurrent) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}

/* I add the same accessible menu control to every header at runtime so each static page keeps one reusable navigation contract. */
function setupResponsiveNavigation() {
  document.querySelectorAll(".site-header").forEach((header, index) => {
    const navigation = header.querySelector("nav");
    if (!navigation) return;

    const button = document.createElement("button");
    const navigationId = `primary-navigation-${index + 1}`;
    button.type = "button";
    button.className = "menu-toggle";
    button.textContent = "Menu";
    button.setAttribute("aria-label", "Open navigation menu");
    button.setAttribute("aria-controls", navigationId);
    button.setAttribute("aria-expanded", "false");
    navigation.id = navigationId;
    header.insertBefore(button, navigation);

    button.addEventListener("click", () => {
      const isOpen = header.classList.toggle("menu-open");
      button.setAttribute("aria-expanded", String(isOpen));
      button.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu",
      );
      button.textContent = isOpen ? "Close" : "Menu";
    });

    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        header.classList.remove("menu-open");
        button.setAttribute("aria-expanded", "false");
        button.setAttribute("aria-label", "Open navigation menu");
        button.textContent = "Menu";
      });
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });
  setupResponsiveNavigation();
  applyNavigationState();
  renderServices();

  const contactForm = document.querySelector("#contact-form");
  contactForm?.addEventListener("submit", handleContactSubmit);

  window.addEventListener("hashchange", applyNavigationState);
});
