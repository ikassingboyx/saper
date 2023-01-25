const saper = document.querySelector(".saper");
const wyslij = document.querySelector("#wyslij");
const szrokosc = document.querySelector("#szerokosc");
const wysokosc = document.querySelector("#wysokosc");
const miny = document.querySelector("#miny");
const bombsLeft = document.querySelector(".bombsLeft");
const win = document.querySelector(".win");
const lose = document.querySelector(".lose");
const blure = document.querySelector(".blure");
const l1 = document.querySelector("#label1");
const l2 = document.querySelector("#label2");
const l3 = document.querySelector("#label3");
const msg = document.querySelector(".msg");
const msg2 = document.querySelector(".msg2");
const czas = document.querySelector(".czas");
var timerSpan = document.querySelector("#timer");
const l4 = document.querySelector("#label4");
const nick = document.querySelector("#nick");
var interval;
function createBoard(col, row, min, minArr) {
  const reset = document.querySelector("#reset");
  l1.style = "display:none";
  l2.style = "display:none";
  l3.style = "display:none";
  l4.style = "display:none";
  nick.style = "display:none";
  szrokosc.style = "display:none";
  wysokosc.style = "display:none";
  miny.style = "display:none";
  wyslij.style = "display:none";
  reset.style = "display:flex";
  const board = [];
  bombsLeft.innerHTML = "💣: " + min;
  for (let x = 0; x < col; x++) {
    debugger;
    const rows = [];
    for (let y = 0; y < row; y++) {
      const saperDiv = document.createElement("div");
      saperDiv.classList.add("notChecked");
      const box = {
        saperDiv,
        x,
        y,
        mine: minArr.some(isEqueal.bind(null, { x, y })),
      };
      rows.push(box);
      saper.appendChild(saperDiv);
    }
    board.push(rows);
  }
  interval = timer();
  return board;
}
function createBoardHeightWidth(col, row) {
  saper.style.display = "inline-grid";
  saper.style.setProperty("--width", row);
  saper.style.setProperty("--height", col);
}

function setMinesCoordinates(col, row, min) {
  const minesArr = [];

  while (minesArr.length < min) {
    const coordinates = {
      x: Math.floor(Math.random() * col),
      y: Math.floor(Math.random() * row),
    };
    if (!minesArr.some((d) => isEqueal(d, coordinates))) {
      minesArr.push(coordinates);
    }
  }
  return minesArr;
}

function isEqueal(cor1, cor2) {
  if (cor1.x === cor2.x && cor1.y === cor2.y) {
    return true;
  } else {
    return false;
  }
}

function flag(box, x) {
  if (
    box.saperDiv.classList.contains("notChecked") ||
    box.saperDiv.classList.contains("flag")
  ) {
    if (box.saperDiv.classList.contains("notChecked") && x > 0) {
      x = x - 1;
      bombsLeft.innerHTML = "💣: " + x;
      box.saperDiv.classList.remove("notChecked");
      box.saperDiv.classList.add("flag");
      return x;
    } else if (box.saperDiv.classList.contains("flag")) {
      x = x + 1;
      bombsLeft.innerHTML = "💣: " + x;
      box.saperDiv.classList.remove("flag");
      box.saperDiv.classList.add("notChecked");
      return x;
    } else {
      return x;
    }
  } else {
    return x;
  }
}

function checkBombsAndFlags(saperBoard) {
  let d = 0;
  for (var i = 0; i < saperBoard.length; i++) {
    for (var j = 0; j < saperBoard[i].length; j++) {
      let board = saperBoard[i][j];
      if (board.mine && board.saperDiv.classList.contains("flag")) {
        d = d + 1;
      }
    }
  }
  return d;
}
function checkWin(wwa, min) {
  if (wwa == min) {
    blure.style = "display:flex";
    win.style = "display:flex";
    win.innerHTML = `Wygrałeś gratulacje!🎉 \n
    Twój czas: ${timerSpan.innerHTML}`;
    return true;
  }
}

function leftClick(board, box) {
  if (!box.saperDiv.classList.contains("notChecked")) {
    return;
  }
  if (box.mine === true) {
    showAllBombs(board);
    box.saperDiv.classList.remove("mine");
    box.saperDiv.classList.add("mineRed");
    return;
  }
  box.saperDiv.classList.remove("notChecked");
  box.saperDiv.classList.add("number");
  const tiles = nextTiles(board, box);
  const nextMines = tiles.filter((t) => t.mine);
  if (nextMines.length === 0) {
    tiles.forEach(leftClick.bind(null, board));
  } else {
    box.saperDiv.innerHTML = nextMines.length;
  }
}

