(function () {
  'use strict';

  var STORAGE_KEY = 'driving-test-result';
  var NAME_PREFIX = 'driving-test-result:'; // window.name fallback for browsers that isolate file:// storage

  var form = document.getElementById('quiz-form');
  var list = document.getElementById('question-list');
  var navList = document.getElementById('question-nav');
  var errorBox = document.getElementById('form-error');
  var progressFill = document.getElementById('progress-fill');
  var progressText = document.getElementById('progress-text');
  var progressTrack = document.getElementById('progress-track');
  var startBtn = document.getElementById('start-btn');
  var clearBtn = document.getElementById('clear-btn');
  var prevBtn = document.getElementById('prev-btn');
  var nextBtn = document.getElementById('next-btn');
  var submitBtn = document.getElementById('submit-btn');
  var section = document.getElementById('questions');
  var sectionTitle = document.getElementById('questions-title');
  var navWrap = document.querySelector('.question-nav');

  var cards = [];
  var navBtns = [];
  var picked = [];          // selected option index per question, -1 = unanswered
  var current = 0;
  var pointerInput = false; // true when the last interaction was a mouse/touch/pen press
  var advanceTimer = null;

  var yearEl = document.getElementById('year');
  if (yearEl) { yearEl.textContent = String(new Date().getFullYear()); }

  function reducedMotion() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  function scrollToEl(el) {
    el.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });
  }

  function make(tag, className, text) {
    var el = document.createElement(tag);
    if (className) { el.className = className; }
    if (text !== undefined) { el.textContent = text; }
    return el;
  }

  function render() {
    QUESTIONS.forEach(function (q, index) {
      var fs = make('fieldset', 'question-card');
      fs.id = 'question-' + q.id;
      fs.tabIndex = -1;
      fs.hidden = index !== 0;
      fs.setAttribute('data-index', String(index));

      var legend = make('legend', 'question-legend');
      legend.appendChild(make('span', 'q-number', 'Question ' + (index + 1) + ' of ' + QUESTIONS.length));
      legend.appendChild(make('span', 'q-text', q.question));
      fs.appendChild(legend);

      var opts = make('div', 'options');
      q.options.forEach(function (text, i) {
        var wrap = make('div', 'option');
        var input = document.createElement('input');
        input.type = 'radio';
        input.name = 'q' + q.id;
        input.id = 'q' + q.id + '-opt' + i;
        input.value = String(i);
        var label = make('label', '', text);
        label.htmlFor = input.id;
        wrap.appendChild(input);
        wrap.appendChild(label);
        opts.appendChild(wrap);
      });
      fs.appendChild(opts);
      list.appendChild(fs);
      cards.push(fs);

      var li = make('li');
      var btn = make('button', 'q-nav-btn', String(index + 1));
      btn.type = 'button';
      btn.setAttribute('data-index', String(index));
      li.appendChild(btn);
      navList.appendChild(li);
      navBtns.push(btn);
    });
  }

  function readAnswers() {
    return QUESTIONS.map(function (q) {
      var checked = form.querySelector('input[name="q' + q.id + '"]:checked');
      return checked ? Number(checked.value) : -1;
    });
  }

  function syncPicked() { picked = readAnswers(); }

  function updateProgress() {
    var total = QUESTIONS.length;
    var done = picked.filter(function (a) { return a !== -1; }).length;
    progressFill.style.width = (done / total * 100) + '%';
    progressText.textContent = done + ' of ' + total + ' answered';
    progressTrack.setAttribute('aria-valuenow', String(done));
    progressTrack.setAttribute('aria-valuemax', String(total));
  }

  function updateNav() {
    var last = QUESTIONS.length - 1;
    var allDone = picked.every(function (a) { return a !== -1; });
    navBtns.forEach(function (b, i) {
      var answered = picked[i] !== -1;
      b.classList.toggle('is-answered', answered);
      b.setAttribute('aria-label', 'Question ' + (i + 1) + ', ' + (answered ? 'answered' : 'not answered'));
      if (i === current) { b.setAttribute('aria-current', 'step'); } else { b.removeAttribute('aria-current'); }
    });
    prevBtn.disabled = current === 0;
    nextBtn.hidden = current === last;
    nextBtn.textContent = picked[current] === -1 ? 'Skip question' : 'Next question';
    submitBtn.hidden = !(current === last || allDone);
  }

  function refresh() { updateProgress(); updateNav(); }

  function showQuestion(i, opts) {
    opts = opts || {};
    current = Math.max(0, Math.min(QUESTIONS.length - 1, i));
    cards.forEach(function (c, idx) {
      c.hidden = idx !== current;
      c.classList.remove('is-entering');
    });
    var card = cards[current];
    void card.offsetWidth; // restart the entrance animation
    card.classList.add('is-entering');
    updateNav();
    if (navWrap.getBoundingClientRect().top < 0) { scrollToEl(navWrap); }
    if (opts.focus) { card.focus({ preventScroll: true }); }
  }

  function joinNumbers(nums) {
    if (nums.length === 1) { return String(nums[0]); }
    if (nums.length === 2) { return nums[0] + ' and ' + nums[1]; }
    return nums.slice(0, -1).join(', ') + ', and ' + nums[nums.length - 1];
  }

  function clearInvalid() {
    Array.prototype.forEach.call(form.querySelectorAll('.is-invalid'), function (el) {
      el.classList.remove('is-invalid');
    });
    errorBox.textContent = '';
  }

  function showMissing(missing) {
    errorBox.textContent = 'Please answer ' + (missing.length === 1 ? 'question ' : 'questions ') + joinNumbers(missing) + '.';
    missing.forEach(function (n) {
      cards[n - 1].classList.add('is-invalid');
      navBtns[n - 1].classList.add('is-invalid');
    });
    showQuestion(missing[0] - 1);
    scrollToEl(navWrap);
    var input = cards[missing[0] - 1].querySelector('input');
    if (input) { input.focus({ preventScroll: true }); }
  }

  function saveAndContinue(answers) {
    var score = 0;
    answers.forEach(function (a, i) { if (a === QUESTIONS[i].correctIndex) { score += 1; } });
    var result = {
      score: score,
      total: QUESTIONS.length,
      answers: answers,
      timestamp: Date.now(),
      questions: JSON.parse(JSON.stringify(QUESTIONS))
    };
    var json = JSON.stringify(result);
    try { window.localStorage.setItem(STORAGE_KEY, json); } catch (e) { /* storage unavailable */ }
    window.name = NAME_PREFIX + json;
    window.location.href = 'results.html';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var answers = readAnswers();
    var missing = [];
    answers.forEach(function (a, i) { if (a === -1) { missing.push(i + 1); } });
    clearInvalid();
    if (missing.length) { showMissing(missing); return; }
    saveAndContinue(answers);
  });

  // Remember whether the last interaction was a pointer press or the keyboard,
  // so only mouse/touch answers auto-advance (arrow-keying through options must not).
  form.addEventListener('pointerdown', function () { pointerInput = true; });
  form.addEventListener('keydown', function () { pointerInput = false; });

  form.addEventListener('change', function (e) {
    var t = e.target;
    if (!t || t.type !== 'radio') { return; }
    var card = t.closest('.question-card');
    var qi = Number(card.getAttribute('data-index'));
    var wasUnanswered = picked[qi] === -1;
    picked[qi] = Number(t.value);
    card.classList.remove('is-invalid');
    navBtns[qi].classList.remove('is-invalid');
    if (!form.querySelector('.is-invalid')) { errorBox.textContent = ''; }
    refresh();

    if (pointerInput && wasUnanswered && qi < QUESTIONS.length - 1) {
      clearTimeout(advanceTimer);
      advanceTimer = setTimeout(function () {
        if (current === qi) { showQuestion(qi + 1, { focus: true }); }
      }, reducedMotion() ? 150 : 350);
    }
  });

  navList.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('button') : null;
    if (!b) { return; }
    clearTimeout(advanceTimer);
    showQuestion(Number(b.getAttribute('data-index')), { focus: true });
  });

  prevBtn.addEventListener('click', function () {
    clearTimeout(advanceTimer);
    showQuestion(current - 1, { focus: true });
  });

  nextBtn.addEventListener('click', function () {
    clearTimeout(advanceTimer);
    showQuestion(current + 1, { focus: true });
  });

  clearBtn.addEventListener('click', function () {
    clearTimeout(advanceTimer);
    form.reset();
    syncPicked();
    clearInvalid();
    showQuestion(0);
    refresh();
  });

  startBtn.addEventListener('click', function () {
    section.classList.remove('is-revealing');
    void section.offsetWidth; // restart the animation
    section.classList.add('is-revealing');
    scrollToEl(section);
    sectionTitle.focus({ preventScroll: true });
  });

  window.addEventListener('pageshow', function () { syncPicked(); refresh(); });

  if (typeof QUESTIONS === 'undefined' || !QUESTIONS.length) {
    errorBox.textContent = 'The question bank could not be loaded.';
    return;
  }
  render();
  syncPicked();
  showQuestion(0);
  refresh();
})();
