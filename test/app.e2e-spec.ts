import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { UserEntity } from '../src/modules/user/models/user.entity';
import { getConnectionToken, TypeOrmModule } from '@nestjs/typeorm';
import { TodoEntity } from '../src/modules/todo/models/todo.entity';
import { JwtAuthGuard } from '../src/modules/auth/guards/jwt-auth.guard';
import { UserModule } from '../src/modules/user/user.module';
import { TodoModule } from '../src/modules/todo/todo.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Connection, getConnection } from 'typeorm';
import { APP_GUARD } from '@nestjs/core';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let module: TestingModule;
  let connection: Connection;
  let isAuthEnabled: boolean = true;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          ignoreEnvFile: true,
        }),
        UserModule,
        TodoModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [UserEntity, TodoEntity],
          logging: false,
          dropSchema: true,
          synchronize: true,
        }),
      ],
      providers: [
        {
          provide: APP_GUARD,
          useClass: JwtAuthGuard,
        }
      ]
    })
    // .overrideGuard(JwtAuthGuard)
    // .useValue({
    //   canActivate: () => {
    //     return true
    //   },
    // })
    .overrideProvider(ConfigService)
    .useValue({
      get: jest.fn((name) => {
        switch(name){
          case 'jwtSecret':
            return 'test';
            case 'jwtSecretExpires':
              return 120000;
          case 'jwtRefreshSecret':
            return 'test';
          case 'jwtRefreshSecretExpires':
            return 300000;
          case 'isAuthEnabled':
            return isAuthEnabled;
        }
      }),
    })
    .compile();

    app = module.createNestApplication();
    connection = module.get(getConnectionToken());
    await app.init();
  });

  const user: Partial<UserEntity> = {
    email: 'test2e2@gmail.com',
    firstname: 'test',
    lastname: 'e2e',
    password: '1234',
  }

  let access_token: string = null;

  describe('Create new user & login', () => {
    it('Register: /user/register (POST)', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/user/register')
        .send(user)
        .expect(201);
    });
    it('Checking user in database', async () => {
      const users: any[] = await connection.query("SELECT * FROM `user_entity`");
      expect(users.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Checking user login', () => {
    it('Login: /user/login (POST)', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/user/login')
        .send(user)
        .expect(201);
      expect(body).toHaveProperty('status', true);
      expect(body.data.access_token).toBeDefined();
      expect(body.data.refresh_token).toBeDefined();

      access_token = body.data.access_token;
    });
  });

  let todo: Partial<TodoEntity> = null;

  todo = {
    content: 'test',
    scheduled: Date.now() + 3600,
  }

  describe('Checking creation TODO', () => {
    it('Create TODO: /todo/create (POST)', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/todo/create')
        .set('Authorization', `Bearer ${access_token}`)
        .send(todo)
        .expect(201);
      
      expect(body).toHaveProperty('status', true);
      expect(body.data).toBeDefined();
      expect(body.data.scheduled).toEqual(todo.scheduled);

      todo = body.data;
    });

    it('Get TODOS: /todo (GET)', async () => {
      const { body } = await request(app.getHttpServer())
      .get('/todo')
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200);
    
      expect(body).toHaveProperty('status', true);
      expect(body.data).toBeDefined();
      expect(body.data.length).toBeGreaterThanOrEqual(1);
    })
  });

  describe('Checking mark TODO', () => {
    it('Mark completed true: /todo/:todoId/completed (PUT)', async () => {
      const { body } = await request(app.getHttpServer())
        .put(`/todo/${todo.id}/completed?state=true`)
        .set('Authorization', `Bearer ${access_token}`)
        .expect(200);
      
      expect(body).toHaveProperty('status', true);
    });

    it('Mark completed false: /todo/:todoId/completed (PUT)', async () => {
      const { body } = await request(app.getHttpServer())
        .put(`/todo/${todo.id}/completed?state=false`)
        .set('Authorization', `Bearer ${access_token}`)
        .expect(200);
      
      expect(body).toHaveProperty('status', true);
    });
  });
  
  afterAll(async () => {
    await connection.close();
    await app.close();
  });
});
