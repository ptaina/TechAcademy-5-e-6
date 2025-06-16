import UserModel from '../../src/models/UserModel';
import { cpf } from 'cpf-cnpj-validator';

export const createTestUser = async (password = 'DeanTeAmo23') => {
  try {
    
    const randomCpf = cpf.generate(); 
    const uniqueEmail = `user${Date.now()}@example.com`;

    
    const user = await UserModel.create({
      name: 'Jimmy Novak',
      email: uniqueEmail,
      password: password,
      cpf: randomCpf,
    });

    
    return { user, password };
  } catch (err) {
    console.error('Error creating test user:', err);
    throw err;
  }
};
