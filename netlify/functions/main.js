require('dotenv').config();

import * as express from 'express'
const app = express();

import { serverless } from 'serverless-http';

import { SteamAPI } from 'steamapi';
const steam = new SteamAPI(process.env.STEAM_API_KEY);

app.get("/", function (req, res) {
    return res.send('hello world');
});

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
