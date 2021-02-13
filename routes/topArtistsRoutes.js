import express from 'express'
import {spotifyApi} from '../server.js'

const topArtistRouter = express.Router();


topArtistRouter.get("/long_term", (req, res) => {
    spotifyApi.getMyTopArtists({ limit: 50, time_range: "long_term" }).then(
      function (data) {
        let topArtists = data.body.items;
        res.send(topArtists);
      },
      function (err) {
        res.status(500).send(err);
      }
    );
  });
  
  topArtistRouter.get("/medium_term", (req, res) => {
    spotifyApi.getMyTopArtists({ limit: 50 }).then(
      function (data) {
        let topArtists = data.body.items;
        res.send(topArtists);
      },
      function (err) {
        res.status(500).send(err);
      }
    );
  });
  
  topArtistRouter.get("/short_term", (req, res) => {
    spotifyApi.getMyTopArtists({ limit: 50, time_range: "short_term" }).then(
      function (data) {
        let topArtists = data.body.items;
        res.send(topArtists);
      },
      function (err) {
        res.status(500).send(err);
      }
    );
  });

export default topArtistRouter