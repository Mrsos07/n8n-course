/**
 * n8n Academy — Main JavaScript
 * Handles: landing page, lesson navigation, sidebar, quiz, live examples
 */

// =====================================================
// LESSON DATA
// =====================================================
const LESSONS = [
  'intro', 'automation', 'what-is-n8n', 'nodes', 'connections',
  'triggers', 'expressions', 'credentials',
  'ai-overview', 'ai-agent', 'ai-build',
  'live-examples', 'quiz'
];

const LESSON_TITLES = {
  'intro':          'مقدمة الدورة',
  'automation':     'ما هي الأتمتة؟',
  'what-is-n8n':    'ما هو n8n؟',
  'nodes':          'العقد (Nodes)',
  'connections':    'التوصيلات (Connections)',
  'triggers':       'المحفزات (Triggers)',
  'expressions':    'التعبيرات (Expressions)',
  'credentials':    'الاعتمادات (Credentials)',
  'ai-overview':    'الذكاء الاصطناعي في n8n',
  'ai-agent':       'AI Agent Node',
  'ai-build':       'بناء وكيل AI',
  'live-examples':  'أمثلة حية تفاعلية',
  'quiz':           'الاختبار النهائي'
};

let currentLesson = 'intro';
let completedLessons = new Set();

// =====================================================
// QUIZ DATA
// =====================================================
const QUIZ_QUESTIONS = [
  {
    q: 'ما هو n8n؟',
    opts: [
      'متصفح ويب مفتوح المصدر',
      'منصة أتمتة سير العمل مفتوحة المصدر',
      'لغة برمجة جديدة',
      'نظام تشغيل للسيرفرات'
    ],
    correct: 1,
    feedback: '✅ صحيح! n8n هي منصة أتمتة سير العمل مفتوحة المصدر تمكّنك من ربط التطبيقات وأتمتة المهام.'
  },
  {
    q: 'ما هو تعريف "سير العمل" (Workflow) في n8n؟',
    opts: [
      'ملف نصي يحتوي على أكواد برمجية',
      'مجموعة من العقد المتصلة لأتمتة عملية ما',
      'قاعدة بيانات لتخزين المعلومات',
      'واجهة مستخدم رسومية'
    ],
    correct: 1,
    feedback: '✅ صحيح! Workflow هو مجموعة من العقد المتصلة ببعضها لأتمتة عملية ما.'
  },
  {
    q: 'ما هي اللبنات الأساسية لبناء سير العمل في n8n؟',
    opts: [
      'الملفات والمجلدات',
      'الشاشات والنوافذ',
      'العقد (Nodes)',
      'المتغيرات والثوابت'
    ],
    correct: 2,
    feedback: '✅ صحيح! العقد (Nodes) هي اللبنات الأساسية في n8n.'
  },
  {
    q: 'ما الفرق بين Trigger Node وAction Node؟',
    opts: [
      'لا يوجد فرق، كلاهما نفس الشيء',
      'Trigger يبدأ سير العمل، أما Action فينفذ مهاماً داخله',
      'Trigger أسرع في الأداء من Action',
      'Action يعمل فقط مع خدمات Google'
    ],
    correct: 1,
    feedback: '✅ صحيح! Trigger يبدأ سير العمل استجابةً لحدث، بينما Action ينفذ إجراءات محددة.'
  },
  {
    q: 'ما هي صيغة التعبيرات (Expressions) في n8n؟',
    opts: [
      '[[  ]]  (قوسان مربعان مزدوجان)',
      '##  ##  (رمز الهاش)',
      '{{  }}  (أقواس معقوصة مزدوجة)',
      '<<  >>  (أقواس زاوية)'
    ],
    correct: 2,
    feedback: '✅ صحيح! التعبيرات في n8n تستخدم صيغة {{ }} — مثال: {{ $json.email }}'
  },
  {
    q: 'لماذا تُستخدم الاعتمادات (Credentials) في n8n؟',
    opts: [
      'لتصميم واجهة المستخدم',
      'لتحديد اسم سير العمل',
      'لتوثيق الاتصال بالخدمات الخارجية بشكل آمن',
      'لتحديد لون العقد'
    ],
    correct: 2,
    feedback: '✅ صحيح! الاعتمادات تخزّن معلومات التوثيق (API Keys) بشكل مشفّر.'
  },
  {
    q: 'ما هو وكيل الذكاء الاصطناعي (AI Agent) في n8n؟',
    opts: [
      'برنامج لتصميم المواقع',
      'نظام مستقل يستقبل البيانات ويتخذ قرارات لتحقيق أهداف',
      'أداة لضغط الملفات',
      'خادم بريد إلكتروني ذكي'
    ],
    correct: 1,
    feedback: '✅ صحيح! AI Agent هو نظام مستقل يفكر ويخطط ويستخدم أدوات لإنجاز المهام.'
  },
  {
    q: 'ما الذي يجب توصيله بعقدة AI Agent كحد أدنى؟',
    opts: [
      'قاعدة بيانات فقط',
      'نموذج لغوي (Chat Model)',
      'خمس عقد على الأقل',
      'ملف CSS للتصميم'
    ],
    correct: 1,
    feedback: '✅ صحيح! يجب توصيل نموذج لغوي (Chat Model) بعقدة AI Agent كشرط أساسي.'
  },
  {
    q: 'ما هي وظيفة مكوّن "الذاكرة" (Memory) في وكيل AI؟',
    opts: [
      'تخزين ملفات الصور',
      'تسريع معالجة البيانات',
      'تمكين الوكيل من تذكّر سياق المحادثة',
      'حماية سير العمل من الهجمات'
    ],
    correct: 2,
    feedback: '✅ صحيح! الذاكرة تمكّن الوكيل من تذكّر ما قيل مسبقاً في المحادثة.'
  },
  {
    q: 'ما هي أول عقدة تُضاف عند بناء وكيل AI بالدردشة في n8n؟',
    opts: [
      'Code Node',
      'HTTP Request Node',
      'Chat Trigger Node',
      'Schedule Trigger Node'
    ],
    correct: 2,
    feedback: '✅ صحيح! يبدأ بناء وكيل AI بالدردشة بإضافة Chat Trigger كنقطة البداية.'
  }
];

