import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;
  beforeEach(async () => {
    // create a fake copy of user service which authservice is going to use.
    const users: User[] = [];
    // new service
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;
        users.push(user);

        return Promise.resolve(user);
      },
    };
    // old fake service
    // fakeUsersService = {
    //   find: () => Promise.resolve([]),
    //   create: (email: string, password: string) =>
    //     Promise.resolve({ id: 1, email, password } as User),
    // };

    const module = await Test.createTestingModule({
      // In general provider array is listing of all classes that we might want to inject in DI Container, with the DI container creates instance for any classes then it finds
      // the other classes instance and creates dependency of it and register it in DI Container.
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        }, // this object denotes that when anyone ask for UserService then give them the value fakeUserService
      ],
    }).compile();

    service = module.get(AuthService); //this right here is going to cause DI Container to create a new instance of authentication service with all its different dependencies already intialized.
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('asdf@asdf.com', 'asdf');

    expect(user.password).not.toEqual('asdf');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if users signs up with email that is in use', async () => {
    // @old_flow
    // fakeUsersService.find = () =>
    //   Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);

    // try {
    //   await service.signup('asdf@asdf.com', 'asdf');
    // } catch (err) {
    //   done(); // using done because jest is not perfect in handling thrown error in async operations.. this will also throw error if done is called with in 5 sec
    // }

    // await expect(service.signup('a@asdf.com', 'asdf')).rejects.toThrowError(
    //   'email in use',
    // );

    // @new_flow
    await service.signup('asdf@asdf.com', 'myPassword');
    await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrowError(
      'email in use',
    );
  });

  it('throws if signin is called with an unused email', async () => {
    // try {
    //   await service.signin('assdff@gmail.com', 'sdfgh');
    // } catch (err) {
    //   done();
    // }
    await expect(
      service.signin('assdff@gmail.com', 'sdfgh'),
    ).rejects.toThrowError('user not found');
  });

  it('throws if an invalid password is provided', async () => {
    // fakeUsersService.find = () =>
    //   Promise.resolve([
    //     { email: 'asdf@asdf.com', password: 'lashdjfg' } as User,
    //   ]);
    // await expect(
    //   service.signin('anyMail@gmail.com', 'password'),
    // ).rejects.toThrowError('bad password');

    await service.signup('asdf@asdf.com', 'myPassword123');
    await expect(
      service.signin('asdf@asdf.com', 'password'),
    ).rejects.toThrowError('bad password');
  });

  it('returns a user if correct password is provided', async () => {
    // fakeUsersService.find = () =>
    //   Promise.resolve([
    //     {
    //       email: 'asdf@gmail.com',
    //       password:
    //         '6a63e9bee2cc060e.a8ed6eae603085d083563ef3a7016e5939f73c6210c41f76b198b81ef42157dd',
    //     } as User,
    //   ]);

    // const user = await service.signin('asdf@asdf.com', 'myPassword');
    // expect(user).toBeDefined();

    //Below is the way to get hashed password in console
    // const user = await service.signup('asdf@asdf.com', 'myPassword');
    // console.log(user)

    // new flow
    await service.signup('asdf@asdf.com', 'myPassword');
    const user = await service.signin('asdf@asdf.com', 'myPassword');
    expect(user).toBeDefined();
  });
});
