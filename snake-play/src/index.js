let food;
let ctx2d;
let foodPosition = { x: 3, y: 5 };
window.onload = () => {
  const canvas = document.getElementById('map');
  ctx2d = canvas.getContext('2d');
  ctx2d.beginPath();
  ctx2d.fillStyle = "#39ff14";
  ctx2d.fillRect(0, 0, canvas.width, canvas.height);
  ctx2d.fill();
  ctx2d.closePath();
  const snake = new Snake(100, 100, 'down', '#ff5050', 30, Snake.INITIAL_LENGTH, ctx2d)
  foodPosition = createFood(snake.coordinates);
  console.log('food position', foodPosition);
  food = new Food(foodPosition.x, foodPosition.y, '#cccc00', ctx2d);
  const game = {
    snake,
    foodPosition
  };

  startGame(game);
}

class Food {
  constructor(x, y, color, ctx) {
    this.RADIUS = 6;
    this.x = x;
    this.y = y;
    console.log('constructor color', color)
    this.color = color;
    this.draw(ctx);
  }

  draw(ctx) {
    ctx.beginPath()
    console.log('this color', this.color)
    ctx.fillStyle = this.color;
    ctx.strokeStyle = this.color;
    ctx.arc(this.x, this.y, this.RADIUS, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
  }

  destroy() {
    ctx2d.beginPath();
    ctx2d.fillStyle = "#39ff14";
    ctx2d.strokeStyle = "#39ff14";
    ctx2d.arc(this.x, this.y, this.RADIUS, 0, 2 * Math.PI);
    ctx2d.fill();
    ctx2d.stroke();
    ctx2d.closePath();
  }
};

// food creating method 
const createFood = (snakeBody) => {
  let foodInSnakebody = true;
  let x, y;
  while (foodInSnakebody) {
    x = Math.round(Math.random() * 1400);
    y = Math.round(Math.random() * 700);
    foodInSnakebody = snakeBody.find(position => x === position.x && y === position.y);
  };
  return { x, y };
};

// has eaten food

const hasEatenFood = (x, y) => {
  if (
    (x > foodPosition.x - 10) && (x < foodPosition.x + 10) &&
    (y > foodPosition.y - 10) && (y < foodPosition.y + 10)
  ) {
    console.log('yes i am eating it');
    food.destroy(ctx2d);
    return true;
  }
  return false;
}

class Snake {
  constructor(x, y, direction, color, length, angle, ctx) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.ctx = ctx;
    this.coordinates = [];
    this.color = color;
    this.direction = direction;
    this.length = length;
    // FirstRender of snake skin:-
    for (let x = 0; x < 10; x++) {
      this.running();
    }
  }

  running() {
    this.x += Snake.xSpeed;
    this.y += Snake.ySpeed;
    if (hasEatenFood(this.x, this.y)) {
      this.length += 30;
      foodPosition = createFood(this.coordinates);
      food = new Food(foodPosition.x, foodPosition.y, '#CCCC00', ctx2d);
      console.log('food after eaten', food);
    };
    this.pushCoordinates();
    this.draw();
  }

  pushCoordinates() {
    this.coordinates.push({
      x: this.x,
      y: this.y
    });
    this.snakeLengthControl();
  }

  snakeLengthControl() {
    if (this.coordinates.length > this.length) {
      let { x, y } = this.coordinates[0];
      this.ctx.beginPath();
      this.ctx.fillStyle = "#39ff14";
      this.ctx.arc(x, y, Snake.HEAD_RADIUS + 1, 0, 2 * Math.PI);
      this.ctx.fill();
      this.ctx.closePath();
      this.coordinates.shift();
    }
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.fillStyle = this.color;// now anthing that will be drown on the canvas will be of this color.
    this.ctx.arc(this.x, this.y, Snake.HEAD_RADIUS, 0, 2 * Math.PI)
    this.ctx.fill();
    this.ctx.closePath();
  }

  directionControl(e) {
    switch (e.key) {
      case 'ArrowLeft': {
        if (this.direction === 'left' || this.direction === 'right') {
          break;
        }
        if (this.previousDirection === 'right' && this.previousDirection !== 'left') {
          this.running();
          this.running();
          this.running();
          this.running();
          this.running();// we are doing this check so snack does not collpase in itself;
        }
        Snake.ySpeed = 0;
        Snake.xSpeed = -2;
        this.previousDirection = this.direction;
        this.direction = 'left';
        break;
      }
      case "ArrowRight": {
        if (this.direction === 'left' || this.direction === 'right') {
          break;
        }
        if (this.previousDirection === 'left' && this.previousDirection !== 'right') {
          this.running();
          this.running();
          this.running();
          this.running();
          this.running(); // we are doing this check so snack does not collpase in itself;
        }
        Snake.ySpeed = 0;
        Snake.xSpeed = +2;
        this.previousDirection = this.direction;
        this.direction = 'right';
        break;
      }
      case "ArrowUp": {
        if (this.direction === 'up' || this.direction === 'down') {
          break;
        }
        if (this.previousDirection === 'down') {
          this.running();
          this.running();
          this.running();
          this.running();
          this.running(); // we are doing this check so snack does not collpase in itself;
        }
        Snake.xSpeed = 0;
        Snake.ySpeed = -2;
        this.previousDirection = this.direction;
        this.direction = 'up';
        break;
      }
      case "ArrowDown": {
        if (this.direction === 'up' || this.direction === 'down') {
          break;
        }
        if (this.previousDirection === 'up') {
          this.running();
          this.running();
          this.running();
          this.running();
          this.running();// we are doing this check so snack does not collpase in itself;
        }
        Snake.xSpeed = 0;
        Snake.ySpeed = +2;
        this.previousDirection = this.direction;
        this.direction = 'down';
        break;
      }
    }
  }

  validationCoordinates() {

  }

}

Snake.INITIAL_LENGTH = 100
Snake.HEAD_RADIUS = 5;
Snake.SPEED = 2 // points per iteration
Snake.ROTATION_SPEED = 5 //
Snake.xSpeed = 0;
Snake.ySpeed = 2;

var globalTimeInterval = null;
const startGame = (game) => {
  const { snake } = game;
  const bindedRunFunction = snake.running.bind(snake);
  game.snakeInterval = setInterval(bindedRunFunction, 10)
  globalTimeInterval = game.snakeInterval;
  addEventListener('keydown', snake.directionControl.bind(snake))
  // setInterval(() => clearInterval(game.snakeInterval), 3000);
}