let currentQuestion = 0;
let score = 0;
let answered = new Array(QUIZ_QUESTIONS.length).fill(null);

// =====================================================
// INIT
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
  renderQuiz();
  updateProgress();
  updateNavButtons();

  // Restore from hash
  const hash = window.location.hash.replace('#', '');
  if (hash && LESSONS.includes(hash)) {
    startCourse();
    navigateToLesson(hash);
  }
});

// =====================================================
// LANDING PAGE
// =====================================================
function startCourse() {
  const landing = document.getElementById('landingPage');
  const app = document.getElementById('courseApp');
  if (landing) landing.classList.add('hidden');
  if (app) {
    app.classList.add('active');
    app.style.display = 'flex';
  }
  navigateToLesson('intro');
  window.scrollTo(0, 0);
}

// =====================================================
// SIDEBAR
// =====================================================
function openSidebar() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('overlay').classList.add('active');
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('active');
}

// =====================================================
// LESSON NAVIGATION
// =====================================================
function navigateToLesson(lessonId) {
  if (!LESSONS.includes(lessonId)) return;

  // Mark current as completed
  if (currentLesson && currentLesson !== 'quiz') {
    completedLessons.add(currentLesson);
  }

  // Hide all lessons
  document.querySelectorAll('.lesson').forEach(l => l.classList.remove('active'));

  // Show target lesson
  const target = document.getElementById('lesson-' + lessonId);
  if (target) {
    target.classList.add('active');
    const contentArea = document.querySelector('.content-area');
    if (contentArea) contentArea.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Update sidebar active/completed state
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
    // Match by onclick attribute content
    const onclick = item.getAttribute('onclick') || '';
    if (onclick.includes("'" + lessonId + "'")) {
      item.classList.add('active');
    }
    // Mark completed lessons
    LESSONS.forEach(lid => {
      if (onclick.includes("'" + lid + "'") && completedLessons.has(lid)) {
        item.classList.add('completed');
      }
    });
  });

  currentLesson = lessonId;

  // Update breadcrumb
  const breadcrumb = document.getElementById('currentLessonTitle');
  if (breadcrumb) breadcrumb.textContent = LESSON_TITLES[lessonId] || '';

  // Update URL hash
  window.location.hash = lessonId;

  // Update nav buttons
  updateNavButtons();

  // Update progress
  updateProgress();

  // Close sidebar on mobile
  if (window.innerWidth < 900) closeSidebar();
}

function prevLesson() {
  const idx = LESSONS.indexOf(currentLesson);
  if (idx > 0) navigateToLesson(LESSONS[idx - 1]);
}

