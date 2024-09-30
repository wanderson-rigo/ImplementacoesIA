const board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = false;
let vsComputer = false;

const cells = document.querySelectorAll('.cell');
const treeRoot = document.getElementById('tree-root');
const resetButton = document.getElementById('reset-button');
const playVsComputerButton = document.getElementById('play-vs-computer-button');
const playTwoPlayersButton = document.getElementById('play-two-players-button');
const statusDisplay = document.getElementById('status');

cells.forEach(cell => {
  cell.addEventListener('click', handleClick);
});

resetButton.addEventListener('click', resetGame);
playVsComputerButton.addEventListener('click', startGameVsComputer);
playTwoPlayersButton.addEventListener('click', startGameTwoPlayers);

function handleClick(e) {
  const id = e.target.id;
  if (board[id] === "" && gameActive) {
    board[id] = currentPlayer;
    updateBoard();
    if (checkWinner(board, currentPlayer)) {
      highlightWinningCells(board, currentPlayer);
      statusDisplay.textContent = `Jogador ${currentPlayer} venceu!`;
      gameActive = false;
    } else if (!board.includes("")) {
      statusDisplay.textContent = 'Empate!';
      gameActive = false;
    } else {
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      if (vsComputer && currentPlayer === "O") {
        setTimeout(aiMove, 500);
      } else {
        generateNextMoves(board, currentPlayer, treeRoot);
      }
    }
  }
}

function aiMove() {
  if (gameActive) {
    const bestMove = minimax(board, currentPlayer, true);
    board[bestMove.index] = currentPlayer;
    updateBoard();
    if (checkWinner(board, currentPlayer)) {
      highlightWinningCells(board, currentPlayer);
      statusDisplay.textContent = `Computador venceu!`;
      gameActive = false;
    } else if (!board.includes("")) {
      statusDisplay.textContent = 'Empate!';
      gameActive = false;
    } else {
      currentPlayer = "X";
      generateNextMoves(board, currentPlayer, treeRoot);
    }
  }
}

function resetGame() {
  board.fill("");
  cells.forEach(cell => {
    cell.classList.remove("X", "O", "winning-cell");
    cell.removeAttribute('data-value');
  });
  currentPlayer = "X";
  gameActive = false;
  vsComputer = false;
  treeRoot.innerHTML = '';
  statusDisplay.textContent = '';
}

function startGameVsComputer() {
  resetGame();
  vsComputer = true;
  gameActive = true;
  statusDisplay.textContent = 'Jogo iniciado contra o Computador.';
  generateNextMoves(board, currentPlayer, treeRoot);
}

function startGameTwoPlayers() {
  resetGame();
  vsComputer = false;
  gameActive = true;
  statusDisplay.textContent = 'Jogo iniciado entre dois jogadores.';
  generateNextMoves(board, currentPlayer, treeRoot);
}

function updateBoard() {
  board.forEach((val, index) => {
    const cell = cells[index];
    cell.setAttribute('data-value', val);
    cell.classList.toggle('X', val === 'X');
    cell.classList.toggle('O', val === 'O');
  });
}


function checkWinner(board, player) {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Linhas
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Colunas
    [0, 4, 8], [2, 4, 6]             // Diagonais
  ];
  return winPatterns.some(pattern => pattern.every(index => board[index] === player));
}

function highlightWinningCells(board, player) {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  const winningPattern = winPatterns.find(pattern => pattern.every(index => board[index] === player));
  if (winningPattern) {
    winningPattern.forEach(index => {
      cells[index].classList.add("winning-cell");
    });
  }
}

function minimax(newBoard, player, isMaximizing) {
  const availSpots = newBoard.reduce((acc, val, idx) => val === '' ? acc.concat(idx) : acc, []);

  if (checkWinner(newBoard, 'X')) {
    return { score: -10 };
  } else if (checkWinner(newBoard, 'O')) {
    return { score: 10 };
  } else if (availSpots.length === 0) {
    return { score: 0 };
  }

  const moves = [];

  for (let i = 0; i < availSpots.length; i++) {
    const move = {};
    move.index = availSpots[i];
    newBoard[availSpots[i]] = player;

    if (player === 'O') {
      const result = minimax(newBoard, 'X', false);
      move.score = result.score;
    } else {
      const result = minimax(newBoard, 'O', true);
      move.score = result.score;
    }

    newBoard[availSpots[i]] = '';
    moves.push(move);
  }

  let bestMove;
  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = moves[i];
      }
    }
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = moves[i];
      }
    }
  }
  return bestMove;
}

function generateNextMoves(board, player, parent) {
  parent.innerHTML = ''; // Limpar o conteúdo atual

  const availableMoves = board.map((val, index) => val === "" ? index : null).filter(val => val !== null);

  availableMoves.forEach(move => {
    const newBoard = [...board];
    newBoard[move] = player;

    const li = document.createElement('li');
    li.textContent = `Jogador ${player} -> Movimento ${move}`;
    parent.appendChild(li);

    // Cria um mini tabuleiro para mostrar o estado do jogo após o movimento
    const miniBoard = document.createElement('div');
    miniBoard.className = 'mini-board';
    newBoard.forEach((val, index) => {
      const miniCell = document.createElement('div');
      miniCell.className = 'mini-cell ' + val;
      miniCell.setAttribute('data-value', val);
      miniBoard.appendChild(miniCell);
    });
    li.appendChild(miniBoard);
  });
}