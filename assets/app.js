const root = document.documentElement;
const languageSelect = document.querySelector("#languageSelect");
const themeToggle = document.querySelector("#themeToggle");
const page = document.body.dataset.page || "landing";
const supportedLanguages = ["zh", "en", "ar"];

async function initI18n() {
  await i18next
    .use(i18nextHttpBackend)
    .use(i18nextBrowserLanguageDetector)
    .init({
      fallbackLng: "zh",
      supportedLngs: supportedLanguages,
      load: "languageOnly",
      ns: ["common"],
      defaultNS: "common",
      backend: {
        loadPath: "locales/{{lng}}/{{ns}}.json"
      },
      detection: {
        order: ["localStorage", "navigator"],
        caches: ["localStorage"],
        lookupLocalStorage: "scholardaily-language"
      }
    });

  const normalizedLanguage = normalizeLanguage(i18next.resolvedLanguage || i18next.language);
  applyLanguage(normalizedLanguage);
  bindLanguageEvents();
  bindThemeEvents();
  bindCommonDemos();

  if (page === "docs") {
    bindDocsPage();
  }
}

function normalizeLanguage(language) {
  if (!language) return "zh";
  const short = language.split("-")[0];
  return supportedLanguages.includes(short) ? short : "zh";
}

function translatePage() {
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = i18next.t(node.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    node.setAttribute("placeholder", i18next.t(node.dataset.i18nPlaceholder));
  });

  const commandInput = document.querySelector("#commandInput");
  if (commandInput) {
    commandInput.setAttribute("placeholder", i18next.t("docs.commandSearch"));
  }
}

function applyLanguage(language) {
  const next = normalizeLanguage(language);
  root.lang = next === "zh" ? "zh-CN" : next;
  root.dir = next === "ar" ? "rtl" : "ltr";

  if (languageSelect) {
    languageSelect.value = next;
  }

  if (i18next.language !== next && i18next.resolvedLanguage !== next) {
    i18next.changeLanguage(next).then(() => {
      translatePage();
      refreshDynamicCopy();
    });
    return;
  }

  translatePage();
  refreshDynamicCopy();
}

function bindLanguageEvents() {
  languageSelect?.addEventListener("change", (event) => {
    applyLanguage(event.target.value);
  });
}

function applyTheme(theme) {
  const nextTheme = theme === "dark" ? "dark" : "light";
  root.dataset.theme = nextTheme;
  themeToggle?.setAttribute("aria-pressed", String(nextTheme === "dark"));
  localStorage.setItem("scholardaily-theme", nextTheme);
}

function bindThemeEvents() {
  const preferredTheme = localStorage.getItem("scholardaily-theme") || "light";
  applyTheme(preferredTheme);
  themeToggle?.addEventListener("click", () => {
    applyTheme(root.dataset.theme === "dark" ? "light" : "dark");
  });
}

function bindCommonDemos() {
  document.querySelectorAll("[data-bookmark]").forEach((button) => {
    button.addEventListener("click", () => {
      const saved = button.classList.toggle("is-saved");
      button.textContent = saved ? "★" : "☆";
      button.closest(".paper-card-demo")?.classList.toggle("is-saved", saved);
    });
  });

  document.querySelectorAll("[data-chip]").forEach((button) => {
    button.addEventListener("click", () => {
      button.classList.toggle("is-active");
    });
  });
}

function bindDocsPage() {
  bindSidebarFilter();
  bindSidebarToggle();
  bindScrollSpy();
  bindPaperCardDemo();
  bindSummaryDemo();
  bindCommandBar();
  bindSheetDemo();
  bindAiAnswerDemo();
  bindPageTabs();
}

function bindSidebarFilter() {
  const filterInput = document.querySelector("#sidebarFilter");
  if (!filterInput) return;

  filterInput.addEventListener("input", () => {
    const keyword = filterInput.value.trim().toLowerCase();
    document.querySelectorAll("[data-nav-item]").forEach((link) => {
      const visible = link.textContent.toLowerCase().includes(keyword);
      link.classList.toggle("hidden", !visible);
    });
  });
}

function bindSidebarToggle() {
  const toggle = document.querySelector("#sidebarToggle");
  const sidebar = document.querySelector("#docsSidebar");
  if (!toggle || !sidebar) return;

  toggle.addEventListener("click", () => {
    const isOpen = sidebar.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

function bindScrollSpy() {
  const links = [...document.querySelectorAll("[data-nav-item]")];
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (!links.length || !sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;
      const id = `#${visible.target.id}`;
      links.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === id);
      });
    },
    {
      rootMargin: "-20% 0px -60% 0px",
      threshold: [0.2, 0.6]
    }
  );

  sections.forEach((section) => observer.observe(section));
}

