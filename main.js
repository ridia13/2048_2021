'use strict';
const $table = document.querySelector('#js-table');
const $score = document.querySelector('#js-score');
const $result = document.querySelector('#js-result');
let data = [];
let score = 0;
// data = [//가짜 데이터로 테스트 해보기(극단적인 상황)
//   [2, 64, 2, 2],
//   [1024, 0, 1024, 2],
//   [4, 2, 512, 0],
//   [0, 256, 8, 1024]
// ];
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


function win(){
  // 2048이 되었나?
  // y 승리msg -> addevent 막기
  // n 대기

   
  data.forEach((rowData, i) => {
    rowData.forEach((cellData, j) => {
      if(cellData === 2048){
        $result.textContent = 'WIN!!';
        window.removeEventListener('keyup', keyup);
        window.removeEventListener('mousedown', mousedown);
        window.removeEventListener('mouseup', mouseup);
      }
    })
  })
}

function lose(){
// 패배경우
// 공간이 없나?

    // 빈셀(===0)이 있나
    // y flag = true + return
    // n flag = false 

    // flag가 false인가
    // y 상하좌우에 같은 수가 있나?
      // y 대기
      // n 패배
    // y 종료msg + removeevent
    // n 대기
  let emptyCell = false;
  data.forEach((rowData, i) => {
    rowData.forEach((cellData, j) => {
      if(!cellData){
        emptyCell = true;
        return;
      }
      
    })
  })
  console.log(emptyCell);
  if(!emptyCell){
    $result.textContent = 'Loseㅠㅠ';
    window.removeEventListener('keyup', keyup);
    window.removeEventListener('mousedown', mousedown);
    window.removeEventListener('mouseup', mouseup);
  }
}

function moveCells(direction) {//방향따라 이동 + 합치기
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
      console.log(newData);
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
      console.log(newData);
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
      console.log(newData);
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
      console.log(newData);
      break;
    }
  }
  
  // 승패 결정
// data에 2048 포함?
// y 축하msg -> 끝
// n data에 0없음(포함x)?
// y 실패msg -> 끝
  if(data.flat().includes(2048)){//2048 포함 -> 승리
    $result.textContent = 'Win!!';
  }else if(!(data.flat().includes(0))){//빈공간x -> 패배
    $result.textContent = 'Loseㅜㅜ';
  }else{
    put2inRandomCell();
  }
  draw();
  
}

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

function keyup(e){//키보드 방향
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

let startCoord;
function mousedown(e){
  startCoord = [e.clientX, e.clientY];
}
function mouseup(e){
  const endCoord = [e.clientX, e.clientY];
    const diffX = endCoord[0] - startCoord[0];
    const diffY = endCoord[1] - startCoord[1];
    if (Math.abs(diffX) > Math.abs(diffY)) { //L,R
      diffX > 0 ? moveCells('right') : moveCells('left');
    } else if (Math.abs(diffX) < Math.abs(diffY)) { //U,D
      diffY > 0 ? moveCells('down') : moveCells('up');
    }
}

function init() {
  createTable();
  window.addEventListener('keyup', keyup);
  //마우스 방향
  window.addEventListener('mousedown', mousedown);
  window.addEventListener('mouseup', mouseup);
}
init();
