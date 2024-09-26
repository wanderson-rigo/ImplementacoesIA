function checkWinner(board, player) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    return winPatterns.find(pattern => {
        return pattern.every(index => board[index] === player);
    });
}

function get_children(board, player) {
    const children = [];
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            const child = [...board];
            child[i] = player;
            children.push(child);
        }
    }
    return children;
}

function is_terminal(board) {
    return checkWinner(board, 'X') || checkWinner(board, 'O') || !board.includes('');
}

function evaluate(board) {
    const winnerCells = checkWinner(board, 'X') || checkWinner(board, 'O');
    if(winnerCells) {
        const winner = board[winnerCells[0]]
        return winner === 'X' ? 1 : -1;
    }
    return 0;
}

function minMax(board, depth, isMaximizing, alpha, beta) {
    if(depth == 0 || is_terminal(board)) {
        return evaluate(board);
    }

    if(isMaximizing){
        max_eval = -Infinity;
        for(child in get_children(board, 'X')){
            eval = minMax(child, depth - 1, false, alpha, beta);
            max_eval = Math.max(max_eval, eval);
            alpha = Math.max(alpha, eval);
            if(beta <= alpha){
                break;
            }
        }
        return max_eval
    }else {
        min_eval = Infinity;
        for(child in get_children(board, 'O')){
            eval = minMax(child, depth - 1, true, alpha, beta);
            min_eval = Math.min(min_eval, eval);
            beta = Math.min(beta, eval);
            if(beta <= alpha){
                break;
            }
        }
        return min_eval
    }
}

function printBoard(board) {
    console.log(board.slice(0, 3).join(' | '));
    console.log('---------');
    console.log(board.slice(3, 6).join(' | '));
    console.log('---------');
    console.log(board.slice(6, 9).join(' | '));
    console.log('===================');
}

function simulateGame() {
    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let gameActive = true;

    while (gameActive) {
        printBoard(board);

        if (currentPlayer === 'X') {
            let bestScore = -Infinity;
            let bestMove;
            
            const children = get_children(board, "X");
            for (let child of children) {
                const score = minMax(child, 0, false, -Infinity, Infinity);
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = child;
                }
            }
            board = bestMove;
        } else {
            let worstScore = -Infinity;
            let bestMove;
            
            const children = get_children(board, 'O');
            for (let child of children) {
                const score = minMax(child, 0, true, -Infinity, Infinity);
                if (score > worstScore) {
                    worstScore = score;
                    bestMove = child;
                }
            }
            board = bestMove;
        }

        if (is_terminal(board)) {
            printBoard(board);
            const winnerCells = checkWinner(board, 'X') || checkWinner(board, 'O');
            if (winnerCells) {
                console.log(`Jogador ${board[winnerCells[0]]} ganhou!`);
            } else {
                console.log('Empate!');
            }
            gameActive = false;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
}

simulateGame();