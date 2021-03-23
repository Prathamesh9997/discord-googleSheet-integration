const { google } = require("googleapis");
const updateSystemLog = require("./updateSystemLog");
require("dotenv").config();

//Private chat with bot
module.exports = (
  client,
  sheetClient,
  roleID,
  receivedMessage,
  primaryCommand
) => {
  let emailByUser;
  let clan = primaryCommand.split("-");
  receivedMessage.author.send("Please enter your registered email id");

  client.on("message", async (checkMessage) => {
    if (checkMessage.channel.type === "dm") {
      emailByUser = checkMessage.content;
    }

    //Getting data from sheet and verifying email address
    const gsapi = google.sheets({ version: "v4", auth: sheetClient });
    const member = {
      spreadsheetId: process.env.MEMBERSHEETID,
      range: `Sheet${clan[1]}`,
    };

    let memberData = await gsapi.spreadsheets.values.get(member);
    let memberInfo = memberData.data.values;

    memberInfo.find((array, index) => {
      //if email is registered
      if (array[0] === emailByUser) {
        //if candidate id is not present
        if (array[1] === "") {
          checkMessage.author.send("Welcome to the batch.");

          //Role assignment
          if (receivedMessage.member.roles.cache.has(roleID)) {
          } else {
            receivedMessage.member.roles.add(roleID);
          }

          //Calling updateSystemLog function to update system log
          updateSystemLog(
            client,
            sheetClient,
            clan[1],
            emailByUser,
            primaryCommand,
            roleID,
            index
          );
          return;
        } else {
          //if email is already authorized
          checkMessage.author.send(
            `This email id is already authorized to access than ${primaryCommand}. You can try with another email id registered with us or contact Outscal Team.`
          );
          return;
        }
      }
    });
  });
};
