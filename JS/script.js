const board = document.getElementById('grid-container');
const template = document.getElementById('card-template');
const scoreElement = document.querySelector('#score');
const timerElement = document.querySelector('#timer');
const streakElement = document.querySelector('#streak');
const btnStart = document.getElementById('btn-start');
const btnReset = document.getElementById('btn-reset');

const BASE_EMOJIS = ['🃏', '💎', '🔥', '🎲', '⚡', '🌙', '🚀', '🍄'];
const deckValues = [...BASE_EMOJIS, ...BASE_EMOJIS];
const numberOfPair = deckValues.length / 2;

const gameState = {
    pair: [],
    matchedPair: 0,
    isLocked: false,
    score: 0,
    streak: 0,
    timerInterval: null,
    startTime: null,
};

function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function startTimer() {
    gameState.startTime = Date.now();
    gameState.timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - gameState.startTime) / 1000);
        const mins = String(Math.floor(elapsed / 60)).padStart(2, '0');
        const secs = String(elapsed % 60).padStart(2, '0');
        timerElement.textContent = `${mins}:${secs}`;
    }, 1000);
}

function stopTimer() {
    clearInterval(gameState.timerInterval);
}

function updateStreakDisplay(hasGained) {
    streakElement.textContent = `x${Math.max(1, gameState.streak)}`;

    const scale = hasGained ? 1.35 : 0.85;
    streakElement.style.transform = `scale(${scale})`;
    setTimeout(() => {
        streakElement.style.transform = 'scale(1)';
    }, 200);
}

function createCard(value, id) {
    const clone = template.content.cloneNode(true);
    const button = clone.querySelector('.card');
    const backFace = clone.querySelector('.card-back');

    backFace.textContent = value;
    button.dataset.value = value;
    button.dataset.id = id;

    button.addEventListener('click', () => onCardClick(button));
    return clone;
}

function renderBoard() {
    board.innerHTML = '';
    const shuffled = shuffle(deckValues);
    shuffled.forEach((val, idx) => {
        board.appendChild(createCard(val, idx));
    });
}

function onCardClick(cardElement) {
    if (gameState.isLocked || gameState.pair.includes(cardElement)) return;

    cardElement.classList.add('is-flipped');
    gameState.pair.push(cardElement);

    if (gameState.pair.length === 2) {
        checkMatch();
    }
}

function checkMatch() {
    gameState.isLocked = true;
    const [c1, c2] = gameState.pair;

    if (c1.dataset.value === c2.dataset.value) {
        c1.style.pointerEvents = 'none';
        c2.style.pointerEvents = 'none';

        gameState.matchedPair++;
        gameState.streak++;
        updateStreakDisplay(true);

        const pointsWon = 10 * gameState.streak;
        gameState.score += pointsWon;
        animateScoreJuicy(scoreElement, gameState.score);

        gameState.pair = [];
        gameState.isLocked = false;

        if (gameState.matchedPair === numberOfPair) {
            stopTimer();
            setTimeout(() => {
                const bonusClear = 100 * Math.max(1, gameState.streak);
                gameState.score += bonusClear;
                animateScoreJuicy(scoreElement, gameState.score);
            }, 600);
        }
    } else {
        gameState.streak = 0;
        updateStreakDisplay(false);

        setTimeout(() => {
            c1.classList.remove('is-flipped');
            c2.classList.remove('is-flipped');
            gameState.pair = [];
            gameState.isLocked = false;
        }, 900);
    }
}

// Boutons
btnStart.addEventListener('click', () => {
    btnStart.disabled = true;
    gameState.streak = 0;
    updateStreakDisplay(false);
    renderBoard();
    startTimer();
});

btnReset.addEventListener('click', () => {
    window.location.reload();
});

function easeOutQuad(x) {
    return 1 - (1 - x) * (1 - x);
}

function animateScoreJuicy(element, target, duration = 300) {
    const start = parseInt(element.textContent.replace(/\s/g, ''), 10) || 0;
    const startTime = performance.now();
    const diff = Math.max(0, target - start);
    const baseGain = 10;

    const intensity = Math.min(Math.log10(Math.max(diff, 1) / baseGain + 1) + 0.7, 3);
    const maxScaleBonus = 0.25 * intensity;
    const maxRotation = 6 * intensity;
    const direction = Math.random() > 0.5 ? 1 : -1;

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const currentVal = Math.round(start + diff * easeOutQuad(progress));
        element.textContent = currentVal.toLocaleString('fr-FR');

        const scale = 1 + Math.sin(progress * Math.PI) * maxScaleBonus;
        const rotation = Math.sin(progress * Math.PI * 2) * maxRotation * (1 - progress) * direction;
        element.style.transform = `scale(${scale}) rotate(${rotation}deg)`;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target.toLocaleString('fr-FR');
            element.style.transform = 'scale(1) rotate(0deg)';
        }
    }

    requestAnimationFrame(update);
}