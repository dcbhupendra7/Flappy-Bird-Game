/**************************************************************
 * Bird Class (for Human Mode)
 **************************************************************/
class Bird {
  constructor() {
    this.x = 50;
    this.y = height / 2;
    this.gravity = 0.3;
    this.lift = -5;
    this.velocity = 0;
    this.rotation = 0;
    this.width = 34;
    this.height = 24;
  }

  show() {
    push();
    imageMode(CENTER);
    translate(this.x, this.y);
    rotate(this.rotation);
    image(birdFrames[birdFrameIndex], 0, 0, this.width, this.height);
    pop();
  }

  up() {
    this.velocity += this.lift;
    this.rotation = -0.2;
  }

  update() {
    this.velocity += this.gravity;
    this.velocity = constrain(this.velocity, -6, 10);
    this.y += this.velocity;
    this.rotation *= 0.9;
    if (this.y > height - baseImgHeight) {
      this.y = height - baseImgHeight;
      this.velocity = 0;
    }
    if (this.y < 0) {
      this.y = 0;
      this.velocity = 0;
    }
  }
}

/**************************************************************
 * AiBird Class (for AI Mode)
 **************************************************************/
class AiBird extends Bird {
  constructor() {
    super();
    this.score = 0;
    this.dead = false;
    this.brain = new SimpleNN(); // Placeholder for neural network
  }

  reset() {
    this.x = 50;
    this.y = height / 2;
    this.velocity = 0;
    this.rotation = 0;
    this.score = 0;
    this.dead = false;
  }

  think(pipes) {
    if (pipes.length === 0) return;
    let closestPipe = pipes[0];
    let inputs = [
      this.y / height, // Normalized bird height
      closestPipe.x / width, // Normalized pipe x position
      closestPipe.top / height, // Normalized top pipe height
      (height - closestPipe.bottom) / height, // Normalized bottom pipe height
    ];
    let output = this.brain.predict(inputs);
    if (output > 0.5) this.up();
  }

  hitsPipes(pipes) {
    for (let pipe of pipes) {
      if (
        this.x + 5 > pipe.x &&
        this.x - 5 < pipe.x + pipe.w &&
        (this.y + 5 < pipe.top || this.y - 5 > height - pipe.bottom)
      ) {
        return true;
      }
    }
    return false;
  }
}

/**************************************************************
 * SimpleNN Class (Placeholder Neural Network)
 **************************************************************/
class SimpleNN {
  constructor() {
    // Simple weights for a single-layer perceptron
    this.weights = [random(-1, 1), random(-1, 1), random(-1, 1), random(-1, 1)];
    this.bias = random(-1, 1);
  }

  predict(inputs) {
    let sum = 0;
    for (let i = 0; i < inputs.length; i++) {
      sum += inputs[i] * this.weights[i];
    }
    sum += this.bias;
    return this.sigmoid(sum);
  }

  sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
  }

  crossover(parent1, parent2) {
    this.weights = parent1.weights.map((w, i) =>
      random() > 0.5 ? w : parent2.weights[i]
    );
    this.bias = random() > 0.5 ? parent1.bias : parent2.bias;
  }

  mutate(rate) {
    this.weights = this.weights.map((w) =>
      random() < rate ? w + random(-0.1, 0.1) : w
    );
    if (random() < rate) this.bias += random(-0.1, 0.1);
  }
}

/**************************************************************
 * Pipe Class (unchanged)
 **************************************************************/
class Pipe {
  constructor() {
    this.spacing = 100;
    this.top = random(50, height / 2);
    this.bottom = height - (this.top + this.spacing);
    this.x = width;
    this.w = 52;
    this.speed = 2;
  }

  show() {
    push();
    imageMode(CORNER);
    image(pipeImg, this.x, height - this.bottom, this.w, this.bottom);
    pop();
    push();
    imageMode(CORNER);
    scale(1, -1);
    image(pipeImg, this.x, -this.top, this.w, this.top);
    pop();
  }

  update() {
    this.x -= this.speed;
  }

  offscreen() {
    return this.x + this.w < 0;
  }

  hits(bird) {
    const hitboxShrink = 5;
    if (
      bird.x + hitboxShrink > this.x &&
      bird.x - hitboxShrink < this.x + this.w
    ) {
      if (
        bird.y + hitboxShrink < this.top ||
        bird.y - hitboxShrink > height - this.bottom
      ) {
        return true;
      }
    }
    return false;
  }
}
