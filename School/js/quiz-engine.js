let currentQuiz = [];
let currentQuestionIndex = 0;
let score = 0;

window.renderUnifiedQuizSetup = function(subjectId) {
    const subjectName = subjectId === 'math' ? '數學' : '理化';
    const html = `
        <div class="quiz-setup-card">
            <div style="display: flex; justify-content: center; gap: 1rem; margin-bottom: 1.5rem;">
                <span style="background: #dcfce7; color: #166534; padding: 0.5rem 1rem; border-radius: 20px; font-weight: bold; font-size: 0.9rem;">基礎 30%</span>
                <span style="background: #fef9c3; color: #854d0e; padding: 0.5rem 1rem; border-radius: 20px; font-weight: bold; font-size: 0.9rem;">中等 30%</span>
                <span style="background: #fee2e2; color: #991b1b; padding: 0.5rem 1rem; border-radius: 20px; font-weight: bold; font-size: 0.9rem;">進階 40%</span>
            </div>
            <i class="fa-solid fa-ranking-star" style="font-size: 4rem; color: var(--primary-color); margin-bottom: 1rem;"></i>
            <h2 style="color: var(--text-main); margin-bottom: 0.5rem;">${subjectName} 🏆 30/30/40 全真模擬測驗</h2>
            <p style="color: var(--text-muted); margin-bottom: 2rem;">系統將根據「國二下 - 二段」範圍，為您自動生成 10 題保證不重複的題型，包含 3 題基礎、3 題中等與 4 題資優魔王題！</p>
            
            <button class="btn-primary" onclick="startUnifiedQuiz('${subjectId}')" style="width: 100%; font-size: 1.2rem; padding: 1.2rem; background: linear-gradient(135deg, var(--primary-color), var(--accent-color));">
                開始挑戰 100 分 <i class="fa-solid fa-rocket" style="margin-left: 0.5rem;"></i>
            </button>
        </div>
    `;
    document.getElementById('content-area').innerHTML = html;
}

// 輔助函數：從陣列中隨機取出 n 個不重複元素
function getRandomItems(arr, n) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
}

window.startUnifiedQuiz = function(subjectId) {
    currentQuiz = [];
    const pool = subjectId === 'math' ? window.mathQuestionPool : window.scienceQuestionPool;
    
    // 嚴格抽取：3題基礎, 3題中等, 4題進階
    const basicQuestions = getRandomItems(pool.basic, 3).map(fn => fn());
    const mediumQuestions = getRandomItems(pool.medium, 3).map(fn => fn());
    const advancedQuestions = getRandomItems(pool.advanced, 4).map(fn => fn());
    
    currentQuiz = [...basicQuestions, ...mediumQuestions, ...advancedQuestions];
    
    currentQuestionIndex = 0;
    score = 0;
    renderQuestion();
};

