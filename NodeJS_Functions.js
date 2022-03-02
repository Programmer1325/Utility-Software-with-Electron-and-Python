const { accessPython } = require("./Connections/Linker");
const { contextBridge, clipboard } = require("electron");

contextBridge.exposeInMainWorld("customFunctions", {
  Python: {
    generatePassword: () => {
      // * Create Password
      accessPython("Create Password");
    },
    getSizeofSystemFiles: () => {
      // * Get Size of Junk
      accessPython("Get Size of Junk");
    },
    analysePassword: (inputValue) => {
      // * Check Password
      accessPython(inputValue, "Password Checker");
    },
  },
  sysFuncs: {
    copyText: (textDiv) => {
      // * Copy Text
      var TextID = document.getElementById(textDiv);
      var Text = TextID.innerText;

      clipboard.writeText(Text);
    },
  },
  NodeJS: {
    CheckInitialPasswordJS: (Password) => {
      accessPython(Password, "Initial Password");
    },
  },
});
