import express from 'express'
import {spotifyApi} from '../server.js'

const topTracksRouter = express.Router();

topTracksRouter.get("/long_term", (req, res) => {
    spotifyApi.getMyTopTracks({ limit: 100, time_range: "long_term" }).then(
      function (data) {
        let topTracks = data.body.items;
        res.send(topTracks);
      },
      function (err) {
        res.status(500).send(err);
      }
    );
  });
  
  topTracksRouter.get("/medium_term", (req, res) => {
    spotifyApi.getMyTopTracks({ limit: 50 }).then(
      function (data) {
        let topTracks = data.body.items;
        res.send(topTracks);
      },
      function (err) {
        res.status(500).send(err);
      }
    );
  });
  
  topTracksRouter.get("/short_term", (req, res) => {
    spotifyApi.getMyTopTracks({ limit: 50, time_range: "short_term" }).then(
      function (data) {
        let topTracks = data.body.items;
        res.send(topTracks);
      },
      function (err) {
        res.status(500).send(err);
      }
    );
  });

  export default topTracksRouter