import rawCustomers from '../data/customers.json';
import rawOrders from '../data/orders.json';

interface RawCustomer {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface RawOrder {
  name: string;
  address: string;
  products: string;
  order_date: string;
}

const SEEDED_CUSTOMER_PASSWORD = 'password123';

export function generateCustomers() {
  const seenEmails = new Set<string>();
  const customers = [];

  for (const entry of rawCustomers as RawCustomer[]) {
    const email = entry.email.toLowerCase();
    if (seenEmails.has(email)) continue;
    seenEmails.add(email);

    customers.push({
      name: entry.name,
      email,
      phone: entry.phone,
      address: entry.address,
      password: SEEDED_CUSTOMER_PASSWORD,
    });
  }

  return customers;
}

export function generateOrderSeeds() {
  return (rawOrders as RawOrder[]).map((entry) => ({
    shippingName: entry.name,
    shippingAddress: entry.address,
    itemCountHint: Math.max(1, Math.min(5, Number(entry.products) || 1)),
    date: new Date(entry.order_date),
  }));
}
