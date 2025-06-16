import request from 'supertest';
import app from '../src/index';
import sequelize from '../src/config/database';
import { createTestUser } from './helpers/createTestUser';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';
import UserModel from '../src/models/UserModel';
import { associateModels } from '../src/models/associateModels'; 

beforeAll(async () => {
    associateModels(); 
    await sequelize.sync({ force: true });
});

afterAll(async () => {
    await sequelize.close();
});

describe('User API - Create User', () => {
    it('should create a user successfully', async () => {
        const fakeCpf = cpfValidator.generate();
        const uniqueEmail = `dean${Date.now()}@gmail.com`;

        const response = await request(app)
            .post('/users')
            .send({
                name: 'Dean Winchester',
                email: uniqueEmail,
                cpf: fakeCpf,
                password: 'minhaCaranga67'
            });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('User created successfully');
        expect(response.body.user.name).toBe('Dean Winchester');
        expect(response.body.user.password).toBeUndefined();
    });

    it('should return 400 if CPF is invalid', async () => {
        const response = await request(app)
            .post('/users')
            .send({
                name: 'Dean Winchester',
                email: 'winchester@gmail.com',
                cpf: '123',
                password: 'minhaCaranga67'
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Invalid CPF format');
    });
});

describe('User API - Update User', () => {
    let token: string;
    let userId: number;

    beforeEach(async () => {
        await sequelize.sync({ force: true });
        const { user: testUser, password } = await createTestUser();
        
        const loginResponse = await request(app)
            .post('/login')
            .send({
                email: testUser.email,
                password: password,
            });
        
        token = loginResponse.body.token;
        userId = loginResponse.body.user.id;
    });

    it('should update user successfully', async () => {
        const response = await request(app)
            .put(`/users/${userId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Castiel Novak',
                password: 'newValidPassword1'
            });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('User updated successfully');
        expect(response.body.user.name).toBe('Castiel Novak');
    });

    
    it('should return 400 and NOT allow email update', async () => {
        const response = await request(app)
            .put(`/users/${userId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                email: 'newemail@gmail.com'
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Email cannot be changed');
    });

    it('should return 403 when trying to update another user', async () => {
        const anotherUser = await UserModel.create({
            name: "Other User",
            email: "other@user.com",
            cpf: cpfValidator.generate(),
            password: "aPassword123"
        });

        const response = await request(app)
          .put(`/users/${anotherUser.id}`)
          .set('Authorization', `Bearer ${token}`)
          .send({ name: 'Hacked' });
    
        expect(response.status).toBe(403);
        expect(response.body.error).toBe('You can only update your own profile');
      });
});
