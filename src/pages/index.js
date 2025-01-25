import React, { useState } from 'react';
import { Calendar, Clock } from 'lucide-react';

export default function Home() {
  const [classes, setClasses] = useState([]);

  const addKatharinaClass = () => {
    const newClass = {
      id: Date.now(),
      student: 'Katharina',
      time: '9:00-10:00',
      day: 'Miércoles',
      price: 20,
      date: getNextWednesday(),
    };
    setClasses([...classes, newClass]);
  };

  const addToniClass = () => {
    const newClass = {
      id: Date.now(),
      student: 'Toni',
      time: '10:00-11:00',
      day: 'Miércoles',
      price: 20,
      date: getNextWednesday(),
    };
    setClasses([...classes, newClass]);
  };

  const getNextWednesday = () => {
    const now = new Date();
    const nextWed = new Date();
    nextWed.setDate(now.getDate() + ((3 + 7 - now.getDay()) % 7));
    return nextWed.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">Registro de Clases de Francés</h1>
          
          <div className="flex gap-4 mb-8">
            <button 
              onClick={addKatharinaClass}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-md"
            >
              <Calendar className="w-5 h-5" />
              Añadir Clase Katharina
            </button>
            <button 
              onClick={addToniClass}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-md"
            >
              <Clock className="w-5 h-5" />
              Añadir Clase Toni
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estudiante</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horario</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {classes.map(classItem => (
                  <tr key={classItem.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{classItem.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{classItem.student}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{classItem.time}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{classItem.price}€</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
