import React, { useContext } from "react";

import {
  Home,
  Users,
  Stethoscope,
  Calendar,
  LogOut,
  Settings,
} from "lucide-react";
import { AuthContext } from "../contexts/AuthContext";
import type { Page } from "../types";

interface DashboardLayoutProps {
  children: React.ReactNode;
  activePage: Page;
  navigateTo: (page: Page) => void;
}

const NavItem: React.FC<{
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon: Icon, label, isActive, onClick }) => (
  <li
    onClick={onClick}
    className={`flex items-center p-3 my-1 rounded-lg cursor-pointer transition-colors ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-gray-300 hover:bg-gray-700 hover:text-white"
    }`}
  >
    <Icon size={20} className="mr-3" />
    <span>{label}</span>
  </li>
);

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  activePage,
  navigateTo,
}) => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="flex h-screen w-full bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-gray-800 text-white flex flex-col p-4">
        <div className="text-2xl font-bold mb-10 text-center">medconnect</div>
        <nav className="flex-grow">
          <ul>
            <NavItem
              icon={Home}
              label="Início"
              isActive={activePage === "home"}
              onClick={() => navigateTo("home")}
            />
            {/* novo item de menu para Agendamentos */}
            <NavItem
              icon={Calendar}
              label="Agendamentos"
              isActive={activePage === "appointments"}
              onClick={() => navigateTo("appointments")}
            />
            <NavItem
              icon={Users}
              label="Pacientes"
              isActive={activePage === "patients"}
              onClick={() => navigateTo("patients")}
            />
            <NavItem
              icon={Stethoscope}
              label="Médicos"
              isActive={activePage === "doctors"}
              onClick={() => navigateTo("doctors")}
            />
          </ul>
        </nav>
        <div className="border-t border-gray-700 pt-4">
          <div className="text-sm text-gray-400 mb-2 px-3">{user?.email}</div>
          <NavItem
            icon={Settings}
            label="Editar Perfil"
            isActive={activePage === "edit-user"}
            onClick={() => navigateTo("edit-user")}
          />
          <NavItem
            icon={LogOut}
            label="Sair"
            isActive={false}
            onClick={logout}
          />
        </div>
      </aside>

      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">{children}</main>
    </div>
  );
};

export default DashboardLayout;
