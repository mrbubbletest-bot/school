// State management
const state = {
    subject: 'math', // 'math' or 'science'
    mode: 'preview', // 'preview' or 'quiz'
};

// DOM Elements
const subjectBtns = document.querySelectorAll('.nav-btn');
const modeBtns = document.querySelectorAll('.mode-btn');
const contentArea = document.getElementById('content-area');

// Event Listeners
subjectBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Update UI
        subjectBtns.forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        
        // Update State
        state.subject = e.currentTarget.dataset.subject;
        
        // Render
        renderContent();
    });
});

modeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Update UI
        modeBtns.forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        
        // Update State
        state.mode = e.currentTarget.dataset.mode;
        
        // Render
        renderContent();
    });
});

// Render logic
window.renderContent = function() {
    contentArea.style.opacity = '0';
    
    setTimeout(() => {
        contentArea.innerHTML = ''; // Clear current content
        if (state.subject === 'math') {
            if (state.mode === 'preview') {
                renderMathPreview();
            } else if (state.mode === 'quiz') {
                renderUnifiedQuizSetup('math');
            }
        } else if (state.subject === 'science') {
            if (state.mode === 'preview') {
                renderSciencePreview();
            } else if (state.mode === 'quiz') {
                renderUnifiedQuizSetup('science');
            }
        }
        contentArea.style.opacity = '1';
        contentArea.style.transition = 'opacity 0.3s ease';
    }, 150);
};

// Initial Render Delay
setTimeout(() => {
    renderContent();
}, 1000);
