// main.js file
require('dotenv').config();

const express = require("express");
const ViteExpress = require("vite-express");

const app = express();
const serverless = require('serverless-http');

const SteamAPI = require("steamapi");
const steam = new SteamAPI(process.env.STEAM_API_KEY);

app.get("/games", function (req, res) {
  const id = req.params.gameid;
  console.log("id inside get request");
  console.log(id);
  steam.getUserOwnedGames(process.env.STEAM_USER_ID).then(games => {
    return res.json(games);
  }).catch(error => {
    console.error(error);
    return res.send(500);
  });
});

app.get("/hello", (req, res) => {
  res.send("Hello Vite + React!");
});

export const handler = serverless(app);

/*
ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000...")
);
*/
