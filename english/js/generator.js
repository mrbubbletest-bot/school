/**
 * Bubble 夢幻英文文法學院 - 無限題庫產生器 (Infinite Random Quiz Generator)
 */

class InfiniteGenerator {
  constructor() {
    this.bankCache = {}; // { chapterId: itemsArray }
    this.currentQuestions = [];
    this.userAnswers = {};
    this.score = 0;
  }

  async generate(options = {}) {
    const chapterId = options.chapterId || 'all';
    const count = parseInt(options.count) || 10;
    const level = options.level || 'all'; // 1, 2, 3 or 'all'

    let pool = [];

    if (chapterId === 'all') {
      // Collect from all available cached banks or load sampled chapters
      for (let c = 1; c <= 20; c++) {
        const items = await this.getChapterBank(c);
        if (items && items.length > 0) {
          pool.push(...items.map(item => ({ ...item, chapterId: c })));
        }
      }
    } else {
      const items = await this.getChapterBank(chapterId);
      if (items && items.length > 0) {
        pool.push(...items.map(item => ({ ...item, chapterId })));
      }
    }

    // If pool is empty or too small, complement with procedural generator
    if (pool.length < count) {
      const proceduralItems = this.generateProceduralQuestions(chapterId, count - pool.length);
      pool.push(...proceduralItems);
    }

    // Filter by level if specified
    if (level !== 'all') {
      const targetLevel = parseInt(level);
      const filtered = pool.filter(q => q.level === targetLevel);
      if (filtered.length >= Math.min(count, 5)) {
        pool = filtered;
      }
    }

    // Shuffle and pick count
    this.currentQuestions = this.shuffleArray(pool).slice(0, count);
    this.userAnswers = {};
    this.score = 0;

    return this.currentQuestions;
  }

  async getChapterBank(chapterId) {
    if (this.bankCache[chapterId]) {
      return this.bankCache[chapterId];
    }
    const num = String(chapterId).padStart(2, '0');
    try {
      const resp = await fetch(`content/ch${num}-bank.json`);
      if (resp.ok) {
        const data = await resp.json();
        const items = data.items || data.questions || [];
        this.bankCache[chapterId] = items;
        return items;
      }
    } catch (e) {
      // not yet loaded or file missing
    }
    return [];
  }

  shuffleArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  // Procedural fallback question bank for infinite variations
  generateProceduralQuestions(chapterId, count) {
    const templates = [
      // Ch 1: Tenses
      {
        ch: 1,
        topic: "現在完成式",
        level: 2,
        gen: () => {
          const names = ["Emily", "Chloe", "Sophie", "Hannah", "Mia"];
          const cities = ["Taipei", "Tokyo", "London", "Paris", "New York"];
          const years = [2018, 2020, 2021, 2022];
          const name = names[Math.floor(Math.random() * names.length)];
          const city = cities[Math.floor(Math.random() * cities.length)];
          const year = years[Math.floor(Math.random() * years.length)];
          return {
            q: `${name} ____ in ${city} since ${year}. She really loves the culture there.`,
            options: ["has lived", "lives", "lived", "is living"],
            answer: 0,
            zh: `${name} 從 ${year} 年起就住在 ${city}。她非常喜歡當地的文化。`,
            explain: `since + 過去時間點（${year}）表示「從過去某個時間點持續到現在」，動詞須使用「現在完成式」（have / has + p.p.）。${name} 為第三人稱單數，故選 has lived。`
          };
        }
      },
      // Ch 2: Subjunctive
      {
        ch: 2,
        topic: "假設語氣",
        level: 3,
        gen: () => {
          const wishes = [
            { cond: "had wings", res: "would fly to Japan immediately", zh: "如果有翅膀，我就會立刻飛去日本" },
            { cond: "were a millionaire", res: "would travel around the entire world", zh: "如果我是百萬富翁，我就會環遊全世界" },
            { cond: "knew the answer", res: "would tell you right away", zh: "如果我知道答案，我就會馬上告訴你" }
          ];
          const item = wishes[Math.floor(Math.random() * wishes.length)];
          return {
            q: `If I ____ ${item.cond}, I ${item.res}.`,
            options: [item.cond.split(' ')[0], "am", "will be", "have"],
            answer: 0,
            zh: `如果我${item.zh}。`,
            explain: `本句表示「與現在事實相反的假設語氣」：If 子句動詞須用過去式（be動詞一律用 were，一般動詞用過去式），主要子句用 would / should / could / might + 原形動詞。`
          };
        }
      },
      // Ch 8: Confusing Verbs
      {
        ch: 8,
        topic: "易混淆動詞 lie / lay",
        level: 2,
        gen: () => {
          return {
            q: `After a long exhausting day, she decided to ____ down on the cozy sofa.`,
            options: ["lie", "lay", "laid", "lain"],
            answer: 0,
            zh: "在漫長疲憊的一天後，她決定躺在舒適的沙發上。",
            explain: `考查 lie / lay 的辨析：\n1. lie (躺; 不及物): lie - lay - lain - lying\n2. lay (放置; 及物): lay - laid - laid - laying\nto 後方接原形動詞，此處指「躺下」為不及物動詞，故選 lie。`
          };
        }
      },
      // Ch 3: Passive Voice
      {
        ch: 3,
        topic: "感官動詞之被動語態",
        level: 3,
        gen: () => {
          const verbs = ["sing a sweet melody", "enter the secret room", "cross the avenue"];
          const v = verbs[Math.floor(Math.random() * verbs.length)];
          return {
            q: `The mysterious girl was seen ____ by several witnesses.`,
            options: [`to ${v}`, `${v}`, `for ${v}`, `that ${v}`],
            answer: 0,
            zh: `好幾位目擊者看到那位神秘女孩 ${v}。`,
            explain: `感官動詞（see, hear, watch 等）在主動語態時受詞補語省略 to 接原形動詞；但轉為「被動語態」時，原本省略的 to 必須「還原」！公式：be seen + to V。`
          };
        }
      },
      // Ch 13: Relative Pronouns
      {
        ch: 13,
        topic: "關係代名詞 that 之特殊限制",
        level: 2,
        gen: () => {
          return {
            q: `This is the very dress ____ she wore on her graduation ceremony.`,
            options: ["that", "which", "who", "whom"],
            answer: 0,
            zh: "這正是她在畢業典禮上穿的那件洋裝。",
            explain: `先行詞前若有 the very（正是、恰是）、the only（唯一的）、the same 或最高級修飾時，關係代名詞習慣優先使用 that，不可使用 which。`
          };
        }
      },
      // Ch 19: Inversion
      {
        ch: 19,
        topic: "否定副詞倒裝句",
        level: 3,
        gen: () => {
          return {
            q: `Never ____ such a breathtaking view in my entire life!`,
            options: ["have I seen", "I have seen", "did I saw", "I saw"],
            answer: 0,
            zh: "我這輩子從未見過如此令人屏息的美景！",
            explain: `當否定副詞（Never, Seldom, Rarely, Hardly, Scarcely）移至句首以加強語氣時，句子必須「倒裝」（助動詞 / have / be 提到主詞前方）。現在完成式倒裝公式：Never + have/has + 主詞 + p.p.。`
          };
        }
      }
    ];

    const results = [];
    for (let i = 0; i < count; i++) {
      const t = templates[i % templates.length];
      const item = t.gen();
      results.push({
        ...item,
        topic: t.topic,
        level: t.level,
        chapterId: t.ch
      });
    }
    return results;
  }
}

window.InfiniteGenerator = InfiniteGenerator;
