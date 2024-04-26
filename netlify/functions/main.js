require('dotenv').config();

const express = require("express");
const app = express();
const serverless = require('serverless-http');

const SteamAPI = require("steamapi");
const steam = new SteamAPI(process.env.STEAM_API_KEY);

app.get("/games", function (req, res) {
  const id = req.params.gameid;
  steam.getUserOwnedGames(process.env.STEAM_USER_ID).then(games => {
    return res.json(games);
  }).catch(error => {
    console.error(error);
    return res.send(500);
  });
});

export const handler = serverless(app);
