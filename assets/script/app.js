'use strict';

import { onEvent, select, selectAll, create, print } from "./utils.js";

import { Score } from "./Score.js";

const words = [
    'dinosaur', 'love', 'pineapple', 'calendar', 'robot', 'building',
    'population', 'weather', 'bottle', 'history', 'dream', 'character', 'money',
    'absolute', 'discipline', 'machine', 'accurate', 'connection', 'rainbow',
    'bicycle', 'eclipse', 'calculator', 'trouble', 'watermelon', 'developer',
    'philosophy', 'database', 'periodic', 'capitalism', 'abominable',
    'component', 'future', 'pasta', 'microwave', 'jungle', 'wallet', 'canada',
    'coffee', 'beauty', 'agency', 'chocolate', 'eleven', 'technology', 'promise',
    'alphabet', 'knowledge', 'magician', 'professor', 'triangle', 'earthquake',
    'baseball', 'beyond', 'evolution', 'banana', 'perfume', 'computer',
    'management', 'discovery', 'ambition', 'music', 'eagle', 'crown', 'chess',
    'laptop', 'bedroom', 'delivery', 'enemy', 'button', 'superman', 'library',
    'unboxing', 'bookstore', 'language', 'homework', 'fantastic', 'economy',
    'interview', 'awesome', 'challenge', 'science', 'mystery', 'famous',
    'league', 'memory', 'leather', 'planet', 'software', 'update', 'yellow',
    'keyboard', 'window', 'beans', 'truck', 'sheep', 'band', 'level', 'hope',
    'download', 'blue', 'actor', 'desk', 'watch', 'giraffe', 'brazil', 'mask',
    'audio', 'school', 'detective', 'hero', 'progress', 'winter', 'passion',
    'rebel', 'amber', 'jacket', 'article', 'paradox', 'social', 'resort', 'escape'
];

const sound = new Audio('./assets/audio/game-sound.mp3');
sound.type = 'audio/mp3';

const soundTwo = new Audio('./assets/audio/right.mp3');
soundTwo.type = 'audio/mp3';

const scores = [];

const start = select('.start');
const time = select('.time');
const hits = select('.hits span');
const myWord = select('.my-word');
const input = select('.input');
const result = select('.result');
const background = select('.background');
const resultContent = select('.result h1');
const restart = select('.restart');
const scoreBtn = select('.score-btn');

const SECOND_IN_MILLISECONDS = 1000;

let seconds = 10;
let hitNum = 0;

time.innerText = `${seconds}`;

function continuePlaying() {
    if (sound.paused) {
        sound.play();
    }
}

onEvent('load', window, () => {
    input.value = '';
    restart.classList.add('hidden');
    result.classList.add('hidden');
    input.setAttribute('disabled', '');
});

function updateTime() {
    seconds--;
    time.innerText = `${seconds}`;
    continuePlaying();
}

function randomIndex(length) { 
    return Math.floor(Math.random() * length);
}

let copy = [...words];

function addNewWord() {
    let index = randomIndex(copy.length);
    myWord.innerText = `${copy[index]}`;
    copy.splice(index, 1);
}

function removeHidden() {
    restart.classList.remove('hidden');
    start.classList.add('hidden');
}

let checkTime;

onEvent('click', start, () => {
    input.removeAttribute('disabled', '');
    input.focus();
    sound.play();
    checkTime = setInterval(updateTime, SECOND_IN_MILLISECONDS);
    addNewWord();
    removeHidden();
});

function wordHit() {
    gameOver();
    let userWord = input.value;
        if (userWord.toLowerCase().trim() === myWord.innerText) {
        if (userWord !== '' && myWord.innerText !== '') {
            soundTwo.play();
            hitNum++;
            hits.innerText = hitNum;
            input.value = '';
            addNewWord();
        }
    }
}

let checkInput = setInterval(wordHit, 1);

function removeGameOver() {
    resultContent.innerText = 'Game Over';
    result.classList.remove('hidden');
    background.classList.add('bg-blur');
}

