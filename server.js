const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");

const fetch = require("node-fetch");
const path = require("path");

var index = require("./routes/index");

const { Kafka, CompressionTypes, logLevel } = require("kafkajs");

var User = require("mongoose").model("User");
var jwt = require("jsonwebtoken");
require("dotenv").config();

//Kafka Config
const host = process.env.KAFKAURI;
const kafka = new Kafka({
  logLevel: logLevel.DEBUG,
  brokers: [`${host}:9092`],
  clientId: "example-producer",
});

//Kafka Topic
const topic = "topic-test";

//Initialize Producer and connect to it.
const producer = kafka.producer();
producer.connect()

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.jwtToken, async (err, user) => {
      if (err) {
        console.log("Uh Oh, you dumb");
        return res.sendStatus(403);
      }
      req.id = user;
      const aToken = await User.findOne({ email: user.user })
        .select("googleProvider.token")
        .exec();
      req.aToken = aToken.googleProvider.token;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

var corsOption = {
  origin: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  exposedHeaders: ["x-auth-token"],
};
app.use(cors(corsOption));

// parse application/x-www-form-urlencoded
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    parameterLimit: 100000,
    extended: false,
  })
);
// parse application/json
app.use(bodyParser.json());
// For an actual app you should configure this with an experation time, better keys, proxy and secure
app.use(
  cookieSession({
    name: "genie-session",
    keys: ["key1", "key2"],
    maxAge: 600000,
  })
);

app.use("/api/v1/", index);

app.use(express.static(__dirname + "/build"));

//Get Initial data
function getProfile(email, accessToken) {
  return new Promise((resolve, reject) => {
    fetch(`https://gmail.googleapis.com/gmail/v1/users/${email}/profile`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        authorization: "Bearer " + accessToken,
      },
    })
      .then((response) => response.json())
      .then((data) => resolve(data));
  });
}

//Test variable
test = 0;

const sendMessage = (test1) => {
  return producer.send({
    topic,
    compression: CompressionTypes.GZIP,
    messages: Array(test1)
  })
  .then(console.log)
  .catch((e) =>
    console.error(`[example/producer] ${e.message}`, e)
  );
}

//Get all emails
function getAllEmails(email, accessToken, pageToken, allFiles = []) {
  return new Promise((resolve, reject) => {
    if (pageToken) {
      link = `https://gmail.googleapis.com/gmail/v1/users/${email}/messages?pageToken=${pageToken}&access_token=${accessToken}`;
    } else {
      link = `https://gmail.googleapis.com/gmail/v1/users/${email}/messages?access_token=${accessToken}`;
    }
    fetch(link)
      .then((response) => response.json())
      .then(async function (data) {
        if (!data.messages) {
          console.log(data);
          reject("Error occured", data);
        }
        const newarr = async () => {
          return Promise.all(
            data.messages.map(async (dd) => {
              test += 1;
              const tempStore = {};
              tempStore.id = dd.id;
              var test1 = {
                key:dd.id,
                value:email+"|"+accessToken,
              }
            
              sendMessage(test1);
              console.log(test, tempStore);
              allFiles.push(tempStore);
              return tempStore;
            })
          );
        };
        newarr().then((data) => {
          console.log(test, " Done");
          allFiles.concat(data);
        });
        if (data.nextPageToken) {
          // await sleep(100);
          getAllEmails(email, accessToken, data.nextPageToken, allFiles).then(
            (resAllFiles) => {
              resolve(resAllFiles);
            }
          );
        } else {
          console.log("All Done", typeof allFiles);
          resolve(allFiles);
          test = 0;
        }
        // resolve(allFiles);
      });
  });
}

function fetchEmails(email, id, accessToken) {
  return new Promise((resolve, reject) => {
    link = `https://gmail.googleapis.com/gmail/v1/users/${email}/messages/${id}?format=metadata&access_token=${accessToken}`;
    fetch(link)
      .then((response) => response.json())
      .then((allEmails) => {
        // console.log(id);
        try {
          var fromAddr = allEmails.payload.headers.find((obj) => {
            return obj.name === "From";
          });
          // const re = /[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/m;
          const re = /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          emailFrom = fromAddr.value.replace(/(\<|\>)/g, "").match(re);
          // console.log(id, emailFrom[0]);
          sleep(10);
          resolve(emailFrom[0] || null);
        } catch (e) {
          console.log(e);
          reject(e);
        }
      });
  });
}

async function sleep(millis) {
  return new Promise((resolve) => setTimeout(resolve, millis));
}

// Example protected and unprotected routes
app.get("/failed", (req, res) => res.send("You Failed to log in!"));

// In this route you can see that if the user is logged in u can acess his info in: req.user
app.get("/", (req, res) => {
  console.log("Reached Home");
  console.log(req.session);
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.post("/logout", authenticateJWT, async (req, res) => {
  await User.deleteOne({ email: req.id.user }, function (err) {
    if (err) console.log(err);
    console.log("Successful deletion");
    res.send("OK");
  });
});

app.post("/api/v0/totalEmails", authenticateJWT, async (req, res) => {
  getProfile(req.id.user, req.aToken).then((response) => {
    res.json(response);
  });
});

app.post("/api/v1/Emails", authenticateJWT, (req, res) => {
  // getAllEmails(req.body.userEmail,req.body.userAccess_Token, "","").then((response) =>
  //   console.log(response)
  // );

  getAllEmails(req.id.user, req.aToken, "", []).then((response) => {
    console.log(response);
  });
  res.sendStatus(200).json({"status":"queued"});
});

app.post("/api/v1/EmailMessages", authenticateJWT, (req, res) => {
  getAllEmails(req.id.user, req.aToken, "", []).then((response) => {
    res.json(response);
  });
  console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
});

app.listen(5000, () => console.log(`App listening on port ${5000}!`));
