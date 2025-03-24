function doPost(e) {
  try {
    // Ensure the Google Sheet ID is correct
    const sheet = SpreadsheetApp.openById('your-google-sheet-id').getSheetByName('Sheet1');
    if (!sheet) {
      throw new Error('Sheet1 not found in the spreadsheet');
    }

    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    const { name, designation, type, lat, lng } = data;

    // Validate the incoming data
    if (!name || !designation || !type || lat === null || lng === null) {
      throw new Error('Invalid data received: ' + JSON.stringify(data));
    }

    const timestamp = new Date();

    // Log the incoming data for debugging
    Logger.log('Received data: %s', JSON.stringify(data));

    // Append the data to the sheet
    sheet.appendRow([name, designation, type, timestamp, lat, lng]);

    return ContentService.createTextOutput('Attendance recorded');
  } catch (error) {
    // Log the error for debugging
    Logger.log('Error processing request: %s', error.toString());
    return ContentService.createTextOutput('Error recording attendance: ' + error.message)
      .setMimeType(ContentService.MimeType.TEXT);
  }
}
