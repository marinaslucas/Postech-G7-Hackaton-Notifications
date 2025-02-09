import { faker } from '@faker-js/faker';

type UserProps = {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
};
export function userDataBuilder(props: Partial<UserProps> = {}): UserProps {
  return {
    name: props.name ?? faker.person.fullName(),
    email: props.email ?? faker.internet.email(),
    password: props.password ?? faker.internet.password(),
    createdAt: props.createdAt ?? new Date(),
  };
}