function nextLesson() {
  const idx = LESSONS.indexOf(currentLesson);
  if (idx < LESSONS.length - 1) navigateToLesson(LESSONS[idx + 1]);
}

function updateNavButtons() {
  const idx = LESSONS.indexOf(currentLesson);
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  if (prevBtn) prevBtn.disabled = idx <= 0;
  if (nextBtn) nextBtn.disabled = idx >= LESSONS.length - 1;
}

function updateProgress() {
  const total = LESSONS.filter(l => l !== 'quiz').length;
  const done = completedLessons.size;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const fill = document.getElementById('progressFill');
  const pctEl = document.getElementById('progressPercent');
  if (fill) fill.style.width = pct + '%';
  if (pctEl) pctEl.textContent = pct + '%';
}

// =====================================================
// QUIZ LOGIC
// =====================================================
function renderQuiz() {
  const container = document.getElementById('quizQuestions');
  if (!container) return;

  container.innerHTML = QUIZ_QUESTIONS.map((q, idx) => `
    <div class="quiz-question ${idx === 0 ? 'active' : ''}" id="qq-${idx}">
      <div class="quiz-q-text">
        <span class="q-num">سؤال ${idx + 1}</span>
        ${q.q}
      </div>
      <div class="quiz-options">
        ${q.opts.map((opt, oi) => `
          <div class="quiz-option" id="opt-${idx}-${oi}" onclick="selectOption(${idx}, ${oi})">
            <div class="opt-letter">${['أ','ب','ج','د'][oi]}</div>
            <span>${opt}</span>
          </div>
        `).join('')}
      </div>
      <div class="quiz-feedback" id="fb-${idx}"></div>
    </div>
  `).join('');

  updateQuizUI();
}

function selectOption(qIdx, optIdx) {
  if (answered[qIdx] !== null) return;

  answered[qIdx] = optIdx;
  const correct = QUIZ_QUESTIONS[qIdx].correct;
  const feedback = QUIZ_QUESTIONS[qIdx].feedback;
  let isCorrect = optIdx === correct;

  if (isCorrect) score++;

  document.querySelectorAll(`#qq-${qIdx} .quiz-option`).forEach((el, i) => {
    if (i === correct) el.classList.add('correct-answer', 'correct');
    if (i === optIdx && !isCorrect) el.classList.add('wrong');
  });

  const fb = document.getElementById(`fb-${qIdx}`);
  if (fb) {
    fb.textContent = isCorrect
      ? feedback
      : `❌ إجابة خاطئة! ${feedback.replace('✅ صحيح! ', '')}`;
    fb.className = `quiz-feedback show ${isCorrect ? 'correct-fb' : 'wrong-fb'}`;
  }

  document.getElementById('quizScore').textContent = `النتيجة: ${score}`;
}

function prevQuestion() {
  if (currentQuestion > 0) {
    document.getElementById(`qq-${currentQuestion}`).classList.remove('active');
    currentQuestion--;
    document.getElementById(`qq-${currentQuestion}`).classList.add('active');
    updateQuizUI();
  }
}

function nextQuestion() {
  if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
    document.getElementById(`qq-${currentQuestion}`).classList.remove('active');
    currentQuestion++;
    document.getElementById(`qq-${currentQuestion}`).classList.add('active');
    updateQuizUI();
  } else {
    showResult();
  }
}

function updateQuizUI() {
  const total = QUIZ_QUESTIONS.length;
  const pct = ((currentQuestion + 1) / total) * 100;
  const fillEl = document.getElementById('quizProgressFill');
  const labelEl = document.getElementById('quizProgressLabel');
  const prevBtn = document.getElementById('quizPrevBtn');
  const nextBtn = document.getElementById('quizNextBtn');

  if (fillEl) fillEl.style.width = pct + '%';
  if (labelEl) labelEl.textContent = `السؤال ${currentQuestion + 1} من ${total}`;
  if (prevBtn) prevBtn.disabled = currentQuestion === 0;
  if (nextBtn) {
    const isLast = currentQuestion === total - 1;
    nextBtn.innerHTML = isLast
      ? '<i class="fas fa-flag-checkered"></i> عرض النتيجة'
      : 'التالي <i class="fas fa-chevron-left"></i>';
  }
}

