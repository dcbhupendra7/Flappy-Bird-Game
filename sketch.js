// Global image variables
let bgImg, baseImg, pipeImg;
let birdFrames = [];

// Start in Human mode by default
let isAiMode = false;

let birdsAlive = 0;

// AI Mode variables
let populationSize = 50;
let mutationRate = 0.1;
let birds = [];
let generation = 1;
let aiStarted = false;

// Scores
let bestScore = 0;
let allTimeBest = 0;

// HTML elements
let allTimeBestSpan, currentBestSpan;
let instructionsTitle, humanInstructions, aiInstructions;

// Base variables
let baseImgHeight;
let baseX = 0;
let baseSpeed = 2;

// Game objects
let bird; // Single bird for Human Mode
let pipes = [];

// Game state
let gameOver = false;
let score = 0;

// Bird animation
let birdFrameIndex = 0;
let birdFrameDelay = 5;
let birdFrameCounter = 0;

// Debug mode
const DEBUG = true;

function preload() {
  bgImg = loadImage("background-white.png");
  baseImg = loadImage("base.png");
  pipeImg = loadImage("pipe-green.png");
  birdFrames[0] = loadImage("redbird-downflap.png");
  birdFrames[1] = loadImage("redbird-midflap.png");
  birdFrames[2] = loadImage("redbird-upflap.png");
}

function setup() {
  createCanvas(800, 700);
  // Ensure the instructions panel is on top and clickable
  const instructionsPanel = document.getElementById("instructions-panel");
  instructionsPanel.style.zIndex = "9999";
  instructionsPanel.style.pointerEvents = "auto";
  // HTML elements
  const toggleModeBtn = document.getElementById("toggleModeBtn");
  instructionsTitle = document.getElementById("instructions-title");
  humanInstructions = document.getElementById("human-instructions");
  aiInstructions = document.getElementById("ai-instructions");
  allTimeBestSpan = select("#allTimeBest");
  currentBestSpan = select("#currentBest");

  // Mode toggle
  toggleModeBtn.addEventListener("click", () => {
    isAiMode = !isAiMode;
    toggleModeBtn.textContent = isAiMode
      ? "Switch to Human Mode"
      : "Switch to AI Mode";
    // Show/hide the GA info panel
    const gaInfoPanel = document.getElementById("ga-info-panel");
    if (isAiMode) {
      gaInfoPanel.style.display = "block";
    } else {
      gaInfoPanel.style.display = "none";
    }
    updateInstructions();
    if (!isAiMode) resetGame(); // Reset to Human Mode
    else {
      aiStarted = false; // Reset AI Mode state
      birds = [];
    }
    // Force the button to lose focus so pressing space won't re-click it
    toggleModeBtn.blur();
  });

  // AI Mode Start button
  const startAiBtn = document.getElementById("start-ai-btn");
  startAiBtn.addEventListener("click", () => {
    mutationRate = parseFloat(document.getElementById("mutation-rate").value);
    populationSize = parseInt(document.getElementById("population-size").value);
    startAiMode();
  });

  // Load all-time best score
  let storedBest = localStorage.getItem("flappyAllTimeBest");
  if (storedBest) allTimeBest = parseInt(storedBest, 10);

  baseImgHeight = 112;
  bird = new Bird(); // Human Mode bird
  pipes.push(new Pipe());
}

