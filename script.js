const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = { x: 15, y: 15 };
let direction = "right";
let gameRunning = true;
let score = 0; // Initialize the score
let highScore = localStorage.getItem('snakeHighScore') || 0; // Retrieve high score from localStorage

// High Score Modal
const highScoreModal = document.getElementById("highScoreModal");
const highScoreDisplay = document.getElementById("highScoreDisplay");
const currentScoreDisplay = document.getElementById("currentScoreDisplay");

function showHighScoreModal() {
    currentScoreDisplay.innerText = 'Your Score: ' + score;
    highScoreDisplay.innerText = 'High Score: ' + highScore;
    highScoreModal.style.display = 'block';
}

function closeHighScoreModal() {
    highScoreModal.style.display = 'none';
}

function restartGame() {
    closeHighScoreModal();
    resetGame();
    gameLoop();
}

// Function to end the game and display the appropriate modal
function endGame() {
    gameRunning = false;
    showHighScoreModal();
}

function update() {
    const head = { ...snake[0] };
    switch (direction) {
        case "up":    head.y--; break;
        case "down":  head.y++; break;
        case "left":  head.x--; break;
        case "right": head.x++; break;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        spawnFood();
        score++;
    } else {
        snake.pop();
    }

    if (
        head.x < 0 || head.x >= canvas.width / gridSize ||
        head.y < 0 || head.y >= canvas.height / gridSize ||
        isSnakeCollision()
    ) {
        endGame();
    }
}

function isSnakeCollision() {
    const head = snake[0];
    return snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
}

function spawnFood() {
    food = {
        x: Math.floor(Math.random() * (canvas.width / gridSize)),
        y: Math.floor(Math.random() * (canvas.height / gridSize))
    };
}

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    direction = "right";
    gameRunning = true;
    score = 0; // Reset the score
    spawnFood();
}

function handleKeyPress(event) {
    switch (event.key) {
        case "ArrowUp":    direction = "up";    break;
        case "ArrowDown":  direction = "down";  break;
        case "ArrowLeft":  direction = "left";  break;
        case "ArrowRight": direction = "right"; break;

        case "w":    direction = "up";    break;
        case "s":  direction = "down";  break;
        case "a":  direction = "left";  break;
        case "d": direction = "right"; break;

    }
}

window.addEventListener("keydown", handleKeyPress);

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#00F";
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });

    ctx.fillStyle = "#F00";
    const foodSize = gridSize / 2;
    ctx.beginPath();
    ctx.arc((food.x + 0.5) * gridSize, (food.y + 0.5) * gridSize, foodSize, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = "#000";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 25);
}

function gameLoop() {
    if (gameRunning) {
        update();
        draw();
        setTimeout(gameLoop, 150); // Increase the time delay to slow down the snake
    }
}

gameLoop();