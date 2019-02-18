let food;
let ctx2d;
let foodPosition = { x: 3, y: 5 };
let snake, python;
window.onload = () => {
  const canvas = document.getElementById('map');
  ctx2d = canvas.getContext('2d');
  ctx2d.beginPath();
  ctx2d.fillStyle = "#39ff14";
  ctx2d.fillRect(0, 0, canvas.width, canvas.height);
  ctx2d.fill();
  ctx2d.closePath();
  snake = new Snake(100, 100, 'down', '#ff5050', 30, Snake.INITIAL_LENGTH, ctx2d)
  python = new Python(300, 300, 'down', '#000000', 30, Snake.INITIAL_LENGTH, ctx2d)
  foodPosition = createFood(snake.coordinates);
  console.log('food position', foodPosition);
  food = new Food(foodPosition.x, foodPosition.y, '#cccc00', ctx2d);
  const game = {
    snake,
    python,
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
    (x > foodPosition.x - 12) && (x < foodPosition.x + 12) &&
    (y > foodPosition.y - 12) && (y < foodPosition.y + 12)
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
    this.xSpeed = 0;
    this.ySpeed = 2;
    this.angle = angle;
    this.ctx = ctx;
    this.coordinates = [];
    this.color = color;
    this.direction = direction;
    this.length = length;
    // FirstRender of snake skin:-
    for (let x = 0; x < length; x++) {
      this.running();
    }
  }

  running() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;
    if (hasEatenFood(this.x, this.y)) {
      this.length += 30;
      foodPosition = createFood(this.coordinates);
      food = new Food(foodPosition.x, foodPosition.y, '#CCCC00', ctx2d);
      console.log('food after eaten', food);
    };
    if (this.checkCollisionWithSnakeBodies(this.x, this.y) || this.collisionWithOtherSnake(this.x, this.y)) {
      alert('Snake died');
      clearInterval(globalTimeInterval);
      clearInterval(timeIntervalForSnake2)
    } else {
      this.pushCoordinates();
      this.draw();
    };
  }

  checkCollisionWithSnakeBodies(x, y) {
    if (this.coordinates.length > this.length - 1) {
      let collided = this.coordinates.slice(0, this.length - 8).find((collisionPoint, index) => {
        if (
          (x > collisionPoint.x - 10) && (x < collisionPoint.x + 10) &&
          (y > collisionPoint.y - 10) && (y < collisionPoint.y + 10)
        ) {
          this.coordinates.forEach((element) => console.log(element.x, element.y));
          console.log('head', x, y);
          console.log('collided index', index);
          console.log('collided point', collisionPoint.x, collisionPoint.y);
          return true;
        }
        return false;
      })
      if (collided) {
        console.log('collided', collided);
        console.log('Collided with itself');
        return true;
      }

    }
    return false;
  }

  collisionWithOtherSnake(x, y) {
    if (this.coordinates.length > this.length - 1) {
      let collided = python.coordinates.find((collisionPoint, index) => {
        if (
          (x > collisionPoint.x - 10) && (x < collisionPoint.x + 10) &&
          (y > collisionPoint.y - 10) && (y < collisionPoint.y + 10)
        ) {
          this.coordinates.forEach((element) => console.log(element.x, element.y));
          console.log('head', x, y);
          console.log('collided index', index);
          console.log('collided point', collisionPoint.x, collisionPoint.y);
          return true;
        }
        return false;
      })
      if (collided) {
        console.log('collided', collided);
        console.log('Collided with python');
        return true;
      }

    }
    return false;
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
        console.log('This is really fucked up', e.key);
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
        this.ySpeed = 0;
        this.xSpeed = -2;
        this.previousDirection = this.direction;
        this.direction = 'left';
        break;
      }
      case "ArrowRight": {
        console.log('This is really fucked up', e.key);
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
        this.ySpeed = 0;
        this.xSpeed = +2;
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
        this.xSpeed = 0;
        this.ySpeed = -2;
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
        this.xSpeed = 0;
        this.ySpeed = +2;
        this.previousDirection = this.direction;
        this.direction = 'down';
        break;
      }
    }
  }

  validationCoordinates() {

  }

}

