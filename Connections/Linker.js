const { PythonShell } = require("python-shell");
const { clipboard } = require("electron");
const toastify = require("../Frontend/JS/Toastify.js");

async function accessPython(
  whatToDo,
  SecondParameter = "Optional",
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

  if (SecondParameter != "Optional") {
    options.args = [whatToDo, SecondParameter];
  }

  if (ThirdParameter != "Optional") {
    options.args = [whatToDo, SecondParameter, ThirdParameter];
  }

  if (FourthParameter != "Optional") {
    options.args = [whatToDo, SecondParameter, ThirdParameter, FourthParameter];
  }

  if (FifthParameter != "Optional") {
    options.args = [
      whatToDo,
      SecondParameter,
      ThirdParameter,
      FourthParameter,
      FifthParameter,
    ];
  }

  const RunPython = await new Promise((resolve, reject) => {
    PythonShell.run(
      "./Connections/Linker.py",
      options,
      function (err, results) {
        if (err) return reject(err);

        function Notify(Text) {
          toastify({
            text: Text,
            duration: 5000,
            close: true,
          }).showToast();
        }

        // * Using the result

        if (whatToDo == "Password Checker") {
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
        } else if (whatToDo == "Initial Password") {
          if (results[0] === "Wrong Password") {
            return resolve("Wrong Password");
          } else {
            var ObjectToBeExported = {
              ObjectForFinder: JSON.parse(results[0]),
              MasterPassword: SecondParameter,
            };
            return resolve(ObjectToBeExported);
          }
        } else if (whatToDo == "Read Key") {
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
        } else if (
          whatToDo == "Edit Key" ||
          whatToDo == "Create Key" ||
          whatToDo == "Delete Key"
        ) {
          Notify(results[0]);
        } else if (
          whatToDo == "Encrypt File" ||
          whatToDo == "Decrypt File" ||
          whatToDo == "Delete File"
        ) {
          try {
            Notify(results[0]);
          } catch (err) {}
        }
      }
    );
  });

  // * Returning result
  return RunPython;
}

module.exports = { accessPython };
