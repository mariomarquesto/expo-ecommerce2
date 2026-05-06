// employes/src/pages/MyTasksPage.jsx
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

const employeeApi = {
  getMyTasks: async () => {
    const { data } = await axiosInstance.get("/employee/tasks");
    return data;
  },
  updateTaskStatus: async ({ id, status }) => {
    const { data } = await axiosInstance.patch(`/employee/tasks/${id}/status`, { status });
    return data;
  },
};

function MyTasksPage() {
  const { data: tasks, isLoading, refetch } = useQuery({
    queryKey: ["employee-tasks"],
    queryFn: employeeApi.getMyTasks,
  });

  const updateStatus = async (id, status) => {
    await employeeApi.updateTaskStatus({ id, status });
    refetch();
  };

  const tasksList = tasks || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mis Tareas</h1>
        <p className="text-gray-600 mt-1">Gestiona tus tareas asignadas</p>
      </div>

      <div className="space-y-3">
        {tasksList.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <p className="text-gray-500">No tienes tareas asignadas</p>
          </div>
        ) : (
          tasksList.map((task) => (
            <div key={task._id} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-4 hover:shadow-md transition">
              <button 
                onClick={() => updateStatus(task._id, task.status === "completed" ? "pending" : "completed")}
                className="text-gray-400 hover:text-green-500 transition"
              >
                {task.status === "completed" ? <CheckCircle2 className="w-6 h-6 text-green-500" /> : <Circle className="w-6 h-6" />}
              </button>
              <div className="flex-1">
                <h3 className={`font-bold ${task.status === "completed" ? "line-through text-gray-400" : "text-gray-900"}`}>
                  {task.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                  <Clock size={12} /> Vence: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "Sin fecha"}
                </p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                task.status === "completed" ? "bg-green-100 text-green-700" :
                task.status === "in_progress" ? "bg-blue-100 text-blue-700" :
                "bg-yellow-100 text-yellow-700"
              }`}>
                {task.status === "completed" ? "Completada" : 
                 task.status === "in_progress" ? "En progreso" : "Pendiente"}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyTasksPage;