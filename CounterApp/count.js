// counterverse.js

// State
let historyStack = [];
let redoStack = [];
const autoIntervals = new Map();

// Utility: Update Stats
const updateStats = () => {
    const counters = document.querySelectorAll('.counter-card');
    const values = [...counters].map(card => parseInt(card.querySelector('.counter-value').textContent) || 0);
    const total = values.length;
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = total ? (sum / total).toFixed(1) : 0;
    const high = Math.max(...values, 0);

    const [totalEl, sumEl, avgEl, highEl] = document.querySelectorAll('.stat-value');
    totalEl.textContent = total;
    sumEl.textContent = sum;
    avgEl.textContent = avg;
    highEl.textContent = high;
};

// Core: Save and Restore State
const saveState = () => {
    const data = Array.from(document.querySelectorAll('.counter-card')).map(card => ({
        title: card.querySelector('.counter-title').value,
        value: parseInt(card.querySelector('.counter-value').textContent),
        step: parseInt(card.querySelector('.step-input').value),
        theme: [...card.classList].find(cls => ['blue', 'green', 'purple', 'red'].includes(cls)),
        auto: card.querySelector('.auto-toggle').classList.contains('active')
    }));

    const serialized = JSON.stringify(data);
    historyStack.push(serialized);
    localStorage.setItem('counterverse-data', serialized);
};

const restoreState = (serialized) => {
    document.querySelector('.counters-grid').innerHTML = '';
    const parsed = JSON.parse(serialized);

    parsed.forEach(data => {
        const card = document.createElement('div');
        card.className = `counter-card ${data.theme || ''}`;
        card.innerHTML = `
            <div class="counter-header">
                <input type="text" class="counter-title" value="${data.title}">
                <button class="delete-btn">×</button>
            </div>
            <div class="counter-display">
                <div class="counter-value">${data.value}</div>
            </div>
            <div class="counter-controls">
                <button class="counter-btn decrement">−</button>
                <button class="counter-btn reset">Reset</button>
                <button class="counter-btn increment">+</button>
            </div>
            <div class="counter-options">
                <div>
                    <label>Step:</label>
                    <input type="number" class="step-input" value="${data.step}" min="1">
                </div>
                <button class="auto-toggle ${data.auto ? 'active' : ''}">Auto Mode</button>
                <div class="theme-picker">
                    <div class="theme-dot blue"></div>
                    <div class="theme-dot green"></div>
                    <div class="theme-dot purple"></div>
                    <div class="theme-dot red"></div>
                </div>
            </div>
        `;
        document.querySelector('.counters-grid').appendChild(card);
        attachEvents(card);
        if (data.auto) {
            enableAuto(card);
        }
    });

    updateStats();
};

// Card Creation & Events
const createCounterCard = () => {
    const card = document.createElement('div');
    card.classList.add('counter-card');
    card.innerHTML = `
        <div class="counter-header">
            <input type="text" class="counter-title" placeholder="Counter name">
            <button class="delete-btn">×</button>
        </div>
        <div class="counter-display">
            <div class="counter-value">0</div>
        </div>
        <div class="counter-controls">
            <button class="counter-btn decrement">−</button>
            <button class="counter-btn reset">Reset</button>
            <button class="counter-btn increment">+</button>
        </div>
        <div class="counter-options">
            <div>
                <label>Step:</label>
                <input type="number" class="step-input" value="1" min="1">
            </div>
            <button class="auto-toggle">Auto Mode</button>
            <div class="theme-picker">
                <div class="theme-dot blue"></div>
                <div class="theme-dot green"></div>
                <div class="theme-dot purple"></div>
                <div class="theme-dot red"></div>
            </div>
        </div>
    `;
    attachEvents(card);
    document.querySelector('.counters-grid').appendChild(card);
    updateStats();
    saveState();
};

const attachEvents = (card) => {
    const valueEl = card.querySelector('.counter-value');
    const stepInput = card.querySelector('.step-input');

    const getStep = () => parseInt(stepInput.value, 10) || 1;

    card.querySelector('.increment').onclick = () => {
        valueEl.textContent = parseInt(valueEl.textContent, 10) + getStep();
        updateStats(); saveState();
    };

    card.querySelector('.decrement').onclick = () => {
        valueEl.textContent = parseInt(valueEl.textContent, 10) - getStep();
        updateStats(); saveState();
    };

    card.querySelector('.reset').onclick = () => {
        valueEl.textContent = 0;
        updateStats(); saveState();
    };

    card.querySelector('.delete-btn').onclick = () => {
        card.remove();
        updateStats(); saveState();
    };

    card.querySelector('.auto-toggle').onclick = (e) => {
        const isActive = e.target.classList.toggle('active');
        isActive ? enableAuto(card) : disableAuto(card);
        saveState();
    };

    card.querySelectorAll('.theme-dot').forEach(dot => {
        dot.onclick = () => {
            card.classList.remove('blue', 'green', 'purple', 'red');
            card.classList.add(dot.classList[1]); // applies the theme class
            saveState();
        };
    });
};

const enableAuto = (card) => {
    const valueEl = card.querySelector('.counter-value');
    const getStep = () => parseInt(card.querySelector('.step-input').value, 10) || 1;

    const id = setInterval(() => {
        valueEl.textContent = parseInt(valueEl.textContent, 10) + getStep();
        updateStats();
        saveState();
    }, 1000);
    autoIntervals.set(card, id);
};

const disableAuto = (card) => {
    clearInterval(autoIntervals.get(card));
    autoIntervals.delete(card);
};

// Undo / Redo
const undo = () => {
    if (historyStack.length > 1) {
        const last = historyStack.pop();
        redoStack.push(last);
        restoreState(historyStack[historyStack.length - 1]);
    }
};

const redo = () => {
    if (redoStack.length > 0) {
        const next = redoStack.pop();
        historyStack.push(next);
        restoreState(next);
    }
};

// App Init
window.addEventListener('load', () => {
    const stored = localStorage.getItem('counterverse-data');
    if (stored) {
        restoreState(stored);
        historyStack.push(stored);
    } else {
        saveState(); // initialize empty state
    }
    document.querySelectorAll('.counter-card').forEach(attachEvents);
    updateStats();
});

// Buttons
document.querySelector('.btn-primary').onclick = createCounterCard;
document.querySelector('.btn:nth-child(2)').onclick = undo;
document.querySelector('.btn:nth-child(3)').onclick = redo;
document.querySelector('.btn:nth-child(4)').onclick = () => {
    document.querySelectorAll('.counter-card .counter-value').forEach(val => val.textContent = 0);
    updateStats(); saveState();
};
document.querySelector('.dark-toggle').onclick = () => {
    document.body.classList.toggle('dark');
};
