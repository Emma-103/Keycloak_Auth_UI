import React from "react";
import { useEffect, useState } from "react";
import { getCustomers } from "../services/apiClient";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCustomers()
      .then(setCustomers)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <p>Loading customers...</p>;

  return (
    <div>
      <h2>Customer Listing</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Tier</th>
            <th>Country</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.id}</td>
              <td>{customer.name}</td>
              <td>{customer.tier}</td>
              <td>{customer.country}</td>
              <td>{customer.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
