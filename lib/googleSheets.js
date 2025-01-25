import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

export async function getGoogleSheets() {
  const client = new JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });

  const sheets = google.sheets({ version: 'v4', auth: client });
  return sheets;
}

export async function appendToSheet(values) {
  const sheets = await getGoogleSheets();
  
  return await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.SHEET_ID,
    range: 'Clases!A:E', // Ajusta según tu hoja
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [values]
    },
  });
}

export async function getMonthlyReport(month, year) {
  const sheets = await getGoogleSheets();
  
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range: 'Clases!A:E', // Ajusta según tu hoja
  });

  const rows = response.data.values || [];
  
  // Filtrar por mes y año, y agrupar por estudiante
  return rows.reduce((acc, row) => {
    const [date, student, time, price] = row;
    const rowDate = new Date(date);
    
    if (rowDate.getMonth() === month && rowDate.getFullYear() === year) {
      if (!acc[student]) {
        acc[student] = { classes: 0, total: 0 };
      }
      acc[student].classes++;
      acc[student].total += Number(price);
    }
    return acc;
  }, {});
} 
