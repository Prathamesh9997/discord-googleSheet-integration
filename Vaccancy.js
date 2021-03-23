const { google } = require("googleapis");
const PrivateChat = require("./PrivateChat");
require("dotenv").config();

module.exports = async (client, sheetClient, receivedMessage) => {
  let fullCommand = receivedMessage.content.substr(1);
  let splitCommand = fullCommand.split(" ");
  let primaryCommand = splitCommand[0];
  let arguments = splitCommand.slice(1);

  //Get data from sheet and verify the user commands
  const gsapi = google.sheets({ version: "v4", auth: sheetClient });
  const batch = {
    spreadsheetId: process.env.BATCHSHEETID,
    range: "Sheet1",
  };
  let batchData = await gsapi.spreadsheets.values.get(batch);
  let batchInfo = batchData.data.values;
  let roleID;
  let isBatch = false;

  batchInfo.map((array) => {
    //if clan is present in the sheet
    if (array[0] === primaryCommand) {
      isBatch = true;
      roleID = array[1];
      //checking clan is open or not
      if (
        array[array.length - 1] === "NO" ||
        array[array.length - 1] === "No" ||
        array[array.length - 1] === "no"
      ) {
        receivedMessage.channel.send(
          `${receivedMessage.author.toString()}, Sorry the addmission in this batch has closed. If you wish to apply for addmission in next batch please contact Outscal Team`
        );
        return;
      } else if (
        array[array.length - 1] === "YES" ||
        array[array.length - 1] === "Yes" ||
        array[array.length - 1] === "yes"
      ) {
        receivedMessage.channel.send(
          `${receivedMessage.author.toString()}, Please check your DM to verify your email id`
        );
        //Calling PrivateChat function
        PrivateChat(
          client,
          sheetClient,
          roleID,
          receivedMessage,
          primaryCommand
        );
        return;
      }
    }
  });

  //if clan is not present in the sheet
  !isBatch &&
    receivedMessage.channel.send(
      `${receivedMessage.author.toString()}, Sorry but I am not sure about this batch, please contact Outscal Team`
    );
  return;
};
