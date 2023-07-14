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
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  let addDataQuery = ` insert into cricket_team (player_name,jersey_number,role) values(
      '${playerName}',
      ${jerseyNumber},
      '${role}'
  )`;
  const dbResponse = await db.run(addDataQuery);
  const bookId = dbResponse.lastID;
  response.send("Player Added To Team");
});
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  //console.log(playerId);
  const get_data_query = `
  select * from cricket_team where player_id =${playerId};
  `;
  let book = await db.get(get_data_query);
  response.send(book);
});
app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const updateBookQuery = `
    UPDATE
      cricket_team
    SET
      player_name='${playerName}',
      jersey_number=${jerseyNumber},
      role='${role}'
    WHERE
      player_id = ${playerId};`;
  await db.run(updateBookQuery);
  response.send("Player Details Updated");
});
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `
    DELETE FROM
      cricket_team
    WHERE
      player_id = ${playerId};`;
  await db.run(deletePlayerQuery);
  response.send("Player Removed");
});
