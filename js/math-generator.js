function renderMathPreview() {
    const html = `
        <h2 style="color: var(--primary-color); margin-bottom: 1.5rem;"><i class="fa-solid fa-book"></i> 數學觀念預習 (資優特訓 30/30/40 分級)</h2>
        
        <h3 style="margin-top: 2rem; color: #22c55e; border-bottom: 2px solid #22c55e; padding-bottom: 0.5rem;">🟢 基礎觀念 (30%)</h3>
        
        <!-- 單元 1: 三角形內外角基本定理 -->
        <div class="card" style="border-left: 5px solid #22c55e;">
            <h2 class="card-title">1. 三角形內外角基本定理</h2>
            <div class="interactive-box" style="display: flex; gap: 2rem; align-items: center;">
                <div style="flex: 0 0 200px; background: white; border-radius: 8px; padding: 10px; text-align: center;">
                    <svg width="200" height="150" viewBox="0 0 200 150">
                        <polygon points="50,120 150,120 100,40" fill="rgba(34,197,94,0.1)" stroke="#22c55e" stroke-width="2"/>
                        <line x1="150" y1="120" x2="190" y2="120" stroke="black" stroke-width="2"/>
                        <path d="M 100 60 A 20 20 0 0 1 110 50" fill="none" stroke="red" stroke-width="2"/>
                        <text x="95" y="75" font-size="12" fill="red">∠A</text>
                        <text x="65" y="115" font-size="12" fill="blue">∠B</text>
                        <text x="125" y="115" font-size="12" fill="green">∠C</text>
                        <path d="M 150 120 L 165 120 A 15 15 0 0 0 160 105" fill="none" stroke="purple" stroke-width="2"/>
                        <text x="165" y="105" font-size="12" fill="purple">外角</text>
                    </svg>
                </div>
                <div style="flex: 1;">
                    <ul style="line-height: 1.8;">
                        <li>📐 <strong>內角和定理：</strong> ∠A + ∠B + ∠C = 180°</li>
                        <li>📐 <strong>外角定理：</strong> 任一外角等於其兩個內對角的和 (外角 = ∠A + ∠B)。</li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- 單元 2: 認識五大全等性質 -->
        <div class="card" style="border-left: 5px solid #22c55e;">
            <h2 class="card-title">2. 認識五大全等性質</h2>
            <div class="interactive-box" style="display: flex; gap: 2rem; align-items: center;">
                <div style="flex: 0 0 250px; background: white; border-radius: 8px; padding: 10px; text-align: center;">
                    <svg width="250" height="100" viewBox="0 0 250 100">
                        <!-- Triangle 1 -->
                        <polygon points="20,80 100,80 60,20" fill="rgba(34,197,94,0.1)" stroke="#22c55e" stroke-width="2"/>
                        <line x1="40" y1="50" x2="45" y2="45" stroke="red" stroke-width="2"/>
                        <line x1="60" y1="85" x2="60" y2="75" stroke="red" stroke-width="2"/>
                        <path d="M 35 70 A 15 15 0 0 0 45 80" fill="none" stroke="red" stroke-width="2"/>
                        <!-- Triangle 2 -->
                        <polygon points="140,80 220,80 180,20" fill="rgba(34,197,94,0.1)" stroke="#22c55e" stroke-width="2"/>
                        <line x1="160" y1="50" x2="165" y2="45" stroke="red" stroke-width="2"/>
                        <line x1="180" y1="85" x2="180" y2="75" stroke="red" stroke-width="2"/>
                        <path d="M 155 70 A 15 15 0 0 0 165 80" fill="none" stroke="red" stroke-width="2"/>
                        <text x="125" y="60" font-size="14" font-weight="bold">≅</text>
                    </svg>
                    <p style="font-size: 0.9rem; color: #666; margin-top: 5px;">(示意圖：SAS 全等)</p>
                </div>
                <div style="flex: 1;">
                    <p>要證明兩個三角形全等，必須滿足以下五種條件之一：</p>
                    <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 1rem;">
                        <span style="background: #f0fdf4; padding: 0.5rem 1rem; border-radius: 20px;"><strong>SSS</strong> (三邊等)</span>
                        <span style="background: #f0fdf4; padding: 0.5rem 1rem; border-radius: 20px;"><strong>SAS</strong> (兩邊夾一角等)</span>
                        <span style="background: #f0fdf4; padding: 0.5rem 1rem; border-radius: 20px;"><strong>ASA</strong> (兩角夾一邊等)</span>
                        <span style="background: #f0fdf4; padding: 0.5rem 1rem; border-radius: 20px;"><strong>AAS</strong> (兩角對一邊等)</span>
                        <span style="background: #f0fdf4; padding: 0.5rem 1rem; border-radius: 20px;"><strong>RHS</strong> (直角、斜邊、一股等)</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- 單元 3: 平行線與截角 -->
        <div class="card" style="border-left: 5px solid #22c55e;">
            <h2 class="card-title">3. 平行線與截角</h2>
            <div class="interactive-box" style="display: flex; gap: 2rem; align-items: center;">
                <div style="flex: 0 0 200px; background: white; border-radius: 8px; padding: 10px; text-align: center;">
                    <svg width="200" height="150" viewBox="0 0 200 150">
                        <line x1="20" y1="40" x2="180" y2="40" stroke="black" stroke-width="2"/>
                        <line x1="20" y1="100" x2="180" y2="100" stroke="black" stroke-width="2"/>
                        <line x1="60" y1="10" x2="140" y2="140" stroke="blue" stroke-width="2"/>
                        <text x="185" y="45" font-size="12">L₁</text>
                        <text x="185" y="105" font-size="12">L₂</text>
                        <text x="95" y="35" font-size="12" fill="red">∠1</text>
                        <text x="55" y="60" font-size="12" fill="red">∠2</text>
                        <text x="125" y="90" font-size="12" fill="green">∠3</text>
                        <text x="90" y="90" font-size="12" fill="green">∠4</text>
                    </svg>
                </div>
                <div style="flex: 1;">
                    <p>當 L₁ // L₂ 且被一直線所截時：</p>
                    <ul style="line-height: 1.8;">
                        <li><strong>同位角相等</strong>：位置相同的角角度一樣 (例: ∠1 = ∠3)。</li>
                        <li><strong>內錯角相等</strong>：Z 字型的內角一樣 (例: ∠2 = ∠3)。</li>
                        <li><strong>同側內角互補</strong>：同一側的內角相加為 180° (例: ∠2 + ∠4 = 180°)。</li>
                    </ul>
                </div>
            </div>
        </div>

        <h3 style="margin-top: 2rem; color: #eab308; border-bottom: 2px solid #eab308; padding-bottom: 0.5rem;">🟡 中等段考題型 (30%)</h3>

        <!-- 單元 4: 中垂線與角平分線性質 -->
        <div class="card" style="border-left: 5px solid #eab308;">
            <h2 class="card-title">4. 中垂線與角平分線性質</h2>
            <div class="interactive-box" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div style="background: white; padding: 1rem; border-radius: 8px; border-left: 4px solid var(--primary-color); display: flex; flex-direction: column; align-items: center;">
                    <h4>中垂線性質</h4>
                    <svg width="150" height="100" viewBox="0 0 150 100" style="margin: 10px 0;">
                        <line x1="30" y1="70" x2="120" y2="70" stroke="black" stroke-width="2"/>
                        <line x1="75" y1="20" x2="75" y2="90" stroke="blue" stroke-width="2" stroke-dasharray="5,5"/>
                        <circle cx="75" cy="30" r="3" fill="red"/>
                        <line x1="75" y1="30" x2="30" y2="70" stroke="red" stroke-width="1"/>
                        <line x1="75" y1="30" x2="120" y2="70" stroke="red" stroke-width="1"/>
                        <text x="20" y="85" font-size="12">A</text>
                        <text x="120" y="85" font-size="12">B</text>
                        <text x="80" y="25" font-size="12" fill="red">P</text>
                    </svg>
                    <p>中垂線上任一點 P，到線段<strong>兩端點 A, B</strong> 等距離 (PA = PB)。</p>
                </div>
                <div style="background: white; padding: 1rem; border-radius: 8px; border-left: 4px solid var(--accent-color); display: flex; flex-direction: column; align-items: center;">
                    <h4>角平分線性質</h4>
                    <svg width="150" height="100" viewBox="0 0 150 100" style="margin: 10px 0;">
                        <line x1="20" y1="80" x2="130" y2="80" stroke="black" stroke-width="2"/>
                        <line x1="20" y1="80" x2="100" y2="20" stroke="black" stroke-width="2"/>
                        <line x1="20" y1="80" x2="120" y2="40" stroke="blue" stroke-width="2" stroke-dasharray="5,5"/>
                        <circle cx="95" cy="50" r="3" fill="red"/>
                        <line x1="95" y1="50" x2="70" y2="42" stroke="red" stroke-width="1"/>
                        <line x1="95" y1="50" x2="95" y2="80" stroke="red" stroke-width="1"/>
                    </svg>
                    <p>角平分線上任一點，到角的<strong>兩邊</strong>垂直距離相等。</p>
                </div>
            </div>
        </div>

        <!-- 單元 5: 鋸齒狀平行線 -->
        <div class="card" style="border-left: 5px solid #eab308;">
            <h2 class="card-title">5. 鋸齒狀平行線 (閃電角)</h2>
            <div class="interactive-box" style="display: flex; gap: 2rem; align-items: center; background: #fefce8;">
                <div style="flex: 0 0 250px; background: white; border-radius: 8px; padding: 10px; text-align: center;">
                    <svg width="250" height="120" viewBox="0 0 250 120">
                        <line x1="20" y1="20" x2="230" y2="20" stroke="black" stroke-width="2"/>
                        <line x1="20" y1="100" x2="230" y2="100" stroke="black" stroke-width="2"/>
                        <polyline points="60,20 140,60 80,100" fill="none" stroke="var(--primary-color)" stroke-width="3"/>
                        <line x1="20" y1="60" x2="230" y2="60" stroke="var(--danger)" stroke-width="2" stroke-dasharray="5,5"/>
                        <text x="235" y="25">L₁</text>
                        <text x="235" y="105">L₂</text>
                        <text x="235" y="65" fill="var(--danger)">輔助線</text>
                        <text x="75" y="35" font-size="12">∠1</text>
                        <text x="115" y="65" font-size="12">∠2</text>
                        <text x="95" y="90" font-size="12">∠3</text>
                    </svg>
                </div>
                <div style="flex: 1;">
                    <h3 style="margin-bottom: 1rem; color: var(--text-main);">核心口訣：向左的角總和 = 向右的角總和</h3>
                    <p>遇到折線時，只要在轉折處畫出平行 L₁ 與 L₂ 的輔助線，就能利用「內錯角相等」推導出此結論。以左圖為例，開口向右的角 = 開口向左的角，即 <strong>∠1 + ∠3 = ∠2</strong>。</p>
                </div>
            </div>
        </div>

        <!-- 單元 6: 多邊形內外角逆推算 -->
        <div class="card" style="border-left: 5px solid #eab308;">
            <h2 class="card-title">6. 多邊形內外角逆推算</h2>
            <div class="interactive-box" style="display: flex; gap: 2rem; align-items: center;">
                <div style="flex: 0 0 150px; background: white; border-radius: 8px; padding: 10px; text-align: center;">
                    <svg width="150" height="150" viewBox="0 0 150 150">
                        <polygon points="75,20 130,60 110,120 40,120 20,60" fill="rgba(234,179,8,0.2)" stroke="#eab308" stroke-width="2"/>
                        <line x1="75" y1="20" x2="110" y2="120" stroke="blue" stroke-width="1" stroke-dasharray="5,5"/>
                        <line x1="75" y1="20" x2="40" y2="120" stroke="blue" stroke-width="1" stroke-dasharray="5,5"/>
                        <text x="50" y="80" font-size="16">1</text>
                        <text x="75" y="100" font-size="16">2</text>
                        <text x="100" y="80" font-size="16">3</text>
                    </svg>
                    <p style="font-size: 0.9rem; color: #666; margin-top: 5px;">(五邊形被切為 3 個三角形)</p>
                </div>
                <div style="flex: 1;">
                    <ul style="line-height: 1.8;">
                        <li><strong>內角和公式：</strong> (N - 2) × 180°</li>
                        <li><strong>外角和：</strong> 永遠是 360° (凸多邊形)</li>
                        <li><strong>正 N 邊形單一內角：</strong> (N - 2) × 180° / N</li>
                        <li><strong>正 N 邊形單一外角：</strong> 360° / N</li>
                    </ul>
                </div>
            </div>
        </div>

        <h3 style="margin-top: 2rem; color: #ef4444; border-bottom: 2px solid #ef4444; padding-bottom: 0.5rem;">🔴 資優進階挑戰 (40%)</h3>

        <!-- 單元 7: 極限角度追蹤 -->
        <div class="card" style="border-left: 5px solid #ef4444;">
            <h2 class="card-title">7. 極限角度追蹤與星形角</h2>
            <div class="interactive-box" style="display: flex; flex-direction: column; gap: 1rem; background: #fef2f2;">
                <p>💡 <strong>出題原理與資優解法：</strong></p>
                
                <div style="display: flex; gap: 1rem; align-items: center;">
                    <div style="flex: 0 0 200px; background: white; border-radius: 8px; padding: 10px; text-align: center;">
                        <svg width="200" height="150" viewBox="0 0 200 150">
                            <!-- 連鎖等腰 SVG -->
                            <line x1="20" y1="130" x2="180" y2="130" stroke="black" stroke-width="2"/>
                            <line x1="20" y1="130" x2="180" y2="50" stroke="black" stroke-width="2"/>
                            <polyline points="20,130 70,105 100,130 140,75 160,130" fill="none" stroke="blue" stroke-width="2"/>
                            <!-- 等長記號 -->
                            <line x1="42" y1="112" x2="48" y2="122" stroke="red" stroke-width="2"/>
                            <line x1="82" y1="112" x2="88" y2="122" stroke="red" stroke-width="2"/>
                            <line x1="117" y1="97" x2="123" y2="107" stroke="red" stroke-width="2"/>
                            <line x1="147" y1="97" x2="153" y2="107" stroke="red" stroke-width="2"/>
                            
                            <!-- 角度標示 -->
                            <path d="M 40 130 A 20 20 0 0 0 38 121" fill="none" stroke="red"/>
                            <text x="45" y="125" font-size="12" fill="red">x</text>
                            
                            <path d="M 85 130 A 15 15 0 0 1 83 115" fill="none" stroke="red"/>
                            <text x="70" y="125" font-size="12" fill="red">x</text>

                            <path d="M 85 105 A 15 15 0 0 0 78 116" fill="none" stroke="red"/>
                            <text x="88" y="112" font-size="12" fill="red">2x</text>

                            <path d="M 115 130 A 15 15 0 0 1 110 115" fill="none" stroke="red"/>
                            <text x="105" y="125" font-size="12" fill="red">3x</text>

                            <path d="M 155 75 A 15 15 0 0 0 145 85" fill="none" stroke="red"/>
                            <text x="150" y="70" font-size="12" fill="red">4x</text>
                        </svg>
                        <div style="font-size:0.8rem; margin-top:5px; color: #666;">連鎖等腰角推導</div>
                    </div>
                    <div style="flex: 1;">
                        <strong>1. 連鎖等腰三角形：</strong> 常見考題會在一大三角形內，畫出連續的等長線段構造多個等腰三角形。解題關鍵是「將最小的底角設為 x」，利用『外角定理』，角度會以 x, 2x, 3x, 4x 的規律向外遞增，最後利用大內角和解方程式。
                    </div>
                </div>

                <div style="display: flex; gap: 1rem; align-items: center;">
                    <div style="flex: 0 0 200px; background: white; border-radius: 8px; padding: 10px; text-align: center;">
                        <svg width="200" height="150" viewBox="0 0 200 150">
                            <!-- 多芒星 SVG (正七邊形跳2點) -->
                            <!-- 背景正七邊形 -->
                            <polygon points="100,20 147,43 158,93 126,134 74,134 42,93 53,43" fill="none" stroke="#e5e7eb" stroke-width="2" stroke-dasharray="4,4"/>
                            <!-- 跳步指示 -->
                            <path d="M 100 20 Q 125 20 147 43" fill="none" stroke="blue" stroke-width="1.5" stroke-dasharray="3,3" marker-end="url(#arrow)"/>
                            <path d="M 147 43 Q 160 70 158 93" fill="none" stroke="blue" stroke-width="1.5" stroke-dasharray="3,3" marker-end="url(#arrow)"/>
                            <text x="145" y="30" font-size="10" fill="blue">跳 k=2</text>
                            
                            <!-- 7芒星 (正確連接順序) -->
                            <polygon points="100,20 158,93 74,134 53,43 147,43 126,134 42,93" fill="rgba(239,68,68,0.1)" stroke="#ef4444" stroke-width="2"/>
                            
                            <!-- 7個頂角標示 -->
                            <text x="92" y="15" font-size="12" fill="red">∠1</text>
                            <text x="150" y="40" font-size="12" fill="red">∠2</text>
                            <text x="162" y="98" font-size="12" fill="red">∠3</text>
                            <text x="125" y="148" font-size="12" fill="red">∠4</text>
                            <text x="55" y="148" font-size="12" fill="red">∠5</text>
                            <text x="22" y="98" font-size="12" fill="red">∠6</text>
                            <text x="32" y="40" font-size="12" fill="red">∠7</text>
                            
                            <!-- Arrow marker def -->
                            <defs>
                                <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto">
                                    <path d="M 0 0 L 10 5 L 0 10 z" fill="blue" />
                                </marker>
                            </defs>
                        </svg>
                        <div style="font-size:0.8rem; margin-top:5px; color: #666;">多芒星頂角和</div>
                    </div>
                    <div style="flex: 1;">
                        <strong>2. 多芒星頂角和：</strong> 若為正 n 芒星 (跳 k 個頂點連線)，其頂角和公式為 <strong>(n - 2k) × 180°</strong>。五芒星跳 2 點連線，頂角和恆為 (5 - 4) × 180° = 180°。
                    </div>
                </div>
            </div>
        </div>

        <!-- 單元 8: 幾何摺紙的對稱與畢氏定理 -->
        <div class="card" style="border-left: 5px solid #ef4444;">
            <h2 class="card-title">8. 幾何摺紙的對稱與畢氏定理</h2>
            <div class="interactive-box" style="display: flex; flex-direction: column; gap: 1rem;">
                <p>💡 <strong>出題原理與資優解法：</strong></p>
                
                <div style="display: flex; gap: 1rem; align-items: center;">
                    <div style="flex: 0 0 200px; background: white; border-radius: 8px; padding: 10px; text-align: center;">
                        <svg width="200" height="150" viewBox="0 0 200 150">
                            <!-- 原始紙張虛線 -->
                            <rect x="20" y="30" width="160" height="60" fill="none" stroke="gray" stroke-dasharray="5,5"/>
                            <!-- 摺線 EF -->
                            <line x1="140" y1="30" x2="80" y2="90" stroke="blue" stroke-width="2"/>
                            <!-- 重疊的等腰三角形 EFG -->
                            <polygon points="140,30 80,90 80,30" fill="rgba(239,68,68,0.2)" stroke="red" stroke-width="2"/>
                            
                            <!-- 角1 (原角) -->
                            <path d="M 100 90 A 20 20 0 0 0 94.1 75.9" fill="none" stroke="black"/>
                            <text x="105" y="85" font-size="12">∠1</text>
                            
                            <!-- 角2 (摺疊角) -->
                            <path d="M 80 70 A 20 20 0 0 1 94.1 75.9" fill="none" stroke="black"/>
                            <text x="82" y="75" font-size="12">∠2</text>
                            
                            <!-- 角3 (內錯角) -->
                            <path d="M 120 30 A 20 20 0 0 0 125.9 44.1" fill="none" stroke="black"/>
                            <text x="110" y="45" font-size="12">∠3</text>
                            
                            <text x="25" y="130" font-size="11" fill="red">∠1=∠2(摺疊對稱)，∠1=∠3(內錯角)</text>
                            <text x="25" y="145" font-size="11" fill="red">推得 ∠2=∠3 ➜ 紅色為等腰△</text>
                        </svg>
                        <div style="font-size:0.8rem; margin-top:5px; color: #666;">發現隱藏等腰</div>
                    </div>
                    <div style="flex: 1;">
                        <strong>1. 發現隱藏等腰：</strong> 摺痕即為「對稱軸」，因此 ∠摺疊角(∠1) = ∠原角(∠2)。又因長方形上下平行，產生內錯角相等(∠2=∠3)。推導出底角相等(∠1=∠3)，所以<strong>重疊的區域必定是「等腰三角形」</strong>。
                    </div>
                </div>

                <div style="display: flex; gap: 1rem; align-items: center;">
                    <div style="flex: 0 0 200px; background: white; border-radius: 8px; padding: 10px; text-align: center;">
                        <svg width="200" height="150" viewBox="0 0 200 150">
                            <polygon points="60,20 60,100 140,100" fill="rgba(59,130,246,0.2)" stroke="blue" stroke-width="2"/>
                            <text x="45" y="65" font-size="12">8</text>
                            <text x="90" y="115" font-size="12">10-x</text>
                            <text x="105" y="55" font-size="12" fill="red">x</text>
                            <text x="65" y="140" font-size="12" fill="black">x² = 8² + (10-x)²</text>
                        </svg>
                        <div style="font-size:0.8rem; margin-top:5px; color: #666;">畢氏定理代數化</div>
                    </div>
                    <div style="flex: 1;">
                        <strong>2. 畢氏定理代數化：</strong> 資優題必考摺痕長度。解題技巧是<strong>「善用未知數 x」</strong>。將某邊長設為 x，另一邊為 (總長 - x)，套入直角三角形的畢氏定理 (x² = a² + b²) 來解方程式，這是結合代數與幾何的經典題型。
                    </div>
                </div>
            </div>
        </div>

        <!-- 單元 9: 正方形斜靠與旋轉構造 -->
        <div class="card" style="border-left: 5px solid #ef4444;">
            <h2 class="card-title">9. 正方形斜靠與旋轉構造 (魔王題)</h2>
            <p>當正方形斜靠在牆角時，會產生兩個「全等的直角三角形」。</p>
            <div class="interactive-box" style="display: flex; gap: 2rem; align-items: center; background: white; border: 2px solid #e2e8f0; border-radius: 8px; padding: 1.5rem;">
                <div style="flex: 0 0 250px; position: relative; height: 250px;">
                    <svg width="100%" height="100%" viewBox="0 0 250 250">
                        <line x1="20" y1="20" x2="20" y2="230" stroke="#94a3b8" stroke-width="4"/>
                        <line x1="20" y1="230" x2="230" y2="230" stroke="#94a3b8" stroke-width="4"/>
                        <polygon points="20,130 100,230 200,150 120,50" fill="rgba(236, 72, 153, 0.2)" stroke="var(--accent-color)" stroke-width="3"/>
                        <polygon points="20,230 100,230 20,130" fill="rgba(99, 102, 241, 0.3)" stroke="var(--primary-color)" stroke-width="2"/>
                        <polygon points="20,130 120,50 20,50" fill="rgba(99, 102, 241, 0.3)" stroke="var(--primary-color)" stroke-width="2"/>
                        <text x="25" y="145" font-weight="bold">A</text>
                        <text x="95" y="245" font-weight="bold">B</text>
                        <text x="205" y="160" font-weight="bold">C</text>
                        <text x="125" y="45" font-weight="bold">D</text>
                        <text x="5" y="245" font-weight="bold">O</text>
                        <text x="5" y="45" font-weight="bold">E</text>
                    </svg>
                </div>
                <div style="flex: 1;">
                    <h3 style="margin-bottom: 1rem; color: var(--danger);">解題關鍵：找出 AAS 全等</h3>
                    <ul style="list-style-type: decimal; line-height: 1.8; padding-left: 1.5rem;">
                        <li>因為四邊形 ABCD 是正方形，所以 <span style="text-decoration: overline">AB</span> = <span style="text-decoration: overline">AD</span> 且 ∠DAB = 90°。</li>
                        <li>觀察平角：∠EAD + ∠DAB + ∠OAB = 180°</li>
                        <li>得到 ∠EAD + ∠OAB = 90°</li>
                        <li>在直角 △AOB 中，∠ABO + ∠OAB = 90°</li>
                        <li>推導出 <strong>∠EAD = ∠ABO</strong></li>
                        <li>因此 △AED ≅ △BOA (AAS 全等)。</li>
                        <li><strong>結論：水平長度 = 垂直高度！</strong> <span style="text-decoration: overline">OB</span> = <span style="text-decoration: overline">EA</span> 且 <span style="text-decoration: overline">OA</span> = <span style="text-decoration: overline">ED</span>。</li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- 單元 10: 平移截線與對稱輔助線 -->
        <div class="card" style="border-left: 5px solid #ef4444;">
            <h2 class="card-title">10. 平移截線與對稱輔助線</h2>
            <div class="interactive-box" style="display: flex; flex-direction: column; gap: 1rem;">
                <p>💡 <strong>出題原理與資優輔助線畫法：</strong>資優圖形往往「殘缺不全」，需要主動繪製「輔助線」：</p>
                
                <div style="display: flex; gap: 1rem; align-items: center;">
                    <div style="flex: 0 0 200px; background: white; border-radius: 8px; padding: 10px; text-align: center;">
                        <svg width="200" height="120" viewBox="0 0 200 120">
                            <polygon points="50,20 110,20 150,90 30,90" fill="none" stroke="black" stroke-width="2"/>
                            <line x1="50" y1="20" x2="150" y2="90" stroke="blue" stroke-width="2"/>
                            <line x1="110" y1="20" x2="30" y2="90" stroke="green" stroke-width="2"/>
                            <!-- translated -->
                            <line x1="110" y1="20" x2="210" y2="90" stroke="green" stroke-width="2" stroke-dasharray="5,5"/>
                            <line x1="150" y1="90" x2="210" y2="90" stroke="blue" stroke-width="2" stroke-dasharray="5,5"/>
                        </svg>
                        <div style="font-size:0.8rem; margin-top:5px; color: #666;">平移對角線</div>
                    </div>
                    <div style="flex: 1;">
                        <strong>1. 平移對角線 (梯形必殺技)：</strong> 考題給定梯形兩對角線長度時，將一條對角線「平移」至圖形外部交會。這能構造出一個「底邊 = 上底+下底」的大三角形與平行四邊形，將分散的邊長集中求解。
                    </div>
                </div>

                <div style="display: flex; gap: 1rem; align-items: center;">
                    <div style="flex: 0 0 200px; background: white; border-radius: 8px; padding: 10px; text-align: center;">
                        <svg width="200" height="120" viewBox="0 0 200 120">
                            <polygon points="20,100 160,100 80,20" fill="none" stroke="black" stroke-width="2"/>
                            <line x1="80" y1="20" x2="100" y2="100" stroke="blue" stroke-width="2"/>
                            <line x1="100" y1="100" x2="120" y2="55" stroke="red" stroke-width="2" stroke-dasharray="5,5"/>
                            <text x="130" y="65" font-size="12" fill="red">翻摺 SAS</text>
                        </svg>
                        <div style="font-size:0.8rem; margin-top:5px; color: #666;">角平分線投射</div>
                    </div>
                    <div style="flex: 1;">
                        <strong>2. 角平分線投射：</strong> 遇到角平分線且給定兩邊長度差時，將較短的邊沿著角平分線「翻摺」，構造出 SAS 全等三角形，將不等式轉為線段相減。
                    </div>
                </div>

                <div style="display: flex; gap: 1rem; align-items: center;">
                    <div style="flex: 0 0 200px; background: white; border-radius: 8px; padding: 10px; text-align: center;">
                        <svg width="200" height="120" viewBox="0 0 200 120">
                            <polygon points="60,20 20,70 120,70" fill="none" stroke="black" stroke-width="2"/>
                            <line x1="60" y1="20" x2="70" y2="70" stroke="blue" stroke-width="2"/>
                            <line x1="70" y1="70" x2="80" y2="120" stroke="red" stroke-width="2" stroke-dasharray="5,5"/>
                            <line x1="20" y1="70" x2="80" y2="120" stroke="red" stroke-width="1" stroke-dasharray="5,5"/>
                            <line x1="120" y1="70" x2="80" y2="120" stroke="red" stroke-width="1" stroke-dasharray="5,5"/>
                        </svg>
                        <div style="font-size:0.8rem; margin-top:5px; color: #666;">兩倍中線延長</div>
                    </div>
                    <div style="flex: 1;">
                        <strong>3. 兩倍中線延長：</strong> 看到中線，直接將其延長一倍，構造出對角線互相平分的「平行四邊形」，秒殺中線長度範圍題。
                    </div>
                </div>
            </div>
        </div>
    `;
    document.getElementById('content-area').innerHTML = html;
}

