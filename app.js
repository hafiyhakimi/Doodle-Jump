document.addEventListener('DOMContentLoaded', () => {
    const landingPage = document.getElementById('landing-page');
    const startButton = document.getElementById('start-button');
    const gameOverPage = document.getElementById('game-over');
    const restartButton = document.getElementById('restart-button');
    const gameArea = document.getElementById('game-area');
    const doodler = document.createElement('div');
    let doodlerLeftSpace = 50;
    let startPoint = 150;
    let doodlerBottomSpace = startPoint;
    let isGameOver = false;
    let platformCount = 5;
    let platforms = [];
    let upTimerId;
    let downTimerId;
    let isJumping = true;
    let isGoingLeft = false;
    let isGoingRight = false;
    let leftTimerId;
    let rightTimerId;
    let score = 0;
    let platformIntervalId;

    // Start Game
    startButton.addEventListener('click', start);

    // Restart Game
    restartButton.addEventListener('click', start);

    // Function to create Doodler
    function createDoodler() {
        gameArea.appendChild(doodler);
        doodler.classList.add('doodler');
        doodlerLeftSpace = platforms[0].left;
        doodler.style.left = doodlerLeftSpace + 'px';
        doodler.style.bottom = doodlerBottomSpace + 'px';
    }

    // Platform class and createPlatforms function
    class Platform {
        constructor(newPlatBottom) {
            this.bottom = newPlatBottom;
            this.left = Math.random() * 315;
            this.visual = document.createElement('div');

            const visual = this.visual;
            visual.classList.add('platform');
            visual.style.left = this.left + 'px';
            visual.style.bottom = this.bottom + 'px';
            gameArea.appendChild(visual);
        }
    }

    function createPlatforms() {
        for (let i = 0; i < platformCount; i++) {
            let platGap = 600 / platformCount;
            let newPlatBottom = 100 + i * platGap;
            let newPlatform = new Platform(newPlatBottom);
            platforms.push(newPlatform);
        }
    }

    // Game control functions (movePlatforms, jump, fall, control, etc.)
    function movePlatforms() {
        if (doodlerBottomSpace > 200) {
            platforms.forEach(platform => {
                platform.bottom -= 4;
                let visual = platform.visual;
                visual.style.bottom = platform.bottom + 'px';

                if (platform.bottom < 10) {
                    let firstPlatform = platforms[0].visual;
                    firstPlatform.classList.remove('platform');
                    platforms.shift();
                    score++;
                    let newPlatform = new Platform(600);
                    platforms.push(newPlatform);
                }
            })
        }
    }

    function jump() {
        clearInterval(downTimerId);
        isJumping = true;
        upTimerId = setInterval(function () {
            doodlerBottomSpace += 20;
            doodler.style.bottom = doodlerBottomSpace + 'px';
            if (doodlerBottomSpace > startPoint + 200) {
                fall();
            }
        }, 30);
    }

    function fall() {
        clearInterval(upTimerId);
        isJumping = false;
        downTimerId = setInterval(function () {
            doodlerBottomSpace -= 5;
            doodler.style.bottom = doodlerBottomSpace + 'px';
            if (doodlerBottomSpace <= 0) {
                gameOver();
            }
            platforms.forEach(platform => {
                if (
                    (doodlerBottomSpace >= platform.bottom) &&
                    (doodlerBottomSpace <= platform.bottom + 15) &&
                    ((doodlerLeftSpace + 60) >= platform.left) &&
                    (doodlerLeftSpace <= (platform.left + 85)) &&
                    !isJumping
                ) {
                    startPoint = doodlerBottomSpace;
                    jump();
                }
            })
        }, 30);
    }

    // Reset all movement states
    function resetMovementStates() {
        isGoingLeft = false;
        isGoingRight = false;
        clearInterval(leftTimerId);
        clearInterval(rightTimerId);
    }



    // Display Game Over Screen
    function gameOver() {
        isGameOver = true;

        // Clear the interval for moving platforms
        clearInterval(platformIntervalId);

        // Clear game area: remove all platforms and doodler
        while (gameArea.firstChild) {
            gameArea.removeChild(gameArea.firstChild);
        }

        // Reset platforms and doodler array
        platforms = [];
        if (doodler) {
            doodler.remove();
        }

        // Hide game area and show game over page
        gameArea.style.display = 'none';
        gameOverPage.style.display = 'flex';
        document.getElementById('score-display').innerText = 'Your score is: ' + score;

        // Clear any active timers
        clearInterval(upTimerId);
        clearInterval(downTimerId);
        clearInterval(leftTimerId);
        clearInterval(rightTimerId);

        // Remove event listeners for controls
        document.removeEventListener('keyup', control);
    }

    // Start or Restart Game
    function start() {
        // If the game is over, reset everything before starting again
        if (isGameOver) {
            // Hide game over screen
            gameOverPage.style.display = 'none';

            // Reset game state
            score = 0;  // Reset score
            isGameOver = false;  // Game is not over anymore
            platforms = [];  // Reset platforms array
            doodlerBottomSpace = startPoint;  // Reset doodler position
            doodlerLeftSpace = 50;  // Reset doodler horizontal position

            // Clear any existing platforms and doodler
            while (gameArea.firstChild) {
                gameArea.removeChild(gameArea.firstChild);
            }

            // Hide game over page and show game area
            gameArea.style.display = 'block';

            // Reset timers
            clearInterval(upTimerId);
            clearInterval(downTimerId);
            clearInterval(leftTimerId);
            clearInterval(rightTimerId);
        }

        // Reset movement states
        resetMovementStates();

        landingPage.style.display = 'none';
        gameArea.style.display = 'block';
        gameOverPage.style.display = 'none';

        // Create new platforms and doodler
        createPlatforms();
        createDoodler();

        // Re-start the game loop
        // Start platform movement interval (ensure only one interval is running)
        platformIntervalId = setInterval(movePlatforms, 30);
        jump(startPoint);

        // Reattach event listeners for controls
        document.addEventListener('keyup', control);
    }

    function moveLeft() {
        if (isGoingLeft) return;
        if (isGoingRight) {
            clearInterval(rightTimerId);
            isGoingRight = false;
        }
        isGoingLeft = true;
        leftTimerId = setInterval(function () {
            if (doodlerLeftSpace >= 0) {
                doodlerLeftSpace -= 5;
                doodler.style.left = doodlerLeftSpace + 'px';
            } else moveRight();
        }, 20);
    }

    function moveRight() {
        if (isGoingRight) return;
        if (isGoingLeft) {
            clearInterval(leftTimerId);
            isGoingLeft = false;
        }
        isGoingRight = true;
        rightTimerId = setInterval(function () {
            if (doodlerLeftSpace <= 340) {
                doodlerLeftSpace += 5;
                doodler.style.left = doodlerLeftSpace + 'px';
            } else moveLeft();
        }, 20);
    }

    function moveStraight() {
        isGoingLeft = false;
        isGoingRight = false;
        clearInterval(leftTimerId);
        clearInterval(rightTimerId);
    }

    function control(e) {
        doodler.style.bottom = doodlerBottomSpace + 'px';
        if (e.key === 'ArrowLeft' || e.key === 'a') {
            moveLeft();
        } else if (e.key === 'ArrowRight' || e.key === 'd') {
            moveRight();
        } else if (e.key === 'ArrowUp' || e.key === 'w') {
            moveStraight()
        }
    }
})