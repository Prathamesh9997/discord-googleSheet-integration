const { google } = require("googleapis");
const uuid = require("uuid");
require("dotenv").config();

module.exports = (
  client,
  sheetClient,
  clan,
  emailByUser,
  primaryCommand,
  roleID,
  index
) => {
  let systemChannel = client.channels.cache.get(process.env.SYSTEMCHANNELID);
  let uid = uuid.v4();
  let range = `Sheet${clan}!A${index + 1}`;

  //sending msg to system log channel
  systemChannel.send(
    `User has joined a clan! Here are the details \n User Email: ${emailByUser} \n UserID: ${uid} \n Role ID: ${roleID} \n User clan: ${primaryCommand}`
  );

  //calling updateSheetData function to update sheet data
  updateSheetData(sheetClient, range, uid, roleID);
  return;
};

const updateSheetData = async (sheetClient, range, uid, roleID) => {
  let values = [[, uid, , roleID]];
  const gsapi = google.sheets({ version: "v4", auth: sheetClient });
  const opt = {
    spreadsheetId: process.env.MEMBERSHEETID,
    range: range,
    valueInputOption: "RAW",
    resource: { values: values },
  };

  let request = await gsapi.spreadsheets.values.update(opt);
  //console.log(request);
};
