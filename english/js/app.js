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
    this.mistakeAnalyzer = new MistakeAnalyzer();
    this.currentGeneratorQuestionsMap = {};
    this.currentBlindSpotQuestionsMap = {};
    this.blindSpotUserAnswers = {};
    this.init();
  }

  init() {
    this.renderChapterGrid();
    this.populateChapterSelects();
    this.bindEvents();
    this.initMascotMotivation();
    this.loadProgress();
    if (this.mistakeAnalyzer) {
      this.mistakeAnalyzer.syncToggleUI();
    }
    this.updateGeminiStatusBadge();

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
    } else if (view === 'mistakes') {
      this.navigateTo('mistakes');
    } else if (view === 'ai') {
      this.navigateTo('ai-tutor');
    } else {
      this.navigateTo('home');
    }
  }

  navigateTo(view, chapterId = null) {
    const prevView = this.currentView;
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

    if (this.mistakeAnalyzer) {
      this.mistakeAnalyzer.syncToggleUI();
    }
    this.updateGeminiStatusBadge();

    // View specific initialization
    if (view === 'reader') {
      this.reader.loadChapter(this.currentChapterId);
    } else if (view === 'quiz') {
      // Only prompt once per (IP, Date); subsequent chapter quizzes on the same IP & same day reuse the student automatically
      if (this.needsQuizIdentityPrompt()) {
        this.openQuizUserModal(() => {
          this.quizEngine.loadChapterQuiz(this.currentChapterId);
        }, false);
      } else {
        this.quizEngine.loadChapterQuiz(this.currentChapterId);
      }
    } else if (view === 'generator') {
      // Only prompt once per (IP, Date); subsequent quizzes on the same IP & same day reuse the student automatically
      if (this.needsQuizIdentityPrompt()) {
        this.openQuizUserModal(() => {
          this.setupGeneratorView(this.currentChapterId);
        }, false);
      } else {
        this.setupGeneratorView(this.currentChapterId);
      }
    } else if (view === 'mistakes') {
      this.renderMistakesView();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (view === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  needsQuizIdentityPrompt() {
    if (!this.mistakeAnalyzer) return false;
    const { dateStr } = this.getTaiwanDateTime();
    const currentIp = (this.currentVisitorIPInfo && this.currentVisitorIPInfo.ip) ? this.currentVisitorIPInfo.ip : '';
    const currentDeviceBrowser = this.detectDeviceAndBrowser();

    // 1. Check if MistakeAnalyzer already has a valid (dateStr, currentIp, currentDeviceBrowser) session
    if (this.mistakeAnalyzer.hasValidDailyIPSession(dateStr, currentIp, currentDeviceBrowser)) {
      return false;
    }

    // 2. Check if today's visitor IP log already recorded a studentName for this (dateStr, currentIp, currentDeviceBrowser)
    const store = this.visitorStore || this.loadLocalVisitorStore();
    if (currentIp && store && Array.isArray(store.logs)) {
      const todayRec = store.logs.find(r => 
        r.date === dateStr && 
        r.ip === currentIp && 
        r.studentName && 
        (!r.deviceBrowser || r.deviceBrowser === currentDeviceBrowser)
      );
      if (todayRec && todayRec.studentName) {
        this.mistakeAnalyzer.setCurrentUser(todayRec.studentName, dateStr, currentIp, currentDeviceBrowser);
        return false;
      }
    }

    // Otherwise (first time today on this device/IP, or cross-day, or different IP/device) -> need prompt!
    return true;
  }

  openQuizUserModal(onConfirmed = null, isManualSwitch = true) {
    this.pendingQuizUserCallback = onConfirmed;
    this.canDismissQuizUserModal = isManualSwitch;
    const modal = document.getElementById('quiz-user-modal');
    const titleEl = document.getElementById('quiz-user-modal-title');
    const closeBtn = document.getElementById('quiz-user-modal-close-btn');
    const input = document.getElementById('quiz-user-name-input');
    const existingSection = document.getElementById('quiz-existing-users-section');
    const chipsContainer = document.getElementById('quiz-existing-users-chips');
    if (!modal) {
      if (onConfirmed) onConfirmed();
      return;
    }

    if (titleEl) {
      titleEl.innerText = isManualSwitch ? '切換作答學員 ／ 新增學員 🌸' : '今日首次測驗 · 請選擇或輸入學員姓名 🌸';
    }
    if (closeBtn) {
      closeBtn.style.display = isManualSwitch ? 'inline-flex' : 'none';
    }

    const curUser = this.mistakeAnalyzer ? this.mistakeAnalyzer.currentUser : '';
    if (input) {
      input.value = '';
    }

    if (this.mistakeAnalyzer && existingSection && chipsContainer) {
      const users = this.mistakeAnalyzer.getUserList();
      if (users.length > 0) {
        existingSection.style.display = 'block';
        chipsContainer.innerHTML = users.map(u => {
          const safeName = u.name.replace(/'/g, "\\'");
          const isCurrent = u.name === curUser;
          return `
            <button class="btn-tool" style="font-size: 13.5px; padding: 7px 15px; border-radius: 99px; ${isCurrent ? 'background: var(--primary); color: #fff; border-color: var(--primary); box-shadow: 0 3px 10px rgba(255,107,139,0.3);' : 'background: #fff; color: var(--primary-dark); border-color: rgba(255,107,139,0.45);'}" onclick="window.app.selectQuizUser('${safeName}')">
              <i class="fa-solid ${isCurrent ? 'fa-user-check' : 'fa-user-graduate'}"></i>
              <span>${u.name}</span>
              <span style="opacity: 0.85; font-size: 11.5px;">(${u.count} 題錯題)</span>
              ${isCurrent ? '<span style="font-size: 10.5px; background: rgba(255,255,255,0.25); padding: 1px 6px; border-radius: 99px; margin-left: 2px;">目前使用</span>' : ''}
            </button>
          `;
        }).join('');
      } else {
        existingSection.style.display = 'none';
      }
    }

    modal.style.display = 'flex';
    setTimeout(() => {
      if (input) input.focus();
    }, 80);
  }

  closeQuizUserModal() {
    const modal = document.getElementById('quiz-user-modal');
    if (modal) modal.style.display = 'none';
    this.pendingQuizUserCallback = null;
  }

  confirmQuizUserFromInput() {
    const input = document.getElementById('quiz-user-name-input');
    const val = input ? input.value.trim() : '';
    if (!val) {
      alert('請輸入您的名字或點選上方已儲存的學員名字；若不想記錄錯題請點擊下方「Anonymous 匿名測驗」喔！🌸');
      if (input) input.focus();
      return;
    }
    this.selectQuizUser(val);
  }

  selectQuizUser(name) {
    const { dateStr } = this.getTaiwanDateTime();
    const currentIp = (this.currentVisitorIPInfo && this.currentVisitorIPInfo.ip) ? this.currentVisitorIPInfo.ip : 'pending';
    const currentDeviceBrowser = this.detectDeviceAndBrowser();

    if (this.mistakeAnalyzer) {
      this.mistakeAnalyzer.setCurrentUser(name, dateStr, currentIp, currentDeviceBrowser);
    }

    // Bind studentName to today's (dateStr, currentIp, currentDeviceBrowser) visitor record as well
    this.bindStudentNameToTodayIP(this.mistakeAnalyzer ? this.mistakeAnalyzer.currentUser : name, dateStr, currentIp, currentDeviceBrowser);

    const modal = document.getElementById('quiz-user-modal');
    if (modal) modal.style.display = 'none';

    if (this.currentView === 'mistakes') {
      this.renderMistakesView();
    }

    if (typeof this.pendingQuizUserCallback === 'function') {
      const cb = this.pendingQuizUserCallback;
      this.pendingQuizUserCallback = null;
      cb();
    }
  }

  async bindStudentNameToTodayIP(studentName, dateStr, ip, deviceBrowser = '') {
    if (!ip || ip === 'pending') return;
    const store = this.visitorStore || this.loadLocalVisitorStore();
    if (!store || !Array.isArray(store.logs)) return;
    const rec = store.logs.find(r => 
      r.date === dateStr && 
      r.ip === ip && 
      (!deviceBrowser || !r.deviceBrowser || r.deviceBrowser === deviceBrowser)
    );
    if (rec) {
      rec.studentName = studentName;
      if (deviceBrowser && !rec.deviceBrowser) rec.deviceBrowser = deviceBrowser;
      this.visitorStore = store;
      try {
        localStorage.setItem('bubble_visitor_ip_logs_v1', JSON.stringify(store));
      } catch (e) {}
      try {
        await fetch('https://api.restful-api.dev/objects/ff808181a09d98f701a173a083f608a1', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: 'bubble-english-visitors', data: store })
        });
      } catch (e) {}
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
        const view = btn.getAttribute('data-view');
        if (view) {
          e.preventDefault();
          this.navigateTo(view);
        }
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

    // Ask AI Tutor (Async with Gemini + Chapter Navigation)
    (async () => {
      try {
        const resp = await this.aiTutor.askAsync(message);
        const typingEl = document.getElementById(typingId);
        if (typingEl) {
          let jumpButtonHtml = '';
          const buttons = [];

          if (resp.chapterId) {
            buttons.push(`
              <button class="btn-primary" style="font-size: 13px; padding: 6px 14px;" onclick="window.app.navigateTo('reader', ${resp.chapterId})">
                <i class="fa-solid fa-book-open"></i> 前往第 ${resp.chapterId} 章教材完整講義 📖
              </button>
            `);
          }

          if (resp.googleSearchUrl) {
            buttons.push(`
              <a href="${resp.googleSearchUrl}" target="_blank" rel="noopener noreferrer" class="btn-tool" style="font-size: 12.5px; padding: 6px 14px; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; background: #EEF2FF; color: #4338CA; border-color: #C7D2FE;" title="直接開啟 Google 搜尋查看 Google 官方 Gemini AI 最新摘要">
                <i class="fa-brands fa-google" style="color: #4285F4;"></i> 查看 Google 即時 Gemini AI 統整
                <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 10px; opacity: 0.8;"></i>
              </a>
            `);
          }

          if (buttons.length > 0) {
            jumpButtonHtml = `
              <div style="margin-top: 14px; padding-top: 10px; border-top: 1px dashed rgba(255, 107, 139, 0.3); display: flex; align-items: center; justify-content: flex-start; flex-wrap: wrap; gap: 8px;">
                ${buttons.join('')}
              </div>
            `;
          }

          typingEl.innerHTML = `
            <div>${marked.parse(resp.reply)}</div>
            ${jumpButtonHtml}
          `;
          messagesArea.scrollTop = messagesArea.scrollHeight;
        }
      } catch (e) {
        const typingEl = document.getElementById(typingId);
        if (typingEl) {
          typingEl.innerHTML = `<div>🌸 抱歉，解析生成時遇到小小的狀況，請再試一次喔！</div>`;
        }
      }
    })();
  }

  openGeminiKeyModal() {
    const modal = document.getElementById('gemini-key-modal');
    const input = document.getElementById('gemini-api-key-input');
    if (!modal) return;
    if (input && this.aiTutor) {
      input.value = this.aiTutor.getApiKey();
    }
    modal.style.display = 'flex';
    setTimeout(() => {
      if (input) input.focus();
    }, 80);
  }

  closeGeminiKeyModal() {
    const modal = document.getElementById('gemini-key-modal');
    if (modal) modal.style.display = 'none';
  }

  saveGeminiApiKey() {
    const input = document.getElementById('gemini-api-key-input');
    const val = input ? input.value.trim() : '';
    if (this.aiTutor) {
      this.aiTutor.setApiKey(val);
    }
    this.updateGeminiStatusBadge();
    this.closeGeminiKeyModal();
    alert(val ? '✅ Google Gemini API Key 設定成功！AI 導師將為您即時串接 Gemini 最新回答！🌸' : '已清除自訂 API Key。');
  }

  clearGeminiApiKey() {
    if (this.aiTutor) {
      this.aiTutor.setApiKey('');
    }
    const input = document.getElementById('gemini-api-key-input');
    if (input) input.value = '';
    this.updateGeminiStatusBadge();
    this.closeGeminiKeyModal();
    alert('已清除 API Key。');
  }

  updateGeminiStatusBadge() {
    const badge = document.getElementById('gemini-status-badge');
    if (!badge || !this.aiTutor) return;
    if (this.aiTutor.hasCustomKey()) {
      badge.innerHTML = `<i class="fa-solid fa-sparkles"></i> Gemini 已連線 · 即時名師雙引擎`;
      badge.style.background = '#ECFDF5';
      badge.style.color = '#065F46';
      badge.style.borderColor = '#A7F3D0';
    } else {
      badge.innerHTML = `<i class="fa-solid fa-sparkles"></i> 雙引擎：20章講義導航 + Gemini 智慧解析`;
      badge.style.background = '#EEF2FF';
      badge.style.color = '#4F46E5';
      badge.style.borderColor = '#C7D2FE';
    }
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

    this.currentGeneratorQuestionsMap = {};
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
      this.currentGeneratorQuestionsMap[qKey] = q;
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
    } else if (this.mistakeAnalyzer && this.mistakeAnalyzer.recordEnabled) {
      const qObj = this.currentGeneratorQuestionsMap[qKey];
      if (qObj) {
        const recorded = this.mistakeAnalyzer.recordMistake({
          chapterId: qObj.chapterId || 1,
          topic: qObj.topic || '無限題庫演練',
          q: qObj.q,
          options: qObj.options || [],
          userWrongIndex: selectedIndex,
          correctIndex: correctIndex,
          zh: qObj.zh || '',
          explain: qObj.explain || ''
        });
        if (recorded && explainCard) {
          const fmt = (txt) => this.quizEngine ? this.quizEngine.formatRichText(txt) : txt;
          const diagBox = document.createElement('div');
          diagBox.className = 'blindspot-inline-alert';
          diagBox.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:6px; margin-bottom:6px;">
              <span style="font-weight:800; color:#BE185D; font-size:13.5px;">
                <i class="fa-solid fa-brain"></i> 已歸檔至「${recorded.userName || this.mistakeAnalyzer.currentUser}」的錯題本｜盲點診斷：${recorded.blindSpot.categoryTitle}
              </span>
              <button class="btn-tool" style="font-size:11.5px; padding:2px 8px;" onclick="window.app.navigateTo('mistakes')">
                前往專屬盲點特訓 →
              </button>
            </div>
            <div style="font-size:13px; color:#831843; line-height:1.6;">
              ❌ 妳誤選了 <strong>${fmt(recorded.userWrongText)}</strong> vs. ✅ 正解 <strong>${fmt(recorded.correctText)}</strong><br>
              🔍 <strong>盲點分析：</strong>${fmt(recorded.blindSpot.diagnosis)}
            </div>
          `;
          explainCard.appendChild(diagBox);
        }
      }
    }

    if (explainCard) explainCard.classList.add('show');
  }

  switchMistakeProfileUser(name) {
    if (!this.mistakeAnalyzer) return;
    this.mistakeAnalyzer.setCurrentUser(name);
    const quizArea = document.getElementById('blindspot-targeted-quiz-area');
    if (quizArea) quizArea.innerHTML = '';
    this.renderMistakesView();
  }

  deleteMistakeProfileUser(name, event) {
    if (event) event.stopPropagation();
    if (!this.mistakeAnalyzer) return;
    if (confirm(`確定要刪除學員「${name}」的所有錯題紀錄與檔案嗎？`)) {
      this.mistakeAnalyzer.deleteUserProfile(name);
      const quizArea = document.getElementById('blindspot-targeted-quiz-area');
      if (quizArea) quizArea.innerHTML = '';
      this.renderMistakesView();
    }
  }

  renderMistakesView() {
    if (!this.mistakeAnalyzer) return;
    const selectorBar = document.getElementById('mistake-user-selector-bar');
    const reportContainer = document.getElementById('blindspot-analysis-report');
    const listContainer = document.getElementById('mistake-records-list');
    if (!reportContainer || !listContainer) return;

    const fmt = (txt) => this.quizEngine ? this.quizEngine.formatRichText(txt) : txt;
    const users = this.mistakeAnalyzer.getUserList();
    const activeUser = this.mistakeAnalyzer.getActiveViewUser();
    this.mistakeAnalyzer.syncToggleUI();

    // Render Multi-User Selector Bar
    if (selectorBar) {
      if (users.length === 0) {
        selectorBar.innerHTML = `
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
            <span style="font-size: 13.5px; color: var(--text-muted); font-weight: 600;">
              <i class="fa-solid fa-users" style="color: var(--primary);"></i> 目前尚無已登錄的學員錯題檔案。請點擊右側按鈕建立妳的名字開始測驗！
            </span>
            <button class="btn-primary" style="font-size: 12.5px; padding: 6px 14px;" onclick="window.app.openQuizUserModal()">
              <i class="fa-solid fa-user-plus"></i> 輸入學員姓名開始記錄
            </button>
          </div>
        `;
      } else {
        const userPills = users.map(u => {
          const isSelected = u.name === activeUser;
          const safeName = u.name.replace(/'/g, "\\'");
          return `
            <div onclick="window.app.switchMistakeProfileUser('${safeName}')" style="display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; border-radius: 99px; cursor: pointer; font-size: 13.5px; font-weight: 700; transition: all 0.2s; border: 1.5px solid ${isSelected ? 'var(--primary)' : 'var(--border-card)'}; background: ${isSelected ? 'linear-gradient(135deg, #FF6B8B, #FF8E53)' : '#fff'}; color: ${isSelected ? '#fff' : 'var(--text-main)'}; box-shadow: ${isSelected ? '0 4px 12px rgba(255,107,139,0.28)' : 'none'};">
              <i class="fa-solid fa-user-graduate"></i>
              <span>${u.name}</span>
              <span style="background: ${isSelected ? 'rgba(255,255,255,0.25)' : '#FEE2E2'}; color: ${isSelected ? '#fff' : '#B91C1C'}; font-size: 11.5px; padding: 1px 8px; border-radius: 99px;">${u.count} 題</span>
              <span onclick="window.app.deleteMistakeProfileUser('${safeName}', event)" title="刪除此學員檔案" style="opacity: 0.7; font-size: 12px; margin-left: 2px; padding: 0 3px;">✕</span>
            </div>
          `;
        }).join('');

        selectorBar.innerHTML = `
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
            <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
              <span style="font-size: 13.5px; font-weight: 800; color: var(--secondary);">
                <i class="fa-solid fa-users-viewfinder"></i> 選擇要檢視／特訓的學員檔案：
              </span>
              ${userPills}
            </div>
            <span style="font-size: 12px; color: var(--text-muted);">
              ${this.mistakeAnalyzer.isAnonymous() ? '🕵️ 目前測驗處於 Anonymous 匿名狀態（點選上方學員即可切換為該學員身分）' : `✅ 目前測驗正以「${this.mistakeAnalyzer.currentUser}」身分自動記錄中`}
            </span>
          </div>
        `;
      }
    }

    const analysis = this.mistakeAnalyzer.analyzeAllBlindSpots();
    const mistakes = this.mistakeAnalyzer.mistakes || [];

    if (mistakes.length === 0) {
      reportContainer.innerHTML = `
        <div style="text-align: center; padding: 48px 24px; background: #fff; border-radius: 20px; border: 1px solid var(--border-card); box-shadow: var(--shadow-soft);">
          <div style="font-size: 46px; margin-bottom: 12px;">🎉</div>
          <h3 style="font-size: 20px; color: var(--text-main); margin-bottom: 8px;">
            ${activeUser ? `學員「${activeUser}」目前還沒有任何錯題紀錄喔！` : '目前還沒有任何錯題紀錄喔！'}
          </h3>
          <p style="font-size: 14px; color: var(--text-muted); max-width: 560px; margin: 0 auto 20px;">
            進入「實力診斷」或「無限題庫」時，系統會跳出視窗請妳輸入名字（若選擇 <strong>Anonymous</strong> 則不記錄）。所有答錯的題目都會自動歸檔在妳的名字下，為妳分析專屬盲點並產生客製化題目！
          </p>
          <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
            <button class="btn-primary" onclick="window.app.navigateTo('quiz', 1)">
              <i class="fa-solid fa-pen-to-square"></i> 前往實力診斷測驗
            </button>
            <button class="btn-secondary" onclick="window.app.navigateTo('generator')">
              <i class="fa-solid fa-dice"></i> 前往無限題庫挑戰
            </button>
            <button class="btn-tool" onclick="window.app.startTargetedBlindSpotQuiz()">
              <i class="fa-solid fa-bolt"></i> 直接體驗全方位盲點動態測驗
            </button>
          </div>
        </div>
      `;
      listContainer.innerHTML = '';
      return;
    }

    // 1. Render Blind Spot Summary Report Cards
    const blindSpotCardsHtml = analysis.blindSpots.map((bs, idx) => `
      <div class="blindspot-card">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; margin-bottom: 10px;">
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <span style="background: linear-gradient(135deg, #FF6B8B, #8B5CF6); color: #fff; font-size: 12px; font-weight: 800; padding: 3px 10px; border-radius: 99px;">
              盲點 TOP ${idx + 1}
            </span>
            <h4 style="font-size: 16.5px; font-weight: 800; color: var(--text-main); margin: 0;">${bs.categoryTitle}</h4>
          </div>
          <span style="background: #FEE2E2; color: #B91C1C; font-size: 12.5px; font-weight: 800; padding: 3px 10px; border-radius: 99px; white-space: nowrap;">
            累計失誤 ${bs.count} 次
          </span>
        </div>
        <div style="font-size: 13.5px; color: var(--text-main); background: #FFFDF9; border-left: 3px solid var(--secondary); padding: 10px 14px; border-radius: 8px; margin-bottom: 10px; line-height: 1.65;">
          ${fmt(bs.prescription)}
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; font-size: 12.5px; color: var(--text-muted);">
          <span><i class="fa-solid fa-book-bookmark"></i> 關聯章節：${bs.chapters.map(c => `<a href="#chapter-${c}" onclick="event.preventDefault(); window.app.navigateTo('reader', ${c})" style="color:var(--primary-dark); font-weight:700; text-decoration:underline; margin-right:6px;">第 ${c} 章</a>`).join('')}</span>
          <button class="btn-tool" style="font-size: 12px; padding: 4px 10px;" onclick="window.app.startTargetedBlindSpotQuiz('${bs.categoryId}')">
            <i class="fa-solid fa-crosshairs"></i> 專練此盲點題型
          </button>
        </div>
      </div>
    `).join('');

    reportContainer.innerHTML = `
      <div style="margin-bottom: 14px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
        <h3 style="font-size: 19px; color: var(--text-main); display: flex; align-items: center; gap: 8px; margin: 0;">
          <i class="fa-solid fa-stethoscope" style="color: var(--primary);"></i>
          <span>學員「${activeUser}」的 AI 錯誤選項歸納 · 核心學習盲點診斷報告（共分析 ${analysis.totalMistakes} 道錯題）</span>
        </h3>
      </div>
      <div class="blindspot-grid">
        ${blindSpotCardsHtml}
      </div>
    `;

    // 2. Render Individual Recorded Mistakes List
    const itemsHtml = mistakes.map((m, idx) => {
      return `
        <div class="question-card" style="border-left: 4px solid #F43F5E;">
          <div class="question-meta" style="justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <span class="question-num-tag" style="background: #FEE2E2; color: #B91C1C;">錯題 #${idx + 1}（累計錯 ${m.mistakeCount || 1} 次）</span>
              <span class="question-section-tag">第 ${m.chapterId} 章 · ${m.topic}</span>
              <span class="question-section-tag" style="background: #F3E8FF; color: #6D28D9;">
                <i class="fa-solid fa-brain"></i> ${m.blindSpot?.categoryTitle || '語法盲點'}
              </span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 12px; color: var(--text-muted);">${m.lastWrongTime || ''}</span>
              <button class="btn-tool" style="font-size: 12px; padding: 3px 10px; color: #10B981; border-color: #A7F3D0;" onclick="window.app.removeSingleMistake('${m.id}')" title="標記為已學會並從錯題本移除">
                <i class="fa-solid fa-check"></i> 已學會移除
              </button>
            </div>
          </div>

          <div class="question-text">${fmt(m.q)}</div>

          <!-- Wrong Choice vs Correct Answer Comparison -->
          <div class="mistake-compare-row">
            <div class="wrong-choice-pill">
              <span class="pill-badge">❌ 妳誤選的答案</span>
              <strong>${fmt(m.userWrongText)}</strong>
            </div>
            <div class="correct-choice-pill">
              <span class="pill-badge">✅ 正確標準答案</span>
              <strong>${fmt(m.correctText)}</strong>
            </div>
          </div>

          <div class="explanation-card show" style="margin-top: 12px;">
            <div class="explain-header" style="color: #BE185D;">
              <i class="fa-solid fa-magnifying-glass-chart"></i>
              <span>錯誤原因與盲點深度剖析</span>
            </div>
            <div style="font-size: 14px; color: #831843; background: #FFF0F5; padding: 10px 14px; border-radius: 10px; margin-bottom: 10px; line-height: 1.65;">
              ${fmt(m.blindSpot?.diagnosis || '')}
            </div>
            ${m.zh ? `<div class="explain-translation"><strong>中文語意：</strong>${fmt(m.zh)}</div>` : ''}
            <div class="explain-body">${fmt(m.explain || '')}</div>
          </div>
        </div>
      `;
    }).join('');

    listContainer.innerHTML = `
      <div style="margin-bottom: 14px; display: flex; justify-content: space-between; align-items: center;">
        <h3 style="font-size: 18px; color: var(--text-main); margin: 0;">
          <i class="fa-solid fa-book-medical" style="color: #F43F5E;"></i>
          <span>學員「${activeUser}」的歷史錯題與誤選答案明細（共 ${mistakes.length} 題）</span>
        </h3>
      </div>
      ${itemsHtml}
    `;
  }

  removeSingleMistake(id) {
    if (!this.mistakeAnalyzer) return;
    this.mistakeAnalyzer.removeMistake(id);
    this.renderMistakesView();
  }

  clearAllMistakeRecords() {
    if (!this.mistakeAnalyzer) return;
    const activeUser = this.mistakeAnalyzer.getActiveViewUser();
    if (!activeUser || this.mistakeAnalyzer.mistakes.length === 0) return;
    if (confirm(`確定要清空學員「${activeUser}」已記錄的所有錯題與盲點分析資料嗎？`)) {
      this.mistakeAnalyzer.clearAllMistakes(activeUser);
      const quizArea = document.getElementById('blindspot-targeted-quiz-area');
      if (quizArea) quizArea.innerHTML = '';
      this.renderMistakesView();
    }
  }

  async startTargetedBlindSpotQuiz(specificCategoryId = null) {
    if (!this.mistakeAnalyzer) return;
    const countSelect = document.getElementById('blindspot-quiz-count');
    const count = parseInt(countSelect?.value || '10', 10);
    const container = document.getElementById('blindspot-targeted-quiz-area');
    if (!container) return;

    container.innerHTML = `
      <div style="text-align: center; padding: 36px; background: #fff; border-radius: 20px; border: 2px solid var(--primary-light); color: var(--primary);">
        <i class="fa-solid fa-wand-magic-sparkles fa-spin fa-2x"></i>
        <p style="margin-top: 12px; font-weight: 700;">正在根據妳的錯誤答案盲點，動態合成專屬剋星特訓題組...🎯</p>
      </div>
    `;

    let questions = await this.mistakeAnalyzer.buildTargetedBlindSpotQuiz(this.generator, count);
    if (specificCategoryId) {
      const catVars = this.mistakeAnalyzer.generateDynamicBlindSpotVariations([specificCategoryId], count);
      if (catVars.length > 0) {
        questions = [...catVars, ...questions].slice(0, count);
      }
    }

    this.currentBlindSpotQuestionsMap = {};
    this.blindSpotUserAnswers = {};
    const fmt = (txt) => this.quizEngine ? this.quizEngine.formatRichText(txt) : txt;
    const letters = ['A', 'B', 'C', 'D', 'E'];
    const targetUser = this.mistakeAnalyzer.getActiveViewUser() || '目前學員';

    let html = `
      <div style="background: #FFFDF9; border: 2px solid var(--primary); border-radius: 22px; padding: 22px; box-shadow: var(--shadow-hover);">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 18px; padding-bottom: 12px; border-bottom: 2px dashed rgba(255, 107, 139, 0.3);">
          <div>
            <h3 style="font-size: 19px; color: var(--primary-dark); margin: 0; display: flex; align-items: center; gap: 8px;">
              <i class="fa-solid fa-crosshairs"></i>
              <span>「${targetUser}」專屬客製化盲點特訓測驗（共 ${questions.length} 題）</span>
            </h3>
            <p style="font-size: 13px; color: var(--text-muted); margin: 4px 0 0 0;">
              依據「${targetUser}」的歷史錯題選項重新洗牌，並針對弱點動態合成同構變體題！請點擊選項作答：
            </p>
          </div>
          <button class="btn-tool" onclick="document.getElementById('blindspot-targeted-quiz-area').innerHTML=''">
            <i class="fa-solid fa-xmark"></i> 收起特訓試卷
          </button>
        </div>
    `;

    questions.forEach((q, idx) => {
      const qKey = `bs_q_${idx}`;
      this.currentBlindSpotQuestionsMap[qKey] = q;
      const optionsHtml = (q.options || []).map((opt, optIdx) => `
        <button class="option-btn" data-key="${qKey}" data-index="${optIdx}" onclick="window.app.handleBlindSpotQuizAnswer('${qKey}', ${optIdx}, ${q.answer})">
          <span class="option-letter">${letters[optIdx]}</span>
          <span class="option-text">${fmt(opt)}</span>
        </button>
      `).join('');

      html += `
        <div class="question-card" id="card-${qKey}">
          <div class="question-meta">
            <span class="question-num-tag" style="background: var(--primary); color: #fff;">特訓第 ${idx + 1} 題</span>
            <span class="question-section-tag">${q.sourceTag || '🎯 盲點強化'}</span>
            <span class="question-section-tag" style="background: #F3E8FF; color: #6D28D9;">第 ${q.chapterId || 1} 章 · ${q.topic || '盲點演練'}</span>
          </div>
          <div class="question-text">${fmt(q.q)}</div>
          <div class="options-grid" id="options-${qKey}">
            ${optionsHtml}
          </div>
          <div class="explanation-card" id="explain-${qKey}">
            <div class="explain-header">
              <i class="fa-solid fa-bullseye" style="color: var(--primary);"></i>
              <span>盲點突破解析與中譯</span>
            </div>
            ${q.zh ? `<div class="explain-translation"><strong>中譯：</strong>${fmt(q.zh)}</div>` : ''}
            <div class="explain-body">${fmt(q.explain || '')}</div>
          </div>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  handleBlindSpotQuizAnswer(qKey, selectedIndex, correctIndex) {
    if (this.blindSpotUserAnswers[qKey] !== undefined) return;
    this.blindSpotUserAnswers[qKey] = selectedIndex;

    const optionsContainer = document.getElementById(`options-${qKey}`);
    const explainCard = document.getElementById(`explain-${qKey}`);
    if (!optionsContainer) return;

    const buttons = optionsContainer.querySelectorAll('.option-btn');
    buttons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === correctIndex) btn.classList.add('correct');
      if (idx === selectedIndex && selectedIndex !== correctIndex) btn.classList.add('wrong');
    });

    if (selectedIndex !== correctIndex && this.mistakeAnalyzer && this.mistakeAnalyzer.recordEnabled) {
      const qObj = this.currentBlindSpotQuestionsMap[qKey];
      if (qObj) {
        this.mistakeAnalyzer.recordMistake({
          chapterId: qObj.chapterId || 1,
          topic: qObj.topic || '盲點動態特訓',
          q: qObj.q,
          options: qObj.options || [],
          userWrongIndex: selectedIndex,
          correctIndex: correctIndex,
          zh: qObj.zh || '',
          explain: qObj.explain || ''
        });
      }
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
    // 1. Update daily streak
    const today = new Date().toISOString().slice(0, 10);
    const lastVisitDate = localStorage.getItem('bubble_last_visit_date');
    let streak = parseInt(localStorage.getItem('bubble_streak') || '1', 10);
    if (lastVisitDate && lastVisitDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      if (lastVisitDate === yesterday) {
        streak += 1;
      } else {
        streak = 1;
      }
    }
    localStorage.setItem('bubble_last_visit_date', today);
    localStorage.setItem('bubble_streak', String(streak));
    const streakEl = document.getElementById('streak-count');
    if (streakEl) streakEl.innerText = `${streak} 天`;

    // 2. Update visitor counter (Global API + Local fallback)
    this.initVisitorCounter();
  }

  getTaiwanDateTime() {
    const now = new Date();
    try {
      const dateStr = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Taipei',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(now);
      const timeStr = new Intl.DateTimeFormat('zh-TW', {
        timeZone: 'Asia/Taipei',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).format(now);
      return { dateStr, timeStr };
    } catch (e) {
      const iso = new Date(now.getTime() + 8 * 3600000).toISOString();
      return { dateStr: iso.slice(0, 10), timeStr: iso.slice(11, 19) };
    }
  }

  async fetchVisitorIPInfo() {
    // 1. Primary: ipwho.is (returns IP + Country + City + ISP)
    try {
      const res = await fetch('https://ipwho.is/');
      if (res.ok) {
        const d = await res.json();
        if (d && d.ip) {
          const loc = [d.country, d.city].filter(Boolean).join(' · ') || 'Taiwan';
          const isp = (d.connection && d.connection.isp) ? d.connection.isp : '';
          return { ip: d.ip, location: loc, isp };
        }
      }
    } catch (e) {}

    // 2. Fallback: api.ipify.org
    try {
      const res = await fetch('https://api.ipify.org?format=json');
      if (res.ok) {
        const d = await res.json();
        if (d && d.ip) {
          return { ip: d.ip, location: 'Taiwan', isp: '' };
        }
      }
    } catch (e) {}

    // 3. Fallback: Cloudflare trace
    try {
      const res = await fetch('https://www.cloudflare.com/cdn-cgi/trace');
      if (res.ok) {
        const txt = await res.text();
        const m = txt.match(/^ip=(.+)$/m);
        if (m && m[1]) {
          return { ip: m[1].trim(), location: 'Taiwan', isp: '' };
        }
      }
    } catch (e) {}

    return { ip: 'Local-Client', location: '本地裝置', isp: '' };
  }

  detectDeviceAndBrowser() {
    const ua = navigator.userAgent || '';
    let os = '未知作業系統';
    let deviceType = '電腦';

    // Detect OS & Device
    if (/iPhone/i.test(ua)) {
      os = 'iPhone (iOS)';
      deviceType = '手機';
    } else if (/iPad/i.test(ua) || (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1)) {
      os = 'iPad (iPadOS)';
      deviceType = '平板';
    } else if (/Android/i.test(ua)) {
      const modelMatch = ua.match(/Android\s+[\d.]+;\s*([^;)]+)/i);
      const model = modelMatch && modelMatch[1] ? modelMatch[1].trim() : '';
      deviceType = /Mobile/i.test(ua) ? '手機' : '平板';
      os = model ? `Android ${deviceType} (${model})` : `Android ${deviceType}`;
    } else if (/Windows NT 10\.0/i.test(ua)) {
      os = 'Windows 10/11 電腦';
    } else if (/Windows NT/i.test(ua)) {
      os = 'Windows 電腦';
    } else if (/Macintosh|Mac OS X/i.test(ua)) {
      os = 'Mac 電腦 (macOS)';
    } else if (/CrOS/i.test(ua)) {
      os = 'Chromebook (ChromeOS)';
    } else if (/Linux/i.test(ua)) {
      os = 'Linux 電腦';
    }

    // Detect Browser
    let browser = '瀏覽器';
    if (/Line\/([\d.]+)/i.test(ua)) {
      browser = `LINE 內建瀏覽器 ${RegExp.$1.split('.')[0]}`;
    } else if (/FBAN|FBAV/i.test(ua)) {
      browser = 'Facebook 內建瀏覽器';
    } else if (/Instagram/i.test(ua)) {
      browser = 'Instagram 內建瀏覽器';
    } else if (/Edg\/([\d.]+)/i.test(ua) || /EdgiOS\/([\d.]+)/i.test(ua) || /EdgA\/([\d.]+)/i.test(ua)) {
      browser = `Edge ${RegExp.$1.split('.')[0]}`;
    } else if (/OPR\/([\d.]+)/i.test(ua) || /Opera/i.test(ua)) {
      browser = 'Opera';
    } else if (/CriOS\/([\d.]+)/i.test(ua)) {
      browser = `Chrome ${RegExp.$1.split('.')[0]}`;
    } else if (/FxiOS\/([\d.]+)/i.test(ua) || /Firefox\/([\d.]+)/i.test(ua)) {
      browser = `Firefox ${RegExp.$1.split('.')[0]}`;
    } else if (/Chrome\/([\d.]+)/i.test(ua) && !/Edg/i.test(ua)) {
      browser = `Chrome ${RegExp.$1.split('.')[0]}`;
    } else if (/Version\/([\d.]+).*Safari/i.test(ua)) {
      browser = `Safari ${RegExp.$1.split('.')[0]}`;
    } else if (/Safari/i.test(ua)) {
      browser = 'Safari';
    }

    return `${os} · ${browser}`;
  }

  loadLocalVisitorStore() {
    try {
      const raw = localStorage.getItem('bubble_visitor_ip_logs_v1');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.logs)) return parsed;
      }
    } catch (e) {}
    return { totalUniqueDailyVisits: 0, logs: [] };
  }

  mergeVisitorStores(localStore, cloudStore) {
    const map = new Map();
    const allLogs = [...(cloudStore.logs || []), ...(localStore.logs || [])];
    allLogs.forEach(item => {
      if (!item || !item.date || !item.ip) return;
      const key = `${item.date}_${item.ip}`;
      if (!map.has(key)) {
        map.set(key, { ...item });
      } else {
        const prev = map.get(key);
        map.set(key, {
          date: item.date,
          ip: item.ip,
          studentName: item.studentName || prev.studentName || '',
          deviceBrowser: item.deviceBrowser || prev.deviceBrowser || '未知裝置 / 瀏覽器',
          location: item.location || prev.location || 'Taiwan',
          isp: item.isp || prev.isp || '',
          firstTime: (prev.firstTime && item.firstTime) ? (prev.firstTime < item.firstTime ? prev.firstTime : item.firstTime) : (prev.firstTime || item.firstTime),
          lastTime: (prev.lastTime && item.lastTime) ? (prev.lastTime > item.lastTime ? prev.lastTime : item.lastTime) : (prev.lastTime || item.lastTime),
          viewsToday: Math.max(prev.viewsToday || 1, item.viewsToday || 1)
        });
      }
    });

    // Sort newest date + newest lastTime first
    const mergedLogs = Array.from(map.values()).sort((a, b) => {
      if (a.date !== b.date) return b.date.localeCompare(a.date);
      return (b.lastTime || '').localeCompare(a.lastTime || '');
    });

    const totalUniqueDailyVisits = Math.max(
      mergedLogs.length,
      localStore.totalUniqueDailyVisits || 0,
      cloudStore.totalUniqueDailyVisits || 0
    );

    return { totalUniqueDailyVisits, logs: mergedLogs.slice(0, 500) };
  }

  async initVisitorCounter() {
    const visitorEl = document.getElementById('visitor-count');
    const CLOUD_LOG_URL = 'https://api.restful-api.dev/objects/ff808181a09d98f701a173a083f608a1';

    const { dateStr, timeStr } = this.getTaiwanDateTime();
    const deviceBrowser = this.detectDeviceAndBrowser();
    let localStore = this.loadLocalVisitorStore();
    if (visitorEl && localStore.totalUniqueDailyVisits > 0) {
      visitorEl.innerText = `${localStore.totalUniqueDailyVisits.toLocaleString()} 次`;
    }

    // 1. Detect Visitor Public IP
    const ipInfo = await this.fetchVisitorIPInfo();
    this.currentVisitorIPInfo = { ...ipInfo, deviceBrowser, dateStr, timeStr };

    // 2. Fetch Cloud IP Store
    let cloudStore = { totalUniqueDailyVisits: 0, logs: [] };
    try {
      const res = await fetch(CLOUD_LOG_URL, { cache: 'no-store' });
      if (res.ok) {
        const obj = await res.json();
        if (obj && obj.data && Array.isArray(obj.data.logs)) {
          cloudStore = obj.data;
        }
      }
    } catch (e) {}

    // 3. Merge Local & Cloud Stores
    let store = this.mergeVisitorStores(localStore, cloudStore);

    // 4. Check if (dateStr, ipInfo.ip) already exists today
    const existingIdx = store.logs.findIndex(r => r.date === dateStr && r.ip === ipInfo.ip);

    if (existingIdx === -1) {
      // First time this IP visited today -> count +1!
      const initialStudent = (this.mistakeAnalyzer && this.mistakeAnalyzer.hasValidDailyIPSession(dateStr, ipInfo.ip))
        ? this.mistakeAnalyzer.currentUser
        : '';
      store.logs.unshift({
        date: dateStr,
        ip: ipInfo.ip,
        studentName: initialStudent,
        deviceBrowser,
        location: ipInfo.location,
        isp: ipInfo.isp,
        firstTime: timeStr,
        lastTime: timeStr,
        viewsToday: 1
      });
      store.totalUniqueDailyVisits = Math.max(store.totalUniqueDailyVisits + 1, store.logs.length);
    } else {
      // Same IP already visited today -> DO NOT increment totalUniqueDailyVisits!
      const rec = store.logs[existingIdx];
      rec.lastTime = timeStr;
      rec.deviceBrowser = deviceBrowser || rec.deviceBrowser || '未知裝置 / 瀏覽器';
      rec.viewsToday = (rec.viewsToday || 1) + 1;
      if (ipInfo.location && ipInfo.location !== 'Taiwan') rec.location = ipInfo.location;
      if (ipInfo.isp) rec.isp = ipInfo.isp;

      // Sync daily IP student session with today's IP record
      if (this.mistakeAnalyzer) {
        if (this.mistakeAnalyzer.hasValidDailyIPSession(dateStr, ipInfo.ip)) {
          rec.studentName = this.mistakeAnalyzer.currentUser;
        } else if (rec.studentName) {
          this.mistakeAnalyzer.setCurrentUser(rec.studentName, dateStr, ipInfo.ip);
        }
      }
    }

    this.visitorStore = store;

    // 5. Save to localStorage & update UI badge immediately
    try {
      localStorage.setItem('bubble_visitor_ip_logs_v1', JSON.stringify(store));
    } catch (e) {}
    if (visitorEl) {
      visitorEl.innerText = `${store.totalUniqueDailyVisits.toLocaleString()} 次`;
    }

    // 6. Persist updated IP logs to Cloud Store
    try {
      await fetch(CLOUD_LOG_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'bubble-english-visitors',
          data: store
        })
      });
    } catch (e) {}
  }

  openVisitorLogModal() {
    const modal = document.getElementById('visitor-log-modal');
    if (!modal) return;
    modal.style.display = 'flex';
    this.renderVisitorLogModalContent();
  }

  closeVisitorLogModal() {
    const modal = document.getElementById('visitor-log-modal');
    if (modal) modal.style.display = 'none';
  }

  renderVisitorLogModalContent() {
    const summaryEl = document.getElementById('visitor-modal-summary');
    const tbodyEl = document.getElementById('visitor-log-tbody');
    const store = this.visitorStore || this.loadLocalVisitorStore();
    const cur = this.currentVisitorIPInfo || { ip: '偵測中...', deviceBrowser: this.detectDeviceAndBrowser(), location: '', dateStr: '' };

    if (summaryEl) {
      summaryEl.innerHTML = `
        <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 10px;">
          <div>
            <span style="color: var(--text-muted);">目前連線 IP：</span>
            <strong style="color: var(--primary-dark); font-family: monospace; font-size: 14px;">${cur.ip}</strong>
            ${cur.location ? `<span style="color: var(--text-muted); margin-left: 4px;">(${cur.location})</span>` : ''}
          </div>
          <span style="background: #F3E8FF; color: #6D28D9; padding: 3px 10px; border-radius: 99px; font-weight: 700; font-size: 12px;">
            <i class="fa-solid fa-laptop-mobile"></i> ${cur.deviceBrowser || this.detectDeviceAndBrowser()}
          </span>
        </div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="background: #DCFCE7; color: #15803D; padding: 3px 10px; border-radius: 99px; font-weight: 700; font-size: 12px;">
            <i class="fa-solid fa-check-circle"></i> 同 IP 同日僅計 1 次
          </span>
          <span>有效總訪客計數：<strong style="color: var(--primary); font-size: 15px;">${(store.totalUniqueDailyVisits || 0).toLocaleString()} 次</strong></span>
        </div>
      `;
    }

    if (tbodyEl) {
      if (!store.logs || store.logs.length === 0) {
        tbodyEl.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 24px; color: var(--text-muted);">尚無訪客紀錄</td></tr>`;
        return;
      }
      tbodyEl.innerHTML = store.logs.map(r => {
        const isCurrent = cur.ip === r.ip && cur.dateStr === r.date;
        const locText = [r.location, r.isp].filter(Boolean).join(' · ') || '—';
        const devText = r.deviceBrowser || '電腦 / 瀏覽器';
        return `
          <tr style="${isCurrent ? 'background: #FFF0F5; font-weight: 600;' : ''}">
            <td>${r.date}</td>
            <td style="font-family: monospace; color: var(--primary-dark); font-weight: 700;">
              ${r.ip} ${isCurrent ? '<span style="font-size:11px; background:var(--primary); color:#fff; padding:1px 6px; border-radius:99px; margin-left:4px;">目前連線</span>' : ''}
            </td>
            <td style="color: var(--secondary); font-weight: 600;">${devText}</td>
            <td style="max-width: 180px; overflow: hidden; text-overflow: ellipsis;" title="${locText}">${locText}</td>
            <td>${r.firstTime || '—'}</td>
            <td>${r.lastTime || '—'}</td>
            <td>
              <span style="color: #15803D; font-weight: 700;">計入 1 次</span>
              <span style="color: var(--text-muted); font-size: 11px;">(瀏覽 ${r.viewsToday || 1} 回)</span>
            </td>
          </tr>
        `;
      }).join('');
    }
  }

  exportVisitorLogsCSV() {
    const store = this.visitorStore || this.loadLocalVisitorStore();
    const logs = store.logs || [];
    const header = ['造訪日期', '訪客IP位址', '裝置機器與瀏覽器', '地區', '電信商(ISP)', '當日首次時間', '最後活動時間', '當日總瀏覽回數', '有效計數'];
    const rows = logs.map(r => [
      r.date || '',
      r.ip || '',
      `"${(r.deviceBrowser || '未知裝置 / 瀏覽器').replace(/"/g, '""')}"`,
      `"${(r.location || '').replace(/"/g, '""')}"`,
      `"${(r.isp || '').replace(/"/g, '""')}"`,
      r.firstTime || '',
      r.lastTime || '',
      r.viewsToday || 1,
      1
    ]);
    const csvContent = '\uFEFF' + [header.join(','), ...rows.map(row => row.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bubble_english_visitor_ips_${this.getTaiwanDateTime().dateStr}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// Global bootstrap
window.GrammarApp = GrammarApp;
document.addEventListener('DOMContentLoaded', () => {
  window.app = new GrammarApp();
  window.quizEngine = window.app.quizEngine;
});
