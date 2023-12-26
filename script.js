const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = { x: 15, y: 15 };
let direction = "right";
let gameRunning = true;
let score = 0; // Initialize the score
const highScoreKey = 'snakeHighScore';
let highScore = localStorage.getItem(highScoreKey) || 0;

// High Score Modal
const highScoreModal = document.getElementById("highScoreModal");
const highScoreDisplay = document.getElementById("highScoreDisplay");

function displayHighScore() {
    highScoreDisplay.innerText = "High Score: " + highScore;
}

function closeHighScoreModal() {
    highScoreModal.style.display = 'none';
}

function restartGame() {
    closeHighScoreModal();
    resetGame();
    gameLoop();
}

function updateHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem(highScoreKey, highScore);
        displayHighScore();
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#FF0000";
    snake.forEach((segment, index) => {
        if (index === 0) { // Snake head
            const headSize = gridSize / 2;
            ctx.beginPath();
            ctx.arc((segment.x + 0.5) * gridSize, (segment.y + 0.5) * gridSize, headSize, 0, 2 * Math.PI);
            ctx.fill();
        } else { // Snake body
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
        }
    });

    ctx.fillStyle = "#008300";
    const foodSize = gridSize / 2;
    ctx.beginPath();
    ctx.arc((food.x + 0.5) * gridSize, (food.y + 0.5) * gridSize, foodSize, 0, 2 * Math.PI);
    ctx.fill();

    // Draw the score
    ctx.fillStyle = "#9c0000";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 25); // Adjust the position as needed
}

function gameLoop() {
    if (gameRunning) {
        update();
        draw();
        setTimeout(gameLoop, 150); // Increase the time delay to slow down the snake
    }
}

function showModal() {
    highScoreModal.style.display = 'block';
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
        case "ArrowUp": direction = "up"; break;
        case "ArrowDown": direction = "down"; break;
        case "ArrowLeft": direction = "left"; break;
        case "ArrowRight": direction = "right"; break;
        case "w": direction = "up"; break;
        case "s": direction = "down"; break;
        case "a": direction = "left"; break;
        case "d": direction = "right"; break;
    }
}

function update() {
    const head = { ...snake[0] };
    switch (direction) {
        case "up": head.y--; break;
        case "down": head.y++; break;
        case "left": head.x--; break;
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
        gameRunning = false;
        showModal(); // Show the modal when the game ends
        updateHighScore(); // Update high score when the game ends
    }
}

function isSnakeCollision() {
    const head = snake[0];
    return snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
}

function spawnFood() {
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * (canvas.width / gridSize)),
            y: Math.floor(Math.random() * (canvas.height / gridSize))
        };
    } while (isFoodOnSnake(newFood));

    food = newFood;
}

function isFoodOnSnake(newFood) {
    return snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
}

// Event listeners
window.addEventListener("keydown", handleKeyPress);

// Initial display of high score when the page loads
displayHighScore();

// Start the game loop
gameLoop();
