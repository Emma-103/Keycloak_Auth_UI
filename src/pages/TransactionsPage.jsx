import React from "react";
import { useEffect, useState } from "react";
import { getTransactions } from "../services/apiClient";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getTransactions()
      .then(setTransactions)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <p>Loading transactions...</p>;

  return (
    <div>
      <h2>Transactions Listing</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((txn) => (
            <tr key={txn.id}>
              <td>{txn.id}</td>
              <td>{txn.customer}</td>
              <td>
                {txn.amount} {txn.currency}
              </td>
              <td>{txn.status}</td>
              <td>{new Date(txn.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
