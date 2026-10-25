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
            <button class="btn-primary" onclick="window.app.startInfiniteGenerator(${chapterId})">開啟本章無限題庫 🎲</button>
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
      html += `
        <div class="quiz-section-block" style="margin-bottom: 28px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px dashed rgba(255, 107, 139, 0.3);">
            <span style="font-weight: 800; font-size: 17px; color: var(--primary);">${sec.title}</span>
            <span style="font-size: 13px; color: var(--text-muted);">（${sec.instructions || '請依題意作答'}）</span>
          </div>
      `;

      sec.questions.forEach((q, qIdx) => {
        globalIndex++;
        const qKey = `q_${secIdx}_${qIdx}`;

        if (q.type === 'mc' || q.type === 'error') {
          html += this.renderMultipleChoiceCard(q, qKey, globalIndex, sec.title);
        } else if (q.type === 'translate' || q.type === 'rewrite' || q.type === 'fill') {
          html += this.renderTextAnswerCard(q, qKey, globalIndex, sec.title);
        } else {
          html += this.renderGenericQuestionCard(q, qKey, globalIndex, sec.title);
        }
      });

      html += `</div>`;
    });

    this.totalQuestions = globalIndex;
    container.innerHTML = html;
  }

  renderMultipleChoiceCard(q, qKey, displayNum, sectionTitle) {
    const letters = ['A', 'B', 'C', 'D', 'E'];
    let optionsHtml = '';

    if (q.options && q.options.length > 0) {
      const answerJson = JSON.stringify(q.answer);
      optionsHtml = q.options.map((opt, idx) => `
        <button class="option-btn" data-key="${qKey}" data-index="${idx}" onclick='window.quizEngine.handleAnswer("${qKey}", ${idx}, ${answerJson})'>
          <span class="option-letter">${letters[idx]}</span>
          <span class="option-text">${opt}</span>
        </button>
      `).join('');
    }

    // Clean display for question
    let questionText = q.q || '';
    if (q.type === 'error') {
      questionText = questionText.replace(/⟦([A-E]):\s*(.*?)⟧/g, '<span style="text-decoration: underline; font-weight: 700; color: var(--secondary);">[$1] $2</span>');
    }

    return `
      <div class="question-card" id="card-${qKey}">
        <div class="question-meta">
          <span class="question-num-tag">第 ${displayNum} 題</span>
          <span class="question-section-tag">${sectionTitle}</span>
        </div>
        <div class="question-text">${questionText}</div>
        <div class="options-grid" id="options-${qKey}">
          ${optionsHtml}
        </div>
        <div class="explanation-card" id="explain-${qKey}">
          <div class="explain-header">
            <i class="fa-solid fa-graduation-cap"></i>
            <span>名師精準診斷說明</span>
          </div>
          ${q.zh ? `<div class="explain-translation"><strong>中文語意：</strong>${q.zh}</div>` : ''}
          <div class="explain-body">${q.explain || '本題考查核心語法規則，請參照講義開竅要訣。'}</div>
        </div>
      </div>
    `;
  }

  renderTextAnswerCard(q, qKey, displayNum, sectionTitle) {
    return `
      <div class="question-card" id="card-${qKey}">
        <div class="question-meta">
          <span class="question-num-tag">第 ${displayNum} 題 · 演練題</span>
          <span class="question-section-tag">${sectionTitle}</span>
        </div>
        <div class="question-text">${q.q}</div>
        ${q.hint ? `<div style="font-size: 13px; color: var(--secondary); margin-bottom: 12px; font-weight: 500;">提示：${q.hint}</div>` : ''}
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
            ${Array.isArray(q.answer) ? q.answer.join(' / ') : q.answer}
          </div>
          ${q.explain ? `<div class="explain-body" style="font-size: 13px; color: var(--text-muted);">${q.explain}</div>` : ''}
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
      // Cute audio or celebration
    }

    if (explainCard) {
      explainCard.classList.add('show');
    }

    // Update progress
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
