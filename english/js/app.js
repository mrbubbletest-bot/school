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
    let localStore = this.loadLocalVisitorStore();
    if (visitorEl && localStore.totalUniqueDailyVisits > 0) {
      visitorEl.innerText = `${localStore.totalUniqueDailyVisits.toLocaleString()} 次`;
    }

    // 1. Detect Visitor Public IP
    const ipInfo = await this.fetchVisitorIPInfo();
    this.currentVisitorIPInfo = { ...ipInfo, dateStr, timeStr };

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
    let isNewDailyIPVisit = false;

    if (existingIdx === -1) {
      // First time this IP visited today -> count +1!
      isNewDailyIPVisit = true;
      store.logs.unshift({
        date: dateStr,
        ip: ipInfo.ip,
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
      rec.viewsToday = (rec.viewsToday || 1) + 1;
      if (ipInfo.location && ipInfo.location !== 'Taiwan') rec.location = ipInfo.location;
      if (ipInfo.isp) rec.isp = ipInfo.isp;
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
    const cur = this.currentVisitorIPInfo || { ip: '偵測中...', location: '', dateStr: '' };

    if (summaryEl) {
      summaryEl.innerHTML = `
        <div>
          <span style="color: var(--text-muted);">您的目前 IP：</span>
          <strong style="color: var(--primary-dark); font-family: monospace; font-size: 14px;">${cur.ip}</strong>
          ${cur.location ? `<span style="color: var(--text-muted); margin-left: 6px;">(${cur.location})</span>` : ''}
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
        tbodyEl.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 24px; color: var(--text-muted);">尚無訪客紀錄</td></tr>`;
        return;
      }
      tbodyEl.innerHTML = store.logs.map(r => {
        const isCurrent = cur.ip === r.ip && cur.dateStr === r.date;
        const locText = [r.location, r.isp].filter(Boolean).join(' · ') || '—';
        return `
          <tr style="${isCurrent ? 'background: #FFF0F5; font-weight: 600;' : ''}">
            <td>${r.date}</td>
            <td style="font-family: monospace; color: var(--primary-dark); font-weight: 700;">
              ${r.ip} ${isCurrent ? '<span style="font-size:11px; background:var(--primary); color:#fff; padding:1px 6px; border-radius:99px; margin-left:4px;">目前連線</span>' : ''}
            </td>
            <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis;" title="${locText}">${locText}</td>
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
    const header = ['造訪日期', '訪客IP位址', '地區', '電信商(ISP)', '當日首次時間', '最後活動時間', '當日總瀏覽回數', '有效計數'];
    const rows = logs.map(r => [
      r.date || '',
      r.ip || '',
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
