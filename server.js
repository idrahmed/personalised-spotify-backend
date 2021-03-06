import SpotifyWebApi from "spotify-web-api-node";
import express from "express";
import cors from "cors";
import recommendationsRouter from "./routes/recommendationRoutes.js";
import topTracksRouter from "./routes/topTracksRoutes.js";
import topArtistsRouter from "./routes/topArtistsRoutes.js";
import dotenv from 'dotenv'

dotenv.config()

const scopes = [
  "user-read-recently-played",
  "user-top-read",
  "playlist-modify-public",
  "playlist-modify-private",
  "user-follow-modify",
  "user-library-modify",
  "user-library-read",
  "playlist-read-private",
];

// credentials are optional
export const spotifyApi = new SpotifyWebApi({
  clientId: process.env.REACT_APP_CLIENT_ID,
  clientSecret: process.env.REACT_APP_CLIENT_SECRET,
  redirectUri: process.env.REACT_APP_REDIRECT,
  //http://localhost:9000/callback
});


const app = express();
const PORT = process.env.PORT || 9000;

app.use(cors());
app.use(express.json()); // recognize the incoming Request Object as a JSON Object.
app.use("/recommendations", recommendationsRouter);
app.use("/top-tracks", topTracksRouter);
app.use("/top-artists", topArtistsRouter);

app.get('/login', (req, res) => {
  res.redirect(spotifyApi.createAuthorizeURL(scopes));
});

app.get('/callback', (req, res) => {
  const error = req.query.error;
  const code = req.query.code;
  const state = req.query.state;

  if (error) {
    console.error('Callback Error:', error);
    res.send(`Callback Error: ${error}`);
    return;
  }

  spotifyApi
    .authorizationCodeGrant(code)
    .then(data => {
      const access_token = data.body['access_token'];
      const refresh_token = data.body['refresh_token'];
      const expires_in = data.body['expires_in'];

      spotifyApi.setAccessToken(access_token);
      spotifyApi.setRefreshToken(refresh_token);

      console.log('access_token:', access_token);
      console.log('refresh_token:', refresh_token);

      console.log(
        `Sucessfully retreived access token. Expires in ${expires_in} s.`
      );
      res.redirect('https://personalised-spotify.netlify.app/toptracks')
      // http://localhost:3000/toptracks

      setInterval(async () => {
        const data = await spotifyApi.refreshAccessToken();
        const access_token = data.body['access_token'];

        console.log('The access token has been refreshed!');
        console.log('access_token:', access_token);
        spotifyApi.setAccessToken(access_token);
      }, expires_in / 2 * 1000);
    })
    .catch(error => {
      console.error('Error getting Tokens:', error);
      res.send(`Error getting Tokens: ${error}`);
    });
});

app.get("/me", (req, res) => {
  spotifyApi.getMe().then(
    function (data) {
      res.send(data.body);
    },
    function (err) {
      res.status(500).send(err);
    }
  );
});


app.post("/create-playlist", (req, res) => {
  const name = req.body.name;
  const list = req.body.track_id;

  spotifyApi
    .createPlaylist(name, { public: false })
    .then(function (data) {
      return data.body.id;
    })
    .then(
      (response) => {
        spotifyApi.addTracksToPlaylist(response, list);
      },
      function (err) {
        console.log("Something went wrong!", err);
      }
    );
});

app.post("/artist-top-tracks", (req, res) => {
  const name = req.body.name;
  const artist_list = req.body.track_id;
  const uris = [];

  artist_list.forEach((artist) => {
    spotifyApi.getArtistTopTracks(artist, "ES").then(
      function (data) {
        const songs = data.body.tracks;
        songs.map((track) => uris.push(track.uri));
        console.log(uris);
      },
      function (err) {
        console.log("Something went wrong!", err);
      }
    );
  });

  spotifyApi
    .createPlaylist(name, { public: false })
    .then(function (data) {
      return data.body.id;
    })
    .then(
      (response) => {
        spotifyApi.addTracksToPlaylist(response, uris);
      },
      function (err) {
        console.log("Something went wrong!", err);
      }
    );
});

app.post("/saved-tracks", (req, res) => {
  const track_id = req.body.track_id;
  console.log(track_id);
  spotifyApi.addToMySavedTracks([track_id]).then(
    function (data) {
      console.log("Added track!");
    },
    function (err) {
      console.log("Something went wrong!", err);
    }
  );
});

app.put("/saved-artist", (req, res) => {
  const artist_id = req.body.track_id;
  console.log(artist_id);
  spotifyApi.followArtists([artist_id]).then(
    function (data) {
      console.log("Added artist");
    },
    function (err) {
      console.log("Something went wrong!", err);
    }
  );
});

app.get("/recently-played", (req, res) => {
  spotifyApi
    .getMyRecentlyPlayedTracks({
      limit: 50,
    })
    .then(
      function (data) {
        // Output items
        let recentlyPlayed = data.body.items;
        res.send(recentlyPlayed);
      },
      function (err) {
        res.status(500).send(err);
      }
    );
});

app.listen(PORT, () => console.log("HTTP Server up."));
