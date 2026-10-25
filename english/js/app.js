/**
 * Bubble 夢幻英文文法學院 - 應用主控制器 (Application Controller)
 */

class GrammarApp {
  constructor() {
    this.currentView = 'home';
    this.currentChapterId = 1;
    this.reader = new GrammarReader();
    this.quizEngine = new QuizEngine();
    this.generator = new InfiniteGenerator();
    this.aiTutor = new AIGrammarTutor();
    this.init();
  }

  init() {
    this.renderChapterGrid();
    this.populateChapterSelects();
    this.bindEvents();
    this.initMascotMotivation();
    this.loadProgress();

    // Check hash for direct route (e.g. #chapter-2, #quiz-2)
    this.handleRouteHash();
    window.addEventListener('hashchange', () => this.handleRouteHash());
  }

  handleRouteHash() {
    const hash = window.location.hash.replace('#', '');
    if (!hash) {
      this.navigateTo('home');
      return;
    }
    const [view, param] = hash.split('-');
    if (view === 'chapter' && param) {
      this.navigateTo('reader', param === 'preface' || param === 'appendix' ? param : parseInt(param));
    } else if (view === 'quiz' && param) {
      this.navigateTo('quiz', parseInt(param));
    } else if (view === 'generator') {
      this.navigateTo('generator', param ? parseInt(param) : 'all');
    } else if (view === 'ai') {
      this.navigateTo('ai-tutor');
    } else {
      this.navigateTo('home');
    }
  }

  navigateTo(view, chapterId = null) {
    this.currentView = view;
    if (chapterId !== null) {
      this.currentChapterId = chapterId;
    }

    // Switch view sections
    document.querySelectorAll('.app-view').forEach(v => v.classList.remove('active'));
    const targetEl = document.getElementById(`view-${view}`);
    if (targetEl) targetEl.classList.add('active');

    // Update nav links
    document.querySelectorAll('.nav-link, .mobile-nav-item').forEach(link => {
      if (link.getAttribute('data-view') === view) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // View specific initialization
    if (view === 'reader') {
      this.reader.loadChapter(this.currentChapterId);
    } else if (view === 'quiz') {
      this.quizEngine.loadChapterQuiz(this.currentChapterId);
    } else if (view === 'generator') {
      this.setupGeneratorView(this.currentChapterId);
    } else if (view === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  renderChapterGrid() {
    const grid = document.getElementById('chapters-grid');
    if (!grid) return;

    let html = '';
    CHAPTERS_META.forEach(ch => {
      const subtopicsHtml = ch.subtopics.slice(0, 3).map(s => `<span class="subtopic-pill">${s}</span>`).join('');
      html += `
        <div class="chapter-card" style="border-top: 4px solid ${ch.color};" onclick="window.app.navigateTo('reader', ${ch.id})">
          <div>
            <div class="chapter-card-top">
              <span class="chapter-badge-num">CHAPTER ${ch.num}</span>
              <div class="chapter-icon-circle" style="background: linear-gradient(135deg, ${ch.color}, #FFA3BA);">
                <i class="fa-solid ${ch.icon}"></i>
              </div>
            </div>
            <div class="chapter-title">
              <span>第 ${ch.num} 章 · ${ch.title}</span>
            </div>
            <div class="chapter-en-title" style="margin-bottom: 8px;">${ch.enTitle}</div>
            <p class="chapter-desc">${ch.summary}</p>
            <div class="chapter-subtopics">${subtopicsHtml}</div>
          </div>
          <div class="chapter-card-footer" onclick="event.stopPropagation();">
            <button class="btn-card-action btn-read" onclick="window.app.navigateTo('reader', ${ch.id})">
              <i class="fa-solid fa-book-open"></i> 講義研讀
            </button>
            <button class="btn-card-action btn-quiz" onclick="window.app.navigateTo('quiz', ${ch.id})">
              <i class="fa-solid fa-pen-to-square"></i> 實力診斷
            </button>
          </div>
        </div>
      `;
    });

    grid.innerHTML = html;
  }

  populateChapterSelects() {
    const selects = document.querySelectorAll('.chapter-picker-select');
    selects.forEach(select => {
      let optionsHtml = '<option value="preface">📖 編輯大意 (Preface)</option>';
      CHAPTERS_META.forEach(ch => {
        optionsHtml += `<option value="${ch.id}">第 ${ch.num} 章 · ${ch.title} (${ch.enTitle})</option>`;
      });
      optionsHtml += '<option value="appendix">📜 附錄專題 (Appendices)</option>';
      select.innerHTML = optionsHtml;
      select.value = this.currentChapterId;
      select.addEventListener('change', (e) => {
        const val = e.target.value;
        const targetId = val === 'preface' || val === 'appendix' ? val : parseInt(val);
        this.navigateTo(this.currentView === 'quiz' ? 'quiz' : 'reader', targetId);
      });
    });

    // Generator chapter picker
    const genSelect = document.getElementById('gen-chapter-select');
    if (genSelect) {
      let genHtml = '<option value="all">🌟 全書20章綜合隨機挑戰 (All Chapters)</option>';
      CHAPTERS_META.forEach(ch => {
        genHtml += `<option value="${ch.id}">第 ${ch.num} 章 · ${ch.title}</option>`;
      });
      genSelect.innerHTML = genHtml;
    }
  }

  bindEvents() {
    // Top Nav buttons
    document.querySelectorAll('.nav-link, .mobile-nav-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const view = btn.getAttribute('data-view');
        if (view) this.navigateTo(view);
      });
    });

    // Search bar submit & chips
    const searchInput = document.getElementById('home-search-input');
    const searchBtn = document.getElementById('home-search-btn');
    if (searchBtn && searchInput) {
      const doSearch = () => {
        const q = searchInput.value.trim();
        if (q) {
          this.navigateTo('ai-tutor');
          this.sendChatMessage(q);
        }
      };
      searchBtn.addEventListener('click', doSearch);
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') doSearch();
      });
    }

