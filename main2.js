// ゲームの状態
const CONTINUE = null; // 決着がついてない
const WIN_PLAYER_1 = 1; // ○の勝利
const WIN_PLAYER_2 = -1; // xの勝利
const DRAW_GAME = 0; // 引き分け

const cells =[ // カラなら０、　○なら1, xなら-1
    // 二次元配列を記述
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],

]
let turn = 1; // ○なら１、　xなら-1
let result = CONTINUE;
let mode ="hard";
// 難易度ハード追加

// セルをクリックしたときのイベント登録
for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
        const cell = document.querySelector(`#cell_${row}_${col}`);
        cell.addEventListener("click", () => {
            if (result !== CONTINUE) {
                window.location.reload(true); // 決着がついた後にクリックしてリロード
            }
            if (cells[row][col] === 0) { // 配置可能か判定
            putMark(row, col);　// ○かxを配置
            turn = turn * -1;
            thinkAI(); // AIに考えてもらう
            turn = turn * -1;
            check(); // ゲームの状態を確認
            }
        });
    }
}

// モード切替時の処理
const modeElements = document.querySelectorAll("input[name='mode']");
for (let modeElement of modeElements) {
    modeElements.addEventListener("change", (event) => {
        mode = event.target.value;
    });
}

// ○か×を配置
function putMark(row,col) {
    const cell = document.querySelector(`#cell_${row}_${col}`);
    if (turn === 1) {
        // 半角と全角を逆にすると、表示はどうなるか？
        cell.textContent = "〇";
        cell.classList.add("o");
        cells[row][col] = 1;
    } else {
        cell.textContent = "✕";
        cell.classList.add("x");
        cells[row][col] = -1;
    }
}

// ゲームの状態を確認
function check() {
    result = judge(cells);
    const message = document.querySelector("#message");
    switch (result) {
        case WIN_PLAYER_1:
            message.textContent = "〇の勝ち!";
            // message_textContentをmessage.textContentに修正
            break;
        case WIN_PLAYER_2:
            message.textContent = "✕の勝ち!";
            // message_textContentをmessage.textContentに修正
            break;
        case DRAW_GAME:
            message.textContent = "引き分け!";
            // message_textContentをmessage.textContentに修正
            break;

    }
    
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
    // 引き分けチェック
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (_cells[row][col] === 0) {
                return CONTINUE;
            }
        }
    }
    return DRAW_GAME;

}

// AIに考えてもらう
function thinkAI() {
    const hand = think(cells, -1, 9, mode === "easy");
    if (hand) {
        const cell = document.querySelector(`#cell_${hand[0]}_${hand[1]}`); // テンプレートリテラルを修正
        cell.textContent ="✕";
        cell.classList.add("x");
        cells[hand[0]][hand[1]] = -1;
        // -1,を-1;に修正
    }
}
