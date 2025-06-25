import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import Input from "../components/Input";
import { HeartPulse } from "lucide-react";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro.");
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <div className="flex items-center justify-center text-3xl font-bold text-gray-900 dark:text-white">
        <HeartPulse className="mr-3 h-8 w-8 text-blue-500" />
        <span>medconnect</span>
      </div>
      <h2 className="text-xl font-bold text-center text-gray-900 dark:text-white pt-4">
        Login
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Entrar
        </button>
      </form>
      <p className="text-sm text-center text-gray-600 dark:text-gray-400">
        Não tem uma conta?{" "}
        <Link
          to="/register"
          className="font-medium text-blue-600 hover:underline"
        >
          Registre-se
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
