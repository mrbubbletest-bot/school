/**
 * Bubble 夢幻英文文法學院 - 錯題記錄、盲點診斷與動態靶向出題引擎 (Mistake & Blind-Spot Analyzer)
 */

class MistakeAnalyzer {
  constructor() {
    this.storageKey = 'bubble_mistake_records_v1';
    this.toggleKey = 'bubble_record_mistakes_enabled';
    this.mistakes = this.loadMistakes();
    this.recordEnabled = this.loadToggleState();
  }

  loadToggleState() {
    const saved = localStorage.getItem(this.toggleKey);
    return saved === null ? true : saved === 'true';
  }

  setRecordEnabled(enabled) {
    this.recordEnabled = !!enabled;
    localStorage.setItem(this.toggleKey, String(this.recordEnabled));
    this.syncToggleUI();
  }

  syncToggleUI() {
    document.querySelectorAll('.mistake-record-checkbox').forEach(cb => {
      cb.checked = this.recordEnabled;
    });
    document.querySelectorAll('.mistake-record-status-pill').forEach(el => {
      if (this.recordEnabled) {
        el.innerHTML = '<i class="fa-solid fa-circle-check"></i> 自動記錄錯題：開啟中';
        el.style.background = '#DCFCE7';
        el.style.color = '#15803D';
      } else {
        el.innerHTML = '<i class="fa-solid fa-circle-pause"></i> 自動記錄錯題：已關閉';
        el.style.background = '#F3F4F6';
        el.style.color = '#6B7280';
      }
    });
    this.updateMistakeCountBadges();
  }

  updateMistakeCountBadges() {
    const count = this.mistakes.length;
    document.querySelectorAll('.mistake-total-count').forEach(el => {
      el.innerText = count;
    });
  }

