const game = (function () {
  let _currentClickedIdx;
  let _isGameStarted = false;
  let _isComputersTurn = false;
  let _isPlayersTurn = false;
  let _isGameOver = false;

  const _markerOptions = {
    x: 'x',
    o: 'o',
  };

  const players = {
    player1: {
      name: 'Loki',
      marker: _markerOptions.x,
    },
    player2: {
      name: 'Magneto',
      marker: _markerOptions.o,
    },
  };

  const _gameBoard = (() => {
    const board = [];
    const status = {
      marked: 'marked',
      unmarked: 'unmarked',
    };

    for (let i = 0; i < 9; i++) {
      const current = {
        val: status.unmarked,
        idx: i,
      };
      board[i] = current;
    }
    return board;
  })();

  const _computersTurn = () => {
    if (_isGameOver) return;

    const availableSpots = () => {
      const available = _gameBoard.filter(
        (square) => square.val === 'unmarked'
      );
      return available;
    };

    const cpuDecision = (() => {
      const currentOptions = availableSpots();
      if (currentOptions.length === 0) return 'Out of free squares';
      const randomIdx = (() => {
        const idx = Math.floor(Math.random() * currentOptions.length);
        return idx;
      })();

      const choice = currentOptions[randomIdx];
      return choice.idx;
    })();

    (() => {
      squares.forEach((square) => {
        if (square.dataset.index == cpuDecision) {
          setTimeout(() => {
            square.textContent = players.player2.marker;
            _gameBoard[cpuDecision].val = 'marked';
            console.log('CPU', square.textContent);
            _gameOver();
            _updateSelector();
          }, 500);
          return square;
        }
      });
    })();
  };

  const _updateSelector = () => {
    if (_isGameOver) return;

    if (_isComputersTurn) {
      setTimeout(() => {
        marker1.classList.toggle('selected');
        marker2.classList.toggle('selected');
        _isComputersTurn = false;
        _isPlayersTurn = true;
      }, 1000);
    }

    if (_isPlayersTurn) {
      _isComputersTurn = true;
      _isPlayersTurn = false;
      setTimeout(() => {
        marker1.classList.toggle('selected');
        marker2.classList.toggle('selected');
        _computersTurn();
      }, 1000);
    }
  };

  const _renderGame = () => {
    _isGameStarted = true;
    if (marker1.className.includes('beginWith')) {
      console.log(marker1);
      marker1.classList.add('selected');
    } else if (marker2.className.includes('beginWith')) {
      marker1.classList.add('selected');
      _computersTurn();
    }
  };

  const selectMarker = (target) => {
    if (_isGameStarted) return;
    if (target.className.includes('marker1')) {
      box1.style = 'border: 2px solid #7678ed;';
      if (!target.className.includes('beginWith')) {
        target.classList.add('beginWith');

        players.player1.marker = _markerOptions.x;
        players.player2.marker = _markerOptions.o;
        playerX.textContent = players.player1.name;
        playerO.textContent = players.player2.name;

        _isPlayersTurn = true;
        _renderGame();
      }
    }
    if (target.className.includes('marker2')) {
      box2.style = 'border: 2px solid #7678ed;';
      if (!target.className.includes('beginWith')) {
        target.classList.add('beginWith');
        marker1.classList.remove('beginWith');

        players.player1.marker = _markerOptions.o;
        players.player2.marker = _markerOptions.x;
        playerO.textContent = players.player1.name;
        playerX.textContent = players.player2.name;

        _isComputersTurn = true;
        _renderGame();
      }
    }
  };

  const addMark = (target) => {
    if (_isGameOver) return;
    _currentClickedIdx = parseInt(target.dataset.index);

    if (
      target.className === 'square' &&
      _isComputersTurn === false &&
      _isPlayersTurn === true &&
      _gameBoard[_currentClickedIdx].val === 'unmarked'
    ) {
      _gameBoard[_currentClickedIdx].val = 'marked';
      target.textContent = players.player1.marker;
      console.log('Human', squares[_currentClickedIdx].textContent);
      _gameOver();
      _updateSelector();
    }
  };

  const _gameOver = () => {
    const winnableSlots = {
      col1: {
        slot: [0, 3, 6],
        available: true,
      },
      col2: {
        slot: [1, 4, 7],
        available: true,
      },
      col3: {
        slot: [2, 5, 8],
        available: true,
      },
      row1: {
        slot: [0, 1, 2],
        available: true,
      },
      row2: {
        slot: [3, 4, 5],
        available: true,
      },
      row3: {
        slot: [6, 7, 8],
        available: true,
      },
      diag1: {
        slot: [0, 4, 8],
        available: true,
      },
      diag2: {
        slot: [2, 4, 6],
        available: true,
      },
    };

    const stopGame = (message) => {
      _isGameOver = true;
      popupResult.textContent = message;
      setTimeout(() => {
        newModal.showModal();
      }, 500);
    };

    for (const key in winnableSlots) {
      const currentSlot = winnableSlots[key];
      const idx1 = currentSlot.slot[0];
      const idx2 = currentSlot.slot[1];
      const idx3 = currentSlot.slot[2];
      let finalMessage = 'game over';
      if (
        squares[idx1].textContent === _markerOptions.x &&
        squares[idx2].textContent === _markerOptions.x &&
        squares[idx3].textContent === _markerOptions.x
      ) {
        console.log(_isComputersTurn, _isPlayersTurn);
        if (!_isComputersTurn) {
          finalMessage = `congrats! ${players.player1.name} wins!`;
        } else {
          finalMessage = `bummer :( ${players.player2.name} wins!`;
        }
        stopGame(finalMessage);
      } else if (
        squares[idx1].textContent === _markerOptions.o &&
        squares[idx2].textContent === _markerOptions.o &&
        squares[idx3].textContent === _markerOptions.o
      ) {
        console.log(_isComputersTurn, _isPlayersTurn);
        let finalMessage = 'player with O wins';
        if (!_isComputersTurn) {
          finalMessage = `congrats! ${players.player1.name} wins!`;
        } else {
          finalMessage = `bummer :( ${players.player2.name} wins!`;
        }
        stopGame(finalMessage);
      }
    }

    (() => {
      for (const key in winnableSlots) {
        const currentSlot = winnableSlots[key];
        const idx1 = currentSlot.slot[0];
        const idx2 = currentSlot.slot[1];
        const idx3 = currentSlot.slot[2];

        if (
          _gameBoard[idx1].val === 'marked' &&
          _gameBoard[idx2].val === 'marked' &&
          squares[idx1].textContent !== squares[idx2].textContent
        ) {
          console.log('this slot: ', key);
          currentSlot.available = false;
        } else if (
          _gameBoard[idx1].val === 'marked' &&
          _gameBoard[idx3].val === 'marked' &&
          squares[idx1].textContent !== squares[idx3].textContent
        ) {
          console.log('this slot: ', key);
          currentSlot.available = false;
        } else if (
          _gameBoard[idx3].val === 'marked' &&
          _gameBoard[idx2].val === 'marked' &&
          squares[idx3].textContent !== squares[idx2].textContent
        ) {
          console.log('this slot: ', key);
          currentSlot.available = false;
        }
      }

      let check = true;
      console.log(winnableSlots);
      for (const key in winnableSlots) {
        const currentSlot = winnableSlots[key];
        if (currentSlot.available) {
          check = false;
        }
      }
      if (check) {
        console.log('its a tie!');
        stopGame('bummer its a draw');
      }
    })();
  };

  const reset = () => {
    _gameBoard.forEach((square) => {
      square.val = 'unmarked';
    });
    console.log(_gameBoard);

    squares.forEach((square) => {
      console.log(square.textContent);
      square.textContent = '';
    });

    if (marker1.className.includes('selected')) {
      marker1.classList.remove('selected');
    } else if (marker2.className.includes('selected')) {
      marker2.classList.remove('selected');
    }

    players.player2.marker = _markerOptions.o;
    players.player1.marker = _markerOptions.x;
    playerX.textContent = 'Player 1';
    playerO.textContent = 'Magneto';

    _isGameStarted = false;
    _isComputersTurn = false;
    _isPlayersTurn = false;
    _isGameOver = false;

    if (marker1.className.includes('beginWith')) {
      marker1.classList.remove('beginWith');
    } else if (marker2.className.includes('beginWith')) {
      marker2.classList.remove('beginWith');
    }

    display.textContent = 'Start game as X or O';
    newModal.close();
  };

  return {
    addMark,
    selectMarker,
    reset,
    players,
  };
})();

const gameboard = document.querySelector('.gameboard');
const squares = document.querySelectorAll('.square');

const marker1 = document.querySelector('.marker1');
const marker2 = document.querySelector('.marker2');
const playerX = document.querySelector('.player-X .playerName');
const playerO = document.querySelector('.player-O .playerName');

const display = document.querySelector('.message');
const playAgain = document.querySelector('.play-again');
const popupResult = document.querySelector('.result');

const newModal = document.getElementById('modal');
const box1 = document.querySelector('.box1');
const box2 = document.querySelector('.box2');

gameboard.addEventListener('click', (e) => {
  game.addMark(e.target);
});

marker1.addEventListener('click', (e) => {
  game.selectMarker(e.target);
});

marker2.addEventListener('click', (e) => {
  game.selectMarker(e.target);
});

playAgain.addEventListener('click', () => {
  game.reset();
});

const welcomePopup = document.querySelector('.welcome-popup');
const nameForm = document.querySelector('.getName');
const inputName = document.querySelector('#name');

const player = document.querySelector('.playerName');

nameForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!inputName.value) {
    inputName.value = 'Xavier';
  }
  player.textContent = inputName.value;
  game.players.player1.name = inputName.value;
  welcomePopup.close();
});

welcomePopup.showModal();
