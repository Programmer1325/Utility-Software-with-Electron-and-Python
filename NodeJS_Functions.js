const { contextBridge, clipboard, ipcRenderer } = require("electron");
const DOMPurify = require("dompurify");
const finder = require("finderjs");
const Icons = require("@exuanbo/file-icons-js");
const toastify = require("./Frontend/JS/Toastify.js");

const { accessPython } = require("./Connections/Linker");
const {
  hideElement,
  waitForElm,
  fetchFromFile,
  removeAllChildNodes,
} = require("./Functions");

// * Text for appending to HTML
var createModalText = `<div class="Form">
                        <h1>
                          Create Key
                          <span class="Close" id="Close-Create">&times;</span>
                        </h1>
                        <div class="Form-Inputs">
                          <p class="Field">
                            <input
                              type="username"
                              name="username"
                              placeholder="Username"
                              id="CreateUsername"
                            />
                            <i class="fa-solid fa-user"></i>
                          </p>
                          <p class="Field">
                            <input
                              type="password"
                              name="password"
                              placeholder="Password"
                              id="CreatePassword"
                            />
                            <i class="fa fa-lock"></i>
                          </p>
                          <p class="Field">
                            <input
                              type="username"
                              name="username"
                              placeholder="Path separated by commas"
                              id="Path-ID-Creation"
                            />
                            <i class="fa-solid fa-road"></i>
                          </p>
                          <p class="Field">
                            <input
                              type="username"
                              name="username"
                              placeholder="Key Name"
                              id="PasswordName"
                            />
                            <i class="fa-solid fa-road"></i>
                          </p>
                        </div>
                        <button class="Password-Input-Button" id="Create-Key-Modal">
                          <span>Enter</span>
                        </button>
                        </div>`;

var editModalText = `<div class="Form">
                      <h1>
                        Key
                        <span class="Close" id="Close-Edit">&times;</span>
                      </h1>
                      <div class="Form-Inputs">
                        <p class="Field">
                          <input
                            type="username"
                            name="username"
                            placeholder="Username"
                            id="Username"
                          />
                          <i class="fa-solid fa-user"></i>
                        </p>
                        <p class="Field">
                          <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            id="Password"
                          />
                          <i class="fa fa-lock"></i>
                        </p>
                        <p class="Field">
                          <input
                            type="username"
                            name="username"
                            placeholder="Path separated by commas"
                            id="Path-ID"
                          />
                          <i class="fa-solid fa-road"></i>
                        </p>
                      </div>
                      <button class="Password-Input-Button" id="Edit-Key-Modal">
                        <span>Enter</span>
                      </button>
                      </div>`;

var ModalForEncryptingAndDecryptingFiles = `<div class="Form">
                                              <h1>
                                                Enter Password
                                                <span class="Close">&times;</span>
                                              </h1>
                                              <div class="Form-Inputs">
                                                <p class="Field">
                                                  <input
                                                    type="password"
                                                    name="password"
                                                    placeholder="Password"
                                                    id="InputPassword"
                                                  />
                                                  <i class="fa fa-lock"></i>
                                                </p>
                                              </div>
                                              <button class="Password-Input-Button" id="InputPasswordBtn">
                                                <span>Enter</span>
                                              </button>
                                            </div>`;

// * Valid Channels for IPC
let validChannels = ["Initial Password", "Finder Content"];

// * Sanitizes HTML Text content
const Sanitizer = trustedTypes.createPolicy("SecureContent", {
  createHTML: (input) => DOMPurify.sanitize(input),
});

// * Functions
function TextToHTMLElement(Text, Parent) {
  if (typeof trustedTypes !== "undefined") {
    var SanitizedElement = Sanitizer.createHTML(Text);
    Parent.insertAdjacentHTML("afterbegin", SanitizedElement);
  }
}

function InitializeFinderFunction(ObjectForFinder) {
  // * Delete Manager and recreate it with Finder.JS
  const ManagerWithPreviousContent = document.getElementById("Manager");

  const newElement = document.createElement("div");
  newElement.id = "Manager";

  ManagerWithPreviousContent.parentNode.appendChild(newElement);
  ManagerWithPreviousContent.parentNode.removeChild(ManagerWithPreviousContent);

  const Manager = document.getElementById("Manager");

  var Finder = finder(Manager, ObjectForFinder, {});

  return Finder;
}

