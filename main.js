'use strict';
const $table = document.querySelector('#js-table');
let data = [];

function createTable() { // 2차원 배열 생성 (4*4) + 화면 그리기
  const $fragment = document.createDocumentFragment();
  [1, 2, 3, 4].forEach((v, ri, arr) => {
    const row = [];
    data.push(row);
    const $tr = document.createElement('tr');
    [1, 2, 3, 4].forEach((v, ci, arr) => {
      row.push(0);
      const $td = document.createElement('td');
      $tr.append($td);
    })
    $fragment.append($tr);
  })
  $table.append($fragment);
  put2inRandomCell();
  draw();
}

function put2inRandomCell() { //랜덤자리 숫자2 배치(재사용)
  const emptyCells = [];
  data.forEach((row, ri, arr) => { //빈 자리 찾기
    row.forEach((cell, ci, arr) => {
      if (cell === 0) {
        emptyCells.push([ri, ci]);
      }
    })
  })
  const emptyRandom = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  data[emptyRandom[0]][emptyRandom[1]] = 2;
}

function draw() { // data에 있는 숫자 그리기(재사용)
  data.forEach((rowData, ri) => {
    rowData.forEach((cellData, ci) => {
      const $target = $table.children[ri].cells[ci];
      if (cellData > 0) {
        $target.textContent = cellData;
        $target.className = 'color-' + cellData;
      } else if (cellData <= 0) {
        $target.textContent = '';
        $target.className = '';
      }
    })
  })
}

function moveCells(direction) {
  console.log(direction);
}


function init() {
  createTable();
  window.addEventListener('keyup', (e) => { //키보드 방향
    if (e.key === 'ArrowUp') {
      moveCells('up');
    } else if (e.key === 'ArrowDown') {
      moveCells('down');
    } else if (e.key === 'ArrowLeft') {
      moveCells('left');
    } else if (e.key === 'ArrowRight') {
      moveCells('right');
    }
  });
  //마우스 방향
  let startCoord;
  window.addEventListener('mousedown', (e) => {
    startCoord = [e.clientX, e.clientY];
  });
  window.addEventListener('mouseup', (e) => {
    const endCoord = [e.clientX, e.clientY];
    const diffX = endCoord[0] - startCoord[0];
    const diffY = endCoord[1] - startCoord[1];
    if (Math.abs(diffX) > Math.abs(diffY)) { //L,R
      diffX > 0 ? moveCells('right') : moveCells('left');
    } else if (Math.abs(diffX) < Math.abs(diffY)) { //U,D
      diffY > 0 ? moveCells('down') : moveCells('up');
    }
  });
}

init();
