const Discord = require("discord.js");
const { google } = require("googleapis");
const keys = require("./keys.json");
const Vaccancy = require("./Vaccancy");
require("dotenv").config();

const client = new Discord.Client();
const sheetClient = new google.auth.JWT(
  keys.client_email,
  null,
  keys.private_key,
  ["https://www.googleapis.com/auth/spreadsheets"]
);

//DISCORD BOT ready
client.on("ready", () => {
  console.log(`Connected as ${client.user.tag}`);
  client.user.setActivity("Cricket match", { type: "WATCHING" });
  console.log("BOT Ready");
});

//On user's message
client.on("message", (receivedMessage) => {
  //if msg sent by bot itself then 'return' to avoid infinite loop
  if (receivedMessage.author === client.user) {
    return;
  }
  if (receivedMessage.content.startsWith("!")) {
    //Google Sheet authorization.
    sheetClient.authorize((err, tokens) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Connected to goole sheet");
        //Calling Vacancy to check weather clan is open or not
        Vaccancy(client, sheetClient, receivedMessage);
      }
    });
  }
});

//BOT login
client.login(process.env.BOTID);
