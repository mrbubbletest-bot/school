/**
 * Bubble 夢幻英文文法學院 - 章節閱讀器 (Reader Engine)
 */

class GrammarReader {
  constructor() {
    this.currentChapterId = 1;
    this.currentFontSize = 16;
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.voices = [];
    this.currentAudio = null;
    this.initSpeech();
  }

  initSpeech() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const updateVoices = () => {
        this.voices = window.speechSynthesis.getVoices().filter(v => v.lang.startsWith('en'));
      };
      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }

  getBestNativeVoice() {
    if (!this.voices || this.voices.length === 0) return null;
    // Ranked preference list: Natural > Online/Neural > High-quality system voices
    const priorityKeywords = [
      'Natural', 'Neural', 'Online', 'Multilingual',
      'Ava', 'Jenny', 'Aria', 'Guy', 'Google US English', 'Samantha', 'Zira', 'Victoria'
    ];
    for (const kw of priorityKeywords) {
      const match = this.voices.find(v => v.name.includes(kw));
      if (match) return match;
    }
    const usVoice = this.voices.find(v => v.lang === 'en-US' || v.lang === 'en_US');
    if (usVoice) return usVoice;
    return this.voices[0];
  }

  speakWithWebSpeech(cleanText) {
    if (!this.synth) return;
    this.synth.cancel();
    const utter = new SpeechSynthesisUtterance(cleanText);
    utter.lang = 'en-US';
    utter.rate = 0.92;
    utter.pitch = 1.0;
    const bestVoice = this.getBestNativeVoice();
    if (bestVoice) {
      utter.voice = bestVoice;
    }
    this.synth.speak(utter);
  }

  speak(text) {
    const cleanText = String(text || '').replace(/[*_#`~⟦⟧\n\r]/g, ' ').replace(/\s+/g, ' ').trim();
    if (!cleanText) return;

    // 1. Try high-fidelity natural neural pronunciation via Google Cloud TTS Audio
    if (typeof Audio !== 'undefined') {
      try {
        if (this.currentAudio) {
          this.currentAudio.pause();
          this.currentAudio.currentTime = 0;
          this.currentAudio = null;
        }
        if (this.synth) this.synth.cancel();

        const encoded = encodeURIComponent(cleanText);
        const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encoded}&tl=en&client=tw-ob`;
        const audio = new Audio(ttsUrl);
        this.currentAudio = audio;

        audio.playbackRate = 0.95; // Clear and easy to follow for junior/senior high students

        // Fallback to Web Speech Synthesis if audio fails (e.g. offline)
        audio.onerror = () => {
          this.currentAudio = null;
          this.speakWithWebSpeech(cleanText);
        };

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Autoplay restriction or network error -> fallback to native synthesis
            this.currentAudio = null;
            this.speakWithWebSpeech(cleanText);
          });
        }
        return;
      } catch (err) {
        // Fall through to Web Speech
      }
    }

    // 2. Secondary Fallback: Web Speech API with highest-quality natural voice
    this.speakWithWebSpeech(cleanText);
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

  fixCjkBold(text) {
    // Prevents CommonMark delimiter bugs when **bold** touches CJK punctuation like 「...」 or （...）
    return text.split(/(`[^`\n]+`)/g).map((part, idx) => {
      if (idx % 2 === 1) return part;
      return part.replace(/\*\*([^*\n]+?)\*\*/g, '<strong>$1</strong>');
    }).join('');
  }

  classifyExampleLine(line) {
    const t = line.trim();
    if (/^➜/.test(t)) return 'hint';
    const withoutParens = t.replace(/[（(〔\[][^）)〕\]]*[）)〕\]]/g, '');
    const hasChineseOutsideParens = /[\u4e00-\u9fff]/.test(withoutParens);
    if (!hasChineseOutsideParens) {
      return 'en';
    }
    return 'zh';
  }

  renderCalloutBox(type, title, innerHtml) {
    type = (type || 'note').toLowerCase();
    title = (title || '').trim();
    if (type === 'example') {
      return `<div class="callout example">${innerHtml}</div>`;
    }
    let icon = '💡';
    let defaultTitle = '說明';
    if (type === 'warn') { icon = '⚠️'; defaultTitle = '重點注意'; }
    if (type === 'tip') { icon = '⭐'; defaultTitle = '老師私房記憶法'; }
    if (type === 'formula') { icon = '📐'; defaultTitle = '核心動詞句型公式'; }

    const headerHtml = title
      ? `<div class="callout-title">${icon} ${this.fixCjkBold(title)}</div>`
      : `<div class="callout-title">${icon} ${defaultTitle}</div>`;
    return `<div class="callout ${type}">${headerHtml}${innerHtml}</div>`;
  }

  preprocessAndParse(md) {
    const tokens = [];
    const saveToken = (html) => {
      const id = `@@CALLOUT_TOKEN_${tokens.length}@@`;
      tokens.push({ id, html });
      return `\n\n${id}\n\n`;
    };

    // Parse ::: callout containers using a stack + token replacement
    // so that multi-line HTML or nested callouts never trigger CommonMark's 4-space code block rule
    const lines = md.split(/\r?\n/);
    const stack = [];
    const outLines = [];

    const flushFrame = (frame) => {
      const rawBody = frame.lines.join('\n').trim();
      let html = '';
      if (frame.type.toLowerCase() === 'example') {
        html = this.renderCalloutBox('example', frame.title, this.formatExampleBlock(rawBody));
      } else {
        const bodyHtml = marked.parse(this.fixCjkBold(rawBody));
        html = this.renderCalloutBox(frame.type, frame.title, bodyHtml);
      }
      const tokenStr = saveToken(html);
      if (stack.length > 0) {
        stack[stack.length - 1].lines.push(tokenStr);
      } else {
        outLines.push(tokenStr);
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      const openMatch = trimmed.match(/^:::([a-zA-Z]+)(?:[ \t]+(.*))?$/);
      if (openMatch) {
        stack.push({ type: openMatch[1], title: openMatch[2] || '', lines: [] });
      } else if (trimmed === ':::') {
        if (stack.length > 0) {
          const frame = stack.pop();
          flushFrame(frame);
        }
      } else {
        if (stack.length > 0) {
          stack[stack.length - 1].lines.push(line);
        } else {
          outLines.push(line);
        }
      }
    }

    while (stack.length > 0) {
      flushFrame(stack.pop());
    }

    let finalHtml = marked.parse(this.fixCjkBold(outLines.join('\n')));

    // Restore callout tokens from innermost/latest to outermost
    for (let i = tokens.length - 1; i >= 0; i--) {
      const { id, html } = tokens[i];
      finalHtml = finalHtml.replace(new RegExp(`<p>\\s*${id}\\s*</p>`, 'g'), html);
      finalHtml = finalHtml.replace(new RegExp(id, 'g'), html);
    }

    // Wrap tables in responsive container for mobile comfort
    finalHtml = finalHtml.replace(/<table>/g, '<div class="table-responsive"><table>').replace(/<\/table>/g, '</table></div>');

    return finalHtml;
  }

  formatExampleBlock(rawContent) {
    // Splits by empty line into distinct examples
    const blocks = rawContent.split(/\r?\n\s*\r?\n/).filter(b => b.trim());
    return blocks.map(block => {
      const lines = block.split(/\r?\n/).map(l => l.trim()).filter(l => l);
      if (lines.length === 0) return '';

      const innerRows = lines.map(line => {
        const type = this.classifyExampleLine(line);
        const safeLine = this.fixCjkBold(line);
        if (type === 'en') {
          const cleanEnForSpeech = line
            .replace(/^[=＝⇒⇔→\s]+/, '')
            .replace(/[（(〔\[][^）)〕\]]*[\u4e00-\u9fff○×✕✓✗][^）)〕\]]*[）)〕\]]/g, '')
            .replace(/[*_#`~⟦⟧]/g, '')
            .replace(/<\/?[^>]+>/g, '')
            .replace(/"/g, '&quot;')
            .trim();
          return `<div class="example-en"><span>${marked.parseInline(safeLine)}</span><button class="btn-tts" data-speech="${cleanEnForSpeech}" title="點擊聆聽真人美式發音 🔊"><i class="fa-solid fa-volume-high"></i></button></div>`;
        } else if (type === 'zh') {
          return `<div class="example-zh">${marked.parseInline(safeLine)}</div>`;
        } else {
          const noteText = this.fixCjkBold(line.replace(/^➜\s*/, ''));
          return `<div class="example-hint">➜ ${marked.parseInline(noteText)}</div>`;
        }
      }).join('');

      return `<div class="example-item">${innerRows}</div>`;
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
