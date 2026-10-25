/**
 * Bubble 夢幻英文文法學院 - 實力診斷測驗引擎 (Quiz Engine)
 */

class QuizEngine {
  constructor() {
    this.currentChapterId = 1;
    this.quizData = null;
    this.userAnswers = {}; // { questionKey: selectedIndex }
    this.score = 0;
    this.totalQuestions = 0;
  }

  formatRichText(text) {
    if (!text) return '';
    let s = String(text);
    // Highlight error detection or blank tags ⟦A: ...⟧ or ⟦1⟧
    s = s.replace(/⟦([A-E]):\s*(.*?)⟧/g, '<span style="text-decoration: underline; font-weight: 700; color: var(--secondary);">[$1] $2</span>');
    s = s.replace(/⟦(\d+)⟧/g, '<span style="display:inline-block; padding: 0 6px; border-bottom: 2px solid var(--primary); font-weight: 800; color: var(--primary);">($1)</span>');
    // Fix CJK bold edge cases before marked
    s = s.split(/(`[^`\n]+`)/g).map((part, idx) => {
      if (idx % 2 === 1) return part;
      return part.replace(/\*\*([^*\n]+?)\*\*/g, '<strong>$1</strong>');
    }).join('');
    // Parse inline markdown per line and join with <br>
    return s.split(/\r?\n/).map(line => {
      if (typeof marked !== 'undefined' && marked.parseInline) {
        return marked.parseInline(line);
      }
      return line;
    }).join('<br>');
  }

  async loadChapterQuiz(chapterId) {
    this.currentChapterId = chapterId;
    const num = String(chapterId).padStart(2, '0');
    const container = document.getElementById('quiz-questions-list');
    const headerTitle = document.getElementById('quiz-header-title');
    const headerSub = document.getElementById('quiz-header-sub');
    if (!container) return;

    this.userAnswers = {};
    this.score = 0;

    container.innerHTML = `
      <div style="text-align: center; padding: 60px 20px; color: var(--secondary);">
        <i class="fa-solid fa-spinner fa-spin fa-2x"></i>
        <p style="margin-top: 14px; font-weight: 600;">正在載入本章精彩實力診斷試題...✍️</p>
      </div>
    `;

    try {
      const response = await fetch(`content/ch${num}-quiz.json`);
      if (!response.ok) {
        throw new Error(`測驗題庫尚未就緒 (${response.status})`);
      }
      this.quizData = await response.json();
      this.renderQuiz(container, headerTitle, headerSub);
    } catch (err) {
      console.warn("Quiz load error:", err);
      container.innerHTML = `
        <div style="text-align: center; padding: 50px 20px; background: #fff; border-radius: 20px; border: 1px solid var(--border-card);">
          <i class="fa-solid fa-feather fa-3x" style="color: var(--primary-light); margin-bottom: 16px;"></i>
          <h3 style="color: var(--text-main); margin-bottom: 8px;">第 ${chapterId} 章實力診斷題庫正由老師精心校對中 🌸</h3>
          <p style="font-size: 14px; color: var(--text-muted); margin-bottom: 20px;">妳可以先使用「🎲 無限題庫」做隨機強化練習，或是前往其他章節測驗喔！</p>
          <div style="display: flex; gap: 12px; justify-content: center;">
            <button class="btn-primary" onclick="window.app.navigateTo('generator', ${chapterId})">開啟本章無限題庫 🎲</button>
            <button class="btn-secondary" onclick="window.app.navigateTo('reader', ${chapterId})">複習本章講義 📖</button>
          </div>
        </div>
      `;
    }
  }

  renderQuiz(container, headerTitle, headerSub) {
    if (!this.quizData || !this.quizData.sections) return;

    const meta = CHAPTERS_META.find(c => c.id === this.currentChapterId) || { title: `第 ${this.currentChapterId} 章` };
    if (headerTitle) {
      headerTitle.innerHTML = `第 ${this.currentChapterId} 章 ${this.quizData.title || meta.title} · 實力診斷`;
    }
    if (headerSub) {
      headerSub.innerText = `原書完整實力診斷試題 · 點擊選項立即揭曉名師診斷說明與中譯`;
    }

    let html = '';
    let globalIndex = 0;

    this.quizData.sections.forEach((sec, secIdx) => {
      const rawInstr = (sec.instructions || '').trim();
      const isLongInstr = rawInstr.length > 90 || rawInstr.includes('\n');
      const shortInstr = !isLongInstr ? (rawInstr || '請依題意作答') : '請先閱讀下方短文與提示後作答';

      let passageHtml = '';
      if (isLongInstr) {
        passageHtml += `
          <div class="callout note" style="margin-bottom: 18px; background: #FFFDF9; border-color: var(--secondary); color: var(--text-main); line-height: 1.8;">
            <div class="callout-title" style="color: var(--secondary);">📖 閱讀短文與題組說明</div>
            <div style="font-size: 15px;">${this.formatRichText(rawInstr)}</div>
          </div>
        `;
      }
      if (sec.passage) {
        passageHtml += `
          <div class="callout note" style="margin-bottom: 18px; background: #FFFDF9; border-color: var(--secondary); color: var(--text-main); line-height: 1.85;">
            <div class="callout-title" style="color: var(--secondary);">📖 克漏字閱讀篇章 (Reading Passage)</div>
            <div style="font-size: 15px;">${this.formatRichText(sec.passage)}</div>
          </div>
        `;
      }
      const vocabList = sec.vocabulary_notes || sec.vocabulary_hints;
      if (vocabList) {
        const vocabContent = Array.isArray(vocabList)
          ? vocabList.map(v => `<span style="display:inline-block; background:#F3E8FF; color:#6D28D9; padding:3px 10px; border-radius:8px; font-size:13px; margin:3px 4px 3px 0;">${this.formatRichText(v)}</span>`).join('')
          : `<div style="font-size:13.5px;">${this.formatRichText(vocabList)}</div>`;
        passageHtml += `
          <div style="margin-bottom: 18px; padding: 12px 16px; background: #FAF5FF; border-radius: 12px; border: 1px dashed rgba(139, 92, 246, 0.35);">
            <div style="font-weight: 700; font-size: 13px; color: var(--secondary); margin-bottom: 6px;">💡 詞彙與片語小幫手：</div>
            <div>${vocabContent}</div>
          </div>
        `;
      }

      html += `
        <div class="quiz-section-block" style="margin-bottom: 32px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px dashed rgba(255, 107, 139, 0.3); flex-wrap: wrap;">
            <span style="font-weight: 800; font-size: 17px; color: var(--primary);">${sec.title}</span>
            <span style="font-size: 13px; color: var(--text-muted);">（${shortInstr}）</span>
          </div>
          ${passageHtml}
      `;

      sec.questions.forEach((q, qIdx) => {
        globalIndex++;
        const qKey = `q_${secIdx}_${qIdx}`;

        if (q.type === 'mc' || q.type === 'error' || (q.options && q.options.length > 0)) {
          html += this.renderMultipleChoiceCard(q, qKey, globalIndex, sec.title);
        } else {
          html += this.renderTextAnswerCard(q, qKey, globalIndex, sec.title);
        }
      });

      html += `</div>`;
    });

    this.totalQuestions = globalIndex;
    container.innerHTML = html;
    this.updateProgressBar();
  }

  renderMultipleChoiceCard(q, qKey, displayNum, sectionTitle) {
    const letters = ['A', 'B', 'C', 'D', 'E'];
    let optionsHtml = '';

    if (q.options && q.options.length > 0) {
      const answerJson = JSON.stringify(q.answer);
      optionsHtml = q.options.map((opt, idx) => `
        <button class="option-btn" data-key="${qKey}" data-index="${idx}" onclick='window.quizEngine.handleAnswer("${qKey}", ${idx}, ${answerJson})'>
          <span class="option-letter">${letters[idx]}</span>
          <span class="option-text">${this.formatRichText(opt)}</span>
        </button>
      `).join('');
    }

    const isMultiAnswer = Array.isArray(q.answer) && q.answer.length > 1;
    const multiBadge = isMultiAnswer
      ? `<span class="question-section-tag" style="background: #FEF3C7; color: #B45309;">複選題（共 ${q.answer.length} 個正解）</span>`
      : '';

    return `
      <div class="question-card" id="card-${qKey}">
        <div class="question-meta">
          <span class="question-num-tag">第 ${q.no || displayNum} 題</span>
          <span class="question-section-tag">${sectionTitle}</span>
          ${multiBadge}
        </div>
        <div class="question-text">${this.formatRichText(q.q || '')}</div>
        <div class="options-grid" id="options-${qKey}">
          ${optionsHtml}
        </div>
        <div class="explanation-card" id="explain-${qKey}">
          <div class="explain-header">
            <i class="fa-solid fa-graduation-cap"></i>
            <span>名師精準診斷說明</span>
          </div>
          ${q.zh ? `<div class="explain-translation"><strong>中文語意：</strong>${this.formatRichText(q.zh)}</div>` : ''}
          <div class="explain-body">${this.formatRichText(q.explain || '本題考查核心語法規則，請參照講義開竅要訣。')}</div>
        </div>
      </div>
    `;
  }

  renderTextAnswerCard(q, qKey, displayNum, sectionTitle) {
    const ansDisplay = Array.isArray(q.answer) ? q.answer.join(' ／ ') : (q.answer || '');
    return `
      <div class="question-card" id="card-${qKey}">
        <div class="question-meta">
          <span class="question-num-tag">第 ${q.no || displayNum} 題 · 演練題</span>
          <span class="question-section-tag">${sectionTitle}</span>
        </div>
        <div class="question-text">${this.formatRichText(q.q || '')}</div>
        ${q.hint ? `<div style="font-size: 13.5px; color: var(--secondary); margin-bottom: 12px; font-weight: 600;">💡 提示：${this.formatRichText(q.hint)}</div>` : ''}
        <div style="margin-top: 14px;">
          <button class="btn-secondary" style="font-size: 13px; padding: 6px 16px;" onclick="document.getElementById('explain-${qKey}').classList.toggle('show')">
            <i class="fa-solid fa-eye"></i> 顯示參考解答與診斷
          </button>
        </div>
        <div class="explanation-card" id="explain-${qKey}">
          <div class="explain-header">
            <i class="fa-solid fa-circle-check" style="color: #10B981;"></i>
            <span>參考標準解答</span>
          </div>
          <div style="font-size: 15px; font-weight: 700; color: var(--primary-dark); margin-bottom: 8px;">
            ${this.formatRichText(ansDisplay)}
          </div>
          ${q.zh && q.zh !== q.q ? `<div class="explain-translation"><strong>中文語意：</strong>${this.formatRichText(q.zh)}</div>` : ''}
          ${q.explain ? `<div class="explain-body" style="font-size: 13.5px; color: var(--text-main);">${this.formatRichText(q.explain)}</div>` : ''}
        </div>
      </div>
    `;
  }

  renderGenericQuestionCard(q, qKey, displayNum, sectionTitle) {
    return this.renderTextAnswerCard(q, qKey, displayNum, sectionTitle);
  }

  handleAnswer(qKey, selectedIndex, correctIndex) {
    if (this.userAnswers[qKey] !== undefined) return; // Prevent double answer
    this.userAnswers[qKey] = selectedIndex;

    const optionsContainer = document.getElementById(`options-${qKey}`);
    const explainCard = document.getElementById(`explain-${qKey}`);
    if (!optionsContainer) return;

    const isAnswerCorrect = (idx) => Array.isArray(correctIndex) ? correctIndex.includes(idx) : idx === correctIndex;

    const buttons = optionsContainer.querySelectorAll('.option-btn');
    buttons.forEach((btn, idx) => {
      btn.disabled = true;
      if (isAnswerCorrect(idx)) {
        btn.classList.add('correct');
      }
      if (idx === selectedIndex && !isAnswerCorrect(idx)) {
        btn.classList.add('wrong');
      }
    });

    if (isAnswerCorrect(selectedIndex)) {
      this.score++;
    }

    if (explainCard) {
      explainCard.classList.add('show');
    }

    this.updateProgressBar();
  }

  updateProgressBar() {
    const answeredCount = Object.keys(this.userAnswers).length;
    const bar = document.getElementById('quiz-progress-fill');
    if (bar && this.totalQuestions > 0) {
      const pct = Math.round((answeredCount / this.totalQuestions) * 100);
      bar.style.width = `${pct}%`;
    }
  }
}

window.QuizEngine = QuizEngine;