class Python {
  constructor(x, y, direction, color, length, angle, ctx) {
    this.x = x;
    this.y = y;
    this.xSpeed = 0;
    this.ySpeed = 2;
    this.angle = angle;
    this.ctx = ctx;
    this.coordinates = [];
    this.color = color;
    this.direction = direction;
    this.length = length;
    // FirstRender of snake skin:-
    for (let x = 0; x < length; x++) {
      this.running();
    }
  }

  running() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;
    if (hasEatenFood(this.x, this.y)) {
      this.length += 30;
      foodPosition = createFood(this.coordinates);
      food = new Food(foodPosition.x, foodPosition.y, '#CCCC00', ctx2d);
      console.log('food after eaten', food);
    };
    if (this.checkCollisionWithSnakeBodies(this.x, this.y) || this.collisionWithOtherSnake(this.x, this.y)) {
      alert('Python died');
      clearInterval(globalTimeInterval);
      clearInterval(timeIntervalForSnake2)
    } else {
      this.pushCoordinates();
      this.draw();
    }
  }

  checkCollisionWithSnakeBodies(x, y) {
    if (this.coordinates.length > this.length - 1) {
      let collided = this.coordinates.slice(0, this.length - 8).find((collisionPoint, index) => {
        if (
          (x > collisionPoint.x - 10) && (x < collisionPoint.x + 10) &&
          (y > collisionPoint.y - 10) && (y < collisionPoint.y + 10)
        ) {
          this.coordinates.forEach((element) => console.log(element.x, element.y));
          console.log('head', x, y);
          console.log('collided index', index);
          console.log('collided point', collisionPoint.x, collisionPoint.y);
          return true;
        }
        return false;
      })
      if (collided) {
        console.log('collided', collided);
        console.log('Collided with itself');
        return true;
      }

    }
    return false;
  }

  collisionWithOtherSnake(x, y) {
    if (this.coordinates.length > this.length - 1) {
      let collided = snake.coordinates.find((collisionPoint, index) => {
        if (
          (x > collisionPoint.x - 10) && (x < collisionPoint.x + 10) &&
          (y > collisionPoint.y - 10) && (y < collisionPoint.y + 10)
        ) {
          this.coordinates.forEach((element) => console.log(element.x, element.y));
          console.log('head', x, y);
          console.log('collided index', index);
          console.log('collided point', collisionPoint.x, collisionPoint.y);
          return true;
        }
        return false;
      })
      if (collided) {
        console.log('collided', collided);
        console.log('Collided with itself');
        return true;
      }

    }
    return false;
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
    switch (e.keyCode) {
      case 65: {
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
        this.ySpeed = 0;
        this.xSpeed = -2;
        this.previousDirection = this.direction;
        this.direction = 'left';
        break;
      }
      case 68: {
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
        this.ySpeed = 0;
        this.xSpeed = +2;
        this.previousDirection = this.direction;
        this.direction = 'right';
        break;
      }
      case 87: {
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
        this.xSpeed = 0;
        this.ySpeed = -2;
        this.previousDirection = this.direction;
        this.direction = 'up';
        break;
      }
      case 88: {
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
        this.xSpeed = 0;
        this.ySpeed = +2;
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

var globalTimeInterval = null;
var timeIntervalForSnake2 = null;
const startGame = (game) => {
  const { snake, python } = game;

  const bindedRunFunction = snake.running.bind(snake);
  const bindedRunFunctionForPython = python.running.bind(python);
  game.snakeInterval = setInterval(bindedRunFunction, 20)
  globalTimeInterval = game.snakeInterval;
  timeIntervalForSnake2 = setInterval(bindedRunFunctionForPython, 20)
  addEventListener('keydown', snake.directionControl.bind(snake))
  addEventListener('keydown', python.directionControl.bind(python))

  addEventListener('keydown', (event) => {
    if (event.key === 'c') {
      clearInterval(globalTimeInterval);
      clearInterval(timeIntervalForSnake2);
    }
    if (event.key === 'S') {
      globalTimeInterval = setInterval(bindedRunFunction, 20);
      timeIntervalForSnake2 = setInterval(bindedRunFunctionForPython, 20)
    }

  })
  // setInterval(() => clearInterval(game.snakeInterval), 3000);
}
