const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const Users = require("./gappi");
const fs = require("fs");
const readline = require("readline");
const fetch = require("node-fetch");

const { google } = require("googleapis");
const SCOPES = [
  "profile",
  "email",
  "https://mail.google.com/",
  "https://www.googleapis.com/auth/gmail.modify",
  "https://www.googleapis.com/auth/gmail.readonly",
];
const TOKEN_PATH = "token.json";

async function sleep(millis) {
  return new Promise((resolve) => setTimeout(resolve, millis));
}
 function authorize(credentials, profile, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oauth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );
  
  
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oauth2Client, callback);
    oauth2Client.credentials = JSON.parse(token);
    
    console.log(callback.name, profile ? "yes" : "no");
    profile
      ? callback(oauth2Client, profile)
      : new Promise(async function (resolve, reject) {
        let temp = await oauth2Client.getAccessToken();
        resolve(temp);
      }).then((result) => {
        callback(result.token);
        });
  });
}

function getNewToken(oauth2Client, callback) {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("Enter the code from that page here: ", (code) => {
    rl.close();
    oauth2Client.getToken(code, (err, token) => {
      if (err) return console.error("Error retrieving access token", err);
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}

function storeToken(token) {
  fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
    if (err) return console.warn(`Token not stored to ${TOKEN_PATH}`, err);
    console.log(`Token stored to ${TOKEN_PATH}`);
  });
}

passport.serializeUser(function (user, done) {
  /*
    From the user take just the id (to minimize the cookie size) and just pass the id of the user
    to the done callback
    PS: You dont have to do it like this its just usually done like this
    */
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  /*
    Instead of user this function usually recives the id 
    then you use the id to select the user from the db and pass the user obj to the done callback
    PS: You can later access this data in any routes in: req.user
    */
  done(null, user);
});

var genieStratergy = new GoogleStrategy(
  {
    clientID: process.env.REACT_APP_rci,
    clientSecret: process.env.googleClientSecret,
    callbackURL: "http://localhost:3000/google/callback",
  },
  async function (accessToken, refreshToken, params, profile, done) {
    /*
     use the profile info (mainly profile id) to check if the user is registerd in ur db
     If yes select the user and pass him to the done callback
     If not create the user and then select him and pass to callback
    */
    //  console.log(accessToken);
    profile.accessToken = accessToken;
    profile.refreshToken = refreshToken;
    //  console.log("\n Profile----------------------------------------",profile);
    return done(null, profile, params);
  }
);

passport.use(genieStratergy);
