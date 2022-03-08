function removeElement(element) {
  element.parentNode.remove(element);
}

function removeAllChildNodes(ID) {
  while (ID.hasChildNodes()) {
    ID.removeChild(ID.firstChild);
  }
}

function removeAllChildNodesExceptSpecified(parent, IDNode) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }

  setTimeout(() => {
    parent.appendChild(IDNode);
  }, 100);
}

function showElement(element) {
  element.style.display = "block";
}

function hideElement(element) {
  element.style.display = "none";
}

function waitForElm(selector) {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver((mutations) => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector));
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

function Modals(ModalID) {
  var Modal = document.getElementById(ModalID);
  var Span = document.getElementsByClassName("Close")[0];

  Modal.style.display = "block";

  Span.onclick = function () {
    Modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == Modal) {
      Modal.style.display = "none";
    }
  };
}

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

function fetchFromFile(FilePath) {
  return fetch(FilePath)
    .then((response) => response.text())
    .then((text) => {
      Load = text.split("\n").slice(0, -1);
      return Load;
    });
}
