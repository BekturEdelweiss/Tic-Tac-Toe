var baseState = function () {
  return [null, null, null, null, null, null, null, null, null];
};
var historyState = [];
var currentState, turn;

var isWinner = function () {
  var wins = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
    t,
  ];

  var isWinner = wins.filter(function (win) {
    return (
      currentState[win[0]] &&
      currentState[win[0]] === currentState[win[1]] &&
      currentState[win[0]] === currentState[win[2]]
    );
  });

  return isWinner.length > 0 ? currentState[isWinner[0][0]] : false;
};

var isFirstInRow = function (id) {
  return (id + 1) % 3 === 1;
};

var isLastInRow = function (id) {
  return (id + 1) % 3 === 0;
};

var buildSquares = function (state, winner) {
  var rows = "";

  state.forEach(function (square, id) {
    var value = square ? square : "";
    var selected = square ? ' aria-pressed="true"' : "";
    var disabled = square || winner ? " disabled" : "";

    if (isFirstInRow(id)) {
      rows += "<tr>";
    }
    rows +=
      '<td><button class="game-square" data-id="' +
      id +
      '"' +
      selected +
      disabled +
      ">" +
      value +
      "</button></td>";

    if (isLastInRow(id)) {
      rows += "</tr>";
    }
  });

  return rows;
};

var buildHistory = function () {
  var history = "";

  if (historyState.length > 0) {
    history += "<h2>Game History</h2><ol>";
    historyState.forEach(function (move, index) {
      history +=
        '<li><button data-history="' +
        move.toString() +
        '">Go to move # ' +
        (index + 1) +
        "</button></li>";
    });
    history += "</ol>";
  }

  return history;
};

var buildBoard = function (state) {
  var winner = isWinner();

  var rows = winner
    ? "<p><strong>" + winner + " is the winner!</string></p>"
    : "";
  rows += "<table><tbody>";

  rows += buildSquares(state, winner);
  rows += '</tbody></table><p><button id="play-again">Play Again</button></p>';

  rows += buildHistory();

  return rows;
};

var updateBoard = function (state) {
  var board = document.querySelector("#game-board");
  if (!board) return;
  board.innerHTML = buildBoard(state || currentState);
};

var renderTurn = function (square) {
  var selected = square.getAttribute("data-id");
  if (!selected) return;

  currentState[selected] = turn;

  historyState.push(currentState.slice());

  updateBoard();

  turn = turn === "X" ? "O" : "X";
};

var resetBoard = function () {
  currentState = baseState();
  historyState = [];
  turn = "X";
  updateBoard();
};

resetBoard();

document.addEventListener(
  "click",
  function (event) {
    if (
      event.target.matches(".game-square") &&
      !event.target.hasAttribute("disabled")
    ) {
      renderTurn(event.target);
    }
    if (event.target.matches("#play-again")) {
      resetBoard();
    }
    if (event.target.matches("[data-history]")) {
      updateBoard(event.target.getAttribute("data-history").split(","));
    }
  },
  false
);
