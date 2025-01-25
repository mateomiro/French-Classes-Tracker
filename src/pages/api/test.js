import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

export default async function handler(req, res) {
  try {
    // 1. Verificar variables de entorno
    console.log('Variables disponibles:', {
      hasEmail: !!process.env.GOOGLE_CLIENT_EMAIL,
      hasKey: !!process.env.GOOGLE_PRIVATE_KEY,
      hasSheetId: !!process.env.SHEET_ID,
    });

    // 2. Intentar crear el cliente
    const client = new JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    // 3. Intentar inicializar sheets
    const sheets = google.sheets({ version: 'v4', auth: client });

    // 4. Intentar una operación simple
    const response = await sheets.spreadsheets.get({
      spreadsheetId: process.env.SHEET_ID
    });

    // Si llegamos aquí, todo está bien
    return res.status(200).json({
      success: true,
      sheetTitle: response.data.properties.title,
      message: 'Conexión exitosa'
    });

  } catch (error) {
    // Capturar el error específico
    console.error('Error completo:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack,
      code: error.code
    });
  }
}
