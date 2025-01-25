import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

export async function getGoogleSheets() {
  try {
    console.log('Iniciando conexión...');
    
    // Verificar que las variables de entorno estén disponibles
    if (!process.env.GOOGLE_CLIENT_EMAIL) {
      throw new Error('GOOGLE_CLIENT_EMAIL no está definido');
    }
    if (!process.env.GOOGLE_PRIVATE_KEY) {
      throw new Error('GOOGLE_PRIVATE_KEY no está definido');
    }
    if (!process.env.SHEET_ID) {
      throw new Error('SHEET_ID no está definido');
    }

    const client = new JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    const sheets = google.sheets({ version: 'v4', auth: client });
    console.log('Conexión inicializada correctamente');
    return sheets;
  } catch (error) {
    console.error('Error detallado:', error);
    throw error;
  }
}

export async function appendToSheet(values) {
  try {
    console.log('Intentando añadir valores:', values);
    const sheets = await getGoogleSheets();
    
    const result = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SHEET_ID,
      range: 'Clases!A2:E',
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [values]
      },
    });

    console.log('Resultado:', result.data);
    return result;
  } catch (error) {
    console.error('Error al añadir:', error.message);
    throw error;
  }
}

export async function getMonthlyReport(month, year) {
  try {
    const sheets = await getGoogleSheets();
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: 'Clases!A2:E',
    });

    const rows = response.data.values || [];
    
    return rows.reduce((acc, row) => {
      if (!row[0]) return acc;
      
      const [date, student, time, price] = row;
      const rowDate = new Date(date);
      
      if (rowDate.getMonth() === month && rowDate.getFullYear() === year) {
        if (!acc[student]) {
          acc[student] = { classes: 0, total: 0 };
        }
        acc[student].classes++;
        acc[student].total += parseFloat(price) || 0;
      }
      return acc;
    }, {});
  } catch (error) {
    console.error('Error al obtener el reporte mensual:', error);
    throw error;
  }
} 
