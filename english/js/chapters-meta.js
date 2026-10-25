/**
 * Bubble 夢幻英文文法學院 - 20大章節核心詮釋資料 (Chapters Metadata)
 */
const CHAPTERS_META = [
  {
    id: 1,
    num: "01",
    title: "時態",
    enTitle: "Tenses",
    icon: "fa-clock",
    color: "#FF6B8B",
    bgSoft: "#FFF0F5",
    subtopics: ["三時四方面（十二種時態）", "現在簡單式與進行式", "現在完成式與完成進行式", "過去時態全攻略", "未來時態用法"],
    summary: "英文動詞與中文最大的不同就是「時態」！掌握動詞字形變化，12種時態一目了然。",
    level: "資優必備 ★★★☆☆"
  },
  {
    id: 2,
    num: "02",
    title: "假設語氣",
    enTitle: "Subjunctive Mood",
    icon: "fa-wand-magic-sparkles",
    color: "#9333EA",
    bgSoft: "#F5F3FF",
    subtopics: ["與現在事實相反", "與過去事實相反", "與未來事實相反", "I wish / as if 句型", "but for / without / 倒裝省略"],
    summary: "「如果時光能倒流...」透過時間往過去推一步的魔法規律，輕鬆駕馭英檢與會考魔王題！",
    level: "資優進階 ★★★★★"
  },
  {
    id: 3,
    num: "03",
    title: "語態",
    enTitle: "Voice",
    icon: "fa-arrows-rotate",
    color: "#2563EB",
    bgSoft: "#EFF6FF",
    subtopics: ["一般時/進行時/完成時被動", "感官與使役動詞被動", "雙受詞與受詞補語被動", "祈使句與否定句被動", "情緒動詞與特殊介系詞搭配"],
    summary: "主動轉被動不是只有 be + p.p.！探索感官動詞還原 to、情緒動詞搭配特定介系詞的精髓。",
    level: "重要核心 ★★★★☆"
  },
  {
    id: 4,
    num: "04",
    title: "不定詞",
    enTitle: "Infinitives",
    icon: "fa-seedling",
    color: "#059669",
    bgSoft: "#ECFDF5",
    subtopics: ["名詞用法（主詞/受詞/補語）", "形容詞用法與副詞用法", "感官動詞與使役動詞省略 to", "不定詞的時態與被動", "獨立不定詞慣用語"],
    summary: "「to V 或省略 to？」解析不定詞在句中當名詞、形容詞、副詞的靈活面貌。",
    level: "基礎核心 ★★★☆☆"
  },
  {
    id: 5,
    num: "05",
    title: "動名詞",
    enTitle: "Gerunds",
    icon: "fa-feather-pointed",
    color: "#D97706",
    bgSoft: "#FFFBEB",
    subtopics: ["動名詞的基本功用", "動名詞與不定詞語意差別", "動名詞的邏輯主詞", "動名詞時態與被動", "必背動名詞高頻慣用語"],
    summary: "stop to V 與 stop V-ing 意思大不同！一次釐清只能接動名詞的關鍵動詞與固定句型。",
    level: "易錯陷阱 ★★★★☆"
  },
  {
    id: 6,
    num: "06",
    title: "分詞",
    enTitle: "Participles",
    icon: "fa-masks-theater",
    color: "#DB2777",
    bgSoft: "#FDF2F8",
    subtopics: ["現在分詞 vs 過去分詞", "分詞當形容詞與補語", "分詞構句簡化規則", "獨立分詞構句", "分詞慣用語"],
    summary: "主動進行用 V-ing，被動完成用 p.p.！掌握分詞構句，寫作水準瞬間晉升資優高手。",
    level: "寫作關鍵 ★★★★★"
  },
  {
    id: 7,
    num: "07",
    title: "助動詞",
    enTitle: "Auxiliary Verbs",
    icon: "fa-bolt-lightning",
    color: "#EA580C",
    bgSoft: "#FFF7ED",
    subtopics: ["Be / have / do 的兩用面貌", "shall / should / will / would", "can / could / may / might", "must / have to / ought to", "need / dare / used to"],
    summary: "助動詞是英語的語氣調味劑！徹底剖析推測、義務、能力與習慣的高分用法。",
    level: "重要核心 ★★★★☆"
  },
  {
    id: 8,
    num: "08",
    title: "易混淆動詞",
    enTitle: "Confusing Verbs",
    icon: "fa-scale-balanced",
    color: "#7C3AED",
    bgSoft: "#FAF5FF",
    subtopics: ["spend / take / cost", "lie / lay / lie", "speak / say / tell / talk", "rob / steal / take / bring", "23組高頻易混淆動詞大解密"],
    summary: "會考與各大檢定最愛考的 23 組易混淆動詞大清單！再也不會搞混 lie 和 lay。",
    level: "秒殺必背 ★★★★★"
  },
  {
    id: 9,
    num: "09",
    title: "主詞與動詞的一致",
    enTitle: "Subject-Verb Agreement",
    icon: "fa-handshake",
    color: "#0284C7",
    bgSoft: "#F0F9FF",
    subtopics: ["單數動詞的各種情況", "複數動詞的各種情況", "依主詞語意決定的情況", "對等/相關連接詞決定動詞", "集合名詞與數量詞的一致"],
    summary: "主詞到底算單數還是複數？掌握就近原則、強調主體等黃金法則，文法題分秒搞定！",
    level: "基礎核心 ★★★☆☆"
  },
  {
    id: 10,
    num: "10",
    title: "冠詞",
    enTitle: "Articles",
    icon: "fa-gem",
    color: "#4F46E5",
    bgSoft: "#EEF2FF",
    subtopics: ["不定冠詞 a / an 的精準用法", "定冠詞 the 的特指原則", "專有名詞何時加 the", "冠詞省略的固定慣例", "冠詞的特殊位置"],
    summary: "什麼時候加 the？什麼時候零冠詞？細膩梳理最容易被忽略卻最顯程度的小冠詞。",
    level: "細節致勝 ★★★☆☆"
  },
  {
    id: 11,
    num: "11",
    title: "名詞",
    enTitle: "Nouns",
    icon: "fa-cube",
    color: "#0891B2",
    bgSoft: "#ECFEFF",
    subtopics: ["普通/集合/專有/物質/抽象名詞", "可數與不可數名詞轉換", "名詞的規則與不規則複數", "名詞所有格與雙重所有格", "複合名詞的複數"],
    summary: "名詞不只是物品名稱！探索物質名詞的單位詞、集合名詞的單複數及雙重所有格奧妙。",
    level: "基礎核心 ★★★☆☆"
  },
  {
    id: 12,
    num: "12",
    title: "代名詞",
    enTitle: "Pronouns",
    icon: "fa-person-chalkboard",
    color: "#16A34A",
    bgSoft: "#F0FDF4",
    subtopics: ["人稱代名詞與 It 的七大用法", "所有格代名詞與反身代名詞", "指示代名詞 this/that/those", "不定代名詞 one/another/other", "疑問代名詞用法"],
    summary: "虛主詞 It、虛受詞 It、強調句 It...一次通曉！還有 another、the other 完美圖解。",
    level: "重要核心 ★★★★☆"
  },
  {
    id: 13,
    num: "13",
    title: "關係詞",
    enTitle: "Relatives",
    icon: "fa-link",
    color: "#C026D3",
    bgSoft: "#FDF4FF",
    subtopics: ["關係代名詞 who/which/that", "限定與非限定用法", "只能用 that 的特殊情況", "準關係代名詞 but/as/than", "複合關係代名詞 what 與關係副詞"],
    summary: "長難句的靈魂就是關係子句！完整破解先行詞與關代的密碼，輕鬆寫出優美複句。",
    level: "高階資優 ★★★★★"
  },
  {
    id: 14,
    num: "14",
    title: "形容詞",
    enTitle: "Adjectives",
    icon: "fa-palette",
    color: "#E11D48",
    bgSoft: "#FFF1F2",
    subtopics: ["形容詞位置與多個形容詞順序", "數量形容詞 many/much/few/little", "原級、比較級與最高級變化", "倍數表達法與自身比較", "最高級的高頻資優句型"],
    summary: "形容詞修飾排列有神奇公式！倍數句型「A is X times as... as B」會考精準得分法。",
    level: "重要核心 ★★★★☆"
  },
  {
    id: 15,
    num: "15",
    title: "副詞",
    enTitle: "Adverbs",
    icon: "fa-wind",
    color: "#D97706",
    bgSoft: "#FEF3C7",
    subtopics: ["程度/方式/頻率/地點/時間副詞", "副詞在句中的標準位置", "疑問副詞用法", "副詞的比較級與最高級", "高頻易混淆副詞（hard/hardly等）"],
    summary: "hard 和 hardly 意思天差地遠！細說五大副詞擺放位置，讓修飾語自然流暢。",
    level: "基礎核心 ★★★☆☆"
  },
  {
    id: 16,
    num: "16",
    title: "連接詞",
    enTitle: "Conjunctions",
    icon: "fa-diagram-project",
    color: "#2563EB",
    bgSoft: "#DBEAFE",
    subtopics: ["對等連接詞 FANBOYS", "相關連接詞 not only... but also", "引導名詞子句的 that/whether/if", "十種副詞子句（時間/條件/讓步...）", "準連接詞用法"],
    summary: "連接詞是句子的黏著劑！從對等連接到十大副詞子句，文章條理分明的致勝法寶。",
    level: "重要核心 ★★★★☆"
  },
  {
    id: 17,
    num: "17",
    title: "介系詞",
    enTitle: "Prepositions",
    icon: "fa-compass",
    color: "#059669",
    bgSoft: "#D1FAE5",
    subtopics: ["時間介系詞 in/on/at", "地點介系詞 at/in/on/under/above", "手段/工具/材料介系詞", "原因/目的/結果/比較介系詞", "特殊分離與附帶狀況介系詞"],
    summary: "掌握空間與時間意象，再也不必死記硬背！徹底征服最容易丟分的介系詞細節。",
    level: "記憶關鍵 ★★★★☆"
  },
  {
    id: 18,
    num: "18",
    title: "疑問句、附加問句與直述句",
    enTitle: "Questions & Statements",
    icon: "fa-circle-question",
    color: "#7C3AED",
    bgSoft: "#EDE9FE",
    subtopics: ["Yes/No 與 Wh- 特殊疑問句", "間接問句之平述詞序", "猜測動詞特殊問句", "附加問句的十條黃金定律", "直接引述改間接引述時態人稱變化"],
    summary: "問句詞序是考試最愛埋的陷阱！間接問句一定要回復「主詞+動詞」，附加問句前肯後否秒答術。",
    level: "重要核心 ★★★★☆"
  },
  {
    id: 19,
    num: "19",
    title: "否定句與倒裝句",
    enTitle: "Negation & Inversion",
    icon: "fa-repeat",
    color: "#DC2626",
    bgSoft: "#FEE2E2",
    subtopics: ["否定句的各種構成法", "雙重否定表強烈肯定", "部分否定 vs 完全否定", "否定副詞放句首的倒裝", "Only / So / Neither / 地方副詞倒裝"],
    summary: "「Seldom have I seen...」倒裝句是資優生閱讀英美名著與挑戰作文滿分的祕密武器！",
    level: "高階資優 ★★★★★"
  },
  {
    id: 20,
    num: "20",
    title: "五大句型與三大子句",
    enTitle: "Sentence Patterns & Clauses",
    icon: "fa-crown",
    color: "#B45309",
    bgSoft: "#FEF3C7",
    subtopics: ["五大基本句型（S+Vi 到 S+Vt+O+O.C.）", "動詞分類與受詞補語判定", "三大子句：名詞子句", "三大子句：形容詞子句", "三大子句：副詞子句"],
    summary: "全書集大成章節！天下英文句子皆在五大句型中，融會貫通三大子句，文法終極通透！",
    level: "巔峰總結 ★★★★★"
  }
];

// 附錄與前言
const EXTRA_META = {
  preface: {
    id: "preface",
    title: "編輯大意",
    enTitle: "Preface & Study Guide",
    icon: "fa-book-open",
    summary: "陳啟賢、陳明亮老師的編寫初衷、學習導引與四階段（觀念、開竅、診斷、說明）通關法。"
  },
  appendix: {
    id: "appendix",
    title: "附錄專題",
    enTitle: "Grammar Appendices",
    icon: "fa-scroll",
    summary: "五大句型基本要素解析、Subject+be+to V 句型、Be+不及物動詞過去分詞、不規則動詞全表。"
  }
};

if (typeof window !== 'undefined') {
  window.CHAPTERS_META = CHAPTERS_META;
  window.EXTRA_META = EXTRA_META;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CHAPTERS_META, EXTRA_META };
}

