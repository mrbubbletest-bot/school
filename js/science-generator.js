function renderSciencePreview() {
    const html = `
        <h2 style="color: var(--primary-color); margin-bottom: 1.5rem;"><i class="fa-solid fa-flask"></i> 理化觀念預習 (資優特訓 30/30/40 分級)</h2>
        
        <h3 style="margin-top: 2rem; color: #22c55e; border-bottom: 2px solid #22c55e; padding-bottom: 0.5rem;">🟢 基礎觀念 (30%)</h3>
        
        <!-- 單元 1: 狹義的氧化與還原 -->
        <div class="card" style="border-left: 5px solid #22c55e;">
            <h2 class="card-title">1. 狹義的氧化與還原</h2>
            <div class="interactive-box">
                <ul style="line-height: 1.8;">
                    <li><strong>氧化反應</strong>：物質與氧結合 (得到氧) 的反應。</li>
                    <li><strong>還原反應</strong>：氧化物失去氧的反應。</li>
                </ul>
            </div>
        </div>

        <!-- 單元 2: 常見酸鹼的分類與特性 -->
        <div class="card" style="border-left: 5px solid #22c55e;">
            <h2 class="card-title">2. 常見酸鹼的分類與特性</h2>
            <div class="interactive-box" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div style="background: #fef2f2; padding: 1rem; border-radius: 8px;">
                    <h4 style="color: var(--danger);">強酸</h4>
                    <ul style="margin-top: 0.5rem; padding-left: 1.2rem;">
                        <li><strong>硫酸 (H₂SO₄)</strong>：工業之母，強脫水性。</li>
                        <li><strong>鹽酸 (HCl)</strong>：產生白霧。</li>
                        <li><strong>硝酸 (HNO₃)</strong>：見光易分解。</li>
                    </ul>
                </div>
                <div style="background: #eff6ff; padding: 1rem; border-radius: 8px;">
                    <h4 style="color: var(--primary-color);">強鹼</h4>
                    <ul style="margin-top: 0.5rem; padding-left: 1.2rem;">
                        <li><strong>氫氧化鈉 (NaOH)</strong>：俗稱燒鹼，易潮解。</li>
                        <li><strong>氨水 (NH₃)</strong>：弱鹼性，刺鼻臭味。</li>
                        <li><strong>氧化鈣 (CaO)</strong>：生石灰。</li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- 單元 3: pH 值與酸鹼性基礎 -->
        <div class="card" style="border-left: 5px solid #22c55e;">
            <h2 class="card-title">3. pH 值與酸鹼性基礎</h2>
            <div class="interactive-box">
                <div style="display: flex; justify-content: space-between; background: linear-gradient(to right, #ef4444, #22c55e, #3b82f6); padding: 1rem; border-radius: 8px; color: white; font-weight: bold;">
                    <span>酸性 (pH < 7)<br>[H⁺] > [OH⁻]</span>
                    <span>中性 (pH = 7)<br>[H⁺] = [OH⁻]</span>
                    <span>鹼性 (pH > 7)<br>[H⁺] < [OH⁻]</span>
                </div>
            </div>
        </div>

        <h3 style="margin-top: 2rem; color: #eab308; border-bottom: 2px solid #eab308; padding-bottom: 0.5rem;">🟡 中等段考題型 (30%)</h3>

        <!-- 單元 4: 廣義氧化還原與高爐煉鐵 -->
        <div class="card" style="border-left: 5px solid #eab308;">
            <h2 class="card-title">4. 廣義氧化還原與高爐煉鐵</h2>
            <div class="interactive-box">
                <p><strong>反應式：</strong> 2Fe₂O₃ + 3C → 4Fe + 3CO₂</p>
                <ul style="line-height: 1.8; margin-top: 1rem; padding-left: 1.5rem;">
                    <li>🔥 Fe₂O₃ 失去氧，發生<strong>還原反應</strong>。本身是提供氧的<strong>氧化劑</strong>。</li>
                    <li>🔥 C 得到氧，發生<strong>氧化反應</strong>。本身是搶走氧的<strong>還原劑</strong>。</li>
                </ul>
            </div>
        </div>

        <!-- 單元 5: 氫離子濃度的對數換算 -->
        <div class="card" style="border-left: 5px solid #eab308;">
            <h2 class="card-title">5. 氫離子濃度的對數換算</h2>
            <div class="interactive-box">
                <p>pH 值每相差 1，[H⁺] 濃度相差 <strong>10 倍</strong>！</p>
                <p style="margin-top: 0.5rem;">例如：pH=3 的酸性強度是 pH=5 的 10² = 100 倍。</p>
            </div>
        </div>

        <!-- 單元 6: 酸鹼中和基本原理 -->
        <div class="card" style="border-left: 5px solid #eab308;">
            <h2 class="card-title">6. 酸鹼中和基本原理</h2>
            <div class="interactive-box">
                <p>化學式：<strong>酸 + 鹼 → 鹽 + 水 + 熱量 (放熱反應)</strong></p>
                <p style="margin-top: 0.5rem;">核心離子方程式：H⁺ + OH⁻ → H₂O</p>
            </div>
        </div>

        <h3 style="margin-top: 2rem; color: #ef4444; border-bottom: 2px solid #ef4444; padding-bottom: 0.5rem;">🔴 資優進階挑戰 (40%)</h3>

        <!-- 單元 7: 複雜自身氧化還原反應 -->
        <div class="card" style="border-left: 5px solid #ef4444;">
            <h2 class="card-title">7. 複雜自身氧化還原反應</h2>
            <div class="interactive-box" style="background: #fef2f2;">
                <p>資優考法：雙氧水分解 2H₂O₂ → 2H₂O + O₂</p>
                <p>在此反應中，H₂O₂ 同時有一部分發生還原產生水，一部分發生氧化產生氧氣。它是自己反應中的氧化劑兼還原劑！</p>
            </div>
        </div>

        <!-- 單元 8: pH 極限稀釋與混合酸鹼計算 -->
        <div class="card" style="border-left: 5px solid #ef4444;">
            <h2 class="card-title">8. pH 極限稀釋與混合悖論</h2>
            <div class="interactive-box">
                <p>💡 <strong>極限悖論：</strong> 將 pH=6 的鹽酸加水稀釋 1000 倍，pH 絕對不會變成 9！因為水的解離也會提供氫離子，最終 pH 會<strong>無限逼近 7</strong>，溶液永遠呈酸性。</p>
            </div>
        </div>

        <!-- 單元 9: 酸鹼滴定實驗操作與變色 -->
        <div class="card" style="border-left: 5px solid #ef4444;">
            <h2 class="card-title">9. 酸鹼滴定實驗操作與變色</h2>
            <div class="interactive-box">
                <p>使用標準液滴定未知液：</p>
                <ul style="line-height: 1.8; margin-top: 0.5rem; padding-left: 1.5rem;">
                    <li><strong>滴定管</strong>：裝標準溶液。</li>
                    <li><strong>錐形瓶</strong>：裝未知濃度溶液與指示劑。</li>
                    <li>若用 NaOH 滴定 HCl，加入酚酞，達到當量點時會瞬間從<strong>無色變為微粉紅色</strong>。</li>
                </ul>
            </div>
        </div>

        <!-- 單元 10: 逆滴定與中和熱極限計算 -->
        <div class="card" style="border-left: 5px solid #ef4444;">
            <h2 class="card-title">10. 逆滴定與中和熱極限計算 (魔王題)</h2>
            <div class="interactive-box" style="background: white; border: 2px solid #e2e8f0;">
                <p>對於不溶於水的鹼(如碳酸鈣胃藥)，無法直接滴定。</p>
                <p><strong>逆滴定法：</strong> 先加入過量的已知濃度強酸使其完全溶解反應，再用標準強鹼去滴定「剩下沒反應完」的酸。這需要極強的莫耳數加減運算能力！</p>
            </div>
        </div>
    `;
    document.getElementById('content-area').innerHTML = html;
}

// === 理化統一題型庫 (30/30/40) ===
window.scienceQuestionPool = {
    basic: [
        () => {
            return {
                type: 'multiple_choice',
                question: `【基礎】關於狹義的氧化還原反應，下列敘述何者正確？`,
                options: ["物質得到氧稱為氧化", "物質得到氧稱為還原", "氧化物得到氧稱為氧化", "還原反應是指得到電子的反應"].sort(() => Math.random() - 0.5),
                correctAnswer: "物質得到氧稱為氧化",
                svg: `<svg width="200" height="120" viewBox="0 0 200 120">
                        <circle cx="50" cy="60" r="25" fill="var(--warning)" />
                        <text x="50" y="65" font-size="14" font-weight="bold" text-anchor="middle" fill="white">物質</text>
                        <circle cx="150" cy="60" r="20" fill="var(--danger)" />
                        <text x="150" y="65" font-size="14" font-weight="bold" text-anchor="middle" fill="white">O</text>
                        <path d="M 120 60 L 85 60" fill="none" stroke="black" stroke-width="3" marker-end="url(#arrow)" />
                        <text x="100" y="50" font-size="12" text-anchor="middle" fill="var(--danger)">得到氧</text>
                        <defs>
                          <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="black" />
                          </marker>
                        </defs>
                      </svg>`,
                explanation: `狹義的氧化反應：物質與氧結合（得到氧）的過程。<br>狹義的還原反應：氧化物失去氧的過程。`
            };
        },
        () => {
            return {
                type: 'multiple_choice',
                question: `【基礎】下列何種常見酸性水溶液具有強烈的「脫水性」，能使蔗糖變黑碳化？`,
                options: ["硫酸 (H₂SO₄)", "鹽酸 (HCl)", "硝酸 (HNO₃)", "醋酸 (CH₃COOH)"].sort(() => Math.random() - 0.5),
                correctAnswer: "硫酸 (H₂SO₄)",
                svg: `<svg width="200" height="150" viewBox="0 0 200 150">
                        <path d="M 70 120 L 130 120 L 140 50 L 60 50 Z" fill="none" stroke="black" stroke-width="3" />
                        <path d="M 65 80 L 135 80 L 130 120 L 70 120 Z" fill="rgba(255,255,0,0.3)" />
                        <text x="100" y="105" font-size="16" font-weight="bold" text-anchor="middle" fill="var(--danger)">H₂SO₄</text>
                        <rect x="85" y="10" width="30" height="30" rx="4" fill="black" />
                        <text x="100" y="30" font-size="12" font-weight="bold" text-anchor="middle" fill="white">蔗糖</text>
                        <path d="M 100 45 L 100 65" fill="none" stroke="black" stroke-width="2" stroke-dasharray="3,3" />
                        <text x="145" y="30" font-size="12" fill="var(--danger)">變黑碳化</text>
                      </svg>`,
                explanation: `濃硫酸具有極強的脫水性，能將有機物(如碳水化合物)中的氫與氧依水的比例(2:1)脫去，留下黑色的碳。`
            };
        },
        () => {
            return {
                type: 'multiple_choice',
                question: `【基礎】常溫下，當一杯水溶液的 pH 值小於 7 時，其內部的氫離子 [H⁺] 與氫氧根離子 [OH⁻] 濃度關係為何？`,
                options: ["[H⁺] > [OH⁻]", "[H⁺] < [OH⁻]", "[H⁺] = [OH⁻]", "無法比較"].sort(() => Math.random() - 0.5),
                correctAnswer: "[H⁺] > [OH⁻]",
                svg: `<svg width="200" height="100" viewBox="0 0 200 100">
                        <rect x="20" y="40" width="160" height="20" rx="10" fill="url(#grad)" />
                        <polygon points="100,65 95,80 105,80" fill="black" />
                        <text x="100" y="95" font-size="12" text-anchor="middle">pH=7 (中性)</text>
                        <text x="40" y="30" font-size="14" font-weight="bold" fill="var(--danger)">酸性</text>
                        <text x="160" y="30" font-size="14" font-weight="bold" fill="var(--primary-color)">鹼性</text>
                        <defs>
                          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" style="stop-color:var(--danger);stop-opacity:1" />
                            <stop offset="50%" style="stop-color:var(--success);stop-opacity:1" />
                            <stop offset="100%" style="stop-color:var(--primary-color);stop-opacity:1" />
                          </linearGradient>
                        </defs>
                      </svg>`,
                explanation: `水溶液呈酸性時，pH < 7，此時溶液中的氫離子濃度必然大於氫氧根離子濃度。`
            };
        }
    ],
    medium: [
        () => {
            return {
                type: 'multiple_choice',
                question: `【中等】在高爐煉鐵的反應式 2Fe₂O₃ + 3C → 4Fe + 3CO₂ 中，何者扮演「還原劑」的角色？`,
                options: ["C", "Fe₂O₃", "Fe", "CO₂"].sort(() => Math.random() - 0.5),
                correctAnswer: "C",
                svg: `<svg width="250" height="150" viewBox="0 0 250 150">
                        <polygon points="100,10 150,10 170,130 80,130" fill="#fca5a5" stroke="var(--danger)" stroke-width="3" />
                        <text x="125" y="50" font-size="14" text-anchor="middle" font-weight="bold">高爐</text>
                        <text x="50" y="80" font-size="14" fill="var(--primary-color)">Fe₂O₃</text>
                        <text x="200" y="80" font-size="14" fill="var(--danger)">C</text>
                        <path d="M 60 90 L 100 120" fill="none" stroke="black" stroke-width="2" marker-end="url(#arrow)" />
                        <path d="M 190 90 L 150 120" fill="none" stroke="black" stroke-width="2" marker-end="url(#arrow)" />
                        <text x="125" y="125" font-size="16" text-anchor="middle" fill="white" font-weight="bold">Fe + CO₂</text>
                        <defs>
                          <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="black" />
                          </marker>
                        </defs>
                      </svg>`,
                explanation: `還原劑本身會發生「氧化反應（得到氧）」。<br>在此反應中，C 得到氧變成 CO₂，所以 C 是還原劑。`
            };
        },
        () => {
            const ph1 = Math.floor(Math.random() * 3) + 2; 
            const ph2 = ph1 + 2; 
            return {
                type: 'multiple_choice',
                question: `【中等】甲溶液的 pH = ${ph1}，乙溶液的 pH = ${ph2}。請問甲溶液的氫離子濃度 [H⁺] 是乙溶液的幾倍？`,
                options: ["100", "2", "20", "0.01"].sort(() => Math.random() - 0.5),
                correctAnswer: "100",
                svg: `<svg width="250" height="120" viewBox="0 0 250 120">
                        <line x1="20" y1="80" x2="230" y2="80" stroke="black" stroke-width="2" />
                        <circle cx="50" cy="80" r="5" fill="var(--danger)" />
                        <text x="50" y="100" font-size="14" text-anchor="middle">pH=${ph1}</text>
                        <circle cx="150" cy="80" r="5" fill="var(--warning)" />
                        <text x="150" y="100" font-size="14" text-anchor="middle">pH=${ph2}</text>
                        <path d="M 50 70 Q 100 20 150 70" fill="none" stroke="var(--primary-color)" stroke-width="2" stroke-dasharray="4,4" marker-end="url(#arrow)" />
                        <text x="100" y="45" font-size="14" text-anchor="middle" fill="var(--primary-color)">[H⁺] ÷ 100</text>
                      </svg>`,
                explanation: `pH 值每相差 1，[H⁺] 濃度相差 10 倍。<br>甲(pH=${ph1}) 比 乙(pH=${ph2}) 小 2，所以濃度是 10² = 100 倍。`
            };
        },
        () => {
            return {
                type: 'multiple_choice',
                question: `【中等】進行酸鹼中和實驗，將 0.1M 的鹽酸 50mL 滴入未知濃度的氫氧化鈉溶液 25mL 中，剛好完全中和。請問氫氧化鈉溶液的濃度為多少 M？`,
                options: ["0.2", "0.1", "0.05", "0.4"].sort(() => Math.random() - 0.5),
                correctAnswer: "0.2",
                svg: `<svg width="200" height="120" viewBox="0 0 200 120">
                        <circle cx="70" cy="60" r="20" fill="rgba(239,68,68,0.2)" stroke="var(--danger)" stroke-width="2" />
                        <text x="70" y="65" font-size="14" font-weight="bold" text-anchor="middle" fill="var(--danger)">H⁺</text>
                        <circle cx="130" cy="60" r="20" fill="rgba(59,130,246,0.2)" stroke="var(--primary-color)" stroke-width="2" />
                        <text x="130" y="65" font-size="14" font-weight="bold" text-anchor="middle" fill="var(--primary-color)">OH⁻</text>
                        <text x="100" y="65" font-size="16" font-weight="bold" text-anchor="middle">+</text>
                        <path d="M 100 85 L 100 105" fill="none" stroke="black" stroke-width="2" marker-end="url(#arrow)" />
                        <text x="100" y="115" font-size="14" font-weight="bold" text-anchor="middle" fill="var(--success)">H₂O</text>
                      </svg>`,
                explanation: `酸鹼中和原理：H⁺ 莫耳數 = OH⁻ 莫耳數。<br>0.1M × 50mL = M_NaOH × 25mL<br>5 = 25 × M_NaOH<br>M_NaOH = 0.2M`
            };
        }
    ],
    advanced: [
        () => {
            return {
                type: 'multiple_choice',
                question: `【進階】雙氧水分解反應式為 2H₂O₂ → 2H₂O + O₂。關於此反應的氧化還原性質，下列何者正確？`,
                options: ["H₂O₂ 同時作為氧化劑與還原劑", "H₂O₂ 僅作為氧化劑", "H₂O₂ 僅作為還原劑", "此反應並非氧化還原反應"].sort(() => Math.random() - 0.5),
                correctAnswer: "H₂O₂ 同時作為氧化劑與還原劑",
                svg: `<svg width="250" height="150" viewBox="0 0 250 150">
                        <text x="125" y="40" font-size="18" text-anchor="middle" font-weight="bold" fill="var(--primary-color)">2H₂O₂</text>
                        <path d="M 100 50 Q 60 80 80 120" fill="none" stroke="var(--success)" stroke-width="2" marker-end="url(#arrow)" />
                        <path d="M 150 50 Q 190 80 170 120" fill="none" stroke="var(--danger)" stroke-width="2" marker-end="url(#arrow)" />
                        <text x="80" y="140" font-size="16" text-anchor="middle" font-weight="bold">2H₂O</text>
                        <text x="170" y="140" font-size="16" text-anchor="middle" font-weight="bold">O₂</text>
                        <text x="65" y="90" font-size="12" fill="var(--success)">還原</text>
                        <text x="185" y="90" font-size="12" fill="var(--danger)">氧化</text>
                      </svg>`,
                explanation: `這是經典的「自身氧化還原反應」。<br>H₂O₂ 中的氧有一部分氧化成 O₂，一部分還原成 H₂O，所以它同時扮演氧化劑與還原劑！`
            };
        },
        () => {
            return {
                type: 'multiple_choice',
                question: `【進階悖論】將 pH = 6 的稀鹽酸加水稀釋 1000 倍，請問最終溶液的 pH 值最接近下列何者？`,
                options: ["6.9", "9", "8", "3"].sort(() => Math.random() - 0.5),
                correctAnswer: "6.9",
                svg: `<svg width="250" height="150" viewBox="0 0 250 150">
                        <line x1="40" y1="120" x2="210" y2="120" stroke="black" stroke-width="2" />
                        <line x1="40" y1="120" x2="40" y2="20" stroke="black" stroke-width="2" />
                        <text x="25" y="30" font-size="12">pH</text>
                        <text x="220" y="130" font-size="12">加水</text>
                        <line x1="35" y1="50" x2="210" y2="50" stroke="var(--success)" stroke-width="1" stroke-dasharray="4,4" />
                        <text x="20" y="55" font-size="12" fill="var(--success)">7</text>
                        <path d="M 40 100 Q 100 55 200 52" fill="none" stroke="var(--danger)" stroke-width="3" />
                        <text x="55" y="110" font-size="12" fill="var(--danger)">pH=6</text>
                        <text x="170" y="40" font-size="12" fill="var(--danger)">無限逼近7</text>
                      </svg>`,
                explanation: `這是一個極限悖論題。酸性溶液不論如何稀釋，其 pH 值只能「無限逼近 7」而不會變成鹼性 (大於7)。<br>因為水本身也會解離出 10⁻⁷M 的 H⁺，所以稀釋到最後主要是水的解離在主導。`
            };
        },
        () => {
            return {
                type: 'multiple_choice',
                question: `【進階】以 0.1M 的氫氧化鈉標準液滴定未知濃度的鹽酸溶液。若以酚酞為指示劑，當達到滴定終點時，錐形瓶內的溶液顏色變化為何？`,
                options: ["無色變微粉紅色", "紅色變無色", "黃色變藍色", "無色變藍色"].sort(() => Math.random() - 0.5),
                correctAnswer: "無色變微粉紅色",
                svg: `<svg width="200" height="180" viewBox="0 0 200 180">
                        <rect x="95" y="10" width="10" height="60" fill="rgba(59,130,246,0.1)" stroke="black" stroke-width="2" />
                        <text x="130" y="40" font-size="12" fill="var(--primary-color)">NaOH</text>
                        <path d="M 100 70 L 100 85" stroke="var(--primary-color)" stroke-width="2" stroke-dasharray="2,2" />
                        <polygon points="80,150 120,150 105,90 95,90" fill="rgba(236,72,153,0.3)" stroke="black" stroke-width="2" />
                        <text x="140" y="130" font-size="12" fill="var(--danger)">微粉紅</text>
                        <text x="60" y="130" font-size="12">HCl + 酚酞</text>
                      </svg>`,
                explanation: `錐形瓶內裝的是鹽酸(酸性)，酚酞在酸性中呈無色。<br>當滴加 NaOH 至剛好中和且稍微過量時，溶液微鹼性，酚酞會瞬間轉為微粉紅色且不褪色。`
            };
        },
        () => {
            return {
                type: 'drag_drop_sort',
                question: `【資優排序題】請將下列「利用標準氫氧化鈉滴定未知濃度鹽酸溶液」的實驗步驟依序排列：`,
                correctOrder: ["1", "2", "3", "4"],
                items: [
                    { id: "1", text: "將未知濃度的鹽酸溶液取定量放入錐形瓶中。" },
                    { id: "2", text: "在錐形瓶中滴入 2~3 滴酚酞指示劑 (此時溶液呈無色)。" },
                    { id: "3", text: "將標準氫氧化鈉裝入滴定管中，緩慢滴入錐形瓶，並不斷搖晃。" },
                    { id: "4", text: "當錐形瓶內溶液變為微粉紅色且不褪色時，關閉滴定管，記錄消耗體積。" }
                ].sort(() => Math.random() - 0.5),
                svg: `<svg width="200" height="150" viewBox="0 0 200 150">
                        <rect x="95" y="10" width="10" height="60" fill="rgba(59,130,246,0.1)" stroke="black" stroke-width="2" />
                        <polygon points="80,140 120,140 105,80 95,80" fill="rgba(255,255,255,0.8)" stroke="black" stroke-width="2" />
                        <path d="M 100 70 L 100 85" stroke="var(--primary-color)" stroke-width="2" stroke-dasharray="2,2" />
                        <text x="130" y="50" font-size="12">標準液</text>
                        <text x="135" y="120" font-size="12">未知液</text>
                      </svg>`,
                explanation: `正確順序：先準備被滴定液(錐形瓶) → 加入指示劑 → 用滴定管滴入滴定液 → 觀察變色(無色變微粉紅)即達終點。`
            };
        }
    ]
};