function showResult() {
  document.getElementById('quizContainer').style.display = 'none';
  document.getElementById('quizResult').style.display = 'block';

  const total = QUIZ_QUESTIONS.length;
  const pct = Math.round((score / total) * 100);

  let icon, title, msg;
  if (pct >= 90) {
    icon = '🏆'; title = 'ممتاز! أنت خبير n8n!';
    msg = 'أحسنت! لقد أظهرت فهماً عميقاً لأساسيات n8n. أنت جاهز لبناء سير عمل احترافية!';
  } else if (pct >= 70) {
    icon = '⭐'; title = 'جيد جداً! استمر في التعلم!';
    msg = 'أداء رائع! لديك قاعدة معرفية جيدة. راجع الدروس التي أخطأت فيها لتعزيز فهمك.';
  } else if (pct >= 50) {
    icon = '📚'; title = 'جيد! تحتاج مزيداً من الممارسة';
    msg = 'بداية جيدة! نوصي بمراجعة الدروس مرة أخرى والتركيز على المفاهيم الأساسية.';
  } else {
    icon = '💪'; title = 'لا تستسلم! المعرفة تأتي بالتكرار';
    msg = 'كل خبير كان مبتدئاً يوماً ما! راجع الدروس من البداية وستجد الأمور أكثر وضوحاً.';
  }

  document.getElementById('resultIcon').textContent = icon;
  document.getElementById('resultTitle').textContent = title;
  document.getElementById('resultMessage').textContent = msg;
  document.getElementById('resultScore').textContent = `${score} / ${total} (${pct}%)`;
}

function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  answered = new Array(QUIZ_QUESTIONS.length).fill(null);
  document.getElementById('quizResult').style.display = 'none';
  document.getElementById('quizContainer').style.display = 'block';
  document.getElementById('quizScore').textContent = 'النتيجة: 0';
  renderQuiz();
}

// =====================================================
// LIVE EXAMPLES — INTERACTIVE FUNCTIONS
// =====================================================
function switchExample(tabEl, exId) {
  document.querySelectorAll('.live-tab').forEach(t => t.classList.remove('active'));
  if (tabEl) tabEl.classList.add('active');
  document.querySelectorAll('.live-example').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById(exId);
  if (panel) panel.classList.add('active');
  activateStep(exId, 1);
}

function activateStep(exId, stepNum) {
  const suffix = exId === 'ex1' ? '1' : '2';

  document.querySelectorAll(`#canvas${suffix} .canvas-node`).forEach(n => n.classList.remove('active-node'));
  const activeNode = document.getElementById(`cn${suffix}-${stepNum}`);
  if (activeNode) activeNode.classList.add('active-node');

  const panel = document.getElementById(`steps-${exId}`);
  if (!panel) return;

  panel.querySelectorAll('.live-step-item').forEach(item => {
    const s = parseInt(item.getAttribute('data-step'));
    item.classList.remove('active');
    const body = item.querySelector('.lsi-body');
    const chevron = item.querySelector('.lsi-chevron i');
    if (s === stepNum) {
      item.classList.add('active');
      if (body) body.classList.add('open');
      if (chevron) { chevron.classList.remove('fa-chevron-down'); chevron.classList.add('fa-chevron-up'); }
      setTimeout(() => item.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 80);
    } else {
      if (body) body.classList.remove('open');
      if (chevron) { chevron.classList.remove('fa-chevron-up'); chevron.classList.add('fa-chevron-down'); }
    }
  });
}

function toggleStep(exId, stepNum) {
  const panel = document.getElementById(`steps-${exId}`);
  if (!panel) return;
  const item = panel.querySelector(`.live-step-item[data-step="${stepNum}"]`);
  if (!item) return;
  if (item.classList.contains('active')) {
    item.classList.remove('active');
    const body = item.querySelector('.lsi-body');
    const chevron = item.querySelector('.lsi-chevron i');
    if (body) body.classList.remove('open');
    if (chevron) { chevron.classList.remove('fa-chevron-up'); chevron.classList.add('fa-chevron-down'); }
  } else {
    activateStep(exId, stepNum);
  }
}

function nextStep(exId, stepNum) {
  activateStep(exId, stepNum);
}

// =====================================================
// KEYBOARD NAVIGATION
// =====================================================
document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  if (e.key === 'ArrowLeft') nextLesson();
  if (e.key === 'ArrowRight') prevLesson();
});

// =====================================================
// MOBILE: close sidebar on resize
// =====================================================
window.addEventListener('resize', () => {
  if (window.innerWidth >= 900) closeSidebar();
});
