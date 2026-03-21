const fs = require("fs");
const path = require("path");

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else {
      if (filePath.endsWith(".js") || filePath.endsWith(".jsx") || filePath.endsWith(".css") || filePath.endsWith(".html") || filePath.endsWith(".json")) {
        results.push(filePath);
      }
    }
  }
  return results;
}

const files = walk(path.join(__dirname, "src"));
files.push(path.join(__dirname, "package.json"));
// files.push(path.join(__dirname, "README.md"));

for (const file of files) {
  try {
    let content = fs.readFileSync(file, "utf8");
    if (content.includes("innovaite") || content.includes("Innovaite")) {
      const newContent = content.replace(/innovaite/g, "innoverse").replace(/Innovaite/g, "Innoverse");
      fs.writeFileSync(file, newContent, "utf8");
      console.log("Updated: " + file);
    }
  } catch (e) {
    console.error("Error reading " + file, e);
  }
}
