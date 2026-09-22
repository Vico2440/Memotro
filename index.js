console.log('Happy developing ✨')

const card = document.querySelector('.card');

const board = document.getElementById('grid-container');
const template = document.getElementById('card-template');
const deckValues = ['A', 'A', 'K', 'K', 'Q', 'Q', 'J', 'J'];

function createCard(value, id){
    const clone = template.content.cloneNode(true);

    const button = clone.querySelector('.card');
    const backFace = clone.querySelector('.card-back');

    backFace.textContent = value;
    button.dataset.value = value;
    button.dataset.id = id;

    button.addEventListener('click', () =>{
        button.classList.toggle('is-flipped');
    });

    return clone;

}

deckValues.forEach((val, index) => {
    const cardElement = createCard(val, index);
    board.appendChild(cardElement);
});



