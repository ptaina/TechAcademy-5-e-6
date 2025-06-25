import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASSWORD!,
  {
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT!),
    dialect: "mysql",
    logging: process.env.NODE_ENV !== "production",
  }
);

if (process.env.NODE_ENV !== "test") {
  (async () => {
    try {
      console.log("Aguardando MySQL estar pronto...");
      await new Promise((resolve) => setTimeout(resolve, 10000));

      await sequelize.authenticate();
      console.log("Conexão com o banco de dados estabelecida com sucesso.");

      await sequelize.sync({ alter: true });
      console.log("Banco de dados sincronizado.");
    } catch (error) {
      console.error("Erro ao sincronizar o banco de dados:", error);
    }
  })();
}

export default sequelize;

/*import { Sequelize } from 'sequelize';


const dbName = process.env.NODE_ENV === 'test' 
  ? 'agendamento_medico_test' 
  : 'agendamento_medico';       

const sequelize = new Sequelize(dbName, 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: process.env.NODE_ENV !== 'test' 
});

export default sequelize;*/
