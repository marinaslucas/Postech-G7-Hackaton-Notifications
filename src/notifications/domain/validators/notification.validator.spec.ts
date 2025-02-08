// import { userDataBuilder } from '../testing/helpers/user-data-builder';
// import { UserValidatorFactory } from './user.validator';

// let userValidator = UserValidatorFactory.create();
// let user = userDataBuilder();

// describe('UserValidator', () => {
//   beforeEach(() => {
//     userValidator = UserValidatorFactory.create();
//     user = userDataBuilder();
//   });

//   it('should return true if data is valid', () => {
//     const sut = userValidator.validate(user);
//     expect(sut).toBeTruthy();
//   });

//   describe('name validation', () => {
//     it('should return false if name is empty', () => {
//       const sut = userValidator.validate({ ...user, name: '' });
//       expect(sut).toBeFalsy();
//       expect(userValidator.errors).toEqual({
//         name: [
//           'name should not be empty',
//           'name must be longer than or equal to 1 characters',
//         ],
//       });
//     });
//     it('should return false if name isnt string', () => {
//       const sut = userValidator.validate({ ...user, name: 1 } as any);
//       expect(sut).toBeFalsy();
//       expect(userValidator.errors).toEqual({
//         name: [
//           'name must be a string',
//           'name must be shorter than or equal to 255 characters',
//           'name must be longer than or equal to 1 characters',
//         ],
//       });
//     });
//     it('should return false if name is longer than 255', () => {
//       const sut = userValidator.validate({ ...user, name: 'a'.repeat(256) });
//       expect(sut).toBeFalsy();
//       expect(userValidator.errors).toEqual({
//         name: ['name must be shorter than or equal to 255 characters'],
//       });
//     });
//   });

//   describe('email validation', () => {
//     it('should return false if email is empty', () => {
//       const sut = userValidator.validate({ ...user, email: '' });
//       expect(sut).toBeFalsy();
//       expect(userValidator.errors).toEqual({
//         email: ['email should not be empty', 'email must be an email'],
//       });
//     });
//     it('should return false if email is not an email', () => {
//       const sut = userValidator.validate({ ...user, email: 'invalidEmail' });
//       expect(sut).toBeFalsy();
//       expect(userValidator.errors).toEqual({
//         email: ['email must be an email'],
//       });
//     });
//     it('should return false if email is longer than 255', () => {
//       const sut = userValidator.validate({
//         ...user,
//         email: 'a'.repeat(256) + '@gmail.com',
//       });
//       expect(sut).toBeFalsy();
//       expect(userValidator.errors).toEqual({
//         email: [
//           'email must be shorter than or equal to 255 characters',
//           'email must be an email',
//         ],
//       });
//     });
//   });

//   describe('password validation', () => {
//     it('should return false if password is empty', () => {
//       const sut = userValidator.validate({ ...user, password: '' });
//       expect(sut).toBeFalsy();
//       expect(userValidator.errors).toEqual({
//         password: [
//           'password should not be empty',
//           'password must be longer than or equal to 8 characters',
//         ],
//       });
//     });
//     it('should return false if password is longer than 255', () => {
//       const sut = userValidator.validate({
//         ...user,
//         password: 'a'.repeat(256),
//       });
//       expect(sut).toBeFalsy();
//       expect(userValidator.errors).toEqual({
//         password: ['password must be shorter than or equal to 255 characters'],
//       });
//     });
//   });

//   describe('createdAt validation', () => {
//     it('should return false if createdAt is not a Date', () => {
//       const sut = userValidator.validate({
//         ...user,
//         createdAt: 'invalidDate',
//       } as any);
//       expect(sut).toBeFalsy();
//       expect(userValidator.errors).toEqual({
//         createdAt: ['createdAt must be a Date instance'],
//       });
//     });
//   });
// });
