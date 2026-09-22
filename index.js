console.log('Happy developing ✨');

const board = document.getElementById('grid-container');
const template = document.getElementById('card-template');

const deckValues = ['🃏', '🃏', '💎', '💎', '🔥', '🔥', '🎲', '🎲'].sort(() => Math.random() - 0.5);
const numberOfPair = deckValues.length / 2;

const gameState = {
    pair: [],
    life: 3,
    matchedPair: 0,
    isLocked: false,
};

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
        gameState.matchedPair ++;
    } else {
        setTimeout(() => {
            unflipCard(c1);
            unflipCard(c2);
            gameState.pair = [];
            gameState.isLocked = false;
        }, 1000);
    }

    if(gameState.matchedPair === numberOfPair)
    {
        setTimeout(() => {
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

deckValues.forEach((val, index) => {
    const cardElement = createCard(val, index);
    board.appendChild(cardElement);
});

function startNewRound() {
    board.innerHTML = '';
    gameState.pair = [];
    gameState.isLocked = false;
    gameState.matchedPairs = 0;

    const deck = deckValues.sort(() => Math.random() - 0.5);

    deck.forEach((val, index) => {
        const cardElement = createCard(val, index);
        board.appendChild(cardElement);
    });
}