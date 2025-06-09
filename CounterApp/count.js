// count.js

// Utility Functions
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
};

const attachEvents = (card) => {
    const valueEl = card.querySelector('.counter-value');
    const stepInput = card.querySelector('.step-input');

    const getStep = () => parseInt(stepInput.value) || 1;

    card.querySelector('.increment').onclick = () => {
        valueEl.textContent = parseInt(valueEl.textContent) + getStep();
        updateStats();
    };

    card.querySelector('.decrement').onclick = () => {
        valueEl.textContent = parseInt(valueEl.textContent) - getStep();
        updateStats();
    };

    card.querySelector('.reset').onclick = () => {
        valueEl.textContent = 0;
        updateStats();
    };

    card.querySelector('.delete-btn').onclick = () => {
        card.remove();
        updateStats();
    };

    card.querySelector('.auto-toggle').onclick = (e) => {
        e.target.classList.toggle('active');
    };

    card.querySelectorAll('.theme-dot').forEach(dot => {
        dot.onclick = () => {
            card.classList.remove('blue', 'green', 'purple', 'red');
            card.classList.add(dot.classList[1]);
        };
    });
};

// Initial Setup

document.querySelectorAll('.counter-card').forEach(attachEvents);
updateStats();

// Add Counter Button
const addCounterBtn = document.querySelector('.btn-primary');
addCounterBtn.onclick = createCounterCard;

// Reset All
document.querySelector('.btn:nth-child(4)').onclick = () => {
    document.querySelectorAll('.counter-card .counter-value').forEach(val => val.textContent = 0);
    updateStats();
};

// Placeholder: Undo/Redo (for future)
document.querySelector('.btn:nth-child(2)').onclick = () => alert('Undo feature not implemented.');
document.querySelector('.btn:nth-child(3)').onclick = () => alert('Redo feature not implemented.');

// Dark Mode Toggle
const darkToggle = document.querySelector('.dark-toggle');
darkToggle.onclick = () => {
    document.body.classList.toggle('dark');
};
