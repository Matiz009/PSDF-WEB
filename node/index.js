const fs = require("fs");
const path = require("path");

const currentDir = './';

try {
  const files = fs.readdirSync(currentDir);

  files.forEach((file) => {
    const filePath = path.join(currentDir, file);

    const stats = fs.statSync(filePath);

    if (stats.isFile() && path.extname(file).toLowerCase() === ".txt") {
      fs.unlinkSync(filePath);
      console.log(`Deleted: ${file}`);
    }
  });

  console.log("All .txt files deleted successfully.");
} catch (error) {
  console.error("Error:", error.message);
}