export function formatDate(curDate) {
  const dateFromServer = new Date(curDate); // Received from the server
  const patientDob = dateFromServer
    .toLocaleDateString("en-GB")
    .replaceAll("/", ".");
  return patientDob === "Invalid Date" ? curDate : patientDob;
}

export function formatDateForSQL(curDate) {
  const inputDateString = curDate;
  const [day, month, year] = inputDateString.split(".");

  const parsedDate = new Date(`${year}-${month}-${day}`);
  // Format the date as YYYY-MM-DD
  const formattedDate = parsedDate.toISOString().split("T")[0];
  return formattedDate;
}