  loadMistakes() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [];
  }

  saveMistakes() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.mistakes));
    } catch (e) {}
    this.updateMistakeCountBadges();
  }

  clearAllMistakes() {
    this.mistakes = [];
    this.saveMistakes();
  }

  removeMistake(id) {
    this.mistakes = this.mistakes.filter(m => m.id !== id);
    this.saveMistakes();
  }

  /**
   * 根據題目、學生誤選的答案 vs 正確答案、以及詳解，自動診斷學生的文法學習盲點
   */
  diagnoseBlindSpot(entry) {
    const ch = Number(entry.chapterId) || 1;
    const wrong = String(entry.userWrongText || '').toLowerCase();
    const right = String(entry.correctText || '').toLowerCase();
    const q = String(entry.q || '').toLowerCase();
    const exp = String(entry.explain || '');
    const topic = String(entry.topic || '');
    const letters = ['A', 'B', 'C', 'D', 'E'];
    const wrongLetter = letters[entry.userWrongIndex] || 'A';

    // 1. 嘗試從詳解中擷取針對該錯誤選項 (A)/(B)/(C)/(D) 的專屬剖析
    let specificDistractorReason = '';
    const letterRegex = new RegExp(`[（(]${wrongLetter}[)）][^。；\\n]*[。；]?`, 'g');
    const matches = exp.match(letterRegex);
    if (matches && matches.length > 0) {
      specificDistractorReason = matches.join(' ');
    }

    // 2. 依據文法結構與誤選特徵進行盲點歸類
    let categoryId = `ch${ch}_general`;
    let categoryTitle = '';
    let diagnosis = '';
    let prescription = '';

    if (
      (/\b(have|has|had)\b/.test(wrong) && !/\b(have|has|had)\b/.test(right)) ||
      (!/\b(have|has|had)\b/.test(wrong) && /\b(have|has|had)\b/.test(right)) ||
      /完成式|過去簡單式|since|for/.test(topic + exp) && ch === 1
    ) {
      categoryId = 'tense_perfect_vs_past';
      categoryTitle = '時態盲點：現在/過去完成式 vs. 簡單過去式混淆';
      diagnosis = `妳選了「${entry.userWrongText}」，但正解為「${entry.correctText}」。常混淆「特定過去時間點（如 yesterday, ago, when 子句 ➜ 只能用過去簡單式）」與「持續期間或先後順序（since, for, by the time ➜ 用完成式）」的時態界線。`;
      prescription = '作答時先圈出時間副詞：見到明確過去時間點立刻排除 have/has + p.p.；見到 since / for + 一段時間或「過去之過去」才用完成式。';
    } else if (
      ch === 1 && (/will\b/.test(wrong) && !/will\b/.test(right))
    ) {
      categoryId = 'tense_time_cond_clause';
      categoryTitle = '時態盲點：時間與條件副詞子句誤用未來式 will';
      diagnosis = `妳在時間或條件副詞子句（if, when, as soon as, before, until）中誤選了含「${entry.userWrongText}」的未來式，忽略了「副詞子句須以現在簡單式代替未來式」的鐵則。`;
      prescription = '先判斷 if / when 引導的是「副詞子句（表條件或時間 ➜ 用現在式）」還是「名詞子句（當動詞受詞表是否/何時 ➜ 可用 will）」。';
    } else if (
      ch === 2 || /假設語氣|與現在事實相反|與過去事實相反|as if|wish/.test(topic + exp)
    ) {
      categoryId = 'subjunctive_backshift';
      categoryTitle = '假設語氣盲點：時態退位公式與倒裝省略 If 混淆';
      diagnosis = `妳選了「${entry.userWrongText}」而非「${entry.correctText}」。在與事實相反的假設句中，容易受中文直譯影響而選現在式/未來式，或混淆「與現在相反（過去式 / were）」與「與過去相反（had + p.p. / would have + p.p.）」的對應公式。`;
      prescription = '牢記「時光倒流一格」：現在相反用過去式（were + would V）；過去相反用過去完成式（had p.p. + would have p.p.）；萬一混合時態則看兩端時間副詞各自對應。';
    } else if (
      ch === 3 || /被動語態|感官動詞|使役動詞|be\s+\w+ed/.test(topic + exp)
    ) {
      categoryId = 'voice_passive_and_to';
      categoryTitle = '語態盲點：主動/被動關係誤判或感官使役被動漏加 to';
      diagnosis = `妳選了「${entry.userWrongText}」，但正確結構為「${entry.correctText}」。常見原因為未先確認主詞是「施動者」還是「受動者」，或忘了感官/使役動詞（see, hear, make）改為被動語態時必須「還原 to」。`;
      prescription = '檢查主詞能否自己發出該動詞的動作；若為被動且遇到 be seen / be heard / be made，後面一定要接 to + 原形動詞（或 V-ing）。';
    } else if (
      ch === 4 || ch === 5 || (/^to\s+\w+/.test(wrong) && /\w+ing\b/.test(right)) || (/\w+ing\b/.test(wrong) && /^to\s+\w+/.test(right))
    ) {
      categoryId = 'nonfinite_to_vs_ing';
      categoryTitle = '動狀詞盲點：不定詞 (to V) 與動名詞 (V-ing) 搭配混淆';
      diagnosis = `妳在「${entry.userWrongText}」與「${entry.correctText}」之間選錯了動狀詞形態。容易把介系詞 to（如 look forward to, be used to, devote to, object to）當作不定詞 to，或混淆特定動詞後接 to V / V-ing 的語意差異。`;
      prescription = '熟記「只接 V-ing 的動詞（enjoy, mind, finish, practice, avoid, suggest）」與「介系詞 to + V-ing 片語」；遇到 remember/forget/stop/try 則用「to V 表未做、V-ing 表已做或進行中」區分。';
    } else if (
      ch === 6 || (/\w+ing\b/.test(wrong) && /\w+(ed|en)\b/.test(right)) || (/\w+(ed|en)\b/.test(wrong) && /\w+ing\b/.test(right))
    ) {
      categoryId = 'participle_ing_vs_ed';
      categoryTitle = '分詞盲點：現在分詞 (-ing) 與過去分詞 (-ed / p.p.) 誤判';
      diagnosis = `妳選了「${entry.userWrongText}」而非「${entry.correctText}」。在分詞構句、感官補語或情緒分詞中，常混淆「主動/令人產生情緒（用 V-ing）」與「被動/自身感到情緒（用 p.p.）」。`;
      prescription = '分詞構句看「主要子句的主詞」：主詞主動做動作用 V-ing，被動承受用 p.p.；情緒動詞修飾事物或「令人…」用 -ing，修飾人「感到…」用 -ed。';
    } else if (
      ch === 7 || /助動詞|have\s+p\.p\.|used\s+to|should|must|need/.test(topic + exp)
    ) {
      categoryId = 'auxiliary_modals';
      categoryTitle = '助動詞盲點：助動詞 + have p.p. 過去推測與習慣句型混淆';
      diagnosis = `妳誤選了「${entry.userWrongText}」（正解為「${entry.correctText}」）。對於「助動詞 + have + p.p.」對過去事實的推測（must have p.p. 過去一定…、cannot have p.p. 過去不可能…、should have p.p. 本該做卻未做）或 used to 句型容易混淆。`;
      prescription = '先看語境時間：若是針對「過去已經發生的事」做推測或懊悔，助動詞後必須接 have + p.p.；此外區分 used to V（過去常）與 be used to V-ing（習慣於）。';
    } else if (
      ch === 8 || /lie|lay|rise|raise|spend|cost|take|seat|sit|rob|steal|arouse|arise/.test(topic + exp + q)
    ) {
      categoryId = 'confusing_verbs';
      categoryTitle = '易混淆動詞盲點：及物/不及物動詞與主詞搭配誤區';
      diagnosis = `妳選了「${entry.userWrongText}」而非「${entry.correctText}」。在易混淆動詞組（如 lie/lay, rise/raise, arise/arouse, sit/seat, spend/cost/take）中，常未先檢查「空格後方有無受詞」及「主詞是人或物」。`;
      prescription = '解題兩步驟：① 看空格後有無受詞（無受詞選不及物 lie/rise/sit；有受詞選及物 lay/raise/seat）；② 看主詞是人（spend）還是事物/it（cost/take）。';
    } else if (
      ch === 9 || /一致|單數|複數/.test(topic + exp)
    ) {
      categoryId = 'subject_verb_agreement';
      categoryTitle = '主詞動詞一致盲點：受修飾語干擾或相關連接詞主詞判定失誤';
      diagnosis = `妳選了「${entry.userWrongText}」（正解為「${entry.correctText}」）。常被主詞後方的介系詞片語、as well as / together with 干擾，或忽略「動名詞/名詞子句/時間距離金錢作主詞視為單數」。`;
      prescription = '牢記：with / along with / as well as 看「前面主詞」；either...or / neither...nor / not only...but also 看「靠近動詞的主詞」；every / each / many a 一律接單數動詞。';
    } else if (
      ch === 10 || ch === 11
    ) {
      categoryId = 'articles_and_nouns';
      categoryTitle = '冠詞與名詞盲點：不可數名詞與特指/零冠詞規則混淆';
      diagnosis = `妳選了「${entry.userWrongText}」（正解為「${entry.correctText}」）。容易將集合名詞或不可數名詞（advice, information, furniture, news, baggage）誤加 a 或 s，或忽略固定冠詞慣用語。`;
      prescription = '判斷 a / an 一律看「發音（母音音標開頭用 an，如 an hour, a useful book）」；不可數名詞量化須用 a piece of，不可直接加 a 或複數 s。';
    } else if (
      ch === 12
    ) {
      categoryId = 'pronouns_reference';
      categoryTitle = '代名詞盲點：it / one / that / those 指代與所有格混淆';
      diagnosis = `妳選了「${entry.userWrongText}」（正解為「${entry.correctText}」）。在代名詞指代中，常混淆「同名同物（it）」、「同名異物泛指（one/ones）」與「比較句後位修飾特定代替（that of / those of）」。`;
      prescription = '比較句中代替前面出現過的不可數或單數名詞且後有 of 修飾時，必用 that（複數用 those）；虛主詞與虛受詞（make/find it + adj. + to V）只能用 it。';
    } else if (
      ch === 13
    ) {
      categoryId = 'relative_clauses';
      categoryTitle = '關係詞盲點：關代 vs. 關副及 that / what 特殊限制誤判';
      diagnosis = `妳選了「${entry.userWrongText}」（正解為「${entry.correctText}」）。常未先檢查關係子句內部是否缺主詞/受詞就憑先行詞是地點/時間選了 where/when，或混淆含先行詞的複合關代 what 與一般關代 which/that。`;
      prescription = '黃金檢驗法：① 空前有先行詞嗎？（無先行詞選 what/whoever）；② 關係子句缺主詞或受詞嗎？（缺名詞用 who/which/that；結構完整才用 where/when/why 或介系詞 + which）；③ 逗號後與介系詞後絕對不用 that。';
    } else if (
      ch === 14 || ch === 15
    ) {
      categoryId = 'adj_adv_comparison';
      categoryTitle = '形容詞與副詞盲點：比較結構、倍數語序與易混淆副詞誤判';
      diagnosis = `妳選了「${entry.userWrongText}」（正解為「${entry.correctText}」）。在形容詞/副詞辨析中，常混淆連綴動詞後接形容詞補語、比較級修飾語（much/far/even），或 hard/hardly、late/lately 等字義差異。`;
      prescription = '連綴動詞（look, feel, smell, taste, sound, become, remain）後方作主詞補語必用形容詞；加 ly 後字義大變的副詞（hardly 幾乎不、lately 最近、nearly 幾乎、closely 仔細地）務必特別留意。';
    } else if (
      ch === 16 || ch === 17
    ) {
      categoryId = 'conj_and_prep';
      categoryTitle = '連接詞與介系詞盲點：子句 vs. 名詞片語結構與搭配詞混淆';
      diagnosis = `妳選了「${entry.userWrongText}」（正解為「${entry.correctText}」）。常未區分空格後方是「完整子句（S + V，需用連接詞 although, because, while）」還是「名詞/V-ing（需用介系詞 despite, in spite of, because of, during）」。`;
      prescription = '先看空格後有無「主詞 + 述語動詞」：有動詞選連接詞，只有名詞或動名詞選介系詞；且注意 although 不與 but 並用、because 不與 so 並用。';
    } else if (
      ch === 18
    ) {
      categoryId = 'questions_and_tags';
      categoryTitle = '疑問句與附加問句盲點：間接問句語序與否定附加問句誤判';
      diagnosis = `妳選了「${entry.userWrongText}」（正解為「${entry.correctText}」）。常在間接問句中誤用疑問倒裝語序（助動詞跑到主詞前），或忽略直述句含否定副詞（seldom, never, hardly, little, few）時附加問句必須用肯定。`;
      prescription = '當問句變成別的句子的受詞或主詞（間接問句）時，一律恢復「疑問詞 + 主詞 + 動詞」平述語序；附加問句必遵循「前肯後否、前否後肯」及主詞代名詞化。';
    } else if (
      ch === 19
    ) {
      categoryId = 'negation_and_inversion';
      categoryTitle = '否定與倒裝盲點：否定副詞置句首或 Only 句型未正確倒裝';
      diagnosis = `妳選了「${entry.userWrongText}」（正解為「${entry.correctText}」）。當否定副詞（Never, Seldom, Little, Hardly...when, No sooner...than, Not until）或 Only + 副詞置於句首時，忘記將主要子句改為「助動詞 + 主詞 + 原形/p.p.」倒裝語序。`;
      prescription = '見到否定詞或 Only + 副詞片語/子句放句首，立刻找「助動詞 / be / have + 主詞」的倒裝選項；但地方副詞放句首且主詞為代名詞（如 Here it comes）時則不倒裝。';
    } else {
      categoryId = 'sentence_patterns_clauses';
      categoryTitle = '句型與三大子句盲點：五大句型補語結構與子句連接詞誤判';
      diagnosis = `妳選了「${entry.userWrongText}」（正解為「${entry.correctText}」）。在複合長句中，容易混淆名詞子句（that 表確定事實且不作成分 vs. what 兼作先行詞與受詞）與形容詞子句、副詞子句的引導詞。`;
      prescription = '先抓出主要子句的 S + V，再看子句在句中扮演的角色（當主詞/受詞/補語為名詞子句；修飾名詞為形容詞子句；表時間原因條件讓步為副詞子句）。';
    }

    if (specificDistractorReason) {
      diagnosis += `\n💡 【針對妳所選 (${wrongLetter}) 的名師解析】：${specificDistractorReason}`;
    }

    return {
      categoryId,
      categoryTitle,
      diagnosis,
      prescription
    };
  }

  /**
   * 記錄一筆錯題（若已存在相同題目則累加錯誤次數並更新最新誤選答案）
   */
  recordMistake(payload) {
    if (!this.recordEnabled) return null;

    const cleanQ = String(payload.q || '').trim();
    if (!cleanQ) return null;

    const id = `ch${payload.chapterId || 1}_${cleanQ.slice(0, 60).replace(/\s+/g, '_')}`;
    const letters = ['A', 'B', 'C', 'D', 'E'];
    const options = payload.options || [];
    const userWrongIndex = payload.userWrongIndex;
    const correctIndex = Array.isArray(payload.correctIndex) ? payload.correctIndex[0] : payload.correctIndex;

    const userWrongText = options[userWrongIndex] !== undefined
      ? `(${letters[userWrongIndex]}) ${options[userWrongIndex]}`
      : String(userWrongIndex);
    const correctText = options[correctIndex] !== undefined
      ? `(${letters[correctIndex]}) ${options[correctIndex]}`
      : String(payload.correctIndex);

    const meta = (typeof CHAPTERS_META !== 'undefined' && CHAPTERS_META.find(c => c.id === Number(payload.chapterId))) || {
      id: payload.chapterId || 1,
      num: String(payload.chapterId || 1).padStart(2, '0'),
      title: `第 ${payload.chapterId || 1} 章`
    };

    const tempEntry = {
      id,
      chapterId: Number(payload.chapterId) || 1,
      chapterTitle: meta.title,
      topic: payload.topic || payload.sectionTitle || meta.title,
      q: cleanQ,
      options,
      userWrongIndex,
      userWrongText,
      correctIndex,
      correctText,
      zh: payload.zh || '',
      explain: payload.explain || ''
    };

    const blindSpot = this.diagnoseBlindSpot(tempEntry);
    const nowStr = new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei', hour12: false });

    const existingIdx = this.mistakes.findIndex(m => m.id === id);
    if (existingIdx !== -1) {
      const prev = this.mistakes[existingIdx];
      prev.userWrongIndex = userWrongIndex;
      prev.userWrongText = userWrongText;
      prev.mistakeCount = (prev.mistakeCount || 1) + 1;
      prev.lastWrongTime = nowStr;
      prev.blindSpot = blindSpot;
      // Move to top
      this.mistakes.splice(existingIdx, 1);
      this.mistakes.unshift(prev);
    } else {
      this.mistakes.unshift({
        ...tempEntry,
        mistakeCount: 1,
        lastWrongTime: nowStr,
        blindSpot
      });
    }

    this.saveMistakes();
    return this.mistakes[0];
  }

  /**
   * 彙整分析所有錯題，產出學習盲點診斷報告
   */
  analyzeAllBlindSpots() {
    const totalMistakes = this.mistakes.length;
    if (totalMistakes === 0) {
      return {
        totalMistakes: 0,
        totalErrorHits: 0,
        categories: [],
        blindSpots: [],
        weakChapters: []
      };
    }

    const catMap = new Map();
    const chapMap = new Map();
    let totalErrorHits = 0;

    this.mistakes.forEach(m => {
      const hits = m.mistakeCount || 1;
      totalErrorHits += hits;
      const bs = m.blindSpot || this.diagnoseBlindSpot(m);

      // Group by blindSpot category
      if (!catMap.has(bs.categoryId)) {
        catMap.set(bs.categoryId, {
          categoryId: bs.categoryId,
          categoryTitle: bs.categoryTitle,
          prescription: bs.prescription,
          count: 0,
          errorHits: 0,
          chapterIds: new Set(),
          sampleMistakes: []
        });
      }
      const cGroup = catMap.get(bs.categoryId);
      cGroup.count += 1;
      cGroup.errorHits += hits;
      cGroup.chapterIds.add(m.chapterId);
      cGroup.sampleMistakes.push(m);

      // Group by chapter
      if (!chapMap.has(m.chapterId)) {
        chapMap.set(m.chapterId, {
          chapterId: m.chapterId,
          chapterTitle: m.chapterTitle,
          count: 0,
          errorHits: 0
        });
      }
      const chGroup = chapMap.get(m.chapterId);
      chGroup.count += 1;
      chGroup.errorHits += hits;
    });

    const categories = Array.from(catMap.values())
      .map(c => {
        const chArr = Array.from(c.chapterIds);
        return { ...c, chapterIds: chArr, chapters: chArr };
      })
      .sort((a, b) => b.errorHits - a.errorHits || b.count - a.count);

    const weakChapters = Array.from(chapMap.values())
      .sort((a, b) => b.errorHits - a.errorHits || b.count - a.count);

    return {
      totalMistakes,
      totalErrorHits,
      categories,
      blindSpots: categories,
      weakChapters
    };
  }

  /**
   * 針對診斷出的盲點類別，動態生成全新同構變體題 (Dynamic Isomorphic Templates)
   */
  generateDynamicBlindSpotVariations(categoryIds, neededCount = 10) {
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const shuffleOptions = (opts, correctIdx) => {
      const correctVal = opts[correctIdx];
      const copy = [...opts];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return { options: copy, answer: copy.indexOf(correctVal) };
    };

    const generatorsByCat = {
      tense_perfect_vs_past: () => {
        const sub = pick(['Olivia', 'Lucas', 'My elder sister', 'Dr. Lin', 'The violinist']);
        const mode = Math.random() < 0.5 ? 'past_point' : 'since_duration';
        if (mode === 'past_point') {
          const timeAdv = pick(['three days ago', 'last Wednesday night', 'when she was in junior high', 'in 2019']);
          const s = shuffleOptions(['visited', 'has visited', 'had visited', 'visits'], 0);
          return {
            chapterId: 1,
            topic: '🔥 盲點動態特訓：過去時間點 vs. 現在完成式',
            level: 2,
            q: `${sub} ____ the National Palace Museum ${timeAdv}, and the exhibition was truly unforgettable.`,
            options: s.options,
            answer: s.answer,
            zh: `${sub} 在 ${timeAdv} 參觀了故宮博物院，那場展覽令人難忘。`,
            explain: `【盲點靶向解析】句中有明確表示「過去時間點」的副詞「${timeAdv}」，絕對不可與現在完成式（has visited）連用，必須使用過去簡單式 visited。`
          };
        } else {
          const pastEvent = pick(['she graduated from college', 'he moved to Kaohsiung', 'five years ago', 'last autumn']);
          const s = shuffleOptions(['has worked', 'worked', 'is working', 'works'], 0);
          return {
            chapterId: 1,
            topic: '🔥 盲點動態特訓：since 持續狀態之現在完成式',
            level: 2,
            q: `${sub} ____ as a volunteer at the animal shelter ever since ${pastEvent}.`,
            options: s.options,
            answer: s.answer,
            zh: `自從 ${pastEvent} 以來，${sub} 就一直在動物收容所擔任志工。`,
            explain: `【盲點靶向解析】ever since + 過去時間點/過去式子句，表示動作從過去一直持續到現在，主要子句必須使用「現在完成式（has worked）」，不可誤選過去簡單式 worked。`
          };
        }
      },

      tense_time_cond_clause: () => {
        const sub = pick(['Claire', 'Ethan', 'Mom', 'the manager']);
        const conj = pick(['as soon as', 'when', 'if', 'unless']);
        const s = shuffleOptions(['arrives', 'will arrive', 'arrived', 'would arrive'], 0);
        return {
          chapterId: 1,
          topic: '🔥 盲點動態特訓：時間與條件副詞子句以現在代未來',
          level: 2,
          q: `We will start the surprise birthday party ${conj} ${sub} ____ home tonight.`,
          options: s.options,
          answer: s.answer,
          zh: `今晚只要／當 ${sub} 一到家，我們就會開始驚喜慶生派對。`,
          explain: `【盲點靶向解析】由「${conj}」引導的時間或條件副詞子句，即使指今晚（未來）發生的事，也必須用「現在簡單式（arrives）」代替未來式，絕對不可選 will arrive！`
        };
      },

      subjunctive_backshift: () => {
        const mode = Math.random() < 0.5 ? 'present_contrary' : 'past_contrary';
        if (mode === 'present_contrary') {
          const s = shuffleOptions(['were', 'am', 'was', 'will be'], 0);
          return {
            chapterId: 2,
            topic: '🔥 盲點動態特訓：與現在事實相反之假設語氣',
            level: 2,
            q: `If I ____ in your position right now, I would accept the scholarship without hesitation.`,
            options: s.options,
            answer: s.answer,
            zh: `如果我現在處在你的位置，我會毫不猶豫地接受這筆獎學金。`,
            explain: `【盲點靶向解析】句中有 right now 且主要子句為 would accept，表「與現在事實相反的假設」，If 子句的 be 動詞不論人稱一律使用 were！`
          };
        } else {
          const sub = pick(['Sophia', 'Daniel', 'the driver', 'our team']);
          const s = shuffleOptions(['had taken', 'took', 'has taken', 'would take'], 0);
          return {
            chapterId: 2,
            topic: '🔥 盲點動態特訓：與過去事實相反之假設語氣',
            level: 3,
            q: `If ${sub} ____ my advice yesterday, the mistake would not have happened.`,
            options: s.options,
            answer: s.answer,
            zh: `如果 ${sub} 昨天有聽從我的建議，這個錯誤就不會發生了。`,
            explain: `【盲點靶向解析】與過去事實相反（yesterday + would not have happened），If 子句動詞必須退至「過去完成式（had + p.p.）」，故選 had taken，不可選過去式 took。`
          };
        }
      },

      voice_passive_and_to: () => {
        const person = pick(['The little boy', 'The suspect', 'The famous actress', 'The student']);
        const verb = pick(['was seen', 'was heard', 'was made']);
        const action = pick(['enter the building', 'climb over the fence', 'apologize in public', 'clean the laboratory']);
        const s = shuffleOptions([`to ${action}`, action, `${action.split(' ')[0]}ing`, `having ${action}`], 0);
        return {
          chapterId: 3,
          topic: '🔥 盲點動態特訓：感官與使役動詞被動語態還原 to',
          level: 3,
          q: `${person} ${verb} ____ by several people yesterday afternoon.`,
          options: s.options,
          answer: s.answer,
          zh: `昨天下午有好幾個人看到／聽到／要求 ${person} 去 ${action}。`,
          explain: `【盲點靶向解析】感官動詞（see, hear）與使役動詞（make）在主動語態時省略 to 接原形動詞；但改為「被動語態（${verb}）」後，原本省略的「to」必須強制還原！故選 to ${action}。`
        };
      },

      nonfinite_to_vs_ing: () => {
        const item = pick([
          { q: 'All the students are looking forward to ____ the science camp next month.', right: 'joining', wrong1: 'join', wrong2: 'be joined', wrong3: 'have joined', zh: '所有學生都很期待下個月參加科學營。', exp: 'look forward to（期待）的 to 是「介系詞」而非不定詞標記，後方必須接動名詞 V-ing（joining）！' },
          { q: 'Would you mind ____ the window? It is getting a bit chilly inside.', right: 'closing', wrong1: 'to close', wrong2: 'close', wrong3: 'closed', zh: '你介意關一下窗戶嗎？室內變有點冷了。', exp: '動詞 mind（介意）、enjoy、practice、finish、avoid 後方只能接「動名詞 V-ing（closing）」，不可接不定詞 to close。' },
          { q: 'My grandfather is used to ____ a walk in the park before breakfast every morning.', right: 'taking', wrong1: 'take', wrong2: 'took', wrong3: 'be taken', zh: '我爺爺習慣每天早上早餐前在公園散步。', exp: 'be / get used to（習慣於…）中的 to 為介系詞，後方須接動名詞 V-ing（taking）；切勿與 used to + 原形（過去常常）混淆！' }
        ]);
        const s = shuffleOptions([item.right, item.wrong1, item.wrong2, item.wrong3], 0);
        return {
          chapterId: 5,
          topic: '🔥 盲點動態特訓：to V 與 V-ing 關鍵辨析',
          level: 2,
          q: item.q,
          options: s.options,
          answer: s.answer,
          zh: item.zh,
          explain: `【盲點靶向解析】${item.exp}`
        };
      },

      participle_ing_vs_ed: () => {
        const item = pick([
          { q: '____ from the top of Taipei 101, the night view of the city looks like a sea of stars.', right: 'Seen', wrong1: 'Seeing', wrong2: 'To see', wrong3: 'Having seen', zh: '從台北 101 頂樓往下看，城市的夜景宛如一片星海。', exp: '分詞構句的主詞必須與主要子句主詞「the night view（夜景）」一致。夜景是「被看（be seen）」，故須用過去分詞 Seen 開頭，不可誤選 Seeing！' },
          { q: 'The audience was deeply ____ by the documentary about ocean conservation.', right: 'moved', wrong1: 'moving', wrong2: 'move', wrong3: 'to move', zh: '觀眾被這部關於海洋保育的紀錄片深深感動。', exp: '情緒動詞修飾「人（the audience）」感到感動時，必須用過去分詞 moved（感到…的）；moving 則是「令人感動的（修飾事物）」。' }
        ]);
        const s = shuffleOptions([item.right, item.wrong1, item.wrong2, item.wrong3], 0);
        return {
          chapterId: 6,
          topic: '🔥 盲點動態特訓：現在分詞 (-ing) vs. 過去分詞 (p.p.)',
          level: 3,
          q: item.q,
          options: s.options,
          answer: s.answer,
          zh: item.zh,
          explain: `【盲點靶向解析】${item.exp}`
        };
      },

      auxiliary_modals: () => {
        const s = shuffleOptions(['must have rained', 'must rain', 'should rain', 'can have rained'], 0);
        return {
          chapterId: 7,
          topic: '🔥 盲點動態特訓：助動詞 + have p.p. 對過去之推測',
          level: 2,
          q: 'The ground is completely wet this morning. It ____ heavily last night.',
          options: s.options,
          answer: s.answer,
          zh: '今天早上地面全濕了。昨晚一定下了大雨。',
          explain: '【盲點靶向解析】針對「昨晚（last night，過去事實）」進行肯定推測，必須使用「must + have + p.p.（must have rained）」；must rain 只能推測現在，不能搭配過去時間！'
        };
      },

      confusing_verbs: () => {
        const item = pick([
          { q: 'The tired puppy ____ under the warm blanket and fell asleep right away.', right: 'lay', wrong1: 'laid', wrong2: 'lied', wrong3: 'lain', zh: '疲倦的小狗躺在溫暖的毯子下，馬上就睡著了。', exp: '後方沒有受詞，且由 fell asleep 可知為過去式！「躺（不及物）」的三態為 lie - lay - lain，過去式是 lay；laid 是及物動詞「放置/下蛋」的過去式；lied 是「說謊」。' },
          { q: 'It ____ Grace more than two weeks to finish painting the oil portrait.', right: 'took', wrong1: 'spent', wrong2: 'cost', wrong3: 'paid', zh: '完成這幅油畫肖像花了 Grace 超過兩週的時間。', exp: '虛主詞 It 開頭且花費的是「時間（two weeks）」，固定搭配動詞 took（It takes + 人 + 時間 + to V）；spend 的主詞必須是「人」，cost 則用於花費「金錢」。' },
          { q: 'Whenever a question ____ during the experiment, you should write it down immediately.', right: 'arises', wrong1: 'arouses', wrong2: 'raises', wrong3: 'rises', zh: '每當實驗過程中出現問題時，你應該立刻記錄下來。', exp: '表示抽象的「問題、困難浮現或發生（不及物動詞）」，應使用 arise（arises）；raise 與 arouse 為及物動詞，後方必須接受詞。' }
        ]);
        const s = shuffleOptions([item.right, item.wrong1, item.wrong2, item.wrong3], 0);
        return {
          chapterId: 8,
          topic: '🔥 盲點動態特訓：高頻易混淆動詞辨析',
          level: 2,
          q: item.q,
          options: s.options,
          answer: s.answer,
          zh: item.zh,
          explain: `【盲點靶向解析】${item.exp}`
        };
      },

      subject_verb_agreement: () => {
        const s = shuffleOptions(['is', 'are', 'were', 'have been'], 0);
        return {
          chapterId: 9,
          topic: '🔥 盲點動態特訓：主詞與動詞單複數一致',
          level: 2,
          q: 'The teacher, as well as all the students in the gifted class, ____ excited about the upcoming field trip.',
          options: s.options,
          answer: s.answer,
          zh: '老師以及資優班的所有學生，都對即將到來的校外教學感到興奮。',
          explain: '【盲點靶向解析】由「A as well as B（以及 with / together with / along with）」連接主詞時，動詞單複數必須配合「前面的主詞 A（The teacher，單數）」，而非後面的 students！故選 is。'
        };
      },

      relative_clauses: () => {
        const item = pick([
          { q: 'This is the most inspiring novel ____ I have ever read in high school.', right: 'that', wrong1: 'which', wrong2: 'what', wrong3: 'who', zh: '這是我在高中讀過最勵志的一本小說。', exp: '先行詞 novel 前方有「最高級（the most inspiring）」修飾時，關係代名詞必須使用 that，不可使用 which；what 則不可有先行詞。' },
          { q: 'Do you still remember the small cafe ____ we first met three years ago?', right: 'where', wrong1: 'which', wrong2: 'that', wrong3: 'what', zh: '你還記得我們三年前初次見面的那間小咖啡館嗎？', exp: '關係子句「we first met three years ago」結構完整（不缺受詞，因為是在咖啡館裡 in the cafe 見面），因此必須使用關係副詞 where（= in which），不可誤選關係代名詞 which/that！' }
        ]);
        const s = shuffleOptions([item.right, item.wrong1, item.wrong2, item.wrong3], 0);
        return {
          chapterId: 13,
          topic: '🔥 盲點動態特訓：關係代名詞 vs. 關係副詞與 that 限制',
          level: 2,
          q: item.q,
          options: s.options,
          answer: s.answer,
          zh: item.zh,
          explain: `【盲點靶向解析】${item.exp}`
        };
      },

      conj_and_prep: () => {
        const s = shuffleOptions(['Despite', 'Although', 'Because', 'Unless'], 0);
        return {
          chapterId: 16,
          topic: '🔥 盲點動態特訓：讓步介系詞 (Despite) vs. 連接詞 (Although)',
          level: 2,
          q: '____ the heavy rain and strong wind, the rescue team continued searching for the hikers.',
          options: s.options,
          answer: s.answer,
          zh: '儘管下著大雨又颳著強風，搜救隊仍繼續搜尋登山客。',
          explain: '【盲點靶向解析】空格後方「the heavy rain and strong wind」只是「名詞片語（沒有動詞）」，不能用連接詞 Although（後須接 S + V 子句），必須使用介系詞 Despite（= In spite of）！'
        };
      },

      questions_and_tags: () => {
        const s = shuffleOptions(['where the nearest MRT station is', 'where is the nearest MRT station', 'where does the nearest MRT station', 'that where the nearest MRT station is'], 0);
        return {
          chapterId: 18,
          topic: '🔥 盲點動態特訓：間接問句之直述語序',
          level: 2,
          q: 'Excuse me, could you tell me ____?',
          options: s.options,
          answer: s.answer,
          zh: '不好意思，請問你能告訴我最近的捷運站在哪裡嗎？',
          explain: '【盲點靶向解析】疑問句放在 tell me 後方作受詞時稱為「間接問句（名詞子句）」，語序必須恢復為「疑問詞 + 主詞 + 動詞（where the nearest MRT station is）」，絕對不可倒裝成 where is...！'
        };
      },

      negation_and_inversion: () => {
        const adv = pick(['Seldom', 'Never', 'Rarely']);
        const s = shuffleOptions(['have I seen', 'I have seen', 'did I saw', 'I saw'], 0);
        return {
          chapterId: 19,
          topic: '🔥 盲點動態特訓：否定副詞放句首之倒裝句',
          level: 3,
          q: `${adv} ____ such a dedicated and passionate grammar teacher as Ms. Bubble!`,
          options: s.options,
          answer: s.answer,
          zh: `我很少／從未見過像 Bubble 老師這樣敬業又充滿熱忱的文法老師！`,
          explain: `【盲點靶向解析】否定副詞「${adv}」置於句首加強語氣時，句子必須採用「助動詞/have/be + 主詞 + 動詞」的倒裝結構，故選 have I seen！`
        };
      }
    };

    const defaultGenKeys = Object.keys(generatorsByCat);
    const activeKeys = categoryIds.filter(id => generatorsByCat[id]);
    const poolKeys = activeKeys.length > 0 ? activeKeys : defaultGenKeys;

    const generated = [];
    for (let i = 0; i < neededCount; i++) {
      const key = poolKeys[i % poolKeys.length];
      generated.push(generatorsByCat[key]());
    }
    return generated;
  }

  /**
   * 綜合「動態盲點變體題 + 同主題題庫精準抽題 + 原錯題選項洗牌重測」產生專屬靶向測驗
   */
  async buildTargetedBlindSpotQuiz(generatorInstance, count = 10) {
    const report = this.analyzeAllBlindSpots();
    const catIds = report.categories.map(c => c.categoryId);
    const weakChIds = report.weakChapters.map(c => c.chapterId);

    const finalPool = [];

    // 1. 先將學生的歷史錯題進行「選項隨機洗牌（防止死背 A/B/C/D 位置）」加入測驗池
    const shuffledMistakes = this.mistakes.slice(0, Math.ceil(count * 0.4)).map(m => {
      const origOpts = [...(m.options || [])];
      const correctVal = origOpts[m.correctIndex];
      for (let i = origOpts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [origOpts[i], origOpts[j]] = [origOpts[j], origOpts[i]];
      }
      const newAns = origOpts.indexOf(correctVal);
      return {
        chapterId: m.chapterId,
        topic: `🔄 錯題洗牌重測 · ${m.blindSpot ? m.blindSpot.categoryTitle.split('：')[1] || m.topic : m.topic}`,
        level: 2,
        q: m.q,
        options: origOpts,
        answer: newAns >= 0 ? newAns : m.correctIndex,
        zh: m.zh,
        explain: `${m.blindSpot ? '🧠 【盲點提醒】' + m.blindSpot.prescription + '\n\n' : ''}${m.explain}`
      };
    });
    finalPool.push(...shuffledMistakes);

    // 2. 從弱點章節的 bank.json 中精準抽取同主題 / 同關鍵字的新題
    if (generatorInstance && weakChIds.length > 0) {
      const missedTopics = new Set(this.mistakes.map(m => (m.topic || '').slice(0, 6)).filter(Boolean));
      for (const chId of weakChIds) {
        const bankItems = await generatorInstance.getChapterBank(chId);
        if (bankItems && bankItems.length > 0) {
          // 優先挑選尚未在錯題本裡且主題相近的題目
          const matched = bankItems.filter(item => {
            if (this.mistakes.some(m => m.q === item.q)) return false;
            for (const kw of missedTopics) {
              if (kw && (item.topic || '').includes(kw)) return true;
            }
            return true;
          });
          const picked = generatorInstance.shuffleArray(matched).slice(0, 4).map(item => ({
            ...item,
            chapterId: chId,
            topic: `🎯 弱點單元強化 · ${item.topic || '核心文法'}`
          }));
          finalPool.push(...picked);
        }
      }
    }

    // 3. 補入針對該生盲點類別即時動態生成的變體新題
    const dynamicCount = Math.max(4, count - finalPool.length + 3);
    const dynamicItems = this.generateDynamicBlindSpotVariations(catIds, dynamicCount);
    finalPool.push(...dynamicItems);

    return finalPool.slice(0, count);
  }
}

window.MistakeAnalyzer = MistakeAnalyzer;