function draw() {
  image(bgImg, 0, 0, width, height);

  if (isAiMode) {
    if (!aiStarted) return; // Wait for Start button

    // AI Mode logic
    let allDead = true;
    birdsAlive = 0;
    for (let b of birds) {
      if (!b.dead) {
        allDead = false;
        birdsAlive++;
        b.think(pipes); // Neural network decision
        b.update();
        b.show();
        if (b.hitsPipes(pipes) || b.y >= height - baseImgHeight || b.y <= 0) {
          b.dead = true;
        } else {
          b.score++;
        }
      }
    }

    // Update pipes
    for (let i = pipes.length - 1; i >= 0; i--) {
      pipes[i].update();
      pipes[i].show();
      if (pipes[i].offscreen()) {
        pipes.splice(i, 1);
        score++;
      }
    }

    if (frameCount % 90 === 0) pipes.push(new Pipe());

    // Check if generation is over
    if (allDead) {
      evolvePopulation();
    }
    // Debug: Log to console to confirm values
    if (DEBUG) {
      console.log(`Generation: ${generation}, Birds Alive: ${birdsAlive}`);
    }
  } else {
    // Human Mode logic (unchanged)
    if (gameOver) {
      background(0, 150);
      fill(255);
      textSize(24);
      textAlign(CENTER, CENTER);
      text("GAME OVER\nPress SPACE to Restart", width / 2, height / 2);
      return;
    }

    for (let i = pipes.length - 1; i >= 0; i--) {
      pipes[i].update();
      pipes[i].show();
      if (pipes[i].offscreen()) {
        pipes.splice(i, 1);
        score++;
      }
      if (pipes[i].hits(bird)) gameOver = true;
    }

    birdFrameCounter++;
    if (birdFrameCounter % birdFrameDelay === 0) {
      birdFrameIndex = (birdFrameIndex + 1) % birdFrames.length;
    }

    bird.update();
    bird.show();

    if (frameCount % 90 === 0) pipes.push(new Pipe());
  }

  // Ground scrolling (both modes)
  baseX -= baseSpeed;
  if (baseX <= -width) baseX = 0;
  image(baseImg, baseX, height - baseImgHeight, width, baseImgHeight);
  image(baseImg, baseX + width, height - baseImgHeight, width, baseImgHeight);

  fill(0); // Black fill for contrast
  stroke(255); // White outline
  strokeWeight(2); // Thicker outline
  textSize(24); // Larger for score
  textAlign(CENTER, TOP);
  text(score, width / 2, 10); // Score at top center

  if (isAiMode && aiStarted) {
    textSize(16); // Smaller for additional stats
    text(`Generation: ${generation}`, width / 2, 40); // Below score
    text(`Birds Alive: ${birdsAlive}`, width / 2, 60); // Below generation
  }
  noStroke(); // Reset stroke

  // Update scores
  if (score > bestScore) bestScore = score;
  if (score > allTimeBest) {
    allTimeBest = score;
    localStorage.setItem("flappyAllTimeBest", allTimeBest);
  }
  allTimeBestSpan.html(allTimeBest);
  currentBestSpan.html(bestScore);
}

function keyPressed() {
  if (!isAiMode) {
    if (key === " " || keyCode === UP_ARROW) {
      if (gameOver) resetGame();
      else bird.up();
    }
  }
}

function mousePressed() {
  if (!isAiMode) {
    if (gameOver) resetGame();
    else bird.up();
  }
}

function touchStarted() {
  if (!isAiMode) {
    if (gameOver) resetGame();
    else bird.up();
  }
}

function resetGame() {
  gameOver = false;
  score = 0;
  pipes = [];
  bird = new Bird();
  frameCount = 0;
  pipes.push(new Pipe());
  bestScore = 0;
}

function updateInstructions() {
  if (isAiMode) {
    instructionsTitle.textContent = "AI Mode";
    humanInstructions.style.display = "none";
    aiInstructions.style.display = "block";
  } else {
    instructionsTitle.textContent = "How to Play";
    humanInstructions.style.display = "block";
    aiInstructions.style.display = "none";
  }
}

function startAiMode() {
  aiStarted = true;
  birds = [];
  bestScore = 0;
  score = 0;
  pipes = [new Pipe()];
  for (let i = 0; i < populationSize; i++) {
    birds.push(new AiBird());
  }
  birdsAlive = populationSize;
  generation = 1;
}

function evolvePopulation() {
  // Simple genetic algorithm
  let totalScore = birds.reduce((sum, b) => sum + b.score, 0);
  let newBirds = [];

  // Select top performers and create new population
  birds.sort((a, b) => b.score - a.score); // Sort by score descending
  let elite = birds.slice(0, Math.floor(populationSize * 0.2)); // Keep top 20%

  // Fill the rest with offspring
  while (newBirds.length < populationSize - elite.length) {
    let parent1 = random(birds);
    let parent2 = random(birds);
    let child = new AiBird();
    child.brain.crossover(parent1.brain, parent2.brain);
    child.brain.mutate(mutationRate);
    newBirds.push(child);
  }

  birds = [...elite, ...newBirds];
  generation++;
  score = 0;
  bestScore = 0;
  pipes = [new Pipe()];
  for (let b of birds) {
    b.reset();
  }
}
