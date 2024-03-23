export type Character = {
  name: string;
  house: "Atreides" | "Harkonnen" | "Corrino";
};

// TYPESCRIPT TASKS HERE

// Task 1
type Addresses = Record<string, string | { address: keyof Addresses }>;
