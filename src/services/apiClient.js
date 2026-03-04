import { mockCustomers, mockTransactions, mockUsers } from "../data/mockData";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://localhost:7296/api";

async function authorizedFetch(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  if (!response.ok) {
    throw new Error(`API request failed (${response.status})`);
  }

  return response.json();
}

export async function getTransactions() {
  try {
    return await authorizedFetch("/transactions");
  } catch {
    return mockTransactions;
  }
}

export async function getCustomers() {
  try {
    return await authorizedFetch("/customers");
  } catch {
    return mockCustomers;
  }
}

export async function getUsers() {
  try {
    return await authorizedFetch("/users");
  } catch {
    return mockUsers;
  }
}
