const board = document.getElementById('grid-container');
const template = document.getElementById('card-template');
const scoreElement = document.querySelector('#score');

const BASE_EMOJIS = ['🃏', '💎', '🔥', '🎲', '⚡', '🌙', '🚀', '🍄'];
const deckValues = [...BASE_EMOJIS, ...BASE_EMOJIS];
const numberOfPair = deckValues.length / 2; // 8 paires

const gameState = {
    pair: [],
    life: 3,
    matchedPair: 0,
    isLocked: false,
    score: 0,
};

function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
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

function onCardClick(cardElement) {
    if (gameState.isLocked || gameState.pair.includes(cardElement)) return;

    flipCard(cardElement);
    gameState.pair.push(cardElement);

    if (gameState.pair.length === 2) {
        checkMatch();
    }
}

function checkMatch() {
    gameState.isLocked = true;
    const [c1, c2] = gameState.pair;

    if (c1.dataset.value === c2.dataset.value) {
        gameState.pair = [];
        gameState.isLocked = false;
        gameState.matchedPair++;
        gameState.score += 10;
        animateScoreJuicy(scoreElement, gameState.score);
    } else {
        setTimeout(() => {
            unflipCard(c1);
            unflipCard(c2);
            gameState.pair = [];
            gameState.isLocked = false;
        }, 1000);
    }

    if (gameState.matchedPair === numberOfPair) {
        setTimeout(() => {
            gameState.score += 100;
            animateScoreJuicy(scoreElement, gameState.score);
            startNewRound();
        }, 1000);
    }
}

function flipCard(cardElement) {
    cardElement.classList.add('is-flipped');
}

function unflipCard(cardElement) {
    cardElement.classList.remove('is-flipped');
}

function renderBoard(cards) {
    board.innerHTML = '';
    cards.forEach((val, index) => {
        const cardElement = createCard(val, index);
        board.appendChild(cardElement);
    });
}

function startNewRound() {
    gameState.pair = [];
    gameState.isLocked = false;
    gameState.matchedPair = 0;

    const shuffledDeck = shuffle(deckValues);
    renderBoard(shuffledDeck);
}

startNewRound();

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