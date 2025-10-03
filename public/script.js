/**
 * 
 */
// script.js
const startBtn = document.getElementById('startBtn');
const gameArea = document.getElementById('gameArea');
const timerDisplay = document.getElementById('timer');

let startTime;
let timerInterval;
let nextNumber = 1;

startBtn.addEventListener('click', startGame);

function startGame() {
  gameArea.innerHTML = '';
  nextNumber = 1;
  generateNumbers();
  startTime = Date.now();
  timerInterval = setInterval(updateTimer, 10);
}

function generateNumbers() {
  const positions = [];

  for (let i = 1; i <= 30; i++) {
    const numberDiv = document.createElement('div');
    numberDiv.className = 'number';
    numberDiv.textContent = i;

    let x, y;
    do {
      x = Math.random() * (gameArea.clientWidth - 60);
      y = Math.random() * (gameArea.clientHeight - 60);
    } while (positions.some(pos => Math.abs(pos.x - x) < 45 && Math.abs(pos.y - y) < 45));

    positions.push({ x, y });

    numberDiv.style.left = `${x}px`;
    numberDiv.style.top = `${y}px`;

    numberDiv.addEventListener('click', () => handleClick(i, numberDiv));
    gameArea.appendChild(numberDiv);
  }
}

function handleClick(number, element) {
  if (number === nextNumber) {
    element.remove();
    nextNumber++;
    if (nextNumber > 30) {
      clearInterval(timerInterval);
      const finalTime = ((Date.now() - startTime) / 1000).toFixed(2);
      timerDisplay.textContent = `クリア！タイム: ${finalTime}秒`;
	  
	  const playerName = document.getElementById('playerName').value || "名無し";
	        saveRecord(playerName, finalTime);  // ← 名前と一緒に保存
	        showRanking();


    }
  }
}

function updateTimer() {
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  timerDisplay.textContent = `タイム: ${elapsed}秒`;
}


// タイムを保存
function saveRecord(name,time) {
  let records = JSON.parse(localStorage.getItem('ranking')) || [];
  records.push({ name: name, time: parseFloat(time) });
  records.sort((a, b) => a.time - b.time); // 小さい順にソート
  if (records.length > 10) records = records.slice(0, 10); // 上位10件だけ残す
  localStorage.setItem('ranking', JSON.stringify(records));
}

// ランキングを表示
function showRanking() {
  const rankingList = document.getElementById('rankingList');
  rankingList.innerHTML = '';

  const records = JSON.parse(localStorage.getItem('ranking')) || [];
  records.forEach((record, index) => {
    const li = document.createElement('li');
    li.textContent = 	`${index + 1}位: ${record.name} - ${record.time.toFixed(2)}秒`;
    rankingList.appendChild(li);
  });
}