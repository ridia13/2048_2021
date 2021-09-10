'use strict';
const $table = document.querySelector('#js-table');
const $score = document.querySelector('#js-score');
const $result = document.querySelector('#js-result');
const $cancel = document.querySelector('#js-cancel');
let data = [];
let score = 0;
let history = [];
// data = [//가짜 데이터로 테스트 해보기
//   [2, 64, 2, 2],
//   [1024, 0, 1024, 2],
//   [4, 2, 512, 0],
//   [0, 256, 8, 1024]
// ];



function result(text) {
  $result.textContent = text;
  window.removeEventListener('keyup', keyup);
  window.removeEventListener('mousedown', mousedown);
  window.removeEventListener('mouseup', mouseup);
  $cancel.removeEventListener('click', back)
}

function put2inRandomCell() { //랜덤자리 숫자2 배치(재사용)
  const emptyCells = [];
  data.forEach((rowData, i) => { //빈 자리 찾기
    rowData.forEach((cellData, j) => {
      if (cellData === 0) {
        emptyCells.push([i, j]);
      }
    })
  })
  const emptyRandom = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  data[emptyRandom[0]][emptyRandom[1]] = 2;
}

function draw() { // data를 화면 table에 그리기(재사용)
  data.forEach((rowData, i) => {
    rowData.forEach((cellData, j) => {
      const $target = $table.children[i].cells[j];
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

function createTable() { // 2차원 배열 생성 (4*4) + 화면 그리기
  const $fragment = document.createDocumentFragment();
  [1, 2, 3, 4].forEach((v, i) => {
    const row = [];
    const $tr = document.createElement('tr');
    data.push(row);
    [1, 2, 3, 4].forEach((v, j) => {
      const $td = document.createElement('td');
      row.push(0);
      $tr.append($td);
    })
    $fragment.append($tr);
  })
  $table.append($fragment);
  put2inRandomCell();
  draw();
}

function moveCells(direction) { //방향따라 이동 + 합치기
  history.push({ //이전 정보 저장
    table: JSON.parse(JSON.stringify(data)), //깊은 복사
    score: score
  });

  switch (direction) {
    case 'up': {
      const newData = [
        [],
        [],
        [],
        []
      ];
      data.forEach((rowData, i) => {
        rowData.forEach((cellData, j) => {
          if (cellData) {
            const currentRow = newData[j];
            const preData = currentRow[currentRow.length - 1];
            if (preData === cellData) {
              score += currentRow[currentRow.length - 1] * 2;
              $score.textContent = `${score} score`;
              currentRow[currentRow.length - 1] *= -2;
            } else {
              newData[j].push(cellData);
            }
          }
        })
      })

      data.forEach((rowData, i) => { //이동
        [1, 2, 3, 4].forEach((cellData, j) => {
          data[i][j] = Math.abs(newData[j][i]) || 0;
        })
      })
      break;
    }
    case 'down': {
      const newData = [
        [],
        [],
        [],
        []
      ];
      data.forEach((rowData, i) => {
        rowData.forEach((cellData, j) => {
          if (data[3 - i][j]) {
            const currentRow = newData[j];
            const preData = currentRow[currentRow.length - 1];
            if (preData === data[3 - i][j]) {
              score += currentRow[currentRow.length - 1] * 2
              $score.textContent = `${score} score`;
              currentRow[currentRow.length - 1] *= -2;
            } else {
              newData[j].push(data[3 - i][j]);
            }
          }
        })
      })

      data.forEach((rowData, i) => { //이동
        [1, 2, 3, 4].forEach((cellData, j) => {
          data[3 - j][i] = Math.abs(newData[i][j]) || 0;
        })
      })
      break;
    }
    case 'left': {
      const newData = [
        [],
        [],
        [],
        []
      ];
      data.forEach((rowData, i) => { //왼쪽에 정렬(newData)
        rowData.forEach((cellData, j) => {
          if (cellData) {
            const currentRow = newData[i];
            const preData = currentRow[currentRow.length - 1];
            if (cellData === preData) {
              score += currentRow[currentRow.length - 1] * 2;
              $score.textContent = `${score} score`;
              currentRow[currentRow.length - 1] *= -2;
            } else {
              newData[i].push(cellData);
            }
          }
        })
      })

      data.forEach((rowData, i) => { //여기에서는 [1,2,3,4] error발생함 ㅜ
        [1, 2, 3, 4].forEach((cellData, j) => {
          data[i][j] = Math.abs(newData[i][j]) || 0;
        })
      })
      break;
    }
    case 'right': {
      const newData = [
        [],
        [],
        [],
        []
      ];
      data.forEach((rowData, i) => { //왼쪽에 정렬(newData)
        rowData.forEach((cellData, j) => {
          if (rowData[3 - j]) {
            const currentRow = newData[i];
            const preData = currentRow[currentRow.length - 1];
            if (preData === rowData[3 - j]) {
              score += currentRow[currentRow.length - 1] * 2
              $score.textContent = `${score} score`;
              currentRow[currentRow.length - 1] *= -2;
            } else {
              newData[i].push(rowData[3 - j]);
            }
          }
        })
      })

      data.forEach((rowData, i) => { //여기에서는 [1,2,3,4] error발생함 ㅜ
        [1, 2, 3, 4].forEach((cellData, j) => {
          data[i][3 - j] = Math.abs(newData[i][j]) || 0;
        })
      })
      break;
    }
  }

  if (data.flat().includes(2048)) { //2048 포함 -> 승리
    result('Win!!');
  } else if (!(data.flat().includes(0))) { //빈공간x -> 패배
    result('Lose...');
  } else {
    put2inRandomCell();
  }
  draw();

}

function keyup(e) { //키보드 방향
  if (e.key === 'ArrowUp') {
    moveCells('up');
  } else if (e.key === 'ArrowDown') {
    moveCells('down');
  } else if (e.key === 'ArrowLeft') {
    moveCells('left');
  } else if (e.key === 'ArrowRight') {
    moveCells('right');
  }
}

let startCoord;//마우스 방향
function mousedown(e) {
  startCoord = [e.clientX, e.clientY];
}
function mouseup(e) {
  const endCoord = [e.clientX, e.clientY];
  const diffX = endCoord[0] - startCoord[0];
  const diffY = endCoord[1] - startCoord[1];
  if (Math.abs(diffX) > Math.abs(diffY)) { 
    diffX > 0 ? moveCells('right') : moveCells('left');
  } else if (Math.abs(diffX) < Math.abs(diffY)) {
    diffY > 0 ? moveCells('down') : moveCells('up');
  }
}

function back() {//실행취소 btn
  const preData = history.pop();
  if (!preData) return;
  data = preData.table;
  $score.textContent = `${preData.score} score`;
  draw();
}

function init() {
  createTable();
  window.addEventListener('keyup', keyup);
  window.addEventListener('mousedown', mousedown);
  window.addEventListener('mouseup', mouseup);
  $cancel.addEventListener('click', back)
}
init();
