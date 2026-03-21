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
      if (filePath.endsWith(".js") || filePath.endsWith(".jsx")) {
        results.push(filePath);
      }
    }
  }
  return results;
}

const files = walk(path.join(__dirname, "src"));

for (const file of files) {
  try {
    let content = fs.readFileSync(file, "utf8");
    if (content.includes(">aite<")) {
      content = content.replace(/>aite</g, ">erse<");
      fs.writeFileSync(file, content, "utf8");
      console.log("Updated split branding in: " + file);
    }
  } catch (e) {
    console.error("Error reading " + file, e);
  }
}
