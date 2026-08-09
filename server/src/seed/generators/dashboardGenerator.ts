import rawSuppliers from '../data/suppliers.json';
import rawFinanceEntries from '../data/financeEntries.json';

interface RawSupplier {
  name: string;
  address: string;
  suppliers: string;
  date: string;
  amount: string;
  status: 'Active' | 'Deactive';
}

interface RawFinanceEntry {
  name: string;
  amount: string;
  type: 'Income' | 'Expense' | 'Error';
}

function parseAmount(value: string): number {
  const numeric = value.replace(/[^0-9.-]/g, '');
  return Number(numeric);
}

export function generateSuppliers() {
  return (rawSuppliers as RawSupplier[]).map((entry) => ({
    name: entry.name,
    address: entry.address,
    brand: entry.suppliers,
    date: entry.date,
    amount: parseAmount(entry.amount),
    status: entry.status,
  }));
}

export function generateFinanceEntries() {
  return (rawFinanceEntries as RawFinanceEntry[]).map((entry) => ({
    name: entry.name,
    amount: parseAmount(entry.amount),
    type: entry.type,
  }));
}
