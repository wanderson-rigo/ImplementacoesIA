// script.js

// IIFE para encapsular o código e evitar poluição do escopo global
(() => {
  'use strict';

  // Seleciona elementos do DOM
  const tiles = document.querySelectorAll('.tile');
  const grid = document.querySelector('.grid');
  const boardStateDisplay = document.getElementById('boardState');
  const inversionsDisplay = document.getElementById('inversionsCount');
  const moveCountDisplay = document.getElementById('moveCount');
  const shuffleButton = document.getElementById('shuffleButton');
  const manhattanDistanceDisplay = document.getElementById('manhattanDistance');
  const misplacedTilesDisplay = document.getElementById('misplacedTiles');
  const swapLog = document.getElementById('swapLog');
  const customStateInput = document.getElementById('customStateInput');
  const setCustomStateButton = document.getElementById('setCustomStateButton');
  const solveButton = document.getElementById('solveButton');
  const solveButtonBFS = document.getElementById('solveButtonBFS');

  // Estado meta do puzzle
  const goalState = [1, 2, 3, 4, 5, 6, 7, 8, 0];
  let moveCount = 0; // Contador de movimentos

  // Inicializa o estado do tabuleiro
  let boardState = Array.from(tiles).map(tile => parseInt(tile.dataset.value));

  /**
   * Calcula o número de inversões no estado atual.
   * @param {Array} state - O estado atual do tabuleiro.
   * @returns {number} - O número total de inversões.
   */
  const calculateInversions = state => {
    let inversions = 0;
    for (let i = 0; i < state.length - 1; i++) {
      for (let j = i + 1; j < state.length; j++) {
        if (state[i] > state[j] && state[i] !== 0 && state[j] !== 0) {
          inversions++;
        }
      }
    }
    return inversions;
  };

  /**
   * Calcula a distância Manhattan do estado atual em relação ao estado meta.
   * @param {Array} state - O estado atual do tabuleiro.
   * @returns {number} - A distância Manhattan total.
   */
  const calculateManhattanDistance = state => {
    let distance = 0;
    for (let i = 0; i < state.length; i++) {
      if (state[i] !== 0) {
        const currentRow = Math.floor(i / 3);
        const currentCol = i % 3;
        const targetRow = Math.floor((state[i] - 1) / 3);
        const targetCol = (state[i] - 1) % 3;
        distance += Math.abs(currentRow - targetRow) + Math.abs(currentCol - targetCol);
      }
    }
    return distance;
  };

  /**
   * Calcula o número de peças fora do lugar no estado atual.
   * @param {Array} state - O estado atual do tabuleiro.
   * @returns {number} - O número de peças fora do lugar.
   */
  const calculateMisplacedTiles = state => {
    let misplaced = 0;
    for (let i = 0; i < state.length; i++) {
      if (state[i] !== 0 && state[i] !== goalState[i]) {
        misplaced++;
      }
    }
    return misplaced;
  };

  /**
   * Atualiza as exibições na interface com base no estado atual.
   */
  const updateDisplay = () => {
    // Exibe o estado do tabuleiro na página
    boardStateDisplay.textContent = `Estado atual: [${boardState.join(', ')}]`;

    // Calcula e exibe o número de inversões e a paridade
    const inversions = calculateInversions(boardState);
    const parity = inversions % 2 === 0 ? "par" : "ímpar";
    inversionsDisplay.textContent = `Inversões: ${inversions} (Paridade: ${parity})`;

    // Calcula e exibe a distância Manhattan
    const manhattanDistance = calculateManhattanDistance(boardState);
    manhattanDistanceDisplay.textContent = `Distância Manhattan: ${manhattanDistance}`;

    // Calcula e exibe as peças fora do lugar
    const misplacedTiles = calculateMisplacedTiles(boardState);
    misplacedTilesDisplay.textContent = `Peças fora do lugar: ${misplacedTiles}`;

    // Exibe o número de jogadas
    moveCountDisplay.textContent = `Número de jogadas: ${moveCount}`;

    // Atualiza a classe das peças para indicar se estão fora do lugar
    tiles.forEach((tile, index) => {
      const value = parseInt(tile.dataset.value);
      if (value !== 0 && value !== goalState[index]) {
        tile.classList.add('misplaced');
      } else {
        tile.classList.remove('misplaced');
      }
    });
  };

  /**
   * Verifica se o estado atual é igual ao estado meta.
   * @returns {boolean} - True se o estado atual é o estado meta.
   */
  const checkGoalState = () => {
    if (arraysEqual(boardState, goalState)) {
      alert(`Você resolveu o puzzle em ${moveCount} jogadas!`);
      return true;
    }
    return false;
  };

  /**
   * Embaralha o tabuleiro para um estado inicial solucionável.
   */
  const shuffleBoard = () => {
    // Embaralha o estado do tabuleiro
    do {
      boardState = boardState.sort(() => Math.random() - 0.5);
    } while (calculateInversions(boardState) % 2 !== 0); // Garante que o estado seja resolvível

    moveCount = 0; // Reseta o contador de jogadas
    swapLog.innerHTML = 'Trocas realizadas:<br>'; // Reseta o log de trocas

    // Atualiza o conteúdo visual
    tiles.forEach((tile, index) => {
      tile.textContent = boardState[index] === 0 ? "" : boardState[index];
      tile.dataset.value = boardState[index];

      if (boardState[index] === 0) {
        tile.classList.add('empty');
      } else {
        tile.classList.remove('empty');
      }
    });

    // Atualiza as exibições
    updateDisplay();
  };

  /**
   * Move uma peça adjacente ao espaço vazio.
   * @param {Element} tile - O elemento da peça a ser movida.
   */
  const moveTile = tile => {
    const emptyTile = document.querySelector('.tile.empty');
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
      8: [5, 7]
    };

    if (validMoves[emptyTileIndex].includes(tileIndex)) {
      // Troca de posição entre a peça clicada e a peça vazia
      [boardState[tileIndex], boardState[emptyTileIndex]] = [boardState[emptyTileIndex], boardState[tileIndex]];

      // Atualiza o conteúdo visual
      tile.textContent = boardState[tileIndex] === 0 ? "" : boardState[tileIndex];
      emptyTile.textContent = boardState[emptyTileIndex] === 0 ? "" : boardState[emptyTileIndex];

      // Atualiza o dataset.value das peças
      tile.dataset.value = boardState[tileIndex];
      emptyTile.dataset.value = boardState[emptyTileIndex];

      // Troca as classes para manter a peça vazia correta
      tile.classList.add('empty');
      emptyTile.classList.remove('empty');

      // Registra a troca
      swapLog.innerHTML += `Troca: posição ${tileIndex} com posição ${emptyTileIndex}<br>`;

      // Incrementa o contador de jogadas
      moveCount++;

      // Atualiza as exibições
      updateDisplay();

      // Verifica se o estado meta foi alcançado
      checkGoalState();
    }
  };

  /**
   * Compara dois arrays para verificar se são iguais.
   * @param {Array} a - Primeiro array.
   * @param {Array} b - Segundo array.
   * @returns {boolean} - True se os arrays são iguais.
   */
  const arraysEqual = (a, b) => {
    return a.length === b.length && a.every((val, index) => val === b[index]);
  };

  /**
   * Obtém os vizinhos (estados possíveis) do estado atual.
   * @param {Array} state - O estado atual do tabuleiro.
   * @returns {Array} - Lista de vizinhos.
   */
  const getNeighbors = state => {
    const neighbors = [];
    const emptyIndex = state.indexOf(0);
    const possibleMoves = {
      0: [1, 3],
      1: [0, 2, 4],
      2: [1, 5],
      3: [0, 4, 6],
      4: [1, 3, 5, 7],
      5: [2, 4, 8],
      6: [3, 7],
      7: [4, 6, 8],
      8: [5, 7]
    };

    for (let move of possibleMoves[emptyIndex]) {
      const newState = state.slice();
      [newState[emptyIndex], newState[move]] = [newState[move], newState[emptyIndex]];
      neighbors.push({ state: newState });
    }

    return neighbors;
  };

  /**
   * Reconstrói o caminho da solução a partir do mapa de caminhos.
   * @param {Map} cameFrom - Mapa de estados anteriores.
   * @param {Array} currentState - O estado final.
   * @returns {Array} - O caminho da solução.
   */
  const reconstructPath = (cameFrom, currentState) => {
    const totalPath = [currentState];
    while (cameFrom.has(currentState.toString())) {
      currentState = cameFrom.get(currentState.toString());
      totalPath.unshift(currentState);
    }
    return totalPath;
  };

  /**
   * Implementa o algoritmo A* para resolver o puzzle.
   * @param {Array} startState - O estado inicial do tabuleiro.
   * @returns {Object} - Objeto contendo o caminho da solução e métricas.
   */
  const aStarSearch = startState => {
    const startTime = performance.now();
    let nodesExpanded = 0;

    const openSet = [];
    const closedSet = new Set();
    const cameFrom = new Map();

    openSet.push({
      state: startState,
      g: 0,
      h: calculateManhattanDistance(startState),
      f: 0 + calculateManhattanDistance(startState),
    });

    while (openSet.length > 0) {
      // Ordena o openSet pelo menor valor de f
      openSet.sort((a, b) => a.f - b.f);
      const current = openSet.shift();

      if (arraysEqual(current.state, goalState)) {
        const endTime = performance.now();
        const executionTime = (endTime - startTime) / 1000;
        const path = reconstructPath(cameFrom, current.state);
        return {
          path: path,
          nodesExpanded: nodesExpanded,
          executionTime: executionTime,
          depth: path.length - 1
        };
      }

      closedSet.add(current.state.toString());
      nodesExpanded++;

      const neighbors = getNeighbors(current.state);

      for (let neighbor of neighbors) {
        if (closedSet.has(neighbor.state.toString())) {
          continue;
        }

        const tentativeG = current.g + 1;

        let neighborInOpenSet = openSet.find(node => arraysEqual(node.state, neighbor.state));

        if (!neighborInOpenSet) {
          neighborInOpenSet = {
            state: neighbor.state,
            g: tentativeG,
            h: calculateManhattanDistance(neighbor.state),
            f: tentativeG + calculateManhattanDistance(neighbor.state),
          };
          cameFrom.set(neighbor.state.toString(), current.state);
          openSet.push(neighborInOpenSet);
        } else if (tentativeG < neighborInOpenSet.g) {
          neighborInOpenSet.g = tentativeG;
          neighborInOpenSet.f = tentativeG + neighborInOpenSet.h;
          cameFrom.set(neighbor.state.toString(), current.state);
        }
      }
    }

    const endTime = performance.now();
    const executionTime = (endTime - startTime) / 1000;

    return {
      path: null,
      nodesExpanded: nodesExpanded,
      executionTime: executionTime,
      depth: 0
    }; // Sem solução
  };

  /**
   * Implementa o algoritmo de Busca em Largura (BFS).
   * @param {Array} startState - O estado inicial do tabuleiro.
   * @returns {Object} - Objeto contendo o caminho da solução e métricas.
   */
  const bfs = startState => {
    const startTime = performance.now();
    let nodesExpanded = 0;

    const queue = [];
    const visited = new Set();
    const cameFrom = new Map();

    queue.push(startState);
    visited.add(startState.toString());

    while (queue.length > 0) {
      const currentState = queue.shift();

      if (arraysEqual(currentState, goalState)) {
        const endTime = performance.now();
        const executionTime = (endTime - startTime) / 1000;
        const path = reconstructPath(cameFrom, currentState);
        return {
          path: path,
          nodesExpanded: nodesExpanded,
          executionTime: executionTime,
          depth: path.length - 1
        };
      }

      nodesExpanded++;
      const neighbors = getNeighbors(currentState);

      for (let neighbor of neighbors) {
        const neighborStateStr = neighbor.state.toString();
        if (!visited.has(neighborStateStr)) {
          visited.add(neighborStateStr);
          cameFrom.set(neighbor.state.toString(), currentState);
          queue.push(neighbor.state);
        }
      }
    }

    const endTime = performance.now();
    const executionTime = (endTime - startTime) / 1000;

    return {
      path: null,
      nodesExpanded: nodesExpanded,
      executionTime: executionTime,
      depth: 0
    };
  };

  /**
   * Anima a solução passo a passo e registra as trocas.
   * @param {Array} solution - O caminho da solução.
   */
  const animateSolution = solution => {
    swapLog.innerHTML = 'Trocas realizadas:<br>'; // Limpa o log de trocas

    let index = 1; // Inicia a partir do segundo estado
    let previousState = solution[0];

    // Atualiza o estado inicial
    boardState = previousState;
    tiles.forEach((tile, idx) => {
      tile.textContent = boardState[idx] === 0 ? "" : boardState[idx];
      tile.dataset.value = boardState[idx];

      if (boardState[idx] === 0) {
        tile.classList.add('empty');
      } else {
        tile.classList.remove('empty');
      }
    });
    updateDisplay();

    const interval = setInterval(() => {
      if (index >= solution.length) {
        clearInterval(interval);
        return;
      }

      const currentState = solution[index];

      // Identifica o movimento realizado
      const emptyIndexPrev = previousState.indexOf(0);
      const emptyIndexCurrent = currentState.indexOf(0);

      // A peça que se moveu está na posição do espaço vazio atual no estado anterior
      const tileMoved = previousState[emptyIndexCurrent];

      // Registra o movimento no log
      swapLog.innerHTML += `Movimento: peça ${tileMoved} da posição ${emptyIndexCurrent} para posição ${emptyIndexPrev}<br>`;

      // Atualiza o estado do tabuleiro
      boardState = currentState;
      tiles.forEach((tile, idx) => {
        tile.textContent = boardState[idx] === 0 ? "" : boardState[idx];
        tile.dataset.value = boardState[idx];

        if (boardState[idx] === 0) {
          tile.classList.add('empty');
        } else {
          tile.classList.remove('empty');
        }
      });

      updateDisplay();
      index++;
      previousState = currentState;
    }, 500); // Ajuste o intervalo conforme necessário
  };

  /**
   * Inicia a solução do puzzle usando o algoritmo A*.
   */
  const solvePuzzle = () => {
    // Desabilita o botão e altera o estado visual
    solveButton.disabled = true;
    solveButton.classList.add('loading');

    // Executa o algoritmo A* em um timeout para permitir atualização da interface
    setTimeout(() => {
      const result = aStarSearch(boardState);

      // Reativa o botão e restaura o estado visual
      solveButton.disabled = false;
      solveButton.classList.remove('loading');

      if (result.path) {
        alert(`Solução encontrada!
Tempo de execução: ${result.executionTime.toFixed(2)} segundos
Nós expandidos: ${result.nodesExpanded}
Profundidade da solução: ${result.depth}`);
        animateSolution(result.path);
      } else {
        alert('Nenhuma solução encontrada.');
      }
    }, 100); // Pequeno atraso para garantir que a interface seja atualizada
  };

  /**
   * Inicia a solução do puzzle usando o algoritmo BFS.
   */
  const solvePuzzleBFS = () => {
    // Desabilita o botão e altera o estado visual
    solveButtonBFS.disabled = true;
    solveButtonBFS.classList.add('loading');

    // Executa o algoritmo BFS em um timeout para permitir atualização da interface
    setTimeout(() => {
      const result = bfs(boardState);

      // Reativa o botão e restaura o estado visual
      solveButtonBFS.disabled = false;
      solveButtonBFS.classList.remove('loading');

      if (result.path) {
        alert(`Solução encontrada!
Tempo de execução: ${result.executionTime.toFixed(2)} segundos
Nós expandidos: ${result.nodesExpanded}
Profundidade da solução: ${result.depth}`);
        animateSolution(result.path);
      } else {
        alert('Nenhuma solução encontrada.');
      }
    }, 100); // Pequeno atraso para garantir que a interface seja atualizada
  };

  /**
   * Define um estado personalizado para o tabuleiro.
   */
  const setCustomState = () => {
    const input = customStateInput.value.trim();
    const newState = input.split(',').map(num => parseInt(num));

    if (newState.length !== 9 || newState.includes(NaN)) {
      alert('Por favor, insira exatamente 9 números separados por vírgulas.');
      return;
    }

    // Verifica se os números são de 0 a 8 sem repetição
    const validNumbers = [...Array(9).keys()]; // [0,1,2,3,4,5,6,7,8]
    if (!validNumbers.every(num => newState.includes(num))) {
      alert('Os números devem ser de 0 a 8, sem repetição.');
      return;
    }

    // Calcula a paridade
    const inversions = calculateInversions(newState);
    if (inversions % 2 !== 0) {
      alert('O estado inserido não é solucionável (paridade ímpar).');
      return;
    }

    // Atualiza o estado do tabuleiro
    boardState = newState;
    moveCount = 0; // Reseta o contador de jogadas
    swapLog.innerHTML = 'Trocas realizadas:<br>'; // Reseta o log de trocas

    // Atualiza o conteúdo visual
    tiles.forEach((tile, index) => {
      tile.textContent = boardState[index] === 0 ? "" : boardState[index];
      tile.dataset.value = boardState[index];

      if (boardState[index] === 0) {
        tile.classList.add('empty');
      } else {
        tile.classList.remove('empty');
      }
    });

    // Atualiza as exibições
    updateDisplay();
  };

  // Eventos de interface

  // Clique nas peças
  grid.addEventListener('click', e => {
    const tile = e.target;
    if (tile.classList.contains('tile')) {
      moveTile(tile);
    }
  });

  // Botão de embaralhar
  shuffleButton.addEventListener('click', shuffleBoard);

  // Botão de resolver com A*
  solveButton.addEventListener('click', solvePuzzle);

  // Botão de resolver com BFS
  solveButtonBFS.addEventListener('click', solvePuzzleBFS);

  // Botão de definir estado personalizado
  setCustomStateButton.addEventListener('click', setCustomState);

  // Atualiza a exibição inicialmente
  updateDisplay();
})();
