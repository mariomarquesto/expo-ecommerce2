// employes/src/pages/EmployeesPage.jsx
import { useQuery } from "@tanstack/react-query";
import { employeeApi } from "../lib/api";
import { UsersIcon, MailIcon, PhoneIcon } from "lucide-react";

function EmployeesPage() {
  const { data: employees, isLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: employeeApi.getAll,
  });

  const employeesList = Array.isArray(employees) ? employees : [];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Empleados</h1>
        <p className="text-gray-600 mt-1">
          {employeesList.length} empleados registrados
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
          ) : employeesList.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-xl font-semibold mb-2">No hay empleados</p>
              <p className="text-sm">Los empleados aparecerán aquí cuando se registren</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {employeesList.map((employee) => (
                <div key={employee._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                      <UsersIcon className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{employee.name}</h3>
                      <p className="text-sm text-gray-500 capitalize">{employee.role || "Empleado"}</p>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-600 flex items-center gap-2">
                      <MailIcon className="w-4 h-4" /> {employee.email}
                    </p>
                    <p className="text-gray-600 flex items-center gap-2">
                      <PhoneIcon className="w-4 h-4" /> {employee.phone || "No registrado"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmployeesPage;