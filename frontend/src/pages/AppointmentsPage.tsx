import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import type { Patient, Doctor, Appointment } from "../types";
import Modal from "../components/Modal";
import Notification from "../components/Notification";
import ConfirmModal from "../components/ConfirmModal";
import { useNotification } from "../hooks/useNotification";
import { PlusCircle, ArrowLeft } from "lucide-react";

const AppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    patientId: "",
    doctorId: "",
    date: "",
  });
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    id: number | null;
    status: "completed" | "canceled" | null;
  }>({ isOpen: false, id: null, status: null });

  const navigate = useNavigate();
  const {
    notification,
    showSuccess,
    showError,
    showWarning,
    hideNotification,
  } = useNotification();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [appsRes, patientsRes, doctorsRes] = await Promise.all([
        api.get("/appointments"),
        api.get("/patients"),
        api.get("/doctors"),
      ]);
      setAppointments(appsRes.data);
      setPatients(patientsRes.data);
      setDoctors(doctorsRes.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao buscar dados.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = (id: number, status: "completed" | "canceled") => {
    setConfirmModal({ isOpen: true, id, status });
  };

  const confirmStatusChange = async () => {
    if (!confirmModal.id || !confirmModal.status) return;
    try {
      await api.put(`/appointments/${confirmModal.id}/status`, {
        status: confirmModal.status,
      });
      fetchData();
      showSuccess(
        `Agendamento marcado como ${confirmModal.status} com sucesso!`
      );
    } catch (err) {
      showError(
        err instanceof Error ? err.message : "Falha ao atualizar status."
      );
    } finally {
      setConfirmModal({ isOpen: false, id: null, status: null });
    }
  };

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !newAppointment.patientId ||
      !newAppointment.doctorId ||
      !newAppointment.date
    ) {
      showWarning("Por favor, preencha todos os campos.");
      return;
    }
    try {
      await api.post("/appointments", newAppointment);
      setIsModalOpen(false);
      setNewAppointment({ patientId: "", doctorId: "", date: "" });
      fetchData();
      showSuccess("Agendamento criado com sucesso!");
    } catch (err) {
      showError(
        err instanceof Error ? err.message : "Falha ao criar agendamento."
      );
    }
  };

  if (loading) return <div>A carregar...</div>;
  if (error) return <div className="text-red-500">Erro: {error}</div>;

  return (
    <div>
      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        message={`Tem a certeza de que deseja marcar este agendamento como "${confirmModal.status}"?`}
        onConfirm={confirmStatusChange}
        onCancel={() =>
          setConfirmModal({ isOpen: false, id: null, status: null })
        }
        confirmText="Sim"
        cancelText="Não"
      />
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:underline mb-6"
      >
        <ArrowLeft size={16} className="mr-1" />
        Voltar
      </button>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Agendamentos
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700"
        >
          <PlusCircle size={20} className="mr-2" />
          Novo Agendamento
        </button>
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md overflow-x-auto">
        <table className="w-full text-left">
          <thead className="text-sm text-gray-500 dark:text-gray-400 uppercase">
            <tr>
              <th className="p-3">Paciente</th>
              <th className="p-3">Médico</th>
              <th className="p-3">Data e Hora</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((app) => (
              <tr
                key={app.id}
                className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <td className="p-3 font-medium text-gray-900 dark:text-white">
                  {app.patient?.name || "N/A"}
                </td>
                <td className="p-3 text-gray-600 dark:text-gray-300">
                  {app.doctor?.name || "N/A"}
                </td>
                <td className="p-3 text-gray-600 dark:text-gray-300">
                  {new Date(app.date).toLocaleString("pt-BR")}
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      app.status === "completed"
                        ? "bg-green-200 text-green-800"
                        : app.status === "canceled"
                        ? "bg-red-200 text-red-800"
                        : "bg-yellow-200 text-yellow-800"
                    }`}
                  >
                    {app.status}
                  </span>
                </td>
                <td className="p-3 text-right">
                  {app.status === "scheduled" && (
                    <>
                      <button
                        onClick={() => handleStatusChange(app.id, "completed")}
                        className="text-green-500 hover:underline mr-4"
                      >
                        Concluir
                      </button>
                      <button
                        onClick={() => handleStatusChange(app.id, "canceled")}
                        className="text-red-500 hover:underline"
                      >
                        Cancelar
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Novo Agendamento"
      >
        <form onSubmit={handleCreateAppointment}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Paciente
              </label>
              <select
                value={newAppointment.patientId}
                onChange={(e) =>
                  setNewAppointment({
                    ...newAppointment,
                    patientId: e.target.value,
                  })
                }
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              >
                <option value="">Selecione um paciente</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Médico
              </label>
              <select
                value={newAppointment.doctorId}
                onChange={(e) =>
                  setNewAppointment({
                    ...newAppointment,
                    doctorId: e.target.value,
                  })
                }
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              >
                <option value="">Selecione um médico</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} - {d.speciality}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Data e Hora
              </label>
              <input
                type="datetime-local"
                value={newAppointment.date}
                onChange={(e) =>
                  setNewAppointment({
                    ...newAppointment,
                    date: e.target.value,
                  })
                }
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
          </div>
          <div className="flex justify-end mt-6 space-x-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Criar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AppointmentsPage;
