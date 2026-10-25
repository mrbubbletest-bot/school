/**
 * Bubble 夢幻英文文法學院 - AI 文法導師與全站智慧搜尋 (AI Grammar Tutor & Smart Search)
 */

class AIGrammarTutor {
  constructor() {
    this.knowledgeBase = this.initKnowledgeBase();
    this.geminiKeyStorageKey = 'bubble_gemini_api_key_v1';
  }

  getApiKey() {
    try {
      return (localStorage.getItem(this.geminiKeyStorageKey) || '').trim();
    } catch (e) {
      return '';
    }
  }

  setApiKey(key) {
    try {
      if (key && key.trim()) {
        localStorage.setItem(this.geminiKeyStorageKey, key.trim());
      } else {
        localStorage.removeItem(this.geminiKeyStorageKey);
      }
    } catch (e) {}
  }

  hasCustomKey() {
    return Boolean(this.getApiKey());
  }

  /**
   * 呼叫即時線上 Google Gemini API 生成最新名師深度回答
   */
  async fetchGeminiResponse(userPrompt, matchedChapterInfo = null) {
    const apiKey = this.getApiKey();
    if (!apiKey) return null;

    let systemContext = `妳是「Bubble 老師」，一位親切、專業、富有耐心且生動有趣的國高中英文文法名師，正在教導一位資優班的國高中學生。
請用台灣繁體中文（使用台灣文法慣用語，例如：受詞、主詞補語、述語動詞、連接詞、關係代名詞，切勿使用「漢語、賓語、連詞」等簡體術語）。
回答風格親切活潑，可適度使用 🌸、✨、💡、📐 等符號與清楚的分點條列、中英雙語對照、核心公式與口訣。`;

    if (matchedChapterInfo && matchedChapterInfo.chapter) {
      systemContext += `\n學生目前正在研讀的英文教材中，對應的章節為【第 ${matchedChapterInfo.chapter.num} 章：${matchedChapterInfo.chapter.title} (${matchedChapterInfo.chapter.enTitle})】，主要涵蓋主題：${matchedChapterInfo.chapter.subtopics.join('、')}。請結合該章節的文法觀念為學生深入淺出地解說。`;
    }

    const payload = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${systemContext}\n\n學生詢問的問題是：\n「${userPrompt}」\n\n請以 Bubble 老師的語氣給予完整、有條理且鼓勵性的文法解析與例句說明：`
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024
      }
    };

    const models = [
      'gemini-1.5-flash',
      'gemini-1.5-pro',
      'gemini-2.0-flash-exp'
    ];

    for (const model of models) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          const data = await res.json();
          const candidate = data && data.candidates && data.candidates[0];
          const textPart = candidate && candidate.content && candidate.content.parts && candidate.content.parts[0]?.text;
          if (textPart) {
            return textPart.trim();
          }
        }
      } catch (err) {
        console.warn(`Gemini call to ${model} failed:`, err);
      }
    }
    return null;
  }

  /**
   * 智慧問答入口：整合「即時 Gemini 回答」＋「全書20章精準對照導航」
   */
  async askAsync(question) {
    const q = String(question || '').trim();
    if (!q) {
      return {
        reply: "🌸 請輸入妳想詢問的英文文法問題喔！例如：現在完成式與過去式的差別、lie 和 lay 怎麼分...",
        chapterId: null,
        title: null,
        isGemini: false
      };
    }

    // 1. 先檢索章節知識庫與全書 20 章索引，找出最契合的對應章節
    let matchedChapter = null;
    let fallbackAnswer = null;

    for (const item of this.knowledgeBase) {
      for (const pattern of item.patterns) {
        if (pattern.test(q)) {
          matchedChapter = {
            id: item.chapterId,
            num: String(item.chapterId).padStart(2, '0'),
            title: item.title,
            enTitle: ''
          };
          fallbackAnswer = item.answer;
          break;
        }
      }
      if (matchedChapter) break;
    }

    if (!matchedChapter) {
      const searchResults = this.searchChapters(q);
      if (searchResults.length > 0) {
        const top = searchResults[0];
        matchedChapter = {
          id: top.chapter.id,
          num: top.chapter.num,
          title: top.chapter.title,
          enTitle: top.chapter.enTitle,
          subtopics: top.chapter.subtopics
        };
      }
    }

    // 2. 嘗試獲取即時 Gemini 線上回答
    let geminiText = null;
    if (this.hasCustomKey()) {
      geminiText = await this.fetchGeminiResponse(q, { chapter: matchedChapter });
    }

    if (geminiText) {
      // 成功獲得 Gemini 即時回答，整合並附上章節指引
      let finalReply = geminiText;
      if (matchedChapter) {
        finalReply += `\n\n---\n📖 **教材對照指引：** 本題對應我們寶典中的 **【第 ${matchedChapter.num} 章 · ${matchedChapter.title}】**，點擊下方按鈕即可直接閱讀完整圖解講義與例句練習喔！✨`;
      }
      return {
        reply: finalReply,
        chapterId: matchedChapter ? matchedChapter.id : 1,
        title: matchedChapter ? matchedChapter.title : '講義導航',
        isGemini: true
      };
    }

    // 3. 若未設定 Key 或網路限制，使用內建名師智慧知識庫回答（並溫馨提示可綁定 Gemini API Key）
    const localResult = this.ask(q);
    if (!this.hasCustomKey()) {
      localResult.reply += `\n\n> 💡 **小秘訣**：右上角可點擊 **「🔑 API Key 設定」** 綁定免費 Google Gemini API Key，即可同時解鎖 Gemini 最新線上 AI 的即時生成解析喔！🌸`;
    }
    return {
      ...localResult,
      isGemini: false
    };
  }

  initKnowledgeBase() {
    return [
      {
        patterns: [/現在完成式/, /have \+ p\.p\./i, /完成式/],
        chapterId: 1,
        title: "現在完成式 (Present Perfect Tense)",
        answer: `🌸 嗨！學妹好～現在完成式的核心意象是**「從過去某個點，一直連繫到現在」**！

📐 **三大黃金用法公式：**
1. **持續（Continuity）：** 表示動作或狀態從過去持續到現在。
   - 常搭配：\`since + 過去時間點\`、\`for + 一段時間\`
   - 例句：*I have studied English for six years.*（我已經學了六年英文。）
2. **經驗（Experience）：** 到目前為止曾有過（或從未有過）的經驗。
   - 常搭配：\`ever\`、\`never\`、\`once\`、\`twice\`、\`before\`
   - 例句：*Have you ever seen the northern lights?*（妳看過極光嗎？）
3. **完成或結果（Completion / Result）：** 動作剛剛完成，對現在造成了影響。
   - 常搭配：\`already\`、\`just\`、\`yet\`
   - 例句：*She has already finished her homework.*（她已經寫完作業了。）

⚠️ **超重要考試陷阱：**
現在完成式**絕對不能**與明確的「過去時間副詞」（如 *yesterday*, *last night*, *two days ago*, *in 2010*, *when...*）連用！那種情況一定要用「過去簡單式」喔！`
      },
      {
        patterns: [/lie.*lay/i, /lay.*lie/i, /躺.*放/, /說謊/],
        chapterId: 8,
        title: "易混淆動詞：lie vs. lay 大解密",
        answer: `🌸 這是全台灣各大英文考試最愛考的大魔王！Bubble 老師幫妳整理超好背的口訣：

📐 **四態對照表：**
1. **lie - lay - lain - lying**（不及物動詞，後面不接受詞）
   ➜ 意思是「**躺、臥、位於**」
   - 例句：*He lay on the grass yesterday.*（他昨天躺在草地上。）
2. **lay - laid - laid - laying**（及物動詞，後面**必須接受詞**）
   ➜ 意思是「**放置、擺設、下蛋**」
   - 例句：*Please lay the book on the desk.*（請把書放在書桌上。）
3. **lie - lied - lied - lying**（規則變化動詞）
   ➜ 意思是「**說謊**」
   - 常搭配：*tell a lie* 或 *lie to someone*

⭐ **老師私房記憶法：**
「**規則說謊 (lied)，公雞不躺 (lie-lay-lain)，母雞下蛋先放好 (lay-laid-laid)**」！是不是超好記呢？✨`
      },
      {
        patterns: [/假設語氣/, /subjunctive/i, /if.*would/i, /與事實相反/],
        chapterId: 2,
        title: "假設語氣 (Subjunctive Mood)",
        answer: `🌸 假設語氣其實只有一個終極密碼：**「時光倒流一格」**！因為與現實相反，動詞就要往過去退一步來表達不真實感！

📐 **兩大核心公式：**
1. **與「現在事實相反」：**（動詞退到過去式）
   - If 子句：\`If + 主詞 + 過去式動詞 (be動詞一律用 were)\`
   - 主要子句：\`主詞 + would / could / might / should + 原形動詞\`
   - 例句：*If I were you, I would take the offer.*（如果我是妳，我就會接受這份邀約。）
2. **與「過去事實相反」：**（動詞退到過去完成式）
   - If 子句：\`If + 主詞 + had + p.p.\`
   - 主要子句：\`主詞 + would / could / might / should + have + p.p.\`
   - 例句：*If she had studied harder, she would have passed.*（如果她當時更用功，她早就考過了。）

⭐ **倒裝省略 If 技巧：**
把 *were*、*had* 或 *should* 直接提到句首，If 就能優雅省略！
- *Had I known the truth, I wouldn't have gone.*`
      },
      {
        patterns: [/感官動詞/, /使役動詞/, /被動.*to/i, /see.*to/i],
        chapterId: 3,
        title: "感官與使役動詞的被動語態",
        answer: `🌸 這題真的是會考與英檢中級的經典得分點！

📐 **黃金原則：**
主動時，感官動詞（*see, hear, watch, notice*）與使役動詞（*make, have, let*）後方的受詞補語省略 to，接原形動詞 (V)：
- 主動：*I saw her dance.*（我看到她跳舞。）

**但是！一轉成「被動語態」，原本省略的 to 必須立刻「還原」！**
- 被動：*She was seen **to dance**.*（她被看到在跳舞。）

⚠️ **使役動詞特別注意：**
- *make* 的被動：*be made **to V***（被迫做某事）
- *have* 和 *let* 通常不直接改為被動，*let* 被動常改用 *be allowed to V* 喔！`
      },
      {
        patterns: [/stop to/i, /stop v-ing/i, /動名詞.*不定詞/, /remember to/i, /forget to/i],
        chapterId: 5,
        title: "stop / remember / forget 後接 to V 與 V-ing 差異",
        answer: `🌸 很多同學常會背混，只要記住這個意象：**to V 代表「即將去做（未做）」**，**V-ing 代表「已經在做或做過（已發生）」**！

1. **stop：**
   - \`stop to V\`：停下正在做的事，**轉身去進行另一件事**。
     - *He stopped to tie his shoelace.*（他停下腳步去繫鞋帶。）
   - \`stop V-ing\`：**停止、戒除**正在進行的動作。
     - *He stopped smoking.*（他戒菸了。）
2. **remember / forget：**
   - \`remember to V\`：記得**要去**做（還沒做）。
   - \`remember V-ing\`：記得**曾經**做過某事。
3. **try：**
   - \`try to V\`：竭力、努力嘗試去達成。
   - \`try V-ing\`：試試看某個方法（測試效果）。`
      },
      {
        patterns: [/五大句型/, /三大子句/, /s\+v\+o/i, /補語/],
        chapterId: 20,
        title: "五大基本句型與三大子句",
        answer: `🌸 英文所有的長句難句，骨架全都可以拆解為這五種！

📐 **五大基本句型：**
1. **第一句型：S + Vi**（完全不及物動詞，不需受詞也不需補語）
   - *The birds sing beautifully.*
2. **第二句型：S + Vi + S.C.**（不完全不及物，需主詞補語說明主詞）
   - *She looks happy.* / *He is a doctor.*
3. **第三句型：S + Vt + O**（完全及物動詞，需一個受詞）
   - *I love this song.*
4. **第四句型：S + Vt + I.O. + D.O.**（授與動詞，人稱間接受詞 + 事物直接受詞）
   - *My mom bought me a cute pen.*
5. **第五句型：S + Vt + O + O.C.**（需受詞補語說明受詞狀態）
   - *The news made her sad.* / *We elected him leader.*

💡 **三大子句：**
名詞子句（當主詞/受詞/補語）、形容詞子句（關係子句，修飾名詞）、副詞子句（修飾動詞或全句）。`
      },
      {
        patterns: [/used to/i, /be used to/i, /習慣於/],
        chapterId: 7,
        title: "used to 三兄弟超神分辨法",
        answer: `🌸 超級高頻！三種長很像但意思完全不同的句型：

1. **used to + 原形動詞 (V)**
   - 意思：「**過去習慣...，過去常常...（現在已不再）**」
   - 例句：*I used to play the piano every day.*（我以前每天彈鋼琴。）
2. **be / get used to + V-ing / 名詞**
   - 意思：「**習慣於...（當前的一種適應狀態）**」，此處 to 是**介系詞**！
   - 例句：*She is used to getting up early.*（她習慣早起。）
3. **be used to + 原形動詞 (V)**（被動語態！）
   - 意思：「**被用來做...**」
   - 例句：*Wood is used to make paper.*（木材被用來造紙。）`
      },
      {
        patterns: [/關係代名詞/, /that.*which/i, /關代/],
        chapterId: 13,
        title: "關係代名詞只能用 that 的特殊情境",
        answer: `🌸 先行詞在下列情況時，關係代名詞習慣**只能用 that**，不能用 which 或 who：

1. **先行詞同時有人又有動物/事物時：**
   - *Look at the girl and her dog that are walking in the park.*
2. **先行詞前面有最高級形容詞時：**
   - *This is the most delicious cake that I have ever tasted.*
3. **先行詞有 the only, the very, the same, the first 等強烈特指詞時：**
   - *You are the only friend that understands me.*
4. **先行詞為 all, little, few, much, everything, nothing, anything 等不定代名詞時：**
   - *All that glitters is not gold.*（發光的不一定都是金子。）
5. **在 who 或 which 開頭的疑問句中（避免重複）：**
   - *Who is the boy that is standing by the tree?*`
      }
    ];
  }

  // Answer a grammar question
  ask(question) {
    const q = (question || '').trim();
    if (!q) {
      return {
        reply: "嗨～請隨時告訴老師妳想詢問的文法問題，或是想搜尋的單元名稱喔！🌸",
        chapterId: null
      };
    }

    // Check specific patterns in knowledge base
    for (const item of this.knowledgeBase) {
      for (const pattern of item.patterns) {
        if (pattern.test(q)) {
          return {
            reply: item.answer,
            chapterId: item.chapterId,
            title: item.title
          };
        }
      }
    }

    // Fallback: Smart keyword full-text search across all 20 chapters
    const searchResults = this.searchChapters(q);
    if (searchResults.length > 0) {
      const topMatch = searchResults[0];
      const matchChapters = searchResults.map(r => `• **第 ${r.chapter.num} 章 ${r.chapter.title}** (${r.chapter.enTitle})：${r.matchedReason}`).join('\n');

      return {
        reply: `🌸 老師在我們的 20 大文法寶典中為妳找到了相關內容喔！

${matchChapters}

建議妳可以直接點擊下方按鈕前往 **第 ${topMatch.chapter.num} 章「${topMatch.chapter.title}」** 研讀完整圖解說明與測驗！如果妳有更具體的一句話（例如「lie 和 lay 怎麼分？」或「現在完成式何時用？」），也可以直接考考老師喔！✨`,
        chapterId: topMatch.chapter.id,
        title: topMatch.chapter.title
      };
    }

    // Default friendly assistant response
    return {
      reply: `🌸 學妹問得好！這個觀念非常精采。
在國高中資優英語學習中，掌握「動詞形態」與「句子主幹結構」是解開所有文法難題的鑰匙！

建議妳可以先瀏覽我們的 **20大章節總覽**，或是試試看詢問：
• 「現在完成式何時用？」
• 「lie 和 lay 怎麼分？」
• 「假設語氣公式是什麼？」
• 「感官動詞被動態要注意什麼？」
• 「stop to V 跟 stop V-ing 的差別？」

老師隨時在這邊為妳加油解惑喔！✨`,
      chapterId: 1
    };
  }

  // Search chapters by keyword
  searchChapters(keyword) {
    const kw = keyword.toLowerCase().trim();
    if (!kw) return [];

    const results = [];
    CHAPTERS_META.forEach(ch => {
      let score = 0;
      let matchedReason = '';

      if (ch.title.toLowerCase().includes(kw)) {
        score += 10;
        matchedReason = '章節標題相符';
      }
      if (ch.enTitle.toLowerCase().includes(kw)) {
        score += 8;
        matchedReason = '英文主題相符';
      }
      ch.subtopics.forEach(sub => {
        if (sub.toLowerCase().includes(kw)) {
          score += 5;
          matchedReason = `包含子題「${sub}」`;
        }
      });
      if (ch.summary.toLowerCase().includes(kw)) {
        score += 3;
        matchedReason = matchedReason || '章節重點相符';
      }

      if (score > 0) {
        results.push({ chapter: ch, score, matchedReason });
      }
    });

    results.sort((a, b) => b.score - a.score);
    return results;
  }
}

window.AIGrammarTutor = AIGrammarTutor;
