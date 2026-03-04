export const mockTransactions = [
  { id: "TXN-90320", customer: "Acme Ltd", amount: 4200.5, currency: "USD", status: "Completed", timestamp: "2026-02-24T09:14:00Z" },
  { id: "TXN-90321", customer: "Neo Retail", amount: 255.0, currency: "USD", status: "Pending", timestamp: "2026-02-24T10:28:00Z" },
  { id: "TXN-90322", customer: "Bright Corp", amount: 15320.99, currency: "USD", status: "Completed", timestamp: "2026-02-24T11:05:00Z" },
  { id: "TXN-90323", customer: "Willow Stores", amount: 89.49, currency: "USD", status: "Failed", timestamp: "2026-02-24T11:30:00Z" }
];

export const mockCustomers = [
  { id: "CUS-1001", name: "Acme Ltd", tier: "Gold", country: "Kenya", email: "ops@acme.example" },
  { id: "CUS-1002", name: "Neo Retail", tier: "Silver", country: "Uganda", email: "finance@neo.example" },
  { id: "CUS-1003", name: "Bright Corp", tier: "Platinum", country: "Tanzania", email: "admin@bright.example" },
  { id: "CUS-1004", name: "Willow Stores", tier: "Bronze", country: "Rwanda", email: "support@willow.example" }
];

export const mockUsers = [
  { id: "USR-01", name: "Amina Otieno", email: "amina@portal.example", role: "Admin", status: "Active" },
  { id: "USR-02", name: "Mark Njoroge", email: "mark@portal.example", role: "Auditor", status: "Active" },
  { id: "USR-03", name: "Jane Mwangi", email: "jane@portal.example", role: "Support", status: "Suspended" }
];
