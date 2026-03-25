'use strict';

// Theme switch: set to "dark" or "light".
const SITE_THEME = 'dark';
const THEME_STORAGE_KEY = 'portfolio_theme';
const validThemes = new Set(['dark', 'light']);

const themeToggleBtn = document.querySelector('[data-theme-toggle]');
const themeToggleIcon = document.querySelector('[data-theme-icon]');

const updateThemeToggleUi = function (theme) {
  if (!themeToggleBtn || !themeToggleIcon) {
    return;
  }

  const nextTheme = theme === 'dark' ? 'light' : 'dark';
  themeToggleIcon.setAttribute('name', theme === 'dark' ? 'moon-outline' : 'sunny-outline');
  themeToggleBtn.setAttribute('aria-label', `Switch to ${nextTheme} mode`);
  themeToggleBtn.setAttribute('title', `Switch to ${nextTheme} mode`);
};

const applyTheme = function (theme) {
  const safeTheme = validThemes.has(theme) ? theme : 'dark';
  document.documentElement.setAttribute('data-theme', safeTheme);
  updateThemeToggleUi(safeTheme);
  return safeTheme;
};

const getInitialTheme = function () {
  try {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (validThemes.has(storedTheme)) {
      return storedTheme;
    }
  } catch (_) {
    // Ignore storage access errors and fall back to default.
  }

  return validThemes.has(SITE_THEME) ? SITE_THEME : 'dark';
};

let currentTheme = applyTheme(getInitialTheme());

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', function () {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    currentTheme = applyTheme(currentTheme);

    try {
      localStorage.setItem(THEME_STORAGE_KEY, currentTheme);
    } catch (_) {
      // Ignore storage access errors.
    }
  });
}

const elementToggleFunc = function (elem) {
  if (elem) {
    elem.classList.toggle('active');
  }
};

// Sidebar toggle (mobile)
const sidebar = document.querySelector('[data-sidebar]');
const sidebarBtn = document.querySelector('[data-sidebar-btn]');

if (sidebar && sidebarBtn) {
  sidebarBtn.addEventListener('click', function () {
    elementToggleFunc(sidebar);
  });
}

// Optional portfolio filter controls (kept defensive if section layout changes)
const select = document.querySelector('[data-select]');
const selectItems = document.querySelectorAll('[data-select-item]');
const selectValue = document.querySelector('[data-selecct-value]');
const filterBtn = document.querySelectorAll('[data-filter-btn]');
const filterItems = document.querySelectorAll('[data-filter-item]');

const filterFunc = function (selectedValue) {
  if (!filterItems.length) {
    return;
  }

  for (let i = 0; i < filterItems.length; i++) {
    if (selectedValue === 'all' || selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add('active');
    } else {
      filterItems[i].classList.remove('active');
    }
  }
};

if (select && selectValue && selectItems.length) {
  select.addEventListener('click', function () {
    elementToggleFunc(this);
  });

  for (let i = 0; i < selectItems.length; i++) {
    selectItems[i].addEventListener('click', function () {
      const selectedValue = this.innerText.toLowerCase();
      selectValue.innerText = this.innerText;
      elementToggleFunc(select);
      filterFunc(selectedValue);
    });
  }
}

if (filterBtn.length && selectValue) {
  let lastClickedBtn = filterBtn[0];

  for (let i = 0; i < filterBtn.length; i++) {
    filterBtn[i].addEventListener('click', function () {
      const selectedValue = this.innerText.toLowerCase();
      selectValue.innerText = this.innerText;
      filterFunc(selectedValue);

      if (lastClickedBtn) {
        lastClickedBtn.classList.remove('active');
      }
      this.classList.add('active');
      lastClickedBtn = this;
    });
  }
}

// Page navigation
const navigationLinks = document.querySelectorAll('[data-nav-link]');
const pages = document.querySelectorAll('[data-page]');

if (navigationLinks.length && pages.length) {
  for (let i = 0; i < navigationLinks.length; i++) {
    navigationLinks[i].addEventListener('click', function () {
      const targetPage = this.textContent.trim().toLowerCase();

      for (let j = 0; j < pages.length; j++) {
        const pageMatches = targetPage === pages[j].dataset.page;
        pages[j].classList.toggle('active', pageMatches);
      }

      for (let j = 0; j < navigationLinks.length; j++) {
        navigationLinks[j].classList.toggle('active', navigationLinks[j] === this);
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}
