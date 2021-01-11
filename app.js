// node express
const express = require('express');
const app = express();

// axios for api, .env for credentials, and oauth client
const axios = require('axios');
const OauthClient = require("./oauth/client.js");
require('dotenv').config();

// port
const PORT = 3000;

const oauthOptions = {
    client: {
        id: process.env.BNET_ID,
        secret: process.env.BNET_SECRET
    },
    auth: {
        tokenHost: process.env.OAUTH_TOKEN_HOST || "https://us.battle.net"
    }
};

// imported from ./oauth/client.js
const oauthClient = new OauthClient({ oauthOptions });

app.get("/api",  async (req, res) => {

    let token =  await oauthClient.getToken();

    let jsonObj = {aToken: token}

    res.send(JSON.stringify(jsonObj));

});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("Internal Service Error");
});

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
})