function bindPaperCardDemo() {
  const demoCard = document.querySelector("#paperCardDemo");
  const bookmark = demoCard?.querySelector("[data-bookmark]");
  if (!demoCard) return;

  document.querySelectorAll("[data-paper-state]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-paper-state]").forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");

      demoCard.classList.remove("is-read", "is-saved");

      if (button.dataset.paperState === "read") {
        demoCard.classList.add("is-read");
        if (bookmark) {
          bookmark.classList.remove("is-saved");
          bookmark.textContent = "☆";
        }
      }

      if (button.dataset.paperState === "saved") {
        demoCard.classList.add("is-saved");
        if (bookmark) {
          bookmark.classList.add("is-saved");
          bookmark.textContent = "★";
        }
      }
    });
  });
}

function bindSummaryDemo() {
  const text = document.querySelector("[data-summary-text]");
  if (!text) return;

  document.querySelectorAll("[data-summary-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-summary-mode]").forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");

      const key = button.dataset.summaryMode === "detail" ? "docs.summaryDetail" : "docs.summaryBrief";
      text.textContent = i18next.t(key);
    });
  });
}

function bindCommandBar() {
  const overlay = document.querySelector("#commandOverlay");
  const openButton = document.querySelector("#commandOpenButton");
  const closeButton = document.querySelector("#commandCloseButton");
  const input = document.querySelector("#commandInput");
  const results = document.querySelector("#commandResults");
  if (!overlay || !openButton || !closeButton || !input || !results) return;

  const open = () => {
    overlay.classList.remove("hidden");
    input.focus();
  };

  const close = () => {
    overlay.classList.add("hidden");
    input.value = "";
    filterCommands("");
  };

  const filterCommands = (keyword) => {
    const query = keyword.trim().toLowerCase();
    results.querySelectorAll("button").forEach((button) => {
      const visible = button.textContent.toLowerCase().includes(query);
      button.classList.toggle("hidden", !visible);
    });
  };

  openButton.addEventListener("click", open);
  closeButton.addEventListener("click", close);
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) close();
  });
  input.addEventListener("input", () => filterCommands(input.value));
  document.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      open();
    }

    if (event.key === "Escape") {
      close();
    }
  });

  results.querySelectorAll("[data-command-target]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelector(button.dataset.commandTarget)?.scrollIntoView({ behavior: "smooth", block: "start" });
      close();
    });
  });
}

function bindSheetDemo() {
  const overlay = document.querySelector("#sheetOverlay");
  const openButton = document.querySelector("#sheetOpenButton");
  const closeButton = document.querySelector("#sheetCloseButton");
  if (!overlay || !openButton || !closeButton) return;

  const open = () => overlay.classList.remove("hidden");
  const close = () => overlay.classList.add("hidden");

  openButton.addEventListener("click", open);
  closeButton.addEventListener("click", close);
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) close();
  });
}

function bindAiAnswerDemo() {
  const toggle = document.querySelector("#citationToggle");
  const list = document.querySelector("#citationList");
  if (!toggle || !list) return;

  toggle.addEventListener("click", () => {
    const hidden = list.hasAttribute("hidden");
    if (hidden) {
      list.removeAttribute("hidden");
    } else {
      list.setAttribute("hidden", "");
    }
    toggle.textContent = i18next.t(hidden ? "docs.hideCitation" : "docs.toggleCitation");
  });
}

function bindPageTabs() {
  const tabs = document.querySelectorAll("[data-page-demo]");
  if (!tabs.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.pageDemo;
      tabs.forEach((item) => item.classList.remove("is-active"));
      document.querySelectorAll("[data-page-panel]").forEach((panel) => {
        panel.classList.toggle("is-active", panel.dataset.pagePanel === target);
      });
      tab.classList.add("is-active");
    });
  });
}

function refreshDynamicCopy() {
  const summaryButton = document.querySelector("[data-summary-mode].is-active");
  const summaryText = document.querySelector("[data-summary-text]");
  if (summaryButton && summaryText) {
    const key = summaryButton.dataset.summaryMode === "detail" ? "docs.summaryDetail" : "docs.summaryBrief";
    summaryText.textContent = i18next.t(key);
  }

  const citationToggle = document.querySelector("#citationToggle");
  const citationList = document.querySelector("#citationList");
  if (citationToggle && citationList) {
    citationToggle.textContent = i18next.t(citationList.hasAttribute("hidden") ? "docs.toggleCitation" : "docs.hideCitation");
  }
}

initI18n();
