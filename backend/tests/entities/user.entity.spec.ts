import { UserEntity } from "src/modules/users/domain/entities/user.entity";

describe('UserEntity', () => {
  it('should be defined', () => {
    expect(UserEntity).toBeDefined();
  });

  it('should create a user', () => {
    const user = UserEntity.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      passwordHash: 'password',
      role: 'user',
      status: 'active',
    });
    expect(user).toBeDefined();
    expect(user.getId()).toBeDefined();
    expect(user.getName()).toBe('John Doe');
    expect(user.getEmail()).toBe('john.doe@example.com');
    expect(user.getPassword()).toBe('password');
  });

  it('should validate a user', () => {
    const user = UserEntity.create({
      name: '',
      email: 'john.doe@example.com',
      passwordHash: 'password',
      role: 'user',
      status: 'active',
    });
    expect(() => user.validate()).toThrow(new Error('Name is required'));
  });
});