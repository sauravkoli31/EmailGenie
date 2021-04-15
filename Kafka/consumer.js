const { Kafka, logLevel } = require("kafkajs");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Messages = require("./messages.model");
const User = require("./user.model");
const mongojs = require("mongojs");
const fetch = require("node-fetch");
const psl = require("psl");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

dotenv.config();
db = mongojs(process.env.MONGOURI);

mongoose.connect(
  process.env.MONGOURI,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
  (err) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log(
        "\x1b[36m ################   Successfully Connected to MongoDB \x1b[0m"
      );
    }
  }
);

const host = process.env.KAFKAURI;

const kafka = new Kafka({
  logLevel: logLevel.INFO,
  brokers: [`${host}:9092`],
  clientId: "example-consumer",
});

const topic = "topic-test";
const consumer = kafka.consumer({
  groupId: "test-group",
  heartbeatInterval: 3000,
});

function fetchEmails(email, id, accessToken) {
  return new Promise((resolve, reject) => {
    link = `https://gmail.googleapis.com/gmail/v1/users/${email}/messages/${id}?format=FULL&access_token=${accessToken}`;
    fetch(link)
      .then((response) => response.json())
      .then(async (allEmails) => {
        if (allEmails.payload) {
          try {
            var fromAddr = allEmails.payload.headers.find((obj) => {
              if (obj.name === "From"){
                return obj;
              } else if (obj.name === "from"){
                return obj;
              };
            });
            const re = /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            tempEmailFrom = fromAddr.value.replace(/(\<|\>)/g, "").match(re);
            emailFrom =
              tempEmailFrom == null ? fromAddr.value : tempEmailFrom[0];
              let allUnSubLinks = [];
              try {
              allEmails.payload.parts.forEach((parts) => {
                if (parts.mimeType === "text/html") {
                  let decodedBody = Buffer.from(
                    parts.body.data,
                    "base64"
                  ).toString("binary");

                  const dom = new JSDOM(decodedBody, {
                    contentType: "text/html",
                    includeNodeLocations: true,
                  });
                  const anc = dom.window.document.querySelectorAll("a");
                  anc.forEach((data) => {
                    if (!data.textContent.search(/unsub/i))
                      allUnSubLinks.push(data.href);
                  });
                }
              });
            } catch (e) {
              console.log(id, emailFrom, ' - No Unsublink');
            }

            if (emailFrom !== null) {
              if (Object.keys(allUnSubLinks).length === 0 ) allUnSubLinks = null;
              let result = {
                FromAddress: emailFrom,
                rootDomain: psl.get(emailFrom.split("@").pop()),
                unsubLink: allUnSubLinks
              };

              resolve(result);
            } else {
              reject(e);
            }
          } catch (e) {
            console.log(e);
            reject(e);
          }
        } else if (allEmails.error) {
          console.log(` \x1b[31m ${allEmails.error.errors[0].reason} : Retrying for ID ${id} 
            \n Reason Code : ${allEmails.error.code}, Text : ${allEmails.error.message}\x1b[0m
            `);

          await sleep(3000);
          fetchEmails(email, id, accessToken).then((res) => {
            console.log(
              `\x1b[33m Error was faced but we recovered : ${id} ${res} \x1b[0m id res`
            );
            resolve(res);
          });
        } else {
          console.log(allEmails);
          console.log("wtffffffffffffffffffffffffffff");
          resolve(null);
        }
      });
  });
}

async function sleep(millis) {
  return new Promise((resolve) => setTimeout(resolve, millis));
}

async function newData(messagesKafka) {
  return new Promise((resolve, reject) => {
    // console.log("\x1b[36m --- In function to consume the message");
    var newPromises = messagesKafka.key
      .toString()
      .split(",")
      .map(async (messageIds) => {
        var accessToken = messagesKafka.value.toString().split("|")[1];
        var userEmail = messagesKafka.value.toString().split("|")[0];
        var emailuuid = messageIds;

        var toSleepOrNotToSleep = 0;

        var checkIfMessageExist = await Messages.findOne({
          email_uuid: emailuuid,
        });

        if (
          checkIfMessageExist == null ||
          checkIfMessageExist.fromAddr == null
        ) {
          toSleepOrNotToSleep += 1;
          await fetchEmails(userEmail, emailuuid, accessToken).then(
            (response) => {
              if (response.FromAddress) {
                const filter = {
                  email_uuid: emailuuid,
                };
                const param = {
                  email: userEmail,
                  fromAddr: response.FromAddress,
                  rootDomain: response.rootDomain,
                  unsubLink: response.unsubLink
                };

                Messages.findOneAndUpdate(filter, param, {
                  new: true,
                  upsert: true,
                }).then((res, err) => {
                  if (err) {
                    console.log("\x1b[41m Error \x1b[0m", err);
                    return "error";
                  } else {
                    console.log(
                      `\x1b[36m -- $Done \x1b[35m ${emailuuid}\x1b[37m#\x1b[33m${response.FromAddress} \x1b[0m`
                    );
                    return "done";
                  }
                });
              }
            }
          );
        }

        if (toSleepOrNotToSleep !== 0) {
          await sleep(800);
        }
      });

    Promise.all(newPromises).then(() =>
      resolve("\x1b[42m \x1b[37m Done 100 \x1b[0m")
    );
  });
  // Messages.insertMany(messagesKafka)
  //   .then(function () {
  //     console.log("Data inserted"); // Success
  //   })
  //   .catch(function (error) {
  //     console.log(error); // Failure
  //   });
}

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`;
      console.log(`- ${prefix}`);
      await newData(message).then((res) => {
        console.log(res);
      });
    },
  });
};

run().catch((e) => console.error(`[example/consumer] ${e.message}`, e));

const errorTypes = ["unhandledRejection", "uncaughtException"];
const signalTraps = ["SIGTERM", "SIGINT", "SIGUSR2"];

errorTypes.map((type) => {
  process.on(type, async (e) => {
    try {
      console.log(`process.on ${type}`);
      console.error(e);
      await consumer.disconnect();
      process.exit(0);
    } catch (_) {
      process.exit(1);
    }
  });
});

signalTraps.map((type) => {
  process.once(type, async () => {
    try {
      await consumer.disconnect();
    } finally {
      process.kill(process.pid, type);
    }
  });
});
