// aiの思考をする関数
function think(_cells, _turn, _level, _settai_mode) {
  const result = miniMax(_cells, _turn, _level, _settai_mode);
  return result[1];
}

// 一番いい手を探す
function miniMax(_cells, _turn, _depth, _settai_mode) {
  const gameState = judge(_cells);

  // 決着がついたら評価値を返す
  if (gameState !== CONTINUE) {
    return [gameState, null];
  }

  if (_depth === 0) {
    return [0, null]; // depthが0なら評価値0で終了
  }

  // 最も良い手の点数を記憶する変数。最低値で初回化しておく
  let bestValue;
  if (_settai_mode) {
    bestValue = _turn === 1 ? Infinity : -Infinity;
  } else {
    bestValue = _turn === 1 ? -Infinity : Infinity;
  }
  let bestMove = null;

  // とりうる手をすべて試す
  const hands = showHands(_cells);
  for (let hand of hands) {
    // コピーを作成して手を指す
    const newCells = structuredClone(_cells);
    newCells[hand[0]][hand[1]] = _turn;

    // 次の手番
    const nextTurn = -_turn;

    // 再帰的に探索してみる
    const [value] = miniMax(newCells, nextTurn, _depth - 1);

    // 良い手だったら記憶しておく
    if (_settai_mode) {
      if (
        (_turn === 1 && value < bestValue) ||
        (_turn === -1 && value > bestValue)
      ) {
        bestValue = value;
        bestMove = hand;
      }
    } else {
      if (
        (_turn === 1 && value > bestValue) ||
        (_turn === -1 && value < bestValue)
      ) {
        bestValue = value;
        bestMove = hand;
      }
    }
  }

  return [bestValue, bestMove];
}

// 打てる場所を全部返す
function showHands(_cells) {
  const hands = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (_cells[row][col] == 0) {
        hands.push([row, col]);
      }
    }
  }
  return hands;
}

// ゲームの状態
const CONTINUE = null; // 決着がついてない
const WIN_PLAYER_1 = 1; // ○の勝利
const WIN_PLAYER_2 = -1; // xの勝利
const DRAW_GAME = 0; // 引き分け

const cells = [
  // カラなら０、　○なら1, xなら-1
  // 二次元配列を記述
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];
let turn = 1; // ○なら１、　xなら-1
let result = CONTINUE;
let mode = "hard";
// 難易度ハード追加

// セルをクリックしたときのイベント登録
for (let row = 0; row < 3; row++) {
  for (let col = 0; col < 3; col++) {
    const cell = document.querySelector(`#cell_${row}_${col}`);
    cell.addEventListener("click", () => {
      if (result !== CONTINUE) {
        window.location.reload(true); // 決着がついた後にクリックしてリロード
      }
      if (cells[row][col] === 0) {
        // 配置可能か判定
        putMark(row, col); // ○かxを配置
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
function putMark(row, col) {
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
    cell.textContent = "✕";
    cell.classList.add("x");
    cells[hand[0]][hand[1]] = -1;
    // -1,を-1;に修正
  }
}
