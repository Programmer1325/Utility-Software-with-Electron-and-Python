var MasterPassword = null;
var ObjectForFinder = null;

document
  .getElementById("Initialising-Password")
  .addEventListener("click", () => {
    var InputValueOfPasswordInitial =
      document.getElementById("Initial-Password").value;
    // console.log(InputValueOfPasswordInitial)
    if (InputValueOfPasswordInitial == "") {
      Notify("Please Enter a Password");
    } else {
      var ResultFromInitialPassword =
        window.customFunctions.NodeJS.InitialPassword(
          InputValueOfPasswordInitial
        );

      ResultFromInitialPassword.then((Result) => {
        if (Result == "Wrong Password") {
          Notify("Wrong Password");
        } else {
          ObjectForFinder = Result.ObjectForFinder;
          MasterPassword = Result.MasterPassword;

          window.customFunctions.NodeJS.InitializeFinder(
            ObjectForFinder,
            MasterPassword
          );

          setTimeout(() => {
            document.getElementById("ModalID").style.display = "none";
          }, 2000);
        }
      });
    }
  });

// --- After Password has been entered

// * Onload
window.customFunctions.Python.generatePassword();

// * Functions
function Notify(Text) {
  Toastify({
    text: Text,
    duration: 5000,
    close: true,
  }).showToast();
}

function AnalysePassword() {
  var InputValueOfPassword = document.getElementById(
    "Password-Analyser-Input"
  ).value;
  window.customFunctions.Python.analysePassword(InputValueOfPassword);

  document.getElementById("Vertical-Box").className +=
    " Vertical-with-Analysed";
  document.getElementById("Analysed-Section").className +=
    " Analysed-Section-Expanded";
}

// * Event Listeners
document.getElementById("Copy").addEventListener("click", () => {
  window.customFunctions.sysFuncs.copyText("Generated-Password"),
    Notify("Password successfully copied");
});

document.getElementById("Generate").addEventListener("click", () => {
  window.customFunctions.Python.generatePassword(),
    Notify("New Password Generated");
});

document.getElementById("Analyse").addEventListener("click", () => {
  AnalysePassword(), Notify("Password Analysed");
});
