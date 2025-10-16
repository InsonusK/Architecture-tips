// scripts/rename-ea-files.js
import fs from "fs";
import path from "path";
import sqlite3 from "sqlite3";

const eaFile = "Architecture-tips.eapx"; // путь к твоему файлу EA
const reportDir = "docs/ea-report";

const db = new sqlite3.Database(eaFile);
const diagramQuery = "SELECT Diagram_ID, Diagram_GUID, Name FROM t_diagram";

db.all(diagramQuery, (err, rows) => {
  if (err) throw err;
  const map = new Map(rows.map(r => [r.Diagram_ID, r.Diagram_GUID]));

  fs.readdirSync(reportDir).forEach(file => {
    const match = file.match(/^EA(\d+)\.(htm|png)$/i);
    if (!match) return;
    const id = Number(match[1]);
    const guid = map.get(id);
    if (!guid) return;
    const ext = match[2].toLowerCase();
    const oldPath = path.join(reportDir, file);
    const newPath = path.join(reportDir, `${guid}.${ext}`);
    fs.renameSync(oldPath, newPath);
    console.log(`→ ${file} → ${guid}.${ext}`);
  });

  db.close();
});