// === 數學統一題型庫 (30/30/40) ===
window.mathQuestionPool = {
    basic: [
        () => {
            const sides = Math.floor(Math.random() * 8) + 5;
            return {
                type: 'multiple_choice',
                question: `【基礎】已知一個正 ${sides} 邊形，請問其內角總和為多少度？`,
                options: [`${(sides-2)*180}`, `${sides*180}`, `${(sides-1)*180}`, "360"].sort(() => Math.random() - 0.5),
                correctAnswer: `${(sides-2)*180}`,
                svg: `<svg width="150" height="150" viewBox="0 0 150 150">
                        <polygon points="75,10 135,45 115,115 35,115 15,45" fill="none" stroke="var(--primary-color)" stroke-width="3" />
                        <text x="75" y="75" font-size="24" text-anchor="middle" dominant-baseline="middle" fill="var(--text-main)">n=${sides}</text>
                      </svg>`,
                explanation: `正 n 邊形的內角和公式為 (n - 2) × 180°。<br>在此題中 n = ${sides}，所以內角和 = (${sides} - 2) × 180° = ${(sides-2)*180}°。`
            };
        },
        () => {
            return {
                type: 'multiple_choice',
                question: `【基礎】若 ∠A 與 ∠B 互為互補角，且 ∠A = 70°，請問 ∠B 為多少度？`,
                options: ["110°", "20°", "90°", "180°"].sort(() => Math.random() - 0.5),
                correctAnswer: "110°",
                svg: `<svg width="200" height="120" viewBox="0 0 200 120">
                        <line x1="20" y1="100" x2="180" y2="100" stroke="black" stroke-width="3" />
                        <line x1="100" y1="100" x2="140" y2="30" stroke="var(--danger)" stroke-width="3" />
                        <path d="M 100 100 L 120 100 A 20 20 0 0 0 115 80" fill="none" stroke="var(--primary-color)" stroke-width="2" />
                        <text x="130" y="90" font-size="14" fill="var(--primary-color)">70°</text>
                        <path d="M 80 100 A 20 20 0 0 1 110 60" fill="none" stroke="var(--danger)" stroke-width="2" />
                        <text x="70" y="80" font-size="14" fill="var(--danger)">∠B = ?</text>
                      </svg>`,
                explanation: `互補角的定義為兩角相加為 180°。<br>因此 ∠B = 180° - 70° = 110°。`
            };
        },
        () => {
            return {
                type: 'multiple_choice',
                question: `【基礎】兩平行線被一直線所截，若其中一個同位角為 65°，則其對應的內錯角應為多少度？`,
                options: ["65°", "115°", "25°", "90°"].sort(() => Math.random() - 0.5),
                correctAnswer: "65°",
                svg: `<svg width="200" height="150" viewBox="0 0 200 150">
                        <line x1="20" y1="50" x2="180" y2="50" stroke="black" stroke-width="3" />
                        <line x1="20" y1="100" x2="180" y2="100" stroke="black" stroke-width="3" />
                        <line x1="130" y1="20" x2="70" y2="130" stroke="var(--warning)" stroke-width="3" />
                        <path d="M 115 50 A 20 20 0 0 1 125 30" fill="none" stroke="var(--primary-color)" stroke-width="2" />
                        <text x="130" y="45" font-size="14" fill="var(--primary-color)">65°</text>
                        <path d="M 90 100 A 20 20 0 0 0 80 120" fill="none" stroke="var(--danger)" stroke-width="2" />
                        <text x="50" y="115" font-size="14" fill="var(--danger)">∠x = ?</text>
                      </svg>`,
                explanation: `平行線性質：同位角相等，內錯角也相等。<br>同位角為 65°，則該截線所對應的內錯角也必然是 65°。`
            };
        }
    ],
    medium: [
        () => {
            const ext = Math.floor(Math.random() * 5 + 2) * 10; 
            const n = 360 / ext;
            return {
                type: 'multiple_choice',
                question: `【中等】若一個正多邊形的一個外角為 ${ext}°，請問此多邊形為正幾邊形？`,
                options: [`${n}`, `${n+2}`, `${n-1}`, `${n*2}`].sort(() => Math.random() - 0.5),
                correctAnswer: `${n}`,
                svg: `<svg width="180" height="150" viewBox="0 0 180 150">
                        <polygon points="60,30 120,30 150,80 120,130 60,130 30,80" fill="rgba(59,130,246,0.1)" stroke="black" stroke-width="2" />
                        <line x1="120" y1="130" x2="160" y2="130" stroke="black" stroke-width="2" stroke-dasharray="4,4" />
                        <path d="M 140 130 A 20 20 0 0 0 135 105" fill="none" stroke="var(--danger)" stroke-width="2" />
                        <text x="145" y="115" font-size="14" fill="var(--danger)">${ext}°</text>
                      </svg>`,
                explanation: `任何正多邊形的外角和皆為 360°。<br>正 n 邊形的每個外角 = 360° ÷ n。<br>n = 360° ÷ ${ext}° = ${n}。`
            };
        },
        () => {
            return {
                type: 'multiple_choice',
                question: `【中等】若一等腰三角形的頂角為 40°，請問其一底角的外角為多少度？`,
                options: ["110°", "70°", "140°", "100°"].sort(() => Math.random() - 0.5),
                correctAnswer: "110°",
                svg: `<svg width="200" height="150" viewBox="0 0 200 150">
                        <polygon points="100,20 40,110 160,110" fill="rgba(245,158,11,0.1)" stroke="black" stroke-width="2" />
                        <line x1="160" y1="110" x2="190" y2="110" stroke="black" stroke-width="2" stroke-dasharray="4,4" />
                        <text x="100" y="45" font-size="14" text-anchor="middle" fill="black">40°</text>
                        <path d="M 175 110 A 15 15 0 0 0 145 85" fill="none" stroke="var(--danger)" stroke-width="2" />
                        <text x="165" y="90" font-size="14" fill="var(--danger)">x=?</text>
                        <line x1="65" y1="65" x2="75" y2="65" stroke="black" stroke-width="2"/>
                        <line x1="125" y1="65" x2="135" y2="65" stroke="black" stroke-width="2"/>
                      </svg>`,
                explanation: `等腰三角形內角和 180°，底角 = (180° - 40°) ÷ 2 = 70°。<br>底角的外角 = 180° - 70° = 110°。`
            };
        },
        () => {
            const v = Math.floor(Math.random() * 5) + 3;
            return {
                type: 'multiple_choice',
                question: `【中等】在一個閃電截角圖形中，已知兩平行線間有向左的角分別為 30°、40°、${v*10}°，向右的角有 50° 與 ∠x。若閃電折線並未交叉，請問 ∠x 為多少？`,
                options: [`${30+40+v*10-50}°`, `${30+40+v*10+50}°`, `${180-(30+40+v*10)}°`, "無法計算"].sort(() => Math.random() - 0.5),
                correctAnswer: `${30+40+v*10-50}°`,
                svg: `<svg width="200" height="180" viewBox="0 0 200 180">
                        <line x1="20" y1="20" x2="180" y2="20" stroke="black" stroke-width="2" />
                        <line x1="20" y1="160" x2="180" y2="160" stroke="black" stroke-width="2" />
                        <polyline points="100,20 140,60 80,100 130,130 70,160" fill="none" stroke="var(--primary-color)" stroke-width="3" />
                        <text x="150" y="60" font-size="12" fill="var(--danger)">向左</text>
                        <text x="50" y="100" font-size="12" fill="var(--warning)">向右</text>
                        <text x="140" y="130" font-size="12" fill="var(--danger)">向左</text>
                      </svg>`,
                explanation: `閃電角原理：向左的角總和 = 向右的角總和。<br>30° + 40° + ${v*10}° = 50° + ∠x<br>∠x = ${30+40+v*10}° - 50° = ${30+40+v*10-50}°。`
            };
        }
    ],
    advanced: [
        () => {
            return {
                type: 'multiple_choice',
                question: `【進階】已知梯形 ABCD 中，上底 AD = 4，下底 BC = 10，兩對角線 AC = 13，BD = 15。請問此梯形的面積為多少？`,
                options: ["84", "96", "42", "105"].sort(() => Math.random() - 0.5),
                correctAnswer: "84",
                svg: `<svg width="200" height="150" viewBox="0 0 200 150">
                        <polygon points="60,30 110,30 160,110 30,110" fill="rgba(236,72,153,0.1)" stroke="black" stroke-width="2" />
                        <line x1="60" y1="30" x2="160" y2="110" stroke="var(--primary-color)" stroke-width="2" />
                        <line x1="110" y1="30" x2="30" y2="110" stroke="var(--danger)" stroke-width="2" />
                        <text x="85" y="20" font-size="12">4</text>
                        <text x="95" y="125" font-size="12">10</text>
                        <text x="120" y="60" font-size="12" fill="var(--primary-color)">15</text>
                        <text x="50" y="60" font-size="12" fill="var(--danger)">13</text>
                      </svg>`,
                explanation: `【平移對角線法】將對角線 BD 平移至 CE，構造出大三角形 ACE。<br>底邊 AE = AD + BC = 14。三角形 ACE 三邊長為 13, 14, 15。<br>利用海龍公式或高 (h=12) 算出大三角形面積為 84，梯形面積即等於該大三角形面積！`
            };
        },
        () => {
            return {
                type: 'multiple_choice',
                question: `【進階】將一長方形紙條摺疊，已知摺疊後重疊部分的三角形為等腰三角形。若原紙條寬度為 8，重疊三角形的面積為 40，請問重疊等腰三角形的「底邊」長度為多少？`,
                options: ["10", "8√2", "16", "12"].sort(() => Math.random() - 0.5),
                correctAnswer: "10",
                svg: `<svg width="200" height="120" viewBox="0 0 200 120">
                        <polygon points="20,20 180,20 180,80 20,80" fill="none" stroke="black" stroke-width="2" />
                        <polygon points="60,20 140,20 60,80" fill="rgba(239,68,68,0.2)" stroke="var(--danger)" stroke-width="2" />
                        <line x1="60" y1="20" x2="140" y2="80" stroke="var(--danger)" stroke-width="2" stroke-dasharray="4,4" />
                        <text x="30" y="55" font-size="12">寬=8</text>
                        <text x="80" y="45" font-size="12" fill="var(--danger)">面積=40</text>
                        <text x="100" y="15" font-size="12">底邊=?</text>
                      </svg>`,
                explanation: `重疊部分為等腰三角形，其高即為長方形紙條寬度 8。<br>面積 40 = (底邊 × 8) ÷ 2，推得底邊 = 10。<br>由於等腰三角形由對稱與內錯角構成，其腰與底邊的關係常能透過畢氏定理解出。`
            };
        },
        () => {
            return {
                type: 'multiple_choice',
                question: `【進階】正方形 ABCD 中，一直線 L 通過 A 點。若 B 點到 L 的距離為 3，D 點到 L 的距離為 4，請問正方形的邊長為多少？`,
                options: ["5", "7", "25", "√7"].sort(() => Math.random() - 0.5),
                correctAnswer: "5",
                svg: `<svg width="200" height="150" viewBox="0 0 200 150">
                        <line x1="20" y1="120" x2="180" y2="40" stroke="black" stroke-width="2" />
                        <polygon points="100,80 130,20 190,50 160,110" fill="rgba(16,185,129,0.1)" stroke="var(--success)" stroke-width="2" />
                        <line x1="130" y1="20" x2="110" y2="75" stroke="var(--primary-color)" stroke-width="2" stroke-dasharray="3,3" />
                        <line x1="160" y1="110" x2="140" y2="60" stroke="var(--danger)" stroke-width="2" stroke-dasharray="3,3" />
                        <text x="115" y="45" font-size="12" fill="var(--primary-color)">3</text>
                        <text x="155" y="85" font-size="12" fill="var(--danger)">4</text>
                        <text x="100" y="95" font-size="12">A</text>
                        <text x="175" y="120" font-size="12">直線 L</text>
                      </svg>`,
                explanation: `【正方形斜靠 AAS 全等】<br>由 B、D 分別向 L 作垂線交於 E、F。<br>可證明 △ABE ≅ △DAF (AAS 全等)。<br>因此 AE = DF = 4。在直角 △ABE 中，兩股為 3、4，故斜邊 AB (正方形邊長) = 5。`
            };
        },
        () => {
            return {
                type: 'drag_drop_sort',
                question: `【資優排序題】請將下列「利用延長中線一倍，證明三角形中線長度範圍」的輔助線步驟依序排列：<br>(目標：證明中線 AD 滿足 AD < (AB+AC)/2)`,
                correctOrder: ["1", "2", "3", "4"],
                items: [
                    { id: "1", text: "畫出 △ABC 以及中線 AD (BD = CD)。" },
                    { id: "2", text: "將 AD 延長一倍至 E，使得 AD = DE，並連接 BE、CE。" },
                    { id: "3", text: "由於對角線互相平分 (BD=CD, AD=DE)，四邊形 ABEC 為平行四邊形。" },
                    { id: "4", text: "利用平行四邊形對邊相等 (CE=AB)，在 △ACE 中由三角不等式得出 AE < AC + CE，即 2AD < AC + AB。" }
                ].sort(() => Math.random() - 0.5),
                svg: `<svg width="200" height="160" viewBox="0 0 200 160">
                        <polygon points="100,20 40,80 140,80" fill="none" stroke="black" stroke-width="2" />
                        <line x1="100" y1="20" x2="90" y2="80" stroke="var(--primary-color)" stroke-width="2" />
                        <line x1="90" y1="80" x2="80" y2="140" stroke="var(--danger)" stroke-width="2" stroke-dasharray="4,4" />
                        <line x1="40" y1="80" x2="80" y2="140" stroke="gray" stroke-width="1" stroke-dasharray="4,4" />
                        <line x1="140" y1="80" x2="80" y2="140" stroke="gray" stroke-width="1" stroke-dasharray="4,4" />
                        <text x="100" y="15" font-size="12">A</text>
                        <text x="95" y="75" font-size="12">D</text>
                        <text x="75" y="155" font-size="12">E</text>
                        <text x="30" y="85" font-size="12">B</text>
                        <text x="150" y="85" font-size="12">C</text>
                      </svg>`,
                explanation: `正確順序：先畫中線 → 延長一倍構造平行四邊形 → 利用對角線平分證明平行四邊形 → 代換邊長並利用三角不等式得出結論。`
            };
        }
    ]
};
