const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;
let app = express();
const initializeDbConnect = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server is running");
    });
  } catch (e) {
    console.log("DB error : ${e}");
    process.exit(1);
  }
};
initializeDbConnect();
app.get("/players/", async (request, response) => {
  let getSqlQuery = `
        select * from cricket_team order by player_id 
    `;
  let books = await db.all(getSqlQuery);
  response.send(books);
});
app.use(express.json());
app.post("/players/", async (request, response) => {
  const bookDetails = request.body;
  const { player_name, jersey_number, role } = bookDetails;
  let addDataQuery = ` insert into cricket_team (playerName,jerseyNumber,role) values(
      ${player_name},
      ${jersey_number},
      ${role}
  )`;
  const dbResponse = await db.run(addDataQuery);
  const bookId = dbResponse.lastID;
  response.send({ bookId: bookId });
});