function Notify(Text) {
  toastify({
    text: Text,
    duration: 5000,
    close: true,
  }).showToast();
}

function Modals(ModalID, CloseID) {
  var Modal = document.getElementById(ModalID);
  var Span = document.getElementById(CloseID);

  Modal.style.display = "block";

  Span.onclick = function () {
    Modal.style.display = "none";
    removeAllChildNodes(Modal);
  };

  window.onclick = function (event) {
    if (event.target == Modal) {
      Modal.style.display = "none";
      removeAllChildNodes(Modal);
    }
  };
}

// * Context Bridge
contextBridge.exposeInMainWorld("customFunctions", {
  api: {
    send: (channel, data) => {
      if (validChannels.includes(channel)) {
        ipcRenderer.invoke(channel, data);
      }
    },
    receive: (channel, func) => {
      if (validChannels.includes(channel)) {
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
  },
  Python: {
    generatePassword: () => {
      accessPython("Create Password");
    },
    getSizeofSystemFiles: () => {
      accessPython("Get Size of Junk");
    },
    analysePassword: (inputValue) => {},
    filesFunctionality: (FunctionToExecute, Password, PathsObj) => {
      accessPython(FunctionToExecute, Password, PathsObj);
    },
  },
  sysFuncs: {
    copyText: (textDiv) => {
      var TextID = document.getElementById(textDiv);
      var Text = TextID.innerText;

      clipboard.writeText(Text);
    },
    openFileDialog: () => ipcRenderer.invoke("openFileAndDirectoriesDialog"),
  },
  NodeJS: {
    GetHistory: () => {
      var ReadHistory = fetchFromFile("../Data/File_History.txt");
      var UploadedContentDiv = document.getElementById(
        "Uploaded-Content-history"
      );

      var HistoryAccess = async () => {
        var History = await ReadHistory;
        removeAllChildNodes(UploadedContentDiv);

        History.forEach((HistoryItem) => {
          var Name = HistoryItem.split(" with name ")[1].split(" on ")[0];
          var Function = HistoryItem.split(" ")[0];
          var Time = HistoryItem.split(" on ")[1].split(" with path ")[0];

          var ClassOfIcon = Icons.getClass(Name);

          var HistoryEntry = `<li class="row">
                              <div class="content upload">
                                <i id="file-icon" class="${ClassOfIcon}"></i></p>
                                <div class="details">
                                  <span class="name">${Function} ${Name} on ${Time}</span>
                                  <span class="size">Path - ${
                                    HistoryItem.split(" with path ")[1]
                                  }</span>
                                </div>
                              </div>
                            </li>`;

          TextToHTMLElement(HistoryEntry, UploadedContentDiv);
        });
      };

      HistoryAccess();
    },
    UploadFile: (filePaths) => {
      var UploadedContentDiv = document.getElementById("Uploaded-Content");
      var DefaultContent = document.getElementById("Default-content");
      var PasswordModalSelector = document.getElementById("PasswordModalID");

      TextToHTMLElement(
        ModalForEncryptingAndDecryptingFiles,
        PasswordModalSelector
      );
      var Paths = [];

      try {
        var Data = filePaths[0];
        Paths.push(filePaths[1]);

        Data.forEach((ObjectWithStats) => {
          var FileName = ObjectWithStats.name;
          if (FileName.length >= 12) {
            let splitName = FileName.split(".");
            FileName = splitName[0].substring(0, 13) + "... ." + splitName[1];
          }
          var ClassOfIcon = "icon default-icon";

          (async () => {
            ClassOfIcon = await Icons.getClass(ObjectWithStats.name);
            var UploadedContent = `<li class="row">
              <div class="content upload">
                <i id="file-icon" class="${ClassOfIcon}"></i></p>
                <div class="details">
                  <span class="name">${FileName} • Uploaded</span>
                  <span class="size">${ObjectWithStats.size}</span>
                </div>
              </div>
              <span class="material-icons-round Close-Btn" id="${ObjectWithStats.name}-Close">close</span>
            </li>`;

            TextToHTMLElement(UploadedContent, UploadedContentDiv);
          })();
        });

        try {
          DefaultContent.style.display = "none";
        } catch (err) {}
      } catch (err) {
        console.log(err);
      }

      return Paths;
    },
    InitialPassword: (Password) => {
      return accessPython("Initial Password", Password);
    },
    InitializeFinder: (ObjectForFinder, MasterPassword) => {
      var Finder = InitializeFinderFunction(ObjectForFinder);
      var NameOfLeaf = null;

      function SoftReInitializeFinder() {
        Finder = InitializeFinderFunction(ObjectForFinder);
        Finder.on("leaf-selected", function (item) {
          NameOfLeaf = item["label"];
        });
      }

      function HardReInitializeFinder() {
        var Access = accessPython("Initial Password", MasterPassword);
        Access.then((Data) => {
          Finder = InitializeFinderFunction(Data.ObjectForFinder);
          Finder.on("leaf-selected", function (item) {
            NameOfLeaf = item["label"];
          });
        });
      }

      // * Copy Username
      document.getElementById("Copy-Username").addEventListener("click", () => {
        if (NameOfLeaf !== null) {
          accessPython("Read Key", MasterPassword, NameOfLeaf, "Username");
          SoftReInitializeFinder();
        } else {
          Notify("Please select a Key");
        }
      });

      // * Copy Password
      document.getElementById("Copy-Password").addEventListener("click", () => {
        if (NameOfLeaf !== null) {
          accessPython("Read Key", MasterPassword, NameOfLeaf, "Password");
          SoftReInitializeFinder();
        } else {
          Notify("Please select a Key");
        }
      });

      // * Create Key
      document.getElementById("Create-Key").addEventListener("click", () => {
        var CreateModalID = document.getElementById("CreateModalID");

        TextToHTMLElement(createModalText, CreateModalID);

        Modals("CreateModalID", "Close-Create");
        Notify("Separate the Path with commas");
        Notify(
          "If you want the path to be empty, add a space in the Paths field"
        );

        document
          .getElementById("Create-Key-Modal")
          .addEventListener("click", () => {
            var Username = document.getElementById("CreateUsername").value;
            var Password = document.getElementById("CreatePassword").value;
            var PasswordName = document.getElementById("PasswordName").value;
            var Paths = document.getElementById("Path-ID-Creation").value;
            var UsernameAndPasswordDictionary = `{
                    "Username": "${Username}",
                    "Password": "${Password}"
                  }`;

            accessPython(
              "Create Key",
              MasterPassword,
              PasswordName,
              UsernameAndPasswordDictionary,
              Paths
            );

            waitForElm(".toastify").then(() => {
              HardReInitializeFinder();
              hideElement(CreateModalID);
              removeAllChildNodes(CreateModalID);
            });
          });
      });

      // * Edit Key
      document.getElementById("Edit-Key").addEventListener("click", () => {
        if (NameOfLeaf !== null) {
          var EditModalID = document.getElementById("EditModalID");
          TextToHTMLElement(editModalText, EditModalID);

          Modals("EditModalID", "Close-Edit");
          Notify("Separate the Path with commas");
          Notify(
            "If you want the path to be empty, add a space in the Paths field"
          );

          document
            .getElementById("Edit-Key-Modal")
            .addEventListener("click", () => {
              var Password = document.getElementById("Password").value;
              var Username = document.getElementById("Username").value;
              var Paths = document.getElementById("Path-ID").value;
              var UsernameAndPasswordDictionary = `{
                          "Username": "${Username}",
                          "Password": "${Password}"
                        }`;

              accessPython(
                "Edit Key",
                MasterPassword,
                NameOfLeaf,
                UsernameAndPasswordDictionary,
                Paths
              );

              waitForElm(".toastify").then(() => {
                HardReInitializeFinder();
                hideElement(EditModalID);
                removeAllChildNodes(EditModalID);
              });
            });
        } else {
          Notify("Please select a Key");
        }
      });

      // * Delete Key
      document.getElementById("Delete-Key").addEventListener("click", () => {
        if (NameOfLeaf !== null) {
          accessPython("Delete Key", MasterPassword, NameOfLeaf);
          waitForElm(".toastify").then(() => {
            HardReInitializeFinder();
          });
        } else {
          Notify("Please select a Key");
        }
      });

      // * On Leaf Selected
      Finder.on("leaf-selected", function (item) {
        NameOfLeaf = item["label"];
      });
    },
  },
});
