var { dialog } = require("electron");
const fs = require("fs");

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ["openFile", "multiSelections"],
  });
  if (canceled) {
    return;
  } else {
    var Paths = [];
    var Data = [];

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
