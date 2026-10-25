/**
 * Bubble 夢幻英文文法學院 - 章節閱讀器 (Reader Engine)
 */

class GrammarReader {
  constructor() {
    this.currentChapterId = 1;
    this.currentFontSize = 16;
    this.synth = window.speechSynthesis;
    this.voices = [];
    this.initSpeech();
  }

  initSpeech() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        this.voices = window.speechSynthesis.getVoices().filter(v => v.lang.startsWith('en'));
      };
    }
  }

  speak(text) {
    if (!this.synth) return;
    this.synth.cancel();
    const cleanText = text.replace(/[*_#`~⟦⟧]/g, '').trim();
    const utter = new SpeechSynthesisUtterance(cleanText);
    utter.lang = 'en-US';
    utter.rate = 0.9; // Slightly slower for clear junior-high learning
    utter.pitch = 1.05; // Slightly sweeter tone
    if (this.voices.length > 0) {
      // Prefer female US/UK voice if available
      const sweetVoice = this.voices.find(v => v.name.includes('Samantha') || v.name.includes('Zira') || v.name.includes('Google US English') || v.name.includes('Female'));
      if (sweetVoice) utter.voice = sweetVoice;
    }
    this.synth.speak(utter);
  }

  async loadChapter(chapterId) {
    this.currentChapterId = chapterId;
    let filename = '';
    if (chapterId === 'preface') {
      filename = 'preface.md';
    } else if (chapterId === 'appendix') {
      filename = 'appendix.md';
    } else {
      const num = String(chapterId).padStart(2, '0');
      filename = `ch${num}.md`;
    }

    const container = document.getElementById('reader-markdown-content');
    const tocContainer = document.getElementById('reader-toc-list');
    if (!container) return;

    container.innerHTML = `
      <div style="text-align: center; padding: 60px 20px; color: var(--primary);">
        <i class="fa-solid fa-spinner fa-spin fa-2x"></i>
        <p style="margin-top: 14px; font-weight: 600;">正在為妳調配魔法文法講義中...🌸</p>
      </div>
    `;

    try {
      const response = await fetch(`content/${filename}`);
      if (!response.ok) {
        throw new Error(`無法載入章節檔案 (${response.status})`);
      }
      const rawMd = await response.text();
      const parsedHtml = this.preprocessAndParse(rawMd);
      container.innerHTML = parsedHtml;

      // Update TOC
      this.generateTOC(container, tocContainer);

      // Bind TTS buttons
      this.bindAudioButtons(container);

      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Update URL or active state
      if (window.app) {
        window.app.updateReaderControls(chapterId);
      }
    } catch (err) {
      console.error("Reader load error:", err);
      container.innerHTML = `
        <div style="text-align: center; padding: 50px 20px; color: var(--text-muted);">
          <i class="fa-solid fa-cloud-moon fa-3x" style="color: var(--secondary-light); margin-bottom: 16px;"></i>
          <h3 style="color: var(--text-main); margin-bottom: 8px;">這個章節的講義正在由老師同步校對中 🌸</h3>
          <p style="font-size: 14px; margin-bottom: 20px;">請稍候或切換至其他已轉錄完成的章節學習喔！</p>
          <button class="btn-primary" onclick="window.app.navigateTo('home')">返回章節全覽 📚</button>
        </div>
      `;
      if (tocContainer) tocContainer.innerHTML = '';
    }
  }

  preprocessAndParse(md) {
    // 1. Process custom containers: :::type title ... :::
    let processed = md.replace(/:::(\w+)(?:[ \t]+([^\n\r]*))?[\r\n]+([\s\S]*?)[\r\n]+:::/g, (match, type, title, content) => {
      type = type.toLowerCase();
      title = (title || '').trim();

      if (type === 'example') {
        // Special formatting for examples
        const parsedExamples = this.formatExampleBlock(content);
        return `<div class="callout example">${parsedExamples}</div>`;
      }

      let icon = '💡';
      let defaultTitle = '說明';
      if (type === 'warn') { icon = '⚠️'; defaultTitle = '重點注意'; }
      if (type === 'tip') { icon = '⭐'; defaultTitle = '老師私房記憶法'; }
      if (type === 'formula') { icon = '📐'; defaultTitle = '核心動詞句型公式'; }

      const headerHtml = title ? `<div class="callout-title">${icon} ${title}</div>` : `<div class="callout-title">${icon} ${defaultTitle}</div>`;
      const bodyHtml = marked.parse(content);
      return `<div class="callout ${type}">${headerHtml}${bodyHtml}</div>`;
    });

    // 2. Parse standard markdown
    return marked.parse(processed);
  }

  formatExampleBlock(rawContent) {
    // Splits by empty line into distinct examples
    const blocks = rawContent.split(/\r?\n\s*\r?\n/).filter(b => b.trim());
    return blocks.map(block => {
      const lines = block.split(/\r?\n/).map(l => l.trim()).filter(l => l);
      if (lines.length === 0) return '';
      
      const en = lines[0] || '';
      const zh = lines[1] || '';
      const notes = lines.slice(2).map(n => n.replace(/^➜\s*/, '')).join('<br>');

      // Safe clean text for speech
      const escapedEn = en.replace(/"/g, '&quot;');
      const cleanEnForSpeech = en.replace(/[*_#`~]/g, '');

      return `
        <div class="example-item">
          <div class="example-en">
            <span>${marked.parseInline(en)}</span>
            <button class="btn-tts" data-speech="${escapedEn}" title="點擊聆聽真人美式發音 🔊">
              <i class="fa-solid fa-volume-high"></i>
            </button>
          </div>
          ${zh ? `<div class="example-zh">${zh}</div>` : ''}
          ${notes ? `<div class="example-hint">➜ ${notes}</div>` : ''}
        </div>
      `;
    }).join('');
  }

  generateTOC(contentEl, tocEl) {
    if (!tocEl) return;
    const headings = contentEl.querySelectorAll('h2, h3');
    if (headings.length === 0) {
      tocEl.innerHTML = '<li style="font-size: 13px; color: var(--text-muted); padding: 8px;">本章節為精華速覽</li>';
      return;
    }

    let tocHtml = '';
    headings.forEach((h, index) => {
      const id = `heading-anchor-${index}`;
      h.id = id;
      const text = h.textContent.replace(/^[#\s]+/, '').trim();
      const depthClass = h.tagName.toLowerCase() === 'h3' ? 'depth-3' : 'depth-2';
      tocHtml += `
        <li>
          <a class="toc-item ${depthClass}" href="#${id}" onclick="event.preventDefault(); document.getElementById('${id}').scrollIntoView({behavior: 'smooth'});">
            ${text}
          </a>
        </li>
      `;
    });
    tocEl.innerHTML = tocHtml;
  }

  bindAudioButtons(container) {
    container.querySelectorAll('.btn-tts').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const text = btn.getAttribute('data-speech');
        if (text) this.speak(text);
      });
    });
  }

  changeFontSize(delta) {
    this.currentFontSize = Math.max(13, Math.min(24, this.currentFontSize + delta));
    const content = document.getElementById('reader-markdown-content');
    if (content) {
      content.style.fontSize = `${this.currentFontSize}px`;
    }
  }
}

window.GrammarReader = GrammarReader;
