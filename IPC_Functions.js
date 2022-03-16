var { dialog } = require("electron");
const fs = require("fs");
const { formatBytes } = require("./Functions_NodeJS");

async function handleFileOpen() {
  // * Show Dialog
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ["openFile", "multiSelections"],
  });

  // * Check if dialog cancelled
  if (canceled) {
    return;
  } else {
    var Paths = [];
    var Data = [];

    // * For Each path, get size and stats and append it to the respective arrays
    filePaths.forEach((Path) => {
      Paths.push(Path);

      var FileSystem = fs.statSync(Path);
      var SplitPath = Path.split("/");

      var FileName = SplitPath[SplitPath.length - 1];
      var Size = formatBytes(FileSystem.size);

      var ObjectData = { name: FileName, size: Size };
      Data.push(ObjectData);
    });

    return [Data, Paths];
  }
}

module.exports = { handleFileOpen };
