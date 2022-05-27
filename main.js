'use strict'

const MAX_ENEMIES = 7;
const HEIGHT_ELEM = 100;

const score = document.querySelector('.score'),
      start = document.querySelector('.start'),
      gameArea = document.querySelector('.game-area'),
      gameAreaTexts = document.querySelectorAll('.game-area__text'),
      car = document.createElement('div'),
      btns = document.querySelectorAll('.btn'),
      modal = document.getElementById('modal'),
      modalContentText = document.querySelector('.modal-content__text'),
      modalClose = document.getElementById('close-modal');

const music = new Audio('audio/bensound-happyrock.mp3');

car.classList.add('car');

start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowRight: false,
  ArrowLeft: false,
  w: false,
  a: false,
  s: false,
  d: false,
};

const setting = {
  start: false,
  score: 0,
  speed: 3,
  traffic: 2
};

const changeLevel = (lvl) => {
  switch(lvl) {
    case '1':
      setting.traffic = 4;
      setting.speed = 3;
      break;
    case '2':
      setting.traffic = 3;
      setting.speed = 5;
      break;
    case '3':
      setting.traffic = 3;
      setting.speed = 8;
      break;
  }
}

function getQuantityElements(heightElement) {
  return gameArea.offsetHeight / heightElement + 1;
}

const getRandomEnemy = (max) => Math.floor((Math.random() * max) + 1);

function startGame(event) {
  const target = event.target;
  if (!target.classList.contains('btn')) return;

  const levelGame = target.dataset.levelGame;
  changeLevel(levelGame);
  btns.forEach(btn => btn.disabled = true);

  gameArea.innerHTML = '';
  music.play();
  music.volume = 0.05;
  music.loop = true;

  gameAreaTexts.forEach(text => text.classList.add('hide'));
  gameArea.style.outline = "1px dashed #666";
  gameArea.style.minHeight = Math.floor((document.documentElement.clientHeight - HEIGHT_ELEM) / HEIGHT_ELEM) * HEIGHT_ELEM + 'px';

  for (let i = 0; i < getQuantityElements(HEIGHT_ELEM); i++) {
    const line = document.createElement(`div`);
    line.classList.add('line');
    line.style.top = (i * HEIGHT_ELEM) + 'px';
    line.style.height = (HEIGHT_ELEM / 2) + 'px';
    line.y = i * HEIGHT_ELEM;
    gameArea.append(line);
  }

  for (let i = 1; i < getQuantityElements(HEIGHT_ELEM * setting.traffic); i++) {
    const enemy = document.createElement('div');
    enemy.classList.add('enemy');
    enemy.y = -HEIGHT_ELEM * setting.traffic * i;
    enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
    enemy.style.top = enemy.y + 'px';
    enemy.style.background = `
        transparent 
        url(./img/enemy${getRandomEnemy(MAX_ENEMIES)}.png) 
        center / cover 
        no-repeat`;
    gameArea.appendChild(enemy);
  }

  setting.score = 0;
  setting.start = true;
  gameArea.appendChild(car);
  car.style.left = '125px';
  car.style.top = 'auto';
  car.style.bottom = '10px';
  setting.x = car.offsetLeft;
  setting.y = car.offsetTop;
  requestAnimationFrame(playGame);
}

function playGame() {
  if (setting.start) {
    moveRoad();
    moveEnemy();
    setting.score += setting.speed;
    score.innerHTML = `<b>SCORE: ${setting.score}</b>`;

    if ((keys.ArrowLeft || keys.a) && setting.x > 0) {
      setting.x -= setting.speed;
    }
    if ((keys.ArrowRight || keys.d) && setting.x < (gameArea.offsetWidth - car.offsetWidth)) {
      setting.x += setting.speed;
    }
    if ((keys.ArrowUp || keys.w) && setting.y > 0) {
      setting.y -= setting.speed;
    }
    if ((keys.ArrowDown || keys.s) && setting.y < (gameArea.offsetHeight - car.offsetHeight)) {
      setting.y += setting.speed;
    }
    car.style.left = setting.x + 'px';
    car.style.top = setting.y + 'px';
    requestAnimationFrame(playGame);
  } else {
    music.pause();
    btns.forEach(btn => btn.disabled = false);
    showModal();
  }
}

function startRun(event) {
  if (keys.hasOwnProperty(event.key)) {
    event.preventDefault();
    keys[event.key] = true;
  }
}

function stopRun(event) {
  if (keys.hasOwnProperty(event.key)) {
    event.preventDefault();
    keys[event.key] = false;
  }
}

function moveRoad() {
  let lines = document.querySelectorAll('.line');
  lines.forEach(function(line) {
    line.y += setting.speed;
    line.style.top = line.y + 'px';

    if (line.y >= gameArea.offsetHeight) {
      line.y = -HEIGHT_ELEM;
    }
  })
}

function moveEnemy() {
  let enemies = document.querySelectorAll('.enemy');
  enemies.forEach(function(enemy) {
    let carRect = car.getBoundingClientRect();
    let enemyRect = enemy.getBoundingClientRect();

    if (carRect.top <= enemyRect.bottom &&
        carRect.right >= enemyRect.left &&
        carRect.left <= enemyRect.right &&
        carRect.bottom >= enemyRect.top) {
          setting.start = false;
          start.classList.remove('hide');
    }
    enemy.y += setting.speed / 2;
    enemy.style.top = enemy.y + 'px';

    if (enemy.y >= gameArea.offsetHeight) {
      enemy.y = -HEIGHT_ELEM * setting.traffic;
      enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
    }
  });
}

// Show Modal
function showModal() {
  modal.classList.add('show-modal');
  modalContentText.innerHTML = `Result: <span class="modal-content__score">${setting.score}</span>`;
}

// Modal Event Listeners
modalClose.addEventListener('click', () => {
  modal.classList.remove('show-modal');
});

window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.remove('show-modal');
  }
})
