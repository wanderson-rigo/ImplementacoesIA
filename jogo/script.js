let timerInterval; // Variável que vai armazenar o intervalo do tempo
let startTime; // Tempo inicial quando o jogo começa
let timeLimit; // Limite de tempo escolhido pelo jogador (em segundos)
let remainingTime; // Tempo restante para o jogo
let timeElapsed = 0;

document.addEventListener("DOMContentLoaded", () => {
  const tiles = document.querySelectorAll(".tile");
  const grid = document.querySelector(".grid");
  const boardStateDisplay = document.getElementById("boardState");
  const inversionsDisplay = document.getElementById("inversionsCount");
  const moveCountDisplay = document.getElementById("moveCount");
  const shuffleButton = document.getElementById("shuffleButton");
  const timerDisplay = document.getElementById("gameTimer");
  const timeLimitInput = document.getElementById("timeLimit");
  const startGameButton = document.getElementById("startGameButton");
  const pauseResumeButton = document.getElementById("pauseResumeButton");


  startGameButton.addEventListener("click", startGame);

  const goalState = [1, 2, 3, 4, 5, 6, 7, 8, 0];
  let moveCount = 0;

  // Inicializa o estado do tabuleiro
  let boardState = Array.from(tiles).map((tile) =>
    parseInt(tile.dataset.value)
  );

  let isPaused = false; // Variável para controlar se o jogo está pausado
    // Event listener para o botão de pausa/retomar
    pauseResumeButton.addEventListener("click", () => {
      if (isPaused) {
        resumeGame();
      } else {
        pauseGame();
      }
    });

    function pauseGame() {
      clearInterval(timerInterval); // Para o temporizador
      isPaused = true;
      pauseResumeButton.textContent = "Retomar"; // Altera o texto do botão para "Retomar"
      grid.classList.add("paused"); // Adiciona uma classe para indicar que o jogo está pausado (opcional)
    }

    function resumeGame() {
      // Calcula o novo tempo de início com base no tempo restante (se houver limite de tempo)
      startTime = Date.now() - timeElapsed * 1000;

      // Reinicia o temporizador
      startTimer();

      isPaused = false;
      pauseResumeButton.textContent = "Pausar"; // Altera o texto do botão para "Pausar"
      grid.classList.remove("paused"); // Remove a classe de pausa (opcional)
    }

    function startTimer() {
      timerInterval = setInterval(() => {
        if (isPaused) return; // Verifica se o jogo está pausado

        // Calcula o tempo decorrido
        timeElapsed = Math.floor((Date.now() - startTime) / 1000);

        if (timeLimit) {
          remainingTime = timeLimit - timeElapsed;

          if (remainingTime <= 0) {
            remainingTime = 0;
            clearInterval(timerInterval);
            timerDisplay.textContent = "TIME: 0s";
            checkGoalState(true);
            stopTimer();
            return;
          }

          // Formata o tempo em minutos e segundos
          const minutes = Math.floor(remainingTime / 60);
          const seconds = remainingTime % 60;
          timerDisplay.textContent = `TIME: ${minutes}m ${
            seconds < 10 ? "0" : ""
          }${seconds}s`;
        } else {
          // Se não houver limite de tempo, mostra o tempo decorrido corretamente
          const minutes = Math.floor(timeElapsed / 60);
          const seconds = timeElapsed % 60;
          timerDisplay.textContent = `TIME: ${minutes}m ${
            seconds < 10 ? "0" : ""
          }${seconds}s`;
        }
      }, 1000);
    }

  function stopTimer() {
    clearInterval(timerInterval);
  }

  function resetTimer() {
    stopTimer();
    timeElapsed = 0;
    timerDisplay.textContent = "Tempo: 0s";
  }

  function startGame() {
    const selectedTimeLimit = timeLimitInput.value.trim();
    if (selectedTimeLimit && parseInt(selectedTimeLimit) > 0) {
      timeLimit = parseInt(selectedTimeLimit) * 60; // Limite de tempo em segundos
    } else {
      timeLimit = null; // Sem limite de tempo
    }
    // Inicializa o tempo decorrido e o tempo inicial
    timeElapsed = 0;
    startTime = Date.now(); 
    remainingTime = timeLimit;
    moveCount = 0;

    //shuffleBoard();

    if (timeLimit !== null) {
      startTimer(); // Inicia com o limite de tempo
    } else {
      resetTimer(); // Sem limite, reseta e começa sem temporizador
      startTimer(); // Começa apenas mostrando o tempo decorrido
    }
    updateDisplay(); // Atualiza a exibição após iniciar o jogo
  }

  document.getElementById("calculateParityButton").addEventListener("click", () => {
      const input = document.getElementById("customBoard").value.split(",").map(Number);

      // Verifique se o input tem exatamente 9 valores e contém números de 0 a 8
      if (
        input.length !== 9 ||!input.every((val) => val >= 0 && val <= 8 &&
            input.indexOf(val) === input.lastIndexOf(val)
        )
      ) {
        document.getElementById("customBoardResult").textContent =
          "Por favor, insira um tabuleiro válido (números de 0 a 8 sem repetir).";
        return;
      }

      const inversions = calculateInversions(input);
      const parity = inversions % 2 === 0 ? "par" : "ímpar";

      document.getElementById(
        "customBoardResult"
      ).textContent = `Inversões: ${inversions}, Paridade: ${parity}`;
    });

  function calculateInversions(state) {
    let inversions = 0;
    for (let i = 0; i < state.length - 1; i++) {
      for (let j = i + 1; j < state.length; j++) {
        if (state[i] > state[j] && state[i] !== 0 && state[j] !== 0) {
          inversions++;
        }
      }
    }
    return inversions;
  }

  function updateDisplay() {
    // Exibe o estado do tabuleiro na página
    boardStateDisplay.textContent = `Estado atual: [${boardState.join(", ")}]`;

    // Calcula e exibe o número de inversões e a paridade
    const inversions = calculateInversions(boardState);
    const parity = inversions % 2 === 0 ? "par" : "ímpar";
    inversionsDisplay.textContent = `Inversões: ${inversions} (Paridade: ${parity})`;

    // Exibe o número de jogadas
    moveCountDisplay.textContent = `Número de jogadas: ${moveCount}`;

    // Calcula e exibe a distância Manhattan
    const manhattanDistance = calculateManhattan(boardState);
    document.getElementById("manhattanDistance" ).textContent = `Distância Manhattan: ${manhattanDistance}`;

    // Calcula e exibe o número de peças fora do lugar
    const misplacedCount = countMisplacedTiles(boardState, goalState);document.getElementById(
      "misplacedCount"
    ).textContent = `Peças fora do lugar: ${misplacedCount}`;
  }

  function shuffleBoard() {
    // Embaralha o estado do tabuleiro
    do {
      boardState = boardState.sort(() => Math.random() - 0.5);
    } while (calculateInversions(boardState) % 2 !== 0); // Garante que o estado seja resolvível

    moveCount = 0; // Reseta o contador de jogadas

    // Atualiza o conteúdo visual
    tiles.forEach((tile, index) => {
      tile.textContent = boardState[index] === 0 ? "" : boardState[index];
      tile.dataset.value = boardState[index];

      if (boardState[index] === 0) {
        tile.classList.add("empty");
      } else {
        tile.classList.remove("empty");
      }
    });
    resetTimer(); // Reseta o timer ao embaralhar
    updateDisplay(); // Atualiza as exibições
  }

  updateDisplay(); // Atualiza a exibição inicialmente

  grid.addEventListener("click", (e) => {
    const tile = e.target;
    if (tile.classList.contains("tile")) {
      moveTile(tile);
    }
  });

  shuffleButton.addEventListener("click", shuffleBoard);

  function moveTile(tile) {
    const emptyTile = document.querySelector(".tile.empty");
    const tileIndex = Array.from(tiles).indexOf(tile);
    const emptyTileIndex = Array.from(tiles).indexOf(emptyTile);

    // Define movimentos válidos (esquerda, direita, cima, baixo)
    const validMoves = {
      0: [1, 3],
      1: [0, 2, 4],
      2: [1, 5],
      3: [0, 4, 6],
      4: [1, 3, 5, 7],
      5: [2, 4, 8],
      6: [3, 7],
      7: [4, 6, 8],
      8: [5, 7],
    };

    if (validMoves[emptyTileIndex].includes(tileIndex)) {
      // Troca de posição entre a peça clicada e a peça vazia
      [boardState[tileIndex], boardState[emptyTileIndex]] = [
        boardState[emptyTileIndex],
        boardState[tileIndex],
      ];

      // Atualiza o conteúdo visual
      tile.textContent =
        boardState[tileIndex] === 0 ? "" : boardState[tileIndex];
      emptyTile.textContent =
        boardState[emptyTileIndex] === 0 ? "" : boardState[emptyTileIndex];

      // Troca as classes para manter a peça vazia correta
      tile.classList.add("empty");
      emptyTile.classList.remove("empty");

      // Incrementa o contador de jogadas
      moveCount++;

      // Atualiza as exibições
      updateDisplay();

      // Verifica se o estado atual do tabuleiro é o estado de objetivo
      checkGoalState();
    }
  }

  function checkGoalState(timeOver = false) {
    if (JSON.stringify(boardState) === JSON.stringify(goalState)) {
      stopTimer();

      // Calcula o tempo formatado
      const minutes = Math.floor(timeElapsed / 60);
      const seconds = timeElapsed % 60;
      const formattedTime = `${minutes}m ${seconds < 10 ? "0" : ""}${seconds}s`;

      // Exibe a mensagem com o número de jogadas e o tempo gasto
      alert(
        `Parabéns! Você completou o puzzle em ${moveCount} jogadas e ${formattedTime}!`
      );
    } else if (timeOver) {
      alert("O tempo acabou! Você não conseguiu resolver o puzzle a tempo.");
    }
  }

  function calculateManhattan(state) {
    let distance = 0;
    const goalPositions = [
      [0, 0],[0, 1],[0, 2], // Posições corretas para 1, 2, 3
      [1, 0],[1, 1],[1, 2], // Posições corretas para 4, 5, 6
      [2, 0], [2, 1], [2, 2], // Posições corretas para 7, 8, 0
    ];

    state.forEach((value, index) => {
      if (value !== 0) {
        const currentRow = Math.floor(index / 3);
        const currentCol = index % 3;
        const goalRow = goalPositions[value - 1][0];
        const goalCol = goalPositions[value - 1][1];
        distance +=
          Math.abs(currentRow - goalRow) + Math.abs(currentCol - goalCol);
      }
    });
    return distance;
  }

  function countMisplacedTiles(state, goal) {
    let count = 0;
    for (let i = 0; i < state.length; i++) {
      if (state[i] !== goal[i] && state[i] !== 0) {
        count++;
      }
    }
    return count;
  }
});
