(function () {
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const iconGrid = document.getElementById('iconGrid');
  const iconSearch = document.getElementById('iconSearch');

  const iconNames = [
    'house', 'user', 'gear', 'bell', 'magnifying-glass', 'heart', 'star', 'bookmark',
    'envelope', 'lock', 'eye', 'eye-slash', 'pencil-simple', 'trash', 'plus', 'x',
    'check', 'caret-down', 'caret-up', 'caret-left', 'caret-right', 'arrow-right', 'arrow-left',
    'arrow-up', 'arrow-down', 'download-simple', 'upload-simple', 'share', 'link', 'copy',
    'dots-three', 'dots-six', 'list', 'squares-four', 'grid-four', 'calendar', 'clock',
    'folder', 'folder-open', 'file', 'file-text', 'image', 'camera', 'video', 'play',
    'pause', 'stop', 'skip-forward', 'skip-back', 'shuffle', 'repeat', 'volume-high',
    'headphones', 'microphone', 'phone', 'chat-circle', 'chats', 'paper-plane-tilt',
    'warning', 'warning-circle', 'warning-octagon', 'check-circle', 'x-circle', 'info',
    'question', 'shield', 'shield-check', 'shield-warning', 'key', 'fingerprint',
    'lightning', 'sparkle', 'fire', 'flower', 'leaf', 'tree', 'sun', 'moon', 'cloud',
    'cloud-rain', 'wind', 'map-pin', 'compass', 'globe', 'rocket-launch', 'airplane',
    'car', 'bicycle', 'boat', 'train', 'currency-circle-dollar', 'credit-card', 'wallet',
    'shopping-cart', 'shopping-bag', 'tag', 'tags', 'receipt', 'invoice', 'chart-bar',
    'chart-line', 'chart-line-up', 'chart-pie', 'trend-up', 'trend-down', 'presentation',
    'users-three', 'user-circle', 'user-plus', 'user-minus', 'identification-badge',
    'buildings', 'building', 'office', 'briefcase', 'desktop', 'laptop', 'device-mobile',
    'tablet', 'keyboard', 'mouse', 'printer', 'wifi', 'bluetooth', 'battery-full',
    'plug', 'power', 'code', 'terminal', 'browser', 'bug', 'wrench', 'hammer',
    'paint-brush', 'paint-bucket', 'palette', 'puzzle-piece', 'cube', 'cube-focus',
    'stack', 'layers', 'sidebar', 'layout', 'article', 'text-t', 'text-aa', 'text-h',
    'quote', 'list-bullets', 'list-numbers', 'text-outdent', 'text-indent',
    'minus', 'equals', 'math-operations', 'hash', 'asterisk', 'circle', 'square',
    'triangle', 'hexagon', 'diamond', 'corners-out', 'crop', 'frame-corners',
    'arrows-out', 'arrows-in', 'arrows-clockwise', 'arrow-clockwise',
    'arrow-counter-clockwise', 'hand-pointing', 'fist-raised', 'hand-wave',
    'thumbs-up', 'thumbs-down', 'smiley', 'frown', 'meh', 'confetti', 'gift',
    'balloon', 'cake', 'crown', 'trophy', 'medal', 'flag', 'anchor', 'magnet'
  ];

  const iconWeights = {
    regular: 'ph',
    fill: 'ph-fill',
    duotone: 'ph-duotone',
    thin: 'ph-thin',
    light: 'ph-light',
    bold: 'ph-bold'
  };

  let currentWeight = 'regular';

  function initTheme() {
    const saved = localStorage.getItem('aurora-theme') || 'light';
    applyTheme(saved);

    themeToggle?.addEventListener('click', () => {
      const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
  }

  function applyTheme(theme) {
    root.dataset.theme = theme;
    localStorage.setItem('aurora-theme', theme);
  }

  function initComponentTabs() {
    const tabs = document.querySelectorAll('.comp-tab');
    const panels = document.querySelectorAll('.comp-panel');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;

        tabs.forEach(t => t.classList.remove('is-active'));
        panels.forEach(p => p.classList.remove('is-active'));

        tab.classList.add('is-active');
        const panel = document.querySelector(`[data-panel="${target}"]`);
        if (panel) panel.classList.add('is-active');
      });
    });
  }

  function renderIcons(filter = '') {
    if (!iconGrid) return;

    const weightClass = iconWeights[currentWeight];
    const filtered = iconNames.filter(name =>
      name.toLowerCase().includes(filter.toLowerCase())
    );

    iconGrid.innerHTML = filtered.map(name => `
      <div class="icon-item" data-icon-name="${name}">
        <i class="${weightClass} ph-${name}"></i>
        <span>${name}</span>
      </div>
    `).join('');
  }

  function initIconSearch() {
    if (!iconSearch || !iconGrid) return;

    renderIcons();

    iconSearch.addEventListener('input', (e) => {
      renderIcons(e.target.value);
    });
  }

  function initIconStyles() {
    const styleBtns = document.querySelectorAll('.icon-style-btn');

    styleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const weight = btn.dataset.iconWeight;
        if (!weight || !iconWeights[weight]) return;

        currentWeight = weight;
        styleBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        renderIcons(iconSearch?.value || '');
      });
    });
  }

  function initThemeCards() {
    const themeCards = document.querySelectorAll('.theme-card[data-theme-mode]');

    themeCards.forEach(card => {
      card.addEventListener('click', () => {
        const mode = card.dataset.themeMode;
        themeCards.forEach(c => c.classList.remove('is-active'));
        card.classList.add('is-active');
        applyTheme(mode);
      });
    });
  }

  function initToggles() {
    document.querySelectorAll('[data-toggle-demo]').forEach(toggle => {
      toggle.addEventListener('click', () => {
        toggle.classList.toggle('is-on');
      });
    });
  }

  function initTabsDemo() {
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
  }

  function initAlertClose() {
    document.querySelectorAll('.alert-close').forEach(btn => {
      btn.addEventListener('click', () => {
        const alert = btn.closest('.alert');
        if (alert) {
          alert.style.transition = 'all 200ms';
          alert.style.opacity = '0';
          alert.style.transform = 'translateY(-8px)';
          setTimeout(() => alert.remove(), 200);
        }
      });
    });
  }

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#' || href.length < 2) return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const offset = 88;
          const pos = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: pos, behavior: 'smooth' });
        }
      });
    });
  }

  function initIconCopy() {
    if (!iconGrid) return;

    iconGrid.addEventListener('click', (e) => {
      const item = e.target.closest('.icon-item');
      if (!item) return;

      const iconName = item.dataset.iconName;
      const weightClass = iconWeights[currentWeight];
      const snippet = `<i class="${weightClass} ph-${iconName}"></i>`;

      navigator.clipboard?.writeText(snippet).then(() => {
        const original = item.querySelector('span')?.textContent;
        const label = item.querySelector('span');
        if (label) {
          label.textContent = '已复制!';
          label.style.color = 'var(--primary)';
          setTimeout(() => {
            label.textContent = original;
            label.style.color = '';
          }, 1200);
        }
      }).catch(() => {});
    });
  }

  function initScrollSpy() {
    const sections = ['foundations', 'components', 'icons', 'theming'];
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            const isActive = link.getAttribute('href') === `#${id}`;
            link.style.color = isActive ? 'var(--text)' : '';
            link.style.background = isActive ? 'var(--surface-hover)' : '';
          });
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px', threshold: 0.1 });

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  }

  function init() {
    initTheme();
    initComponentTabs();
    initIconSearch();
    initIconStyles();
    initThemeCards();
    initToggles();
    initTabsDemo();
    initAlertClose();
    initSmoothScroll();
    initIconCopy();
    initScrollSpy();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
