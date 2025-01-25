import { appendToSheet, getMonthlyReport } from '../../lib/googleSheets';

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      const { student, date, time, price } = req.body;
      
      if (!student || !date || !time || !price) {
        return res.status(400).json({ error: 'Faltan datos requeridos' });
      }

      const result = await appendToSheet([date, student, time, price]);
      return res.status(200).json({ 
        message: 'Clase registrada con éxito',
        result 
      });

    } else if (req.method === 'GET') {
      const { month, year } = req.query;
      
      if (!month || !year) {
        return res.status(400).json({ error: 'Se requiere mes y año' });
      }

      const report = await getMonthlyReport(parseInt(month), parseInt(year));
      return res.status(200).json(report);
    }

    return res.status(405).json({ error: 'Método no permitido' });

  } catch (error) {
    console.error('Error en el manejador de API:', error);
    return res.status(500).json({ 
      error: 'Error interno del servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
} 
