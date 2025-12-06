const path = require("path");
const jsonfile = require("jsonfile");

const dataDir = path.join(__dirname, "data");

function filePath(name) {
  return path.join(dataDir, name);
}

async function readData(file) {
  try {
    return await jsonfile.readFile(filePath(file));
  } catch (err) {
    console.error("Read error:", err);
    return [];
  }
}

async function writeData(file, data) {
  try {
    await jsonfile.writeFile(filePath(file), data, { spaces: 2 });
  } catch (err) {
    console.error("Write error:", err);
  }
}

module.exports = { readData, writeData };