function renderQuestion() {
    if (currentQuestionIndex >= currentQuiz.length) {
        renderQuizResult();
        return;
    }
    
    const q = currentQuiz[currentQuestionIndex];
    let contentHtml = '';
    
    // Inject SVG if exists
    let svgHtml = '';
    if (q.svg) {
        svgHtml = `
            <div class="svg-container">
                ${q.svg}
            </div>
        `;
    }
    
    if (q.type === 'drag_drop_sort') {
        let sortItems = '';
        q.items.forEach(item => {
            sortItems += `<div class="sort-item" draggable="true" data-id="${item.id}">
                <i class="fa-solid fa-grip-lines" style="color: #cbd5e1; margin-right: 1rem;"></i>
                ${item.text}
            </div>`;
        });
        
        contentHtml = `
            <div class="drag-drop-container" id="sort-container">
                <p style="color: var(--warning); margin-bottom: 1rem; font-weight: bold;"><i class="fa-solid fa-hand-pointer"></i> 請上下拖曳項目，排列出正確的推導順序：</p>
                ${sortItems}
            </div>
            <button class="btn-primary" id="submit-sort-btn" style="margin-top: 1rem; width: 100%;">送出排序 <i class="fa-solid fa-check"></i></button>
        `;
    } else {
        let optionsHtml = '';
        (q.options || []).forEach(opt => {
            optionsHtml += `<div class="quiz-option" data-value="${opt}">${opt}</div>`;
        });
        contentHtml = `<div class="quiz-options" id="options-container">${optionsHtml}</div>`;
    }
    
    const html = `
        <div class="card quiz-question-card">
            <div style="display: flex; justify-content: space-between; margin-bottom: 1.5rem; color: var(--text-muted); font-weight: bold;">
                <span>第 ${currentQuestionIndex + 1} / ${currentQuiz.length} 題</span>
                <span>得分：${score}</span>
            </div>
            
            <h3 style="font-size: 1.4rem; line-height: 1.6; margin-bottom: 1.5rem; color: var(--text-main);">
                ${q.question}
            </h3>
            
            ${svgHtml}
            
            ${contentHtml}
            
            <div class="explanation" id="explanation-box">
                <h4 style="color: #d97706; margin-bottom: 0.5rem;"><i class="fa-solid fa-lightbulb"></i> 解析</h4>
                <div style="line-height: 1.6;">${q.explanation}</div>
            </div>
            
            <div style="margin-top: 2rem; text-align: right;">
                <button class="btn-primary" id="next-btn" style="display: none;">
                    下一題 <i class="fa-solid fa-arrow-right"></i>
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('content-area').innerHTML = html;
    
    const explanationBox = document.getElementById('explanation-box');
    const nextBtn = document.getElementById('next-btn');
    let answered = false;
    
    if (q.type === 'drag_drop_sort') {
        const container = document.getElementById('sort-container');
        const items = container.querySelectorAll('.sort-item');
        let draggedItem = null;
        
        items.forEach(item => {
            item.addEventListener('dragstart', function() {
                if(answered) return;
                draggedItem = this;
                setTimeout(() => this.style.opacity = '0.5', 0);
            });
            item.addEventListener('dragend', function() {
                if(answered) return;
                setTimeout(() => this.style.opacity = '1', 0);
                draggedItem = null;
            });
            item.addEventListener('dragover', function(e) {
                if(answered) return;
                e.preventDefault();
            });
            item.addEventListener('drop', function(e) {
                if(answered) return;
                if (this !== draggedItem) {
                    let allItems = [...container.querySelectorAll('.sort-item')];
                    let draggedIdx = allItems.indexOf(draggedItem);
                    let targetIdx = allItems.indexOf(this);
                    if (draggedIdx < targetIdx) {
                        this.parentNode.insertBefore(draggedItem, this.nextSibling);
                    } else {
                        this.parentNode.insertBefore(draggedItem, this);
                    }
                }
            });
        });
        
        document.getElementById('submit-sort-btn').addEventListener('click', function() {
            if(answered) return;
            answered = true;
            this.style.display = 'none';
            
            let currentOrder = [...container.querySelectorAll('.sort-item')].map(el => el.getAttribute('data-id'));
            let isCorrect = JSON.stringify(currentOrder) === JSON.stringify(q.correctOrder);
            
            if(isCorrect) {
                container.style.border = "2px solid var(--success)";
                score += 10;
            } else {
                container.style.border = "2px solid var(--danger)";
            }
            
            explanationBox.classList.add('show');
            nextBtn.style.display = 'inline-block';
        });
        
    } else {
        const options = document.querySelectorAll('.quiz-option');
        options.forEach(opt => {
            opt.addEventListener('click', function() {
                if (answered) return; 
                answered = true;
                
                const selectedValue = this.getAttribute('data-value');
                const isCorrect = selectedValue === q.correctAnswer;
                
                if (isCorrect) {
                    this.classList.add('correct');
                    score += 10; 
                } else {
                    this.classList.add('wrong');
                    options.forEach(o => {
                        if (o.getAttribute('data-value') === q.correctAnswer) {
                            o.classList.add('correct');
                        }
                    });
                }
                
                explanationBox.classList.add('show');
                nextBtn.style.display = 'inline-block';
            });
        });
    }
    
    nextBtn.addEventListener('click', () => {
        currentQuestionIndex++;
        renderQuestion();
    });
}

function renderQuizResult() {
    let message = "";
    let icon = "";
    
    if (score === 100) {
        message = "太神啦！全部答對，基礎非常紮實！";
        icon = "fa-trophy";
    } else if (score >= 60) {
        message = "表現不錯，繼續保持，針對錯題多加練習！";
        icon = "fa-thumbs-up";
    } else {
        message = "不要氣餒，回到「觀念預習」再複習一次吧！";
        icon = "fa-book";
    }
    
    const html = `
        <div class="quiz-setup-card">
            <i class="fa-solid ${icon}" style="font-size: 5rem; color: var(--warning); margin-bottom: 1.5rem;"></i>
            <h2 style="font-size: 3rem; color: var(--primary-color); margin-bottom: 1rem;">${score} 分</h2>
            <p style="font-size: 1.2rem; color: var(--text-main); margin-bottom: 2rem;">${message}</p>
            
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button class="btn-primary" onclick="renderContent()" style="background: var(--text-muted);">
                    返回模式選擇
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('content-area').innerHTML = html;
}
