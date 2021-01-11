// node express
const express = require('express');
const app = express();

// axios for api and .env for secrets
const axios = require('axios');
require('dotenv').config();

// port
const PORT = 3001;

const OauthClient = require("./oauth/client.js");

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

app.get("/",  async (req, res) => {

    let token =  await oauthClient.getToken();

    await axios.get(`https://us.api.blizzard.com/hearthstone/cards?locale=en_US&page=${1}&access_token=${token}`)
    .then((response) => {
        console.log(response)
    })
    .catch(()=> {
        console.log('im in the catch')
    })

    res.send("OK");

});

// example of how to implement
// app.get("/signature", async (req, res, next) => {
//   try {
//     const { characterName, realmName, region } = req.query;
//     const character = await characterService.getCharacter(region, realmName, characterName);
//     const characterMedia = await characterService.getCharacterMedia(character);
//     const { filename, data } = await signatureService.generateImage(character, characterMedia);
//     res.set("Content-Type", "image/png");
//     res.set("Content-Disposition", `inline; filename="${filename}"`);
//     res.send(data);
//   } catch (err) {
//     next(err);
//   }
// });

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("Internal Service Error");
});

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
})
