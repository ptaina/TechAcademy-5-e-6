import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserPlus, Stethoscope, Calendar } from "lucide-react";
import { AuthContext } from "../contexts/AuthContext";
import api from "../services/api";

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ElementType;
  isLoading: boolean;
}> = ({ title, value, icon: Icon, isLoading }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {title}
      </p>
      {isLoading ? (
        <div className="h-8 w-12 bg-gray-300 dark:bg-gray-600 rounded-md animate-pulse mt-1"></div>
      ) : (
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {value}
        </p>
      )}
    </div>
    <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full">
      <Icon className="text-blue-600 dark:text-blue-400" size={24} />
    </div>
  </div>
);

const HomePage: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    patients: 0,
    doctors: 0,
    appointments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [patientsRes, doctorsRes, appointmentsRes] = await Promise.all([
          api.get("/patients"),
          api.get("/doctors"),
          api.get("/appointments"),
        ]);
        const today = new Date().toISOString().split("T")[0];
        const appointmentsToday = appointmentsRes.data.filter(
          (app: { date: string }) => app.date.startsWith(today)
        ).length;
        setStats({
          patients: patientsRes.data.length,
          doctors: doctorsRes.data.length,
          appointments: appointmentsToday,
        });
      } catch (error) {
        console.error("Falha ao buscar estatísticas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Olá, {user?.name || user?.email}!
      </h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Bem-vindo(a) de volta ao seu painel de controle.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <StatCard
          title="Total de Pacientes"
          value={stats.patients}
          icon={UserPlus}
          isLoading={loading}
        />
        <StatCard
          title="Total de Médicos"
          value={stats.doctors}
          icon={Stethoscope}
          isLoading={loading}
        />
        <StatCard
          title="Consultas Hoje"
          value={stats.appointments}
          icon={Calendar}
          isLoading={loading}
        />
      </div>
      <div className="mt-10">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Acesso Rápido
        </h2>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/appointments"
            className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Gerir Agendamentos
          </Link>
          <Link
            to="/patients"
            className="bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Gerir Pacientes
          </Link>
          <Link
            to="/doctors"
            className="bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Gerir Médicos
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
