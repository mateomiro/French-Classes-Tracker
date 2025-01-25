import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

export async function getGoogleSheets() {
  try {
    const client = new JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    const sheets = google.sheets({ version: 'v4', auth: client });
    return sheets;
  } catch (error) {
    console.error('Error al inicializar Google Sheets:', error);
    throw error;
  }
}

export async function appendToSheet(values) {
  try {
    const sheets = await getGoogleSheets();
    
    const result = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SHEET_ID,
      range: 'Clases!A:E',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [values]
      },
    });

    return result;
  } catch (error) {
    console.error('Error al añadir datos a la hoja:', error);
    throw error;
  }
}

export async function getMonthlyReport(month, year) {
  try {
    const sheets = await getGoogleSheets();
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: 'Clases!A:E',
    });

    const rows = response.data.values || [];
    
    return rows.reduce((acc, row) => {
      if (!row[0]) return acc; // Ignorar filas vacías
      
      const [date, student, time, price] = row;
      const rowDate = new Date(date);
      
      if (rowDate.getMonth() === month && rowDate.getFullYear() === year) {
        if (!acc[student]) {
          acc[student] = { classes: 0, total: 0 };
        }
        acc[student].classes++;
        acc[student].total += Number(price) || 0;
      }
      return acc;
    }, {});
  } catch (error) {
    console.error('Error al obtener el reporte mensual:', error);
    throw error;
  }
} 
