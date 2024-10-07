const { ipcRenderer } = require("electron");
const { exec } = require("child_process");
const ffmpegPath = require("ffmpeg-static");

document.getElementById("pick-file").addEventListener("click", async () => {
  const inputFile = await ipcRenderer.invoke("pick-file");

  if (!inputFile) {
    document.getElementById("status").innerText = "No file selected.";
    return;
  }

  document.getElementById("status").innerText = `Selected file: ${inputFile}`;

  const outputFile =
    document.getElementById("outputFile").value || "output.mp3";

  const command = `"${ffmpegPath}" -i "${inputFile}" -codec:a libmp3lame -b:a 192k "${outputFile}"`;

  document.getElementById("status").innerText = "Converting...";

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      document.getElementById(
        "status"
      ).innerText = `Conversion failed: ${error.message}`;
      return;
    }

    document.getElementById(
      "status"
    ).innerText = `Conversion successful: ${outputFile}`;
  });
});
