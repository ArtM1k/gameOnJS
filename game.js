document.addEventListener('DOMContentLoaded', function () {
    const startButton = document.getElementById('start-button');
    const letterDisplay = document.getElementById('letter-display');
    const gameArea = document.getElementById('game-area');
    const gameMenu = document.getElementById('game-menu');
    const resultArea = document.getElementById('result-area');
    const resultText = document.getElementById('result');
    const restartButton = document.getElementById('restart-button');
    const letterCountInput = document.getElementById('letter-count');
    const historyList = document.getElementById('history-list');

    let totalLetters = 0;
    let correctLetters = 0;
    let currentLetter = '';
    let gameStartTime = null;
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const history = [];
    let letterTimeout = null;
    let gameFinished = false;

    function nextLetter() {
        if (totalLetters === 0) {
            return endGame();  
        }

        totalLetters--;
        currentLetter = letters.charAt(Math.floor(Math.random() * letters.length));
        letterDisplay.textContent = currentLetter;

        moveLetter();
        history.push({ letter: currentLetter, correct: false });
        updateHistory();

        if (letterTimeout) clearTimeout(letterTimeout);

        letterTimeout = setTimeout(() => {
            letterDisplay.textContent = '';  
            
            if (totalLetters === 0) {
                endGame();
            } else {
                nextLetter();  
            }
        }, 4000); 
    }

    document.addEventListener('keydown', function (event) {
        if (gameArea.style.display === 'block' && event.key.toUpperCase() === currentLetter && !gameFinished) {
            correctLetters++;
            history[history.length - 1].correct = true;
            updateHistory();
            if (letterTimeout) clearTimeout(letterTimeout);
            if (totalLetters === 0) {
                endGame();
            } else {
                nextLetter();
            }
        }
    });

    function startGame() {
        let inputLetters = parseInt(letterCountInput.value);
        if (isNaN(inputLetters) || inputLetters <= 0) {
            totalLetters = 10;  
        } else {
            totalLetters = inputLetters;
        }
        correctLetters = 0;
        gameMenu.style.display = 'none';
        gameArea.style.display = 'block';
        resultArea.style.display = 'none';
        historyList.innerHTML = '';
        gameStartTime = new Date();
        gameFinished = false;

        nextLetter(); 
    }

    function moveLetter() {
        const gameAreaBounds = gameArea.getBoundingClientRect();
        const randomX = Math.random() * (gameAreaBounds.width - letterDisplay.offsetWidth);
        const randomY = Math.random() * (gameAreaBounds.height - letterDisplay.offsetHeight);

        letterDisplay.style.left = `${randomX}px`;
        letterDisplay.style.top = `${randomY}px`;
    }

    function endGame() {
        clearTimeout(letterTimeout); 
        gameArea.style.display = 'none';
        resultArea.style.display = 'block';

        const gameEndTime = new Date();
        const timeElapsed = (gameEndTime - gameStartTime) / 1000;
        const lettersPerSecond = (correctLetters / timeElapsed).toFixed(2);

        resultText.textContent = `Результат: ${lettersPerSecond} букв в секунду`;
        gameFinished = true;
    }

    function updateHistory() {
        historyList.innerHTML = history.map(entry => {
            const className = entry.correct ? 'correct' : 'incorrect';
            return `<li class="${className}">${entry.letter}</li>`;
        }).join('');
    }

    startButton.addEventListener('click', startGame);

    restartButton.addEventListener('click', function () {
        resultArea.style.display = 'none';
        gameMenu.style.display = 'block';
        history.length = 0;
    });
});
