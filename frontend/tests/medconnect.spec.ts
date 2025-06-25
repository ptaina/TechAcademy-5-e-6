import { test, expect } from "@playwright/test";
import {
  generateRandomString,
  generateRandomNumber,
  generateUniqueUserData,
  generateValidCPF,
} from "./helpers/test-helpers";

test.describe("Testes E2E - MedConnect", () => {
  const getFieldByLabelText = (page, text: string) => {
    return page.getByText(text, { exact: true }).locator("..").locator("input");
  };

  test.describe("Autenticação e Registro", () => {
    test("deve registrar um novo usuário com sucesso", async ({ page }) => {
      await page.goto("/register");
      await expect(
        page.getByRole("heading", { name: "Criar Conta" })
      ).toBeVisible();

      const userData = generateUniqueUserData();

      await getFieldByLabelText(page, "Nome Completo").fill(userData.name);
      await getFieldByLabelText(page, "Email").fill(userData.email);
      await getFieldByLabelText(page, "CPF").fill(userData.cpf);
      await getFieldByLabelText(page, "Senha").fill(userData.password);
      await getFieldByLabelText(page, "Confirmar Senha").fill(
        userData.confirmPassword
      );

      await page.getByRole("button", { name: "Registrar" }).click();
      await expect(
        page.getByText("Registo realizado com sucesso!")
      ).toBeVisible();
    });

    test("deve mostrar erro se as senhas no registro não coincidirem", async ({
      page,
    }) => {
      await page.goto("/register");
      await expect(
        page.getByRole("heading", { name: "Criar Conta" })
      ).toBeVisible();

      const userData = generateUniqueUserData();
      await getFieldByLabelText(page, "Nome Completo").fill(userData.name);
      await getFieldByLabelText(page, "Email").fill(userData.email);
      await getFieldByLabelText(page, "CPF").fill(userData.cpf);
      await getFieldByLabelText(page, "Senha").fill(userData.password);
      await getFieldByLabelText(page, "Confirmar Senha").fill(
        "senha-totalmente-diferente"
      );

      await page.getByRole("button", { name: "Registrar" }).click();

      await expect(page.getByText("As senhas não coincidem.")).toBeVisible();
    });

    test("deve fazer login com sucesso", async ({ page }) => {
      await page.goto("/login");
      await expect(page.getByRole("button", { name: "Entrar" })).toBeVisible();

      await getFieldByLabelText(page, "Email").fill("elissonmatos@gmail.com");
      await getFieldByLabelText(page, "Senha").fill("tainaElisson15");
      await page.getByRole("button", { name: "Entrar" }).click();

      await expect(page).toHaveURL("/");

      const heading = page.locator("h1");
      await expect(heading).toContainText("Olá, Elisson Matos");
    });

    test("deve mostrar erro com credenciais de login inválidas", async ({
      page,
    }) => {
      await page.goto("/login");
      await expect(page.getByRole("button", { name: "Entrar" })).toBeVisible();

      await getFieldByLabelText(page, "Email").fill("elissonmatos@gmail.com");
      await getFieldByLabelText(page, "Senha").fill("senhaerrada");
      await page.getByRole("button", { name: "Entrar" }).click();

      await expect(
        page.getByText("Email or password are invalid")
      ).toBeVisible();
    });
  });

  test.describe("CRUD de Médicos", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/login");
      await expect(page.getByRole("button", { name: "Entrar" })).toBeVisible();

      await getFieldByLabelText(page, "Email").fill("elissonmatos@gmail.com");
      await getFieldByLabelText(page, "Senha").fill("tainaElisson15");
      await page.getByRole("button", { name: "Entrar" }).click();
      await expect(page).toHaveURL("/");
      await page.goto("/doctors");
    });

    test("fluxo completo: deve criar, ler, editar e excluir um médico", async ({
      page,
    }) => {
      const doctorName = `Dr. Teste ${generateRandomString(5)}`;
      const crm = `${generateRandomNumber(6)}-RS`;

      await page.getByRole("button", { name: "Novo Médico" }).click();
      await getFieldByLabelText(page, "Nome").fill(doctorName);
      await getFieldByLabelText(page, "Especialidade").fill("Ortopedia");
      await getFieldByLabelText(page, "CRM").fill(crm);
      await page.getByRole("button", { name: "Salvar" }).click();
      await expect(page.getByRole("cell", { name: doctorName })).toBeVisible();

      const row = page.locator("tr").filter({ hasText: doctorName });
      await row.getByRole("button").first().click();
      await getFieldByLabelText(page, "Especialidade").fill("Fisioterapia");
      await page.getByRole("button", { name: "Salvar" }).click();
      await expect(
        page.getByRole("cell", { name: "Fisioterapia" })
      ).toBeVisible();

      page.on("dialog", (dialog) => dialog.accept());
      await row.getByRole("button").last().click();
      await expect(
        page.getByRole("cell", { name: doctorName })
      ).not.toBeVisible();
    });

    test("caso de falha: não deve criar médico com CRM inválido", async ({
      page,
    }) => {
      let dialogMessage = "";
      page.on("dialog", async (dialog) => {
        dialogMessage = dialog.message();
        await dialog.dismiss();
      });

      await page.getByRole("button", { name: "Novo Médico" }).click();
      await getFieldByLabelText(page, "Nome").fill("Dr. Erro");
      await getFieldByLabelText(page, "Especialidade").fill("Clínica Geral");
      await getFieldByLabelText(page, "CRM").fill("CRM-ERRADO");
      await page.getByRole("button", { name: "Salvar" }).click();

      await page.waitForEvent("dialog");
      expect(dialogMessage).toContain("CRM must be in the format");
    });
  });

  test.describe("CRUD de Pacientes", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/login");
      await expect(page.getByRole("button", { name: "Entrar" })).toBeVisible();

      await getFieldByLabelText(page, "Email").fill("elissonmatos@gmail.com");
      await getFieldByLabelText(page, "Senha").fill("tainaElisson15");
      await page.getByRole("button", { name: "Entrar" }).click();
      await expect(page).toHaveURL("/");
      await page.goto("/patients");
    });

    test("fluxo completo: deve criar, ler, editar e excluir um paciente", async ({
      page,
    }) => {
      const patientName = `Paciente ${generateRandomString(5)}`;
      const cpf = generateValidCPF();

      await page.getByRole("button", { name: "Novo Paciente" }).click();
      await getFieldByLabelText(page, "Nome").fill(patientName);
      await getFieldByLabelText(page, "CPF").fill(cpf);
      await getFieldByLabelText(page, "Telefone").fill("51999998888");
      await getFieldByLabelText(page, "Endereço").fill("Av. dos Testes, 789");
      await page.getByRole("button", { name: "Salvar" }).click();
      await expect(page.getByRole("cell", { name: patientName })).toBeVisible();

      const row = page.locator("tr").filter({ hasText: patientName });
      await row.getByRole("button").first().click();
      await getFieldByLabelText(page, "Telefone").fill("51777776666");
      await page.getByRole("button", { name: "Salvar" }).click();
      await expect(
        page.getByRole("cell", { name: "51777776666" })
      ).toBeVisible();

      page.on("dialog", (dialog) => dialog.accept());
      await row.getByRole("button").last().click();
      await expect(
        page.getByRole("cell", { name: patientName })
      ).not.toBeVisible();
    });

    test("caso de falha: não deve criar paciente com CPF já existente", async ({
      page,
    }) => {
      const existingCPF = generateValidCPF();
      const patientName = `Paciente Original ${generateRandomString(3)}`;
      await page.getByRole("button", { name: "Novo Paciente" }).click();
      await getFieldByLabelText(page, "Nome").fill(patientName);
      await getFieldByLabelText(page, "CPF").fill(existingCPF);
      await getFieldByLabelText(page, "Telefone").fill("11111111111");
      await getFieldByLabelText(page, "Endereço").fill("Rua Original");
      await page.getByRole("button", { name: "Salvar" }).click();
      await expect(page.getByRole("cell", { name: patientName })).toBeVisible();

      let dialogMessage = "";
      page.on("dialog", async (dialog) => {
        dialogMessage = dialog.message();
        await dialog.dismiss();
      });

      await page.getByRole("button", { name: "Novo Paciente" }).click();
      await getFieldByLabelText(page, "Nome").fill("Paciente Duplicado");
      await getFieldByLabelText(page, "CPF").fill(existingCPF);
      await getFieldByLabelText(page, "Telefone").fill("22222222222");
      await getFieldByLabelText(page, "Endereço").fill("Rua da Duplicata");
      await page.getByRole("button", { name: "Salvar" }).click();

      await page.waitForEvent("dialog");
      expect(dialogMessage).toContain("CPF already registered");
    });
  });
});
