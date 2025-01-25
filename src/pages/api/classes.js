import { appendToSheet, getMonthlyReport } from '../../lib/googleSheets';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { student, date, time, price } = req.body;
      await appendToSheet([date, student, time, price]);
      res.status(200).json({ message: 'Clase registrada con éxito' });
    } catch (error) {
      res.status(500).json({ error: 'Error al registrar la clase' });
    }
  } else if (req.method === 'GET') {
    try {
      const { month, year } = req.query;
      const report = await getMonthlyReport(parseInt(month), parseInt(year));
      res.status(200).json(report);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el reporte' });
    }
  }
} 
