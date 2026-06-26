(function () {
  const root = document.documentElement;
  const body = document.body;

  function initTheme() {
    const saved = localStorage.getItem('paperdaily-theme') || 'light';
    applyTheme(saved);

    const themeToggles = document.querySelectorAll('#themeToggle, [data-theme-toggle]');
    themeToggles.forEach(toggle => {
      toggle.addEventListener('click', () => {
        const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
        applyTheme(next);
      });
    });
  }

  function applyTheme(theme) {
    root.dataset.theme = theme;
    localStorage.setItem('paperdaily-theme', theme);
  }

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#' || href.length < 2) return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const navbarHeight = parseInt(getComputedStyle(root).getPropertyValue('--navbar-height')) || 60;
          const offset = navbarHeight + 16;
          const pos = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: pos, behavior: 'smooth' });
        }
      });
    });
  }

  function initScrollSpy() {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    if (!navLinks.length) return;

    const sections = [];
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const el = document.querySelector(href);
        if (el) sections.push({ id: href.slice(1), el, link });
      }
    });

    if (!sections.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          sections.forEach(s => {
            s.link.classList.toggle('is-active', s.el === entry.target);
          });
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px', threshold: 0.1 });

    sections.forEach(s => observer.observe(s.el));
  }

  function initBookmarkButtons() {
    document.querySelectorAll('[data-bookmark]').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.classList.toggle('is-saved');
        const icon = btn.querySelector('i');
        if (icon) {
          if (btn.classList.contains('is-saved')) {
            icon.classList.remove('ph');
            icon.classList.add('ph-fill');
          } else {
            icon.classList.remove('ph-fill');
            icon.classList.add('ph');
          }
        }
      });
    });
  }

  function initPageTabs() {
    document.querySelectorAll('[data-tabs-demo]').forEach(tabsContainer => {
      const btns = tabsContainer.querySelectorAll('[data-tab-btn]');
      const panels = tabsContainer.querySelectorAll('[data-tab-panel]');

      btns.forEach(btn => {
        btn.addEventListener('click', () => {
          const target = btn.dataset.tabBtn;
          btns.forEach(b => b.classList.remove('is-active'));
          panels.forEach(p => p.classList.remove('is-active'));
          btn.classList.add('is-active');
          const panel = tabsContainer.querySelector(`[data-tab-panel="${target}"]`);
          if (panel) panel.classList.add('is-active');
        });
      });
    });

    const pageDemoTabs = document.querySelectorAll('.page-demo-tabs');
    pageDemoTabs.forEach(tabGroup => {
      const tabs = tabGroup.querySelectorAll('.page-tab');
      const section = tabGroup.closest('.doc-section');
      if (!section) return;
      const frames = section.querySelectorAll('.page-demo-frame');

      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const target = tab.dataset.pageDemo;
          tabs.forEach(t => t.classList.remove('is-active'));
          frames.forEach(f => f.classList.remove('is-active'));
          tab.classList.add('is-active');
          const frame = section.querySelector(`[data-page-panel="${target}"]`);
          if (frame) frame.classList.add('is-active');
        });
      });
    });
  }

  function initPaperCardStates() {
    const demoBoxes = document.querySelectorAll('.demo-box');
    demoBoxes.forEach(box => {
      const stateBtns = box.querySelectorAll('[data-paper-state]');
      const card = box.querySelector('.paper-card-demo');
      if (!stateBtns.length || !card) return;

      stateBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const state = btn.dataset.paperState;
          stateBtns.forEach(b => b.classList.remove('is-active'));
          btn.classList.add('is-active');

          card.classList.remove('is-read', 'is-saved', 'is-muted');
          if (state === 'read') card.classList.add('is-muted');
          if (state === 'saved') {
            card.classList.add('is-saved');
            const bookmarkBtn = card.querySelector('[data-bookmark]');
            if (bookmarkBtn) bookmarkBtn.classList.add('is-saved');
          }
        });
      });
    });
  }

  function initSummaryModes() {
    const demoBoxes = document.querySelectorAll('.demo-box');
    demoBoxes.forEach(box => {
      const modeBtns = box.querySelectorAll('[data-summary-mode]');
      const summaryBlock = box.querySelector('.summary-block');
      const summaryText = box.querySelector('[data-summary-text]');
      if (!modeBtns.length || !summaryBlock || !summaryText) return;

      const briefText = summaryText.textContent;
      const detailText = summaryText.dataset.detail || '推理表现的上升趋势变得可估计，这会改变训练预算和评估计划的制定方式。研究团队在 10B 到 100B 参数范围内进行了系统实验，发现数据质量和模型规模的协同效应可以用一个简洁的幂律函数描述。';

      modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const mode = btn.dataset.summaryMode;
          modeBtns.forEach(b => b.classList.remove('is-active'));
          btn.classList.add('is-active');

          summaryText.textContent = mode === 'brief' ? briefText : detailText;
        });
      });
    });
  }

  function initCommandBar() {
    const overlay = document.getElementById('commandOverlay');
    const openBtn = document.getElementById('commandOpenButton');
    const closeBtn = document.getElementById('commandCloseButton');
    const input = document.getElementById('commandInput');
    const results = document.getElementById('commandResults');
    if (!overlay || !openBtn || !closeBtn || !input || !results) return;

    function open() {
      overlay.classList.remove('hidden');
      setTimeout(() => input.focus(), 50);
    }

    function close() {
      overlay.classList.add('hidden');
      input.value = '';
    }

    openBtn.addEventListener('click', open);
    closeBtn.addEventListener('click', close);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });

    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (overlay.classList.contains('hidden')) {
          open();
        } else {
          close();
        }
      }
      if (e.key === 'Escape' && !overlay.classList.contains('hidden')) {
        close();
      }
    });

    results.querySelectorAll('button[data-command-target]').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.commandTarget;
        close();
        setTimeout(() => {
          const el = document.querySelector(target);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 200);
      });
    });
  }

  function initBottomSheet() {
    const overlay = document.getElementById('sheetOverlay');
    const openBtn = document.getElementById('sheetOpenButton');
    const closeBtn = document.getElementById('sheetCloseButton');
    if (!overlay || !openBtn || !closeBtn) return;

    function open() {
      overlay.classList.remove('hidden');
    }

    function close() {
      overlay.classList.add('hidden');
    }

    openBtn.addEventListener('click', open);
    closeBtn.addEventListener('click', close);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !overlay.classList.contains('hidden')) {
        close();
      }
    });
  }

  function initCitationToggle() {
    const toggle = document.getElementById('citationToggle');
    const list = document.getElementById('citationList');
    if (!toggle || !list) return;

    toggle.addEventListener('click', () => {
      const isHidden = list.hasAttribute('hidden');
      if (isHidden) {
        list.removeAttribute('hidden');
        toggle.textContent = '隐藏引用';
      } else {
        list.setAttribute('hidden', '');
        toggle.textContent = '显示引用';
      }
    });
  }

  function initSidebarToggle() {
    const toggleBtn = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('docsSidebar');
    if (!toggleBtn || !sidebar) return;

    toggleBtn.addEventListener('click', () => {
      const isOpen = sidebar.classList.contains('is-open');
      sidebar.classList.toggle('is-open');
      toggleBtn.setAttribute('aria-expanded', !isOpen);
    });

    document.addEventListener('click', (e) => {
      if (window.innerWidth > 1024) return;
      if (!sidebar.classList.contains('is-open')) return;
      if (sidebar.contains(e.target) || toggleBtn.contains(e.target)) return;
      sidebar.classList.remove('is-open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  }

  function initSidebarFilter() {
    const input = document.getElementById('sidebarFilter');
    const sidebar = document.getElementById('docsSidebar');
    if (!input || !sidebar) return;

    input.addEventListener('input', () => {
      const query = input.value.toLowerCase();
      const groups = sidebar.querySelectorAll('[data-nav-group]');
      const items = sidebar.querySelectorAll('[data-nav-item]');

      items.forEach(item => {
        const text = item.textContent.toLowerCase();
        const matches = text.includes(query);
        item.style.display = matches ? '' : 'none';
      });

      groups.forEach(group => {
        const visibleItems = group.querySelectorAll('[data-nav-item]:not([style*="display: none"])');
        group.style.display = visibleItems.length > 0 ? '' : 'none';
        if (query && visibleItems.length > 0) {
          group.setAttribute('open', '');
        }
      });
    });
  }

  function initDocNavActiveState() {
    const navItems = document.querySelectorAll('[data-nav-item]');
    if (!navItems.length) return;

    const sections = [];
    navItems.forEach(item => {
      const href = item.getAttribute('href');
      if (href && href.startsWith('#')) {
        const el = document.querySelector(href);
        if (el) sections.push({ id: href.slice(1), el, item });
      }
    });

    if (!sections.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          sections.forEach(s => {
            s.item.classList.toggle('is-active', s.el === entry.target);
          });
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px', threshold: 0.1 });

    sections.forEach(s => observer.observe(s.el));
  }

  function initI18n() {
    if (typeof i18next === 'undefined') return;

    const languageSelect = document.getElementById('languageSelect');

    i18next
      .use(i18nextHttpBackend)
      .use(i18nextBrowserLanguageDetector)
      .init({
        fallbackLng: 'zh',
        lng: 'zh',
        backend: {
          loadPath: 'locales/{{lng}}/common.json'
        },
        interpolation: {
          escapeValue: false
        }
      }, function(err, t) {
        updateContent();
        if (languageSelect) {
          languageSelect.value = i18next.language || 'zh';
        }
      });

    function updateContent() {
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = i18next.t(key);
      });

      document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        el.setAttribute('placeholder', i18next.t(key));
      });
    }

    if (languageSelect) {
      languageSelect.addEventListener('change', (e) => {
        i18next.changeLanguage(e.target.value, () => {
          updateContent();
          document.documentElement.lang = e.target.value;
          document.documentElement.dir = e.target.value === 'ar' ? 'rtl' : 'ltr';
        });
      });
    }
  }

  function init() {
    initTheme();
    initSmoothScroll();
    initScrollSpy();
    initBookmarkButtons();
    initPageTabs();
    initPaperCardStates();
    initSummaryModes();
    initCommandBar();
    initBottomSheet();
    initCitationToggle();
    initSidebarToggle();
    initSidebarFilter();
    initDocNavActiveState();
    initI18n();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
