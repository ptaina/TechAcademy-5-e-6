import express from "express";
import cors from "cors";
import sequelize from "./config/database";
import userRoutes from "./routes/userRoutes";
import loginRoutes from "./routes/loginRoutes";
import patientRoutes from "./routes/patientRoutes";
import doctorRoutes from "./routes/doctorRoutes";
import appointmentRoutes from "./routes/appointmentRoutes";
import { associateModels } from "./models/associateModels";

const app = express();
const port = 3001;

app.use(express.json());

if (process.env.NODE_ENV !== "test") {
  app.use(cors());
}

app.get("/", (req, res) => {
  res.send("Hello World! :)");
});

app.use(userRoutes);
app.use(loginRoutes);
app.use(patientRoutes);
app.use(doctorRoutes);
app.use(appointmentRoutes);

const syncDatabase = async () => {
  try {
    if (process.env.NODE_ENV !== "test") {
      associateModels();
      await sequelize.sync({ alter: true });
    }
  } catch (error) {
    console.error("Erro ao sincronizar database:", error);
  }
};

if (process.env.NODE_ENV !== "test") {
  app.listen(port, async () => {
    await syncDatabase();
    console.log(`Servidor rodando na porta ${port}`);
  });
}

export default app;
