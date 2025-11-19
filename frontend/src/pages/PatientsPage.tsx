import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import type { Patient } from "../types";
import Modal from "../components/Modal";
import Input from "../components/Input";
import Notification from "../components/Notification";
import ConfirmModal from "../components/ConfirmModal";
import { useNotification } from "../hooks/useNotification";
import { PlusCircle, Edit, Trash2, ArrowLeft } from "lucide-react";

const PatientsPage: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    cpf: "",
    phone: "",
    address: "",
  });
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    id: number | null;
  }>({ isOpen: false, id: null });
  const navigate = useNavigate();
  const { notification, showSuccess, showError, hideNotification } =
    useNotification();

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await api.get("/patients");
      setPatients(response.data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Falha ao buscar pacientes."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleOpenModal = (patient: Patient | null = null) => {
    if (patient) {
      setEditingPatient(patient);
      setFormData({
        name: patient.name,
        cpf: patient.cpf,
        phone: patient.phone,
        address: patient.address,
      });
    } else {
      setEditingPatient(null);
      setFormData({ name: "", cpf: "", phone: "", address: "" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleDelete = (id: number) => {
    setConfirmModal({ isOpen: true, id });
  };

  const confirmDelete = async () => {
    if (!confirmModal.id) return;
    try {
      await api.delete(`/patients/${confirmModal.id}`);
      fetchPatients();
      showSuccess("Paciente removido com sucesso!");
    } catch (err) {
      showError(
        err instanceof Error ? err.message : "Falha ao remover paciente."
      );
    } finally {
      setConfirmModal({ isOpen: false, id: null });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPatient) {
        await api.put(`/patients/${editingPatient.id}`, formData);
        showSuccess("Paciente atualizado com sucesso!");
      } else {
        await api.post("/patients", formData);
        showSuccess("Paciente criado com sucesso!");
      }
      handleCloseModal();
      fetchPatients();
    } catch (err) {
      showError(
        err instanceof Error ? err.message : "Falha ao salvar paciente."
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
        message="Tem a certeza de que deseja remover este paciente?"
        onConfirm={confirmDelete}
        onCancel={() => setConfirmModal({ isOpen: false, id: null })}
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
          Gestão de Pacientes
        </h1>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700"
        >
          <PlusCircle size={20} className="mr-2" /> Novo Paciente
        </button>
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md overflow-x-auto">
        <table className="w-full text-left">
          <thead className="text-sm text-gray-500 dark:text-gray-400 uppercase">
            <tr>
              <th className="p-3">Nome</th>
              <th className="p-3">CPF</th>
              <th className="p-3">Telefone</th>
              <th className="p-3">Endereço</th>
              <th className="p-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr
                key={patient.id}
                className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <td className="p-3 font-medium text-gray-900 dark:text-white">
                  {patient.name}
                </td>
                <td className="p-3 text-gray-600 dark:text-gray-300">
                  {patient.cpf}
                </td>
                <td className="p-3 text-gray-600 dark:text-gray-300">
                  {patient.phone}
                </td>
                <td className="p-3 text-gray-600 dark:text-gray-300">
                  {patient.address}
                </td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => handleOpenModal(patient)}
                    className="text-blue-500 hover:underline mr-4 p-1"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(patient.id)}
                    className="text-red-500 hover:underline p-1"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingPatient ? "Editar Paciente" : "Novo Paciente"}
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Nome"
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
            <Input
              label="CPF"
              type="text"
              value={formData.cpf}
              onChange={(e) =>
                setFormData({ ...formData, cpf: e.target.value })
              }
              required
            />
            <Input
              label="Telefone"
              type="text"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              required
            />
            <Input
              label="Endereço"
              type="text"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              required
            />
          </div>
          <div className="flex justify-end mt-6 space-x-3">
            <button
              type="button"
              onClick={handleCloseModal}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Salvar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PatientsPage;
