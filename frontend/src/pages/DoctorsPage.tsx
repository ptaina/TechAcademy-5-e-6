import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import type { Doctor } from "../types";
import Modal from "../components/Modal";
import Input from "../components/Input";
import { PlusCircle, Edit, Trash2, ArrowLeft } from "lucide-react";

const DoctorsPage: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    speciality: "",
    crm: "",
  });
  const navigate = useNavigate();

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await api.get("/doctors");
      setDoctors(response.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao buscar médicos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleOpenModal = (doctor: Doctor | null = null) => {
    if (doctor) {
      setEditingDoctor(doctor);
      setFormData({
        name: doctor.name,
        speciality: doctor.speciality,
        crm: doctor.crm,
      });
    } else {
      setEditingDoctor(null);
      setFormData({ name: "", speciality: "", crm: "" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleDelete = async (id: number) => {
    if (window.confirm("Tem a certeza de que deseja remover este médico?")) {
      try {
        await api.delete(`/doctors/${id}`);
        fetchDoctors();
      } catch (err) {
        alert(err instanceof Error ? err.message : "Falha ao remover médico.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingDoctor) {
        await api.put(`/doctors/${editingDoctor.id}`, formData);
      } else {
        await api.post("/doctors", formData);
      }
      handleCloseModal();
      fetchDoctors();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Falha ao salvar médico.");
    }
  };

  if (loading) return <div>A carregar...</div>;
  if (error) return <div className="text-red-500">Erro: {error}</div>;

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:underline mb-6"
      >
        <ArrowLeft size={16} className="mr-1" />
        Voltar
      </button>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Gestão de Médicos
        </h1>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700"
        >
          <PlusCircle size={20} className="mr-2" /> Novo Médico
        </button>
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md overflow-x-auto">
        <table className="w-full text-left">
          <thead className="text-sm text-gray-500 dark:text-gray-400 uppercase">
            <tr>
              <th className="p-3">Nome</th>
              <th className="p-3">Especialidade</th>
              <th className="p-3">CRM</th>
              <th className="p-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor) => (
              <tr
                key={doctor.id}
                className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <td className="p-3 font-medium text-gray-900 dark:text-white">
                  {doctor.name}
                </td>
                <td className="p-3 text-gray-600 dark:text-gray-300">
                  {doctor.speciality}
                </td>
                <td className="p-3 text-gray-600 dark:text-gray-300">
                  {doctor.crm}
                </td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => handleOpenModal(doctor)}
                    className="text-blue-500 hover:underline mr-4 p-1"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(doctor.id)}
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
        title={editingDoctor ? "Editar Médico" : "Novo Médico"}
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
              label="Especialidade"
              type="text"
              value={formData.speciality}
              onChange={(e) =>
                setFormData({ ...formData, speciality: e.target.value })
              }
              required
            />
            <Input
              label="CRM"
              type="text"
              value={formData.crm}
              onChange={(e) =>
                setFormData({ ...formData, crm: e.target.value })
              }
              placeholder="123456-SP"
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

export default DoctorsPage;
