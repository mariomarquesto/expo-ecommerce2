import { CheckCircle2, Circle, Clock } from "lucide-react";

function MyTasksPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Mis Tareas Asignadas</h1>
        <div className="badge badge-outline">12 Pendientes</div>
      </div>

      <div className="grid gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card bg-base-100 border border-base-300 p-4 flex-row items-center gap-4 hover:shadow-md transition cursor-pointer group">
            <button className="btn btn-circle btn-ghost text-base-content/20 group-hover:text-success">
              <Circle size={24} />
            </button>
            <div className="flex-1">
              <h3 className="font-bold">Tarea Prioritaria #{i}</h3>
              <p className="text-xs text-base-content/50 uppercase font-bold tracking-tighter mt-1 flex items-center gap-1">
                <Clock size={12}/> Vence en 2 horas
              </p>
            </div>
            <div className="badge badge-ghost">Dpto. Ventas</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyTasksPage;