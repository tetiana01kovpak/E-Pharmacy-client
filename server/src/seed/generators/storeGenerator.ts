import { faker } from '@faker-js/faker';

export function generateStore() {
  return {
    name: faker.company.name(),
    address: `${faker.location.streetAddress()}, ${faker.location.city()}`,
    phone: faker.phone.number({ style: 'international' }),
    isOpen: faker.datatype.boolean({ probability: 0.65 }),
    rating: Number(faker.number.float({ min: 1, max: 5, fractionDigits: 1 })),
  };
}