    // Quick chips
    document.querySelectorAll('.grammar-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const query = chip.getAttribute('data-query');
        this.navigateTo('ai-tutor');
        this.sendChatMessage(query);
      });
    });

    // Chat input in AI Tutor
    const chatInput = document.getElementById('chat-user-input');
    const chatSendBtn = document.getElementById('chat-send-btn');
    if (chatSendBtn && chatInput) {
      const doSend = () => {
        const msg = chatInput.value.trim();
        if (msg) {
          chatInput.value = '';
          this.sendChatMessage(msg);
        }
      };
      chatSendBtn.addEventListener('click', doSend);
      chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') doSend();
      });
    }

    // Generator submit
    const genBtn = document.getElementById('start-generator-btn');
    if (genBtn) {
      genBtn.addEventListener('click', () => {
        this.runGeneratorSession();
      });
    }
  }

  updateReaderControls(chapterId) {
    const select = document.getElementById('reader-chapter-dropdown');
    if (select) select.value = chapterId;

    // Previous / Next buttons
    const prevBtn = document.getElementById('reader-prev-btn');
    const nextBtn = document.getElementById('reader-next-btn');

    if (prevBtn) {
      if (typeof chapterId === 'number' && chapterId > 1) {
        prevBtn.disabled = false;
        prevBtn.onclick = () => this.navigateTo('reader', chapterId - 1);
      } else if (chapterId === 1) {
        prevBtn.disabled = false;
        prevBtn.onclick = () => this.navigateTo('reader', 'preface');
      } else {
        prevBtn.disabled = true;
      }
    }

    if (nextBtn) {
      if (chapterId === 'preface') {
        nextBtn.disabled = false;
        nextBtn.onclick = () => this.navigateTo('reader', 1);
      } else if (typeof chapterId === 'number' && chapterId < 20) {
        nextBtn.disabled = false;
        nextBtn.onclick = () => this.navigateTo('reader', chapterId + 1);
      } else if (chapterId === 20) {
        nextBtn.disabled = false;
        nextBtn.onclick = () => this.navigateTo('reader', 'appendix');
      } else {
        nextBtn.disabled = true;
      }
    }
  }

  sendChatMessage(message) {
    const messagesArea = document.getElementById('chat-messages-area');
    if (!messagesArea) return;

    // Append user message
    messagesArea.innerHTML += `
      <div class="chat-bubble user">
        ${marked.parseInline(message)}
      </div>
    `;

    // Scroll to bottom
    messagesArea.scrollTop = messagesArea.scrollHeight;

    // Typing placeholder
    const typingId = `typing-${Date.now()}`;
    messagesArea.innerHTML += `
      <div class="chat-bubble assistant" id="${typingId}">
        <i class="fa-solid fa-spinner fa-spin"></i> Bubble 老師正在為妳整理文法解析...✨
      </div>
    `;
    messagesArea.scrollTop = messagesArea.scrollHeight;

    // Ask AI Tutor
    setTimeout(() => {
      const resp = this.aiTutor.ask(message);
      const typingEl = document.getElementById(typingId);
      if (typingEl) {
        let jumpButtonHtml = '';
        if (resp.chapterId) {
          jumpButtonHtml = `
            <div style="margin-top: 14px; padding-top: 10px; border-top: 1px dashed rgba(255, 107, 139, 0.3);">
              <button class="btn-primary" style="font-size: 13px; padding: 6px 16px;" onclick="window.app.navigateTo('reader', ${resp.chapterId})">
                <i class="fa-solid fa-book-open"></i> 前往第 ${resp.chapterId} 章完整講義 📖
              </button>
            </div>
          `;
        }
        typingEl.innerHTML = `
          <div>${marked.parse(resp.reply)}</div>
          ${jumpButtonHtml}
        `;
        messagesArea.scrollTop = messagesArea.scrollHeight;
      }
    }, 450);
  }

  setupGeneratorView(chapterId = 'all') {
    const select = document.getElementById('gen-chapter-select');
    if (select) select.value = chapterId;
    this.runGeneratorSession();
  }

  async runGeneratorSession() {
    const chapterId = document.getElementById('gen-chapter-select')?.value || 'all';
    const count = document.getElementById('gen-count-select')?.value || 10;
    const level = document.getElementById('gen-level-select')?.value || 'all';
    const container = document.getElementById('generator-questions-list');
    if (!container) return;

    container.innerHTML = `
      <div style="text-align: center; padding: 40px; color: var(--primary);">
        <i class="fa-solid fa-wand-magic-sparkles fa-spin fa-2x"></i>
        <p style="margin-top: 12px; font-weight: 700;">正在隨機抽取生成客製化題目...🎲</p>
      </div>
    `;

    const questions = await this.generator.generate({ chapterId, count, level });
    this.renderGeneratorQuestions(questions, container);
  }

  renderGeneratorQuestions(questions, container) {
    if (!questions || questions.length === 0) {
      container.innerHTML = `<div style="text-align:center; padding: 40px;">暫無符合條件的題目，請切換設定再試一次喔！</div>`;
      return;
    }

    const letters = ['A', 'B', 'C', 'D'];
    let html = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px;">
        <h3 style="font-size: 18px; color: var(--text-main);">
          <i class="fa-solid fa-dice" style="color: var(--primary);"></i> 隨機生成 ${questions.length} 題測驗
        </h3>
        <span style="font-size: 13px; color: var(--text-muted); font-weight: 600;">即時自動核對 · 附名師詳解</span>
      </div>
    `;

    questions.forEach((q, qIdx) => {
      const qKey = `gen_q_${qIdx}`;
      const fmt = (txt) => this.quizEngine ? this.quizEngine.formatRichText(txt) : txt;
      const levelColors = {
        1: { bg: '#DCFCE7', text: '#15803D', label: '🟢 Level 1 基礎' },
        2: { bg: '#FEF3C7', text: '#B45309', label: '🟡 Level 2 進階' },
        3: { bg: '#F3E8FF', text: '#6D28D9', label: '🟣 Level 3 資優' }
      };
      const lvl = levelColors[q.level] || levelColors[2];
      const optionsHtml = q.options.map((opt, optIdx) => `
        <button class="option-btn" data-key="${qKey}" data-index="${optIdx}" onclick="window.app.handleGeneratorAnswer('${qKey}', ${optIdx}, ${q.answer})">
          <span class="option-letter">${letters[optIdx]}</span>
          <span class="option-text">${fmt(opt)}</span>
        </button>
      `).join('');

      html += `
        <div class="question-card" id="card-${qKey}">
          <div class="question-meta">
            <span class="question-num-tag">題號 ${qIdx + 1}</span>
            <span class="question-section-tag">單元：第 ${q.chapterId || 1} 章 · ${q.topic || '文法演練'}</span>
            <span class="question-section-tag" style="background: ${lvl.bg}; color: ${lvl.text};">${lvl.label}</span>
          </div>
          <div class="question-text">${fmt(q.q)}</div>
          <div class="options-grid" id="options-${qKey}">
            ${optionsHtml}
          </div>
          <div class="explanation-card" id="explain-${qKey}">
            <div class="explain-header">
              <i class="fa-solid fa-lightbulb" style="color: #F59E0B;"></i>
              <span>資優解析與中譯</span>
            </div>
            ${q.zh ? `<div class="explain-translation"><strong>中譯：</strong>${fmt(q.zh)}</div>` : ''}
            <div class="explain-body">${fmt(q.explain || '本題考查核心語法規則。')}</div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  handleGeneratorAnswer(qKey, selectedIndex, correctIndex) {
    if (this.generator.userAnswers[qKey] !== undefined) return;
    this.generator.userAnswers[qKey] = selectedIndex;

    const optionsContainer = document.getElementById(`options-${qKey}`);
    const explainCard = document.getElementById(`explain-${qKey}`);
    if (!optionsContainer) return;

    const buttons = optionsContainer.querySelectorAll('.option-btn');
    buttons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === correctIndex) btn.classList.add('correct');
      if (idx === selectedIndex && selectedIndex !== correctIndex) btn.classList.add('wrong');
    });

    if (selectedIndex === correctIndex) {
      this.generator.score++;
    }

    if (explainCard) explainCard.classList.add('show');
  }

  initMascotMotivation() {
    const quotes = [
      "今天也要精神滿滿學文法喔！掌握動詞時態，英文就像搭上火箭一樣飛速進步！🚀✨",
      "資優班的孩子最棒了！每天多學一章，會考英檢滿分就在眼前！🌸",
      "遇到不會的題目不要怕，點擊 🔊 朗讀按鈕多聽幾次，語感就會自然形成囉！🎧",
      "「文法是句子的骨架，單字是美麗的羽毛。」讓我們一起練出最強文法底子！💪✨"
    ];
    const speechEl = document.getElementById('mascot-speech-text');
    if (speechEl) {
      const quote = quotes[Math.floor(Math.random() * quotes.length)];
      speechEl.innerText = quote;
    }
  }

  loadProgress() {
    // Read local streak or points if any
    const streak = localStorage.getItem('bubble_streak') || 1;
    const streakEl = document.getElementById('streak-count');
    if (streakEl) streakEl.innerText = `${streak} 天`;
  }
}

// Global bootstrap
document.addEventListener('DOMContentLoaded', () => {
  window.app = new GrammarApp();
  window.quizEngine = window.app.quizEngine;
});
