// ゲームの状態
const CONTINUE = null; // 決着がついてない
const WIN_PLAYER_1 = 1; // ○の勝利
const WIN_PLAYER_2 = -1; // ×の勝利
const DRAW_GAME = 0; // 引き分け

const cells =[ // カラなら０、　○なら1, ×なら-1
    // 二次元配列を記述
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],

]
let turn = 1; // ○なら１、　×なら-1
let result = CONTINUE;

// セルをクリックしたときのイベント登録
for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
        const cell = document.querySelector('#cell_${row}_${col}');
        cell.addEventListener("click", () => {
            if (result !== CONTINUE) {
                window.location.reload(true); // 決着がついた後にクリックしてリロード
            }
            if (cells[row][col] === 0) { // 配置可能か判定
            putMark(row, col);　// ○か×を配置
            turn = turn * -1;
            check(); // ゲームの状態を確認
            }
        });
    }
}

// ○か×を配置
function putMark(row,col) {
    const cell = document.querySelector('#cell_${row}_${col}');
    if (turn === 1) {
        cell.textContent ="○"
        cell.classList.add("○")；
        cells[row][col] = 1;
    } else {
        cell.textContent ="×";
        cell.classList.add("×");
        cells[row][col] = -1;
    }
}

// ゲームの状態を確認
function check() {

    
}

// 勝敗を判定する処理
function judge(_cells) {
    // 調べるマス目をラインナップ
    const lines = [
        // 横マスをチェック
        [_cells[0][0], _cells[0][1], _cells[0][2]],
        [_cells[1][0], _cells[1][1], _cells[1][2]],
        [_cells[2][0], _cells[2][1], _cells[2][2]],
        // 縦マスをチェック
        [_cells[0][0], _cells[1][0], _cells[2][0]],
        [_cells[0][1], _cells[1][1], _cells[2][1]],
        [_cells[0][2], _cells[1][2], _cells[2][2]],
        // 斜めマスをチェック
        [_cells[0][0], _cells[1][1], _cells[2][2]],
        [_cells[0][2], _cells[1][1], _cells[2][0]],
    ];
    // 勝敗チェック
    for (let line of lines) {
        const sum = line[0] + line[1] + line[2];
        if (sum === 3) {
            return WIN_PLAYER_1;

        }
        if (sum === -3) {
            return WIN_PLAYER_2;
        }
    }
}
