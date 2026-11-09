const CATEGORY_PAGES = {
  dsssb: {
    title: 'DSSSB Examinations',
    description: 'Practice English and Hindi typing passages for Delhi government recruitment.',
    categoryFilter: 'dsssb',
    exams: [
      { name: 'DSSSB Junior Assistant / LDC — English', slug: 'dsssb-ldc-eng', logoText: 'DSSSB', speed: '35 WPM', lessonCount: 3 },
      { name: 'DSSSB Junior Assistant / LDC — Hindi', slug: 'dsssb-ldc-hin', logoText: 'DSSSB', speed: '30 WPM', lessonCount: 3 }
    ]
  },
  upsc: {
    title: 'UPSC Examinations',
    description: 'Choose a Union Public Service Commission typing or stenography test.',
    categoryFilter: 'upsc',
    exams: [
      { name: 'UPSC LDCE Stenographer', slug: 'upsc-ldce-steno', logoText: 'UPSC', speed: '40 WPM', lessonCount: 2 }
    ]
  },
  'high-court': {
    title: 'High Court Examinations',
    description: 'Open a court-specific practice set and choose a lesson.',
    categoryFilter: 'high_court',
    exams: [
      { name: 'Delhi High Court JJA / PA', slug: 'dhc-jja-pa', logoText: 'DHC', speed: '40 WPM', lessonCount: 6 },
      { name: 'Allahabad High Court', slug: 'allahabad-hc', logoText: 'AHC', speed: '30 WPM', lessonCount: 3 },
      { name: 'Himachal Pradesh High Court', slug: 'hp-hc', logoText: 'HPHC', speed: '30 WPM', lessonCount: 0 },
      { name: 'Bombay High Court', slug: 'bombay-hc', logoText: 'BHC', speed: '40 WPM', lessonCount: 0 }
    ]
  },
  'district-court': {
    title: 'District Court Examinations',
    description: 'Select a district court exam to view its lessons.',
    categoryFilter: 'district_court',
    exams: [
      { name: 'Delhi District Courts', slug: 'delhi-dc', logoText: 'DDC', speed: '40 WPM', lessonCount: 0 },
      { name: 'Himachal Pradesh District Courts', slug: 'hp-dc', logoText: 'HPC', speed: '30 WPM', lessonCount: 0 },
      { name: 'Uttar Pradesh Civil Courts', slug: 'up-dc', logoText: 'UPC', speed: '30 WPM', lessonCount: 0 }
    ]
  },
  'supreme-court': {
    title: 'Supreme Court Examinations',
    description: 'Practice typing passages for Supreme Court recruitment.',
    categoryFilter: 'supreme_court',
    exams: [
      { name: 'Supreme Court Junior Court Assistant', slug: 'sc-jca', logoText: 'SCI', speed: '35 WPM', lessonCount: 0 }
    ]
  },
  'central-departments': {
    title: 'Central Government Departments',
    description: 'Practice for typing and stenography tests across central departments.',
    categoryFilter: 'central_dept',
    exams: [
      { name: 'EPFO Social Security Assistant', slug: 'epfo-ssa', logoText: 'EPFO', speed: '35 WPM', lessonCount: 2 },
      { name: 'AIIMS CRE Typist', slug: 'aiims-cre-typist', logoText: 'AIIMS', speed: '35 WPM', lessonCount: 0 },
      { name: 'KVS / NVS Junior Secretariat Assistant', slug: 'kvs-nvs-jsa', logoText: 'KVS', speed: '35 WPM', lessonCount: 3 },
      { name: 'RRB NTPC Typing Test', slug: 'rrb-ntpc-tst', logoText: 'RRB', speed: '30 WPM', lessonCount: 3 }
    ]
  }
};

const page = CATEGORY_PAGES[document.body.dataset.categoryPage];
const examGrid = document.getElementById('category-exam-grid');
if (!page || !examGrid) {
  throw new Error('Category page configuration is missing or incomplete.');
}

document.title = `${page.title} - TypingMockExam.com`;
document.getElementById('category-page-title').textContent = page.title;
document.getElementById('category-page-description').textContent = page.description;
const categoryBrowseLink = document.createElement('a');
categoryBrowseLink.href = `index.html?category=${encodeURIComponent(page.categoryFilter)}`;
categoryBrowseLink.className = 'mt-4 inline-flex min-h-10 items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-700';
categoryBrowseLink.textContent = `Browse all ${page.title} typing tests`;
document.getElementById('category-page-description').after(categoryBrowseLink);
examGrid.innerHTML = page.exams.map(exam => {
  const logo = exam.logo
    ? `<img src="${exam.logo}" alt="">`
    : `<span class="text-[10px] font-black tracking-tight text-blue-700">${exam.logoText}</span>`;
  const lessons = exam.lessonCount > 0
    ? Array.from({ length: exam.lessonCount }, (_, index) => {
      const number = index + 1;
      return `<a href="index.html?subcategory=${encodeURIComponent(exam.slug)}&amp;lesson=${number}" class="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2 py-2 text-center text-xs font-bold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"><svg aria-hidden="true" viewBox="0 0 20 20" fill="none" class="h-3.5 w-3.5"><path d="M5.5 3.5h6l3 3v10h-9v-13Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M11.5 3.75V7h3.25M7.5 10h5M7.5 13h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>Lesson ${number}</a>`;
    }).join('')
    : '<p class="col-span-full rounded-xl bg-slate-50 px-3 py-2 text-center text-xs font-semibold text-slate-500">Practice lessons coming soon</p>';
  return `
    <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:p-5">
      <div class="flex items-start gap-3">
        <span class="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white p-1">${logo}</span>
        <div class="min-w-0 flex-1">
          <h2 class="text-sm font-extrabold leading-snug text-slate-900">${exam.name}</h2>
          <p class="mt-1 text-[11px] font-semibold text-slate-500">${exam.speed} &bull; ${exam.lessonCount ? `${exam.lessonCount} practice lessons` : 'Practice lessons coming soon'}</p>
        </div>
      </div>
      <div class="mt-4 grid grid-cols-3 gap-2" aria-label="${exam.name} lessons">${lessons}</div>
    </article>
  `;
}).join('');

const categoryAdSlot = document.createElement('aside');
categoryAdSlot.id = 'category-page-ad-slot';
categoryAdSlot.className = 'site-ad-slot';
categoryAdSlot.setAttribute('aria-label', 'Advertisement');
categoryAdSlot.dataset.adFormat = 'responsive';
categoryAdSlot.dataset.adSizes = '320x100,468x60,728x90';
categoryAdSlot.innerHTML = '<span class="site-ad-slot-label">Advertisement</span><div class="site-ad-slot-surface" aria-hidden="true">Responsive ad placement</div>';
examGrid.insertAdjacentElement('afterend', categoryAdSlot);

const footerAdBanner = document.getElementById('footer-ad-banner');
try {
  const savedAuthState = localStorage.getItem('ett_auth_state_v2');
  if (footerAdBanner && savedAuthState) {
    const authState = JSON.parse(savedAuthState);
    if (authState && authState.isPaid === true) {
      footerAdBanner.classList.add('hidden');
      categoryAdSlot.classList.add('hidden');
    }
  }
} catch (error) {
  console.error('Could not read the saved account state for ad visibility.', error);
}
