(function () {
  'use strict';

  var STORAGE_KEY = 'driving-test-result';
  var NAME_PREFIX = 'driving-test-result:';

  function readAttempt() {
    var raw = null;
    try { raw = window.localStorage.getItem(STORAGE_KEY); } catch (e) { raw = null; }
    if (!raw && typeof window.name === 'string' && window.name.indexOf(NAME_PREFIX) === 0) {
      raw = window.name.slice(NAME_PREFIX.length);
      try { window.localStorage.setItem(STORAGE_KEY, raw); } catch (e) { /* ignore */ }
    }
    if (!raw) { return null; }
    var data;
    try { data = JSON.parse(raw); } catch (e) { return null; }
    if (!data || !Array.isArray(data.answers) || !Array.isArray(data.questions)) { return null; }
    if (!data.questions.length || data.answers.length !== data.questions.length) { return null; }
    var valid = data.questions.every(function (q) {
      return q && typeof q.question === 'string' && Array.isArray(q.options) && typeof q.correctIndex === 'number';
    });
    return valid ? data : null;
  }

  function make(tag, className, text) {
    var el = document.createElement(tag);
    if (className) { el.className = className; }
    if (text !== undefined) { el.textContent = text; }
    return el;
  }

  function band(pct) {
    if (pct >= 90) { return { cls: 'band-excellent', text: 'Excellent — you\u2019re ready.' }; }
    if (pct >= 70) { return { cls: 'band-good', text: 'Good — a bit more practice.' }; }
    if (pct >= 50) { return { cls: 'band-fair', text: 'Fair — review the misses.' }; }
    return { cls: 'band-poor', text: 'Keep studying — try again.' };
  }

  function addRow(dl, label, text, mark) {
    var row = make('div', 'answer-row');
    row.appendChild(make('dt', '', label));
    var dd = make('dd', '');
    dd.appendChild(make('span', 'answer-text', text));
    if (mark) {
      var m = make('span', 'mark ' + (mark === 'ok' ? 'mark-ok' : 'mark-bad'), mark === 'ok' ? ' \u2713' : ' \u2717');
      m.setAttribute('aria-hidden', 'true');
      dd.appendChild(m);
      dd.appendChild(make('span', 'sr-only', mark === 'ok' ? ' (correct)' : ' (incorrect)'));
    }
    row.appendChild(dd);
    dl.appendChild(row);
  }

  var attempt = readAttempt();
  if (!attempt) {
    window.location.replace('index.html');
    return;
  }

  var total = attempt.questions.length;
  var score = 0;
  var reviewList = document.getElementById('review-list');

  attempt.questions.forEach(function (q, i) {
    var picked = attempt.answers[i];
    var isRight = picked === q.correctIndex;
    if (isRight) { score += 1; }

    var li = make('li', 'review ' + (isRight ? 'is-correct' : 'is-wrong'));
    var h3 = make('h3', 'review-q');
    h3.appendChild(make('span', 'qnum', 'Question ' + (i + 1)));
    h3.appendChild(make('span', 'qtext', q.question));
    li.appendChild(h3);

    var dl = make('dl', 'answers');
    var yourText = (typeof picked === 'number' && q.options[picked] !== undefined) ? q.options[picked] : 'No answer';
    addRow(dl, 'Your answer', yourText, isRight ? 'ok' : 'bad');
    addRow(dl, 'Correct answer', q.options[q.correctIndex]);
    li.appendChild(dl);

    var why = make('p', 'explanation');
    why.appendChild(make('strong', '', 'Why: '));
    why.appendChild(document.createTextNode(q.explanation));
    li.appendChild(why);

    reviewList.appendChild(li);
  });

  var pct = Math.round(score / total * 100);
  var b = band(pct);
  document.getElementById('grade-card').classList.add(b.cls);
  document.getElementById('score-percent').textContent = pct + '%';
  document.getElementById('grade-band').textContent = b.text;
  document.getElementById('score-summary').textContent = 'You got ' + score + ' out of ' + total + ' correct.';

  document.getElementById('print-btn').addEventListener('click', function () { window.print(); });
  document.getElementById('retake-btn').addEventListener('click', function () {
    try { window.localStorage.removeItem(STORAGE_KEY); } catch (e) { /* ignore */ }
    window.name = '';
    window.location.href = 'index.html';
  });

  document.getElementById('main').hidden = false;
})();
