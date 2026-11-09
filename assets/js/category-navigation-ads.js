(() => {
  function buildMenuItem(exam, className) {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = className;
    item.dataset.examId = exam.id;

    const mark = document.createElement('span');
    mark.className = 'flex h-6 w-6 shrink-0 items-center justify-center';
    mark.innerHTML = getCompactExamMark(`${exam.id} ${exam.name}`, exam.category);

    const label = document.createElement('span');
    label.className = 'min-w-0 flex-1 truncate';
    label.textContent = exam.name;

    const speed = document.createElement('span');
    speed.className = 'shrink-0 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600';
    speed.textContent = `${exam.speedCutoff} WPM`;

    item.append(mark, label, speed);
    item.addEventListener('click', () => selectSubcategoryExam(exam.id));
    return item;
  }

  function addCategoryMenusFromCatalog() {
    const filterBar = document.getElementById('exam-filter-bar');
    if (!filterBar) return;

    filterBar.querySelectorAll(':scope > .group').forEach(group => {
      const categoryButton = group.querySelector(':scope > .exam-filter-btn');
      const category = categoryButton?.dataset.filter;
      if (!category || category === 'all') return;

      const title = categoryButton.textContent.trim();
      const menuId = `exam-category-menu-${category}`;
      categoryButton.setAttribute('aria-haspopup', 'true');
      categoryButton.setAttribute('aria-controls', menuId);
      categoryButton.setAttribute('aria-expanded', 'false');

      let menu = group.querySelector(':scope > .category-hover-menu') || group.querySelector(':scope > div');
      if (!menu) {
        menu = document.createElement('div');
        menu.className = 'absolute left-1/2 -translate-x-1/2 top-full pt-1.5 hidden group-hover:block hover:block z-50 w-72 max-h-80 overflow-y-auto custom-scroll bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-2xl p-2 space-y-1 animate-fade-in category-hover-menu';
        group.appendChild(menu);
      }
      menu.classList.add('category-hover-menu');
      menu.id = menuId;
      menu.setAttribute('aria-label', `${title} subcategories`);
      menu.replaceChildren();

      const heading = document.createElement('div');
      heading.className = 'px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400';
      heading.textContent = `${title} subcategories`;
      menu.appendChild(heading);

      let exams = category === 'dsssb'
        ? ALL_EXAMS_DATA.filter(exam => exam.id.includes('dsssb'))
        : ALL_EXAMS_DATA.filter(exam => exam.category === category);
      if (category === 'state_psc') {
        exams = exams.filter(exam => !exam.id.includes('dsssb'));
      }
      exams.forEach(exam => {
        menu.appendChild(buildMenuItem(
          exam,
          'flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-left text-xs font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700'
        ));
      });

      if (!exams.length) {
        const empty = document.createElement('p');
        empty.className = 'px-2.5 py-2 text-xs text-slate-500';
        empty.textContent = 'No matching practice tests yet.';
        menu.appendChild(empty);
      }

      group.addEventListener('mouseenter', () => categoryButton.setAttribute('aria-expanded', 'true'));
      group.addEventListener('mouseleave', () => categoryButton.setAttribute('aria-expanded', 'false'));
      group.addEventListener('focusin', () => categoryButton.setAttribute('aria-expanded', 'true'));
      group.addEventListener('focusout', event => {
        if (!group.contains(event.relatedTarget)) categoryButton.setAttribute('aria-expanded', 'false');
      });
    });
  }

  function mountAdSlot() {
    const examGrid = document.getElementById('all-exams-grid');
    if (!examGrid || document.getElementById('category-exam-ad-slot')) return;

    const slot = document.createElement('aside');
    slot.id = 'category-exam-ad-slot';
    slot.className = 'site-ad-slot';
    slot.setAttribute('aria-label', 'Advertisement');
    slot.dataset.adFormat = 'responsive';
    slot.dataset.adSizes = '320x100,468x60,728x90';

    const label = document.createElement('span');
    label.className = 'site-ad-slot-label';
    label.textContent = 'Advertisement';

    const surface = document.createElement('div');
    surface.className = 'site-ad-slot-surface';
    surface.textContent = 'Responsive ad placement';
    surface.setAttribute('aria-hidden', 'true');

    slot.append(label, surface);
    examGrid.insertAdjacentElement('afterend', slot);
  }

  function syncAdVisibility() {
    let paid = Boolean(currentUser?.isPaid);
    try {
      const savedAuthState = JSON.parse(localStorage.getItem('ett_auth_state_v2') || 'null');
      if (savedAuthState && typeof savedAuthState.isPaid === 'boolean') paid = savedAuthState.isPaid;
    } catch (error) {
      console.error('Could not read the saved account plan for ad visibility.', error);
    }
    document.querySelectorAll('.site-ad-slot').forEach(slot => slot.classList.toggle('hidden', paid));
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (typeof renderCategoryHoverMenus === 'function') renderCategoryHoverMenus();
    else addCategoryMenusFromCatalog();

    if (typeof mountResponsiveAdSlot === 'function') {
      mountResponsiveAdSlot(document.getElementById('all-exams-grid'), 'category-exam-ad-slot');
    } else {
      mountAdSlot();
    }

    syncAdVisibility();
    document.getElementById('btn-toggle-sub-tier')?.addEventListener('click', syncAdVisibility);
  });
})();
