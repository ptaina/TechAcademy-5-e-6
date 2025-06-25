export function generateRandomString(stringLength: number): string {
  const characters = "abcdefghijklmnopqrstuvwxyz";
  let result = "";
  for (let i = 0; i < stringLength; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export function generateValidCPF(): string {
  const digits = Array.from({ length: 9 }, () =>
    Math.floor(Math.random() * 10)
  );

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += digits[i] * (10 - i);
  }
  let remainder = sum % 11;
  const firstDigit = remainder < 2 ? 0 : 11 - remainder;
  digits.push(firstDigit);

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += digits[i] * (11 - i);
  }
  remainder = sum % 11;
  const secondDigit = remainder < 2 ? 0 : 11 - remainder;
  digits.push(secondDigit);

  return digits.join("");
}

export function generateUniqueUserData() {
  const randomSuffix = generateRandomString(5);
  return {
    name: `Usuário Teste ${randomSuffix}`,
    email: `teste${randomSuffix}@email.com`,
    cpf: generateValidCPF(),
    password: "SenhaValida123",
    confirmPassword: "SenhaValida123",
  };
}

export function generateRandomNumber(length: number): string {
  return Math.random()
    .toString()
    .substring(2, 2 + length);
}
