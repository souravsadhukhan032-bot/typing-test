(() => {
  const icon = '<svg aria-hidden="true" viewBox="0 0 20 20" fill="none" class="h-3.5 w-3.5"><path d="M5.5 3.5h6l3 3v10h-9v-13Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M11.5 3.75V7h3.25M7.5 10h5M7.5 13h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
  const sponsoredIcon = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" class="h-5 w-5"><path d="M4 10V6.8a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1V10M4 10h16M4 10v7.2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V10M8 14h4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const styles = `
    .lesson-pagination { display:flex; align-items:center; justify-content:center; gap:.35rem; max-width:100%; overflow-x:auto; padding:.25rem; scrollbar-width:thin; -webkit-overflow-scrolling:touch; }
    .lesson-page-number { display:inline-flex; min-width:2.5rem; height:2.5rem; align-items:center; justify-content:center; gap:.35rem; flex:0 0 auto; border:1px solid #e2e8f0; border-radius:.8rem; background:#fff; color:#334155; font-size:.75rem; font-weight:800; transition:background .16s ease,color .16s ease,border-color .16s ease,transform .16s ease; }
    .lesson-page-number:hover { border-color:#93c5fd; background:#eff6ff; color:#1d4ed8; transform:translateY(-1px); }
    .lesson-page-number[aria-current="page"] { border-color:#0f172a; background:#0f172a; color:#fff; box-shadow:0 2px 6px rgba(15,23,42,.16); }
    .lesson-page-ellipsis { min-width:1.5rem; color:#94a3b8; text-align:center; }
    .lesson-sponsored-card { display:flex; min-height:11rem; flex-direction:column; justify-content:space-between; border:1px solid #dbeafe; border-radius:.9rem; background:linear-gradient(145deg,#eff6ff,#fff 68%,#f0f9ff); padding:.85rem; box-shadow:0 1px 3px rgba(15,23,42,.05); }
    .lesson-sponsored-card .sponsored-label { display:inline-flex; width:max-content; align-items:center; gap:.35rem; border-radius:999px; background:#fff; padding:.22rem .5rem; color:#64748b; font-size:.6rem; font-weight:800; letter-spacing:.06em; text-transform:uppercase; }
    .lesson-sponsored-card h3 { margin-top:.7rem; color:#0f172a; font-size:.78rem; font-weight:900; line-height:1.35; }
    .lesson-sponsored-card p { margin-top:.35rem; color:#64748b; font-size:.68rem; line-height:1.5; }
    .lesson-sponsored-card button { margin-top:.75rem; width:100%; border-radius:.65rem; background:#0f172a; padding:.55rem .65rem; color:#fff; font-size:.68rem; font-weight:800; transition:background .16s ease; }
    .lesson-sponsored-card button:hover { background:#1d4ed8; }
    @media (max-width:639px) {
      .lesson-pagination { justify-content:flex-start; margin-inline:-.25rem; }
      .lesson-page-number { min-width:2.35rem; height:2.35rem; }
    }
    @media (prefers-reduced-motion:reduce) {
      .lesson-page-number,.lesson-sponsored-card button { transition:none; }
    }
  `;
  const style = document.createElement('style');
  style.textContent = styles;
  document.head.append(style);

  function getPageState() {
    if (typeof currentLessonsPage === 'number' && typeof currentLessonsTotalPages === 'number') {
      return { page: currentLessonsPage, total: currentLessonsTotalPages };
    }
    const indicator = document.getElementById('bottom-page-indicator')?.textContent || '';
    const match = indicator.match(/Page\s+(\d+)\s+of\s+(\d+)/i);
    return match ? { page: Number(match[1]), total: Number(match[2]) } : { page: 1, total: 1 };
  }

  function pageSequence(page, total) {
    if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);
    const values = new Set([1, total, page - 1, page, page + 1]);
    if (page <= 3) [2, 3, 4].forEach(value => values.add(value));
    if (page >= total - 2) [total - 3, total - 2, total - 1].forEach(value => values.add(value));
    const sorted = [...values].filter(value => value >= 1 && value <= total).sort((a, b) => a - b);
    const result = [];
    sorted.forEach((value, index) => {
      if (index && value - sorted[index - 1] > 1) result.push('ellipsis');
      result.push(value);
    });
    return result;
  }

  function createPager(host, placement) {
    if (!host) return null;
    const pager = document.createElement('nav');
    pager.className = 'lesson-pagination';
    pager.setAttribute('aria-label', placement === 'top' ? 'Lesson pages' : 'Lesson pages, bottom');
    host.replaceChildren(pager);
    host.className = placement === 'top'
      ? 'lesson-pagination-host w-full min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white/95 p-1 shadow-sm'
      : 'lesson-pagination-host mt-6 flex w-full min-w-0 flex-col items-center gap-2 border-t border-slate-200 pt-5';
    if (placement === 'bottom') {
      const status = document.createElement('span');
      status.id = 'bottom-page-indicator';
      status.className = 'text-[11px] font-semibold text-slate-500';
      host.append(status);
    }
    return pager;
  }

  let topPager;
  let bottomPager;
  function renderPagers() {
    const { page, total } = getPageState();
    [topPager, bottomPager].forEach(pager => {
      if (!pager) return;
      pager.replaceChildren();
      pageSequence(page, total).forEach(item => {
        if (item === 'ellipsis') {
          const ellipsis = document.createElement('span');
          ellipsis.className = 'lesson-page-ellipsis';
          ellipsis.setAttribute('aria-hidden', 'true');
          ellipsis.textContent = '…';
          pager.append(ellipsis);
          return;
        }
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'lesson-page-number';
        button.innerHTML = `${icon}<span>${item}</span>`;
        button.setAttribute('aria-label', `Go to lesson page ${item}`);
        if (item === page) button.setAttribute('aria-current', 'page');
        button.addEventListener('click', () => {
          const query = new URLSearchParams(window.location.search);
          const firstLesson = (item - 1) * 25 + 1;
          if (currentLessonsSubcat && currentLessonsSubcat !== 'all') {
            query.set('subcategory', currentLessonsSubcat);
            query.set('lesson', String(firstLesson));
          } else {
            query.delete('subcategory');
            query.set('lesson', String(firstLesson));
          }
          window.history.replaceState(null, '', `${window.location.pathname}?${query}`);
          renderHomeLessons(currentLessonsSubcat, item);
          document.getElementById('section-home-lessons')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        pager.append(button);
      });
    });
    const indicator = document.getElementById('bottom-page-indicator');
    if (indicator) indicator.textContent = `Page ${page} of ${total}`;
  }

  function showSponsoredLessons() {
    const grid = document.getElementById('home-lessons-grid');
    if (!grid) return;
    grid.querySelectorAll('.lesson-sponsored-card').forEach(card => card.remove());
    let isPaid = false;
    try {
      const state = JSON.parse(localStorage.getItem('ett_auth_state_v2') || 'null');
      isPaid = state?.isPaid === true;
    } catch (error) {
      console.error('Could not read the saved account plan for sponsored lesson placements.', error);
    }
    if (isPaid) return;

    [8, 18].forEach((lessonNumber, index) => {
      const lessonCard = document.getElementById(`lesson-${lessonNumber}`);
      if (!lessonCard) return;
      const promo = document.createElement('aside');
      promo.className = 'lesson-sponsored-card';
      promo.setAttribute('aria-label', 'Sponsored practice setup');
      promo.innerHTML = `<span class="sponsored-label">${sponsoredIcon}<span>Sponsored</span></span><div><h3>${index ? 'Upgrade your typing setup' : 'Practice on exam-ready gear'}</h3><p>Explore typing tools selected for focused, comfortable mock-test sessions.</p></div><button type="button">View practice gear <span aria-hidden="true">&rarr;</span></button>`;
      promo.querySelector('button').addEventListener('click', () => {
        document.getElementById('section-gear')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      lessonCard.after(promo);
    });
  }

  function installLessonTabs() {
    document.querySelectorAll('.exam-filter-btn, .lesson-filter-btn, .home-subcat-btn').forEach(button => {
      if (button.querySelector('.tab-icon, .subcat-tab-logo')) return;
      const filter = button.getAttribute('data-filter') || button.getAttribute('data-subcat') || '';
      const logo = typeof getAuthenticLogo === 'function' && filter && filter !== 'all'
        ? getAuthenticLogo(filter)
        : '';
      const badge = document.createElement('span');
      badge.className = 'tab-icon inline-flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-white p-0.5';
      if (logo) badge.innerHTML = logo;
      else {
        badge.innerHTML = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" class="h-3.5 w-3.5 text-slate-500"><path d="M5 4.5h14v15H5zM8 8h8M8 11.5h8M8 15h5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      }
      button.prepend(badge);
    });
  }

  const topHost = document.getElementById('btn-page-prev')?.parentElement;
  const bottomHost = document.getElementById('btn-page-prev-bottom')?.parentElement;
  topPager = createPager(topHost, 'top');
  bottomPager = createPager(bottomHost, 'bottom');
  if (typeof window.renderHomeLessons === 'function') {
    const originalRender = window.renderHomeLessons;
    window.renderHomeLessons = function (...args) {
      originalRender(...args);
      renderPagers();
      showSponsoredLessons();
    };
  }

  document.addEventListener('DOMContentLoaded', () => {
    installLessonTabs();
    renderPagers();
    showSponsoredLessons();
  });
})();
