import React, { useState, useEffect } from 'react';
import { Edit2, Save, Trash, User, FileText } from 'lucide-react';

const FrenchClassesTracker = () => {
  const [classes, setClasses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [monthlyReport, setMonthlyReport] = useState(null);
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    fetchMonthlyReport();
  }, []);

  const fetchMonthlyReport = async () => {
    const currentDate = new Date();
    try {
      const response = await fetch(
        `/api/classes?month=${currentDate.getMonth()}&year=${currentDate.getFullYear()}`
      );
      const data = await response.json();
      setMonthlyReport(data);
    } catch (error) {
      console.error('Error al obtener el reporte:', error);
    }
  };

  const addClass = async (student, time) => {
    const newClass = {
      id: Date.now(),
      student,
      time,
      day: 'Miércoles',
      price: 20,
      date: getNextWednesday(),
    };

    try {
      await fetch('/api/classes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newClass),
      });
      
      setClasses([...classes, newClass]);
      fetchMonthlyReport();
    } catch (error) {
      console.error('Error al guardar la clase:', error);
    }
  };

  const getNextWednesday = () => {
    const now = new Date();
    const nextWed = new Date();
    nextWed.setDate(now.getDate() + ((3 + 7 - now.getDay()) % 7));
    return nextWed.toISOString().split('T')[0];
  };

  const startEdit = (classItem) => {
    setEditingId(classItem.id);
    setEditForm(classItem);
  };

  const saveEdit = () => {
    setClasses(classes.map(c => c.id === editingId ? editForm : c));
    setEditingId(null);
  };

  const deleteClass = (id) => {
    setClasses(classes.filter(c => c.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Clases de Francés</h1>
          <button
            onClick={() => setShowReport(!showReport)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <FileText className="w-4 h-4" />
            Reporte Mensual
          </button>
        </div>

        {showReport && monthlyReport && (
          <div className="bg-white rounded-xl shadow-md p-4 mb-8">
            <h2 className="text-lg font-semibold mb-4">Reporte del Mes</h2>
            {Object.entries(monthlyReport).map(([student, data]) => (
              <div key={student} className="border-b py-2 last:border-0">
                <p className="font-medium">{student}</p>
                <p className="text-sm text-gray-600">
                  Clases: {data.classes} | Total: {data.total}€
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-8">
          <button 
            onClick={() => addClass('Katharina', '9:00-10:00')}
            className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-100"
          >
            <User className="w-8 h-8 text-indigo-600 mb-2" />
            <span className="text-sm font-medium text-gray-800">Katharina</span>
            <span className="text-xs text-gray-500">9:00-10:00</span>
          </button>
          <button 
            onClick={() => addClass('Toni', '10:00-11:00')}
            className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-100"
          >
            <User className="w-8 h-8 text-indigo-600 mb-2" />
            <span className="text-sm font-medium text-gray-800">Toni</span>
            <span className="text-xs text-gray-500">10:00-11:00</span>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {classes.map(classItem => (
              <div key={classItem.id} className="p-4 hover:bg-gray-50 transition-colors duration-150">
                {editingId === classItem.id ? (
                  <div className="space-y-3">
                    <input
                      type="date"
                      value={editForm.date}
                      onChange={e => setEditForm({...editForm, date: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
                    />
                    <select
                      value={editForm.student}
                      onChange={e => setEditForm({...editForm, student: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
                    >
                      <option>Katharina</option>
                      <option>Toni</option>
                    </select>
                    <div className="flex justify-end">
                      <button 
                        onClick={saveEdit}
                        className="p-2 hover:bg-indigo-50 rounded-lg transition-colors duration-150"
                      >
                        <Save className="w-5 h-5 text-indigo-600" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{classItem.student}</h3>
                      <p className="text-sm text-gray-500">{classItem.date}</p>
                      <p className="text-sm text-gray-500">{classItem.time}</p>
                      <p className="text-sm font-medium text-indigo-600 mt-1">{classItem.price}€</p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => startEdit(classItem)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-150"
                      >
                        <Edit2 className="w-5 h-5 text-gray-400" />
                      </button>
                      <button 
                        onClick={() => deleteClass(classItem.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors duration-150"
                      >
                        <Trash className="w-5 h-5 text-red-400" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrenchClassesTracker;
