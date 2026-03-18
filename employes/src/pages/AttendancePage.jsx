import { useState } from "react";
import { Play, Square, History } from "lucide-react";

function AttendancePage() {
  const [isOnClock, setIsOnClock] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="card bg-base-100 shadow-xl border border-base-300">
        <div className="card-body items-center text-center py-10">
          <h2 className="text-2xl font-bold mb-2">Control de Asistencia</h2>
          <p className="text-base-content/60 mb-8 tracking-widest text-4xl font-mono uppercase">
            {isOnClock ? "04:12:45" : "00:00:00"}
          </p>
          
          <div className="flex gap-4">
            {!isOnClock ? (
              <button 
                onClick={() => setIsOnClock(true)}
                className="btn btn-primary btn-lg gap-2 shadow-lg"
              >
                <Play size={20} /> Iniciar Jornada
              </button>
            ) : (
              <button 
                onClick={() => setIsOnClock(false)}
                className="btn btn-error btn-lg gap-2 shadow-lg"
              >
                <Square size={20} /> Finalizar Jornada
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Historial Reciente */}
      <div className="card bg-base-100 shadow-sm border border-base-300 overflow-hidden">
        <div className="p-4 bg-base-200 font-bold flex items-center gap-2 text-sm uppercase opacity-70">
          <History size={16} /> Últimos Registros
        </div>
        <table className="table w-full">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Entrada</th>
              <th>Salida</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>16 Mar 2026</td>
              <td>08:00</td>
              <td>17:05</td>
              <td className="font-bold text-primary">9h 05m</td>
            </tr>
            <tr>
              <td>15 Mar 2026</td>
              <td>08:10</td>
              <td>17:00</td>
              <td className="font-bold text-primary">8h 50m</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AttendancePage;