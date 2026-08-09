import { useEffect } from 'react';
import clsx from 'clsx';
import { Loader } from '../../components/ui/Loader/Loader';
import { fetchFinanceEntries, fetchSuppliers } from '../../redux/dashboard/dashboardSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import styles from './DashboardPage.module.css';

export function DashboardPage() {
  const dispatch = useAppDispatch();
  const { suppliers, financeEntries, status } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchSuppliers());
    dispatch(fetchFinanceEntries());
  }, [dispatch]);

  return (
    <div className={`container ${styles.page}`}>
      <h1>Store dashboard</h1>
      <p className={styles.subtitle}>Manage your suppliers and track income &amp; expenses.</p>

      {status === 'loading' ? (
        <Loader />
      ) : (
        <div className={styles.layout}>
          <section className={styles.card}>
            <h2>Suppliers</h2>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Address</th>
                    <th>Supplier</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {suppliers.map((supplier) => (
                    <tr key={supplier._id}>
                      <td>{supplier.name}</td>
                      <td>{supplier.address}</td>
                      <td>{supplier.brand}</td>
                      <td>{supplier.date}</td>
                      <td>{supplier.amount.toFixed(2)}</td>
                      <td>
                        <span
                          className={clsx(
                            styles.statusBadge,
                            supplier.status === 'Active' ? styles.statusActive : styles.statusInactive,
                          )}
                        >
                          {supplier.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className={styles.card}>
            <h2>Income &amp; expenses</h2>
            <ul className={styles.financeList}>
              {financeEntries.map((entry) => (
                <li key={entry._id} className={styles.financeRow}>
                  <span className={styles.financeName}>{entry.name}</span>
                  <span
                    className={clsx(
                      styles.financeAmount,
                      entry.type === 'Expense' ? styles.amountNegative : styles.amountPositive,
                    )}
                  >
                    {entry.amount > 0 ? '+' : ''}
                    {entry.amount.toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}
