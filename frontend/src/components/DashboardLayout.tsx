import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  Stethoscope,
  Calendar,
  LogOut,
  Settings,
  HeartPulse,
} from "lucide-react";
import { AuthContext } from "../contexts/AuthContext";

const NavItem: React.FC<{
  icon: React.ElementType;
  label: string;
  to: string;
  isActive: boolean;
}> = ({ icon: Icon, label, to, isActive }) => (
  <li>
    <Link
      to={to}
      className={`flex items-center p-3 my-1 rounded-lg cursor-pointer transition-colors ${
        isActive
          ? "bg-blue-600 text-white"
          : "text-gray-300 hover:bg-gray-700 hover:text-white"
      }`}
    >
      <Icon size={20} className="mr-3" />
      <span>{label}</span>
    </Link>
  </li>
);

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  return (
    <div className="flex h-screen w-full bg-gray-100 dark:bg-gray-900">
      <aside className="w-64 flex-shrink-0 bg-gray-800 text-white flex flex-col p-4">
        <div className="flex items-center justify-center text-2xl font-bold mb-10 text-center">
          <HeartPulse className="mr-2 text-blue-400" />
          <span>MedConnect</span>
        </div>
        <nav className="flex-grow">
          <ul>
            <NavItem
              to="/"
              label="Início"
              icon={Home}
              isActive={location.pathname === "/"}
            />
            <NavItem
              to="/appointments"
              label="Agendamentos"
              icon={Calendar}
              isActive={location.pathname === "/appointments"}
            />
            <NavItem
              to="/patients"
              label="Pacientes"
              icon={Users}
              isActive={location.pathname === "/patients"}
            />
            <NavItem
              to="/doctors"
              label="Médicos"
              icon={Stethoscope}
              isActive={location.pathname === "/doctors"}
            />
          </ul>
        </nav>
        <div className="border-t border-gray-700 pt-4">
          <div className="text-sm text-gray-400 mb-2 px-3 truncate">
            {user?.email}
          </div>
          <NavItem
            to="/edit-user"
            label="Editar Perfil"
            icon={Settings}
            isActive={location.pathname === "/edit-user"}
          />
          <li
            onClick={logout}
            className="flex items-center p-3 my-1 rounded-lg cursor-pointer transition-colors text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <LogOut size={20} className="mr-3" />
            <span>Sair</span>
          </li>
        </div>
      </aside>
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">{children}</main>
    </div>
  );
};

export default DashboardLayout;
