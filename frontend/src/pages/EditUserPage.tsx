import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { AuthContext } from "../contexts/AuthContext";
import api from "../services/api";

const EditUserPage: React.FC = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password && password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    if (password) {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
      if (!passwordRegex.test(password)) {
        setError(
          "A senha deve ter no mínimo 8 caracteres, uma letra maiúscula, uma minúscula e um número."
        );
        return;
      }
    }

    const updates: { name?: string; password?: string } = {};
    if (name && name !== user?.name) {
      updates.name = name;
    }
    if (password) {
      updates.password = password;
    }

    if (Object.keys(updates).length === 0) {
      setError("Nenhuma alteração foi feita.");
      return;
    }

    if (!user) {
      setError("Utilizador não encontrado. Por favor, faça login novamente.");
      return;
    }

    try {
      await api.put(`/users/${user.id}`, updates);
      setSuccess("Perfil atualizado com sucesso!");

      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Ocorreu um erro inesperado ao atualizar o perfil.");
      }
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
        Editar Perfil
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            Email
          </label>
          <input
            type="email"
            value={user?.email || ""}
            disabled
            className="bg-gray-200 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 cursor-not-allowed"
          />
        </div>

        <Input
          label="Nome Completo"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          label="Nova Senha (deixe em branco para não alterar)"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          label="Confirmar Nova Senha"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {success && (
          <p className="text-green-500 text-sm text-center">{success}</p>
        )}

        <div className="flex space-x-4 mt-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full px-4 py-2 text-gray-800 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
          >
            Voltar
          </button>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUserPage;
