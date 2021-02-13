import express from 'express'
import {spotifyApi} from '../server.js'

const recommendationsRouter = express.Router();

recommendationsRouter.get("/weekly", (req, res) => {
    spotifyApi
      .searchPlaylists("Discover Weekly", {
        limit: 1,
      })
      .then(function (data) {
        return data.body.playlists.items[0].id;
      })
      .then((response) => {
        spotifyApi
          .getPlaylistTracks(response, { limit: 100 })
          .then(function (data) {
            res.send(data.body.items);
          });
      });
  });
  
  recommendationsRouter.get("/daily", (req, res) => {
    spotifyApi
      .searchPlaylists("Daily Mix", {
        limit: 1,
      })
      .then(function (data) {
        return data.body.playlists.items[0].id;
      })
      .then((response) => {
        spotifyApi
          .getPlaylistTracks(response, { limit: 100 })
          .then(function (data) {
            res.send(data.body.items);
          });
      });
  });

  export default recommendationsRouter