import express, { Router } from "express";
import serverless from "serverless-http";
import SteamAPI from "steamapi";

const api = express();
const steam = new SteamAPI(process.env.STEAM_API_KEY);

const router = Router();
router.get("/hello", (req, res) => res.send("Hello World!"));
router.get("/games", function (req, res) {
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
  
api.use("/api/", router);

export const handler = serverless(api);

