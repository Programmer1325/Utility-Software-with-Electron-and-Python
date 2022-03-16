var Form = document.getElementById("File-Input-Form");
var DefaultContent = document.getElementById("Default-content");
var UploadedContentDiv = document.getElementById("Uploaded-Content");

var FilePathsArr = [];
var Data = [];

import { removeElement, Modals, removeAllChildNodes,  } from "./Functions";

function AddOrRemoveShakeClass(AddOrRemove) {
  if (AddOrRemove === "add") {
    Form.classList.add("ChangeBackground");
    Form.classList.add("shake-slow");
    Form.classList.add("shake-constant");
  } else {
    Form.classList.remove("ChangeBackground");
    Form.classList.remove("shake-slow");
    Form.classList.remove("shake-constant");
  }
}

async function FileHandler(filePaths) {
  // * Get Elements
  var EncryptBtn = document.getElementById("Encrypt-File");
  var DecryptBtn = document.getElementById("Decrypt-File");
  var DeleteBtn = document.getElementById("Delete-File");
  var ShareEncrypted = document.getElementById("Share-E-File");
  var ShareDecrypted = document.getElementById("Share-D-File");

  var ObjectOfButtons = [
    { Element: EncryptBtn, Function: "Encrypt File" },
    { Element: DecryptBtn, Function: "Decrypt File" },
    { Element: DeleteBtn, Function: "Delete File" },
    { Element: ShareEncrypted, Function: "Share Encrypted File" },
    { Element: ShareDecrypted, Function: "Share Decrypted File" },
  ];

  // * Store Data and Paths
  Data.push(filePaths[0]);
  Data = Data.flat(2);

  FilePathsArr.push(window.customFunctions.NodeJS.UploadFile(filePaths));
  FilePathsArr = FilePathsArr.flat(3);

  // * Remove Entry
  setTimeout(() => {
    Data.forEach((ObjectWithStats) => {
      var PropertyName = `${ObjectWithStats.name}-Close`;

      document.getElementById(PropertyName).addEventListener("click", () => {
        Data = Data.filter((item) => item.name !== ObjectWithStats.name);
        FilePathsArr = FilePathsArr.filter(
          (SinglePath) =>
            SinglePath !==
            FilePathsArr.filter((Path) =>
              Path.includes(ObjectWithStats.name)
            )[0]
        );
        removeElement(document.getElementById(PropertyName));
      });
    });
  }, 0);

  // * Event Listeners
  ObjectOfButtons.forEach((Button) => {
    Button.Element.addEventListener("click", () => {
      Modals("PasswordModalID");
      document
        .getElementById("InputPasswordBtn")
        .addEventListener("click", () => {
          var FilePathsObj = { Paths: FilePathsArr };
          try {
            var Password = document.getElementById("InputPassword").value;
          } catch (err) {}

          window.customFunctions.Python.filesFunctionality(
            Button.Function,
            Password,
            JSON.stringify(FilePathsObj)
          );
          FilePathsArr = [];
          Data = [];
          removeAllChildNodesExceptSpecified(
            UploadedContentDiv,
            DefaultContent
          );
          showElement(DefaultContent);

          var Modal = document.getElementById("PasswordModalID");
          removeAllChildNodes(Modal);
          Modal.style.display = "none";

          waitForElm(".toastify").then(() => {
            window.customFunctions.NodeJS.GetHistory();
          });
        });
    });
  });
}

window.customFunctions.NodeJS.GetHistory();

// * Main Part
Form.addEventListener("drop", function (e) {
  e.preventDefault();
  e.stopPropagation();

  for (let f of e.dataTransfer.files) {
    var ArrayOfStats = [
      [{ name: f.name, size: formatBytes(f.size) }],
      [f.path],
    ];
    FileHandler(ArrayOfStats);
  }

  AddOrRemoveShakeClass("remove");
});

Form.addEventListener("dragover", function (e) {
  e.preventDefault();
  e.stopPropagation();
});

Form.addEventListener("dragenter", () => {
  AddOrRemoveShakeClass("add");
});

Form.addEventListener("dragleave", () => {
  AddOrRemoveShakeClass("remove");
});

Form.addEventListener("click", async () => {
  await FileHandler(await window.customFunctions.sysFuncs.openFileDialog());
});