let score;
let date;
let percentage;

function setScoreObj() {
    score = hitNum;
    date = new Date().toDateString();
    percentage = Math.round(((score / words.length)) * 100) ;
    scores.push({
        'score': score,
        'date': date,
        'percentage': percentage
    });
}

function sortArray(arr) {
    // let arr2 =  [...new Set(arr)];
    return arr.toSorted((a, b) => b.score - a.score);
}

let count = 1;

function storeInLocalStorage() {
    let arrayOfScores = sortArray(scores);
    if (count <= 9) {
        localStorage.setItem('scores', JSON.stringify(arrayOfScores));
    }
    count++;
}

// let email = 'bernard@gmail.com';
// localStorage.setItem('email', email);
// localStorage.removeItem('email', email);
// print(localStorage);
// localStorage.clear();

let resultParagraphs;

function displayData() {
    setScoreObj();
    storeInLocalStorage();
    let obj = scores[scores.length - 1];
    let parag;
    resultParagraphs = selectAll('.result p');

    for (const prop in obj) {
        parag = create('p');
        parag.innerText = `${prop}: ${obj[prop]}`;
        result.appendChild(parag);
    }
    resultParagraphs.forEach(parag => parag.remove());
}

let storedScores;

function appendScoresInfo() {
    dialog.innerHTML = ''
    storedScores = JSON.parse(localStorage.getItem('scores'));
    // print(storedScores);
    let count = 1;
    storedScores.forEach(obj => {
        let parag1 = create('p');
        let parag2 = create('p');
        let parag3 = create('p');
        let box = create('div');
        parag1.innerText = `#${count}`
        parag2.innerText = `${obj.score} words`;
        parag3.innerText = `${obj.date}`;
        count++;
        [parag1, parag2, parag3].forEach(ele => {
            box.appendChild(ele);
            if (box.childElementCount == 3) dialog.appendChild(box);
        });
    });
}

let noInfoIsAdded = false;

function noInfo() {
    if (!scores.length > 0 && !noInfoIsAdded) {
        let parag = create('p');
        parag.innerText =  'No games have been played';
        dialog.appendChild(parag);
        noInfoIsAdded = true;
    }
}

let pElements;

function clearDialog() {
    pElements = dialog.querySelectorAll('dialog p');
    if (pElements.length > 0) {
        pElements.forEach(ele => ele.parentNode.removeChild(ele));
    }
}

function scoreBoardInfo() {
    if (scores.length > 0) {
        // clearDialog();
        // print(localStorage);
        appendScoresInfo();
    } else {
        noInfo();
    }
}

function gameOverFns() {
    displayData();
    scoreBoardInfo();
    input.value = '';
    clearInterval(checkInput);
    clearInterval(checkTime);
    removeGameOver();
    sound.pause();
}

function gameOver() {
    if (seconds === 0) {
        gameOverFns();
    }
}

function resetGame() {
    copy = [...words];
    result.classList.add('hidden');
    resultContent.innerText = '';
    input.value = '';
    background.classList.remove('bg-blur');
    hitNum = 0;
    hits.innerText = hitNum;
    resetIntervals();
    addNewWord();
}

function resetIntervals() {
    seconds = 10;
    time.innerText = `${seconds}`;
    checkInput = setInterval(wordHit, 1);
    checkTime = setInterval(updateTime, SECOND_IN_MILLISECONDS)
    sound.play();
}

onEvent('click', restart, () => {
    clearInterval(checkTime);
    resetGame();
    input.focus();
});


const dialog = document.querySelector('dialog');

/*
    These methods are part of the new 'dialog' API. Therefore they are
    available by default in our code

    By default, HTML centers the dialog component (my reset.css messes with
    the default style)
*/

scoreBtn.addEventListener('click', () => {
    noInfo();
    // scoreBoardInfo();
    dialog.showModal();
});

dialog.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();

    if (e.clientY < rect.top || e.clientY > rect.bottom || 
        e.clientX < rect.left || e.clientX > rect.right) {
        dialog.close();
    }
})

