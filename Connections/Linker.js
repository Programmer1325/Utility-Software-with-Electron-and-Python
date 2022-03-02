const { PythonShell } = require("python-shell");
const { clipboard } = require("electron");
const finder = require("finderjs");
const toastify = require("../Frontend/JS/Toastify.js");

function accessPython(
  whatToDo,
  OptionalParameter = "Optional",
  ThirdParameter = "Optional",
  FourthParameter = "Optional",
  FifthParameter = "Optional"
) {
  let options = {
    mode: "text",
    args: [whatToDo],
    pythonPath:
      "/Users/krishith/.local/share/virtualenvs/Utility-Software-_t4jA-Il/bin/python",
  };

  var classNamesForTextContainer = {
    "Create Password": "Generated-Password",
    "Get Size of Junk": "Size-of-Junk",
  };

  if (OptionalParameter != "Optional") {
    options.args = [whatToDo, OptionalParameter];
  }

  if (ThirdParameter != "Optional") {
    options.args = [whatToDo, OptionalParameter, ThirdParameter];
  }

  if (FourthParameter != "Optional") {
    options.args = [
      whatToDo,
      OptionalParameter,
      ThirdParameter,
      FourthParameter,
    ];
  }

  if (FifthParameter != "Optional") {
    options.args = [
      whatToDo,
      OptionalParameter,
      ThirdParameter,
      FourthParameter,
      FifthParameter,
    ];
  }

  PythonShell.run("./Connections/Linker.py", options, function (err, results) {
    if (err) throw err;
    function Notify(Text) {
      toastify({
        text: Text,
        duration: 5000,
        close: true,
      }).showToast();
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

    // * Using the result

    if (OptionalParameter == "Password Checker") {
      let ScoreContainer = document.getElementById("Score");
      ScoreContainer.innerText = results[0];

      let GuessesContainer = document.getElementById("Guesses");
      GuessesContainer.innerText = results[1];

      let TimeContainer = document.getElementById("Time");
      TimeContainer.innerText = results[2];

      let FeedbackContainer = document.getElementById("Feedback");
      FeedbackContainer.innerText = results[3];
    } else if (
      whatToDo == "Create Password" ||
      whatToDo == "Get Size of Junk"
    ) {
      let Container = document.getElementById(
        classNamesForTextContainer[whatToDo]
      );
      Container.innerText = results[0];
    } else if (OptionalParameter == "Initial Password") {
      const ManagerWithPreviousContent = document.getElementById("Manager");

      const newElement = document.createElement("div");
      newElement.id = "Manager";

      ManagerWithPreviousContent.parentNode.appendChild(newElement);
      ManagerWithPreviousContent.parentNode.removeChild(
        ManagerWithPreviousContent
      );

      const Manager = document.getElementById("Manager");

      if (results[0] === "Wrong Password") {
        Notify("Wrong Password");
      } else {
        var ObjectForFinder = JSON.parse(results[0]);
        var MasterPassword = whatToDo;
        var label = "";

        var Finder = finder(Manager, ObjectForFinder, {});
        document.getElementById("ModalID").style.display = "none";

        document
          .getElementById("Copy-Username")
          .addEventListener("click", () => {
            accessPython(MasterPassword, "Read Key", label, "Username");
          });

        document
          .getElementById("Copy-Password")
          .addEventListener("click", () => {
            accessPython(MasterPassword, "Read Key", label, "Password");
          });

        document.getElementById("Create-Key").addEventListener("click", () => {
          Modals("CreateModalID");
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
                MasterPassword,
                "Create Key",
                PasswordName,
                UsernameAndPasswordDictionary,
                Paths
              );
            });
        });

        document.getElementById("Edit-Key").addEventListener("click", () => {
          Modals("EditModalID");
          Notify("Separate the Path with commas");
          Notify(
            "If you want the path to be empty, add a space in the Paths field"
          );

          console.log(label);
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
                MasterPassword,
                "Edit Key",
                label,
                UsernameAndPasswordDictionary,
                Paths
              );
            });
        });

        document.getElementById("Delete-Key").addEventListener("click", () => {
          accessPython(MasterPassword, "Delete Key", label);
        });

        Finder.on("leaf-selected", function (item) {
          label = item["label"];
        });
      }
    } else if (OptionalParameter == "Read Key") {
      UsernameAndPassword = JSON.parse(results[0])[0];
      if (FourthParameter == "Username") {
        var Username = UsernameAndPassword[FourthParameter];
        clipboard.writeText(Username);

        Notify("Username Copied");
      } else if (FourthParameter == "Password") {
        var Password = UsernameAndPassword[FourthParameter];
        clipboard.writeText(Password);

        Notify("Password Copied");
      }
    } else if (OptionalParameter == "Edit Key") {
      Notify("This page will reload")
      Notify(results[0]);
      setTimeout(() => {
        location.reload();
      }, 1000);
    } else if (OptionalParameter == "Create Key") {
      Notify("This page will reload")
      Notify(results[0]);
      setTimeout(() => {
        location.reload();
      }, 1000);
    } else if (OptionalParameter == "Delete Key") {
      Notify("This page will reload")
      Notify(results[0]);
      setTimeout(() => {
        location.reload();
      }, 1000);
    }
  });
}

module.exports = { accessPython };
