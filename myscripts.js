function dragover(ev) {
  ev.preventDefault();
  ev.target.classList.add("current");
}
function dragleave(ev) {
  ev.preventDefault();
  ev.target.classList.remove("current");
}

function drag(ev) {
  const parentData = ev.target.parentElement.dataset;
  const x_Input = parentData.x;
  const y_Input = parentData.y;
  const x = parseInt(x_Input);
  const y = parseInt(y_Input);

  if (currentDraged !== ev.target) {
    removeValidMoveClass();

    currentDraged = ev.target;
  }

  parentDragStart = { parent: ev.target.parentElement, x: x, y: y };

  const validPos = getValidPosition(x, y);
  ev.dataTransfer.setData("text", ev.target.id);

  // console.log(validPos);

  validPos.forEach(elem => {
    elem.classList.add("validMove");
    elem.addEventListener("drop", drop);
    elem.addEventListener("dragover", dragover);
    elem.addEventListener("dragleave", dragleave);
  });

  function getValidPosition(x, y) {
    const validPos = [];

    const listSameLine = getSameLine(y);
    const listSameCol = getSameColumn(x);

    const beforeLine = getBeforeToken(listSameLine, x);
    const afterLine = getAfterToken(listSameLine, x);
    const beforeCol = getBeforeToken(listSameCol, y);
    const afterCol = getAfterToken(listSameCol, y);

    validPos.push(...beforeLine, ...afterLine, ...beforeCol, ...afterCol);
    // validPos.filter(elem => !elem.classList.contains("throne"))

    return validPos;

    function getSameLine(y) {
      return [...document.getElementsByClassName("line" + y)];
    }
    function getSameColumn(x) {
      return [...document.getElementsByClassName("col" + x)];
    }
    function getBeforeToken(array, value) {
      let before = [];
      for (let index = value - 1; index >= 0; index--) {
        const element = array[index];
        if (
          element.dataset.hastoken === "true" ||
          element.dataset.throne === "true"
        ) {
          break;
        }
        before.push(element);
      }
      return before;
    }
    function getAfterToken(array, value) {
      let after = [];
      for (let index = value + 1; index < TAB_SIZE; index++) {
        const element = array[index];
        if (
          element.dataset.hastoken === "true" ||
          element.dataset.throne === "true"
        ) {
          break;
        }
        after.push(element);
      }
      return after;
    }
  }
}

function removeValidMoveClass() {
  const elements = [...document.getElementsByClassName("grid-item validMove")];
  elements.forEach(elem => {
    elem.classList.remove("validMove");
    elem.classList.remove("current");
    elem.removeEventListener("drop", drop);
    elem.removeEventListener("dragover", dragover);
    elem.removeEventListener("dragleave", dragleave);
  });
}

function drop(ev) {
  ev.preventDefault();
  removeValidMoveClass();
  parentDragStart.parent.setAttribute("data-hastoken", "false");
  const data = ev.dataTransfer.getData("text");
  ev.target.appendChild(document.getElementById(data));
  ev.target.setAttribute("data-hastoken", "true");
}

function init() {
  initDropZone();
  initToken();
}

function initDropZone() {
  const elements = document.getElementsByClassName("grid-item");
  let x = 0;
  let y = 0;
  for (let i = 0, len = elements.length; i < len; ++i) {
    const e = elements[i];

    y = i % TAB_SIZE;
    if (i !== 0 && y === 0) {
      ++x;
    }
    e.setAttribute("data-x", x);
    e.classList.add("col" + x);
    e.setAttribute("data-y", y);
    e.classList.add("line" + y);
    e.setAttribute("data-hasToken", "false");
  }
}

function initToken() {
  const pions = document.getElementsByClassName("pion");
  for (let i = 0, len = pions.length; i < len; ++i) {
    const p = pions[i];
    p.setAttribute("draggable", "true");
    p.addEventListener("dragstart", drag);
    p.parentElement.setAttribute("data-hasToken", "true");
  }
  initWhiteTokens();
  initBlackTokens();

  function initWhiteTokens() {
    const whites = document.getElementsByClassName("white");
    for (let i = 0, len = whites.length; i < len; ++i) {
      const w = whites[i];
      w.setAttribute("id", "white" + i);
    }
  }
  function initBlackTokens() {
    const blacks = document.getElementsByClassName("black");
    for (let i = 0, len = blacks.length; i < len; ++i) {
      const b = blacks[i];
      b.setAttribute("id", "black" + i);
    }
  }
}
const TAB_SIZE = 9;
let parentDragStart = null;
let currentDraged = null;
init();