function nextTiles(board, { x, y }) {
  const numberOfTiles = [];
  for (let nextX = -1; nextX <= 1; nextX++) {
    for (let nextY = -1; nextY <= 1; nextY++) {
      const tile = board[x + nextX]?.[y + nextY];
      if (tile) numberOfTiles.push(tile);
    }
  }
  return numberOfTiles;
}

function restart() {
  location.reload();
  return false;
}
function showAllBombs(saperBoard) {
  msg.innerHTML = "Przegrałeś!!! 😪😥😭😢";
  msg2.innerHTML = 'Kliknij przycisk "Reset" by spróbować ponownie';
  clearInterval(interval);
  for (let i = 0; i < saperBoard.length; i++) {
    for (let j = 0; j < saperBoard[i].length; j++) {
      let board = saperBoard[i][j];
      if (board.mine === true) {
        board.saperDiv.classList.remove("notChecked");
        board.saperDiv.classList.add("mine");
      }
    }
  }
}

function timer() {
  const date = new Date();
  let start = date.getTime();
  let min, sec, milsec;
  x = setInterval(() => {
    const diff = new Date().getTime() - start;
    min = parseInt(diff / 1000 / 60);
    min = min < 10 ? "0" + min : min;
    sec = parseInt(diff / 1000);
    sec = sec < 10 ? "0" + sec : sec;
    if (sec > 60) sec %= 60;
    milsec = diff;
    if (milsec > 1000) milsec %= 1000;
    timerSpan.innerHTML = `${min}.${sec}.${milsec}`;
  }, 10);
  return x;
}

function setCookie(accNick, time, row, col, min) {
  if (accNick == "") {
    accNick = `Gosc`;
  }
  var records = document.cookie;
  let size = `${col}x${row}x${min}`;
  if (records.includes(size)) {
    records = document.cookie.split("; ");
    for (let i = 0; i < records.length; i++) {
      records[i] = records[i].split("=");
      if (records[i][0] == size) {
        document.cookie = `${size}=${records[i][1]}${accNick}_${time}|`;
      }
    }
  } else {
    document.cookie = `${size}=${accNick}_${time}|`;
  }
}
function displayRecords(col, row, min) {
  function compareSecondColumn(x, y) {
    ax = x[1].split(".");
    for (let a = 0; a < ax.length; a++) {
      var bx = bx + ax[a];
    }
    ay = y[1].split(".");
    for (let a = 0; a < ay.length; a++) {
      var by = by + ay[a];
    }
    if (bx === by) {
      return 0;
    } else {
      return bx < by ? -1 : 1;
    }
  }
  const elo = document.querySelector(".records");
  elo.style = "display: flex;";
  var records = document.cookie;
  let size = `${col}x${row}x${min}`;
  let arr = [];
  records = document.cookie.split("; ");
  for (let i = 0; i < records.length; i++) {
    records[i] = records[i].split("=");
    if (records[i][0] == size) {
      records[i][1] = records[i][1].split("|");
      for (let j = 0; j < records[i][1].length; j++) {
        arr.push(records[i][1][j].split("_"));
      }
    }
  }
  arr.pop();
  arr.sort(compareSecondColumn);
  for (let i = 0; i < arr.length && i < 10; i++) {
    const d = document.createElement("div");
    elo.appendChild(d);
    d.classList.add("recordRow");
    d.innerHTML += `${i + 1}: ${arr[i][0]} - ${arr[i][1]}`;
  }
}

blure.addEventListener("click", restart);
reset.addEventListener("click", restart);

function createSaper() {
  const col = szrokosc.value;
  const row = wysokosc.value;
  let min = miny.value;
  const accNick = nick.value;
  const q = (col - 1 + row - 1) / 2
  if (col > 50 || col < 2) {
    l1.style.color = "red"
    szrokosc.value = 50
    return
  }
  if (row > 50 || row < 2) {
    l2.style.color = "red"
    wysokosc.value = 50
    return
  }
  if (min > q) {

    l3.style.color = "red"

    return;
  }
  let b = min;
  let wwa = 0;
  createBoardHeightWidth(col, row);
  const minArr = setMinesCoordinates(col, row, min);
  displayRecords(col, row, min);
  const saperBoard = createBoard(col, row, min, minArr);
  console.log(saperBoard)
  for (var i = 0; i < saperBoard.length; i++) {
    for (var j = 0; j < saperBoard[i].length; j++) {
      let board = saperBoard[i][j];
      board.saperDiv.addEventListener("click", (w) => {
        leftClick(saperBoard, board);
      });
      board.saperDiv.addEventListener("contextmenu", (d) => {
        d.preventDefault();
        b = flag(board, b);
        wwa = checkBombsAndFlags(saperBoard);
        let w = checkWin(wwa, min);
        if (w) {
          clearInterval(interval);
          const time = timerSpan.innerHTML;
          setCookie(accNick, time, col, row, min);
        }
      });
    }
  }
}

wyslij.addEventListener("click", createSaper);
