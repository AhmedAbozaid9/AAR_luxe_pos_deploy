import { create } from "zustand";
import type { Car, Customer } from "../api/getCustomers";

interface CustomerStore {
  selectedCustomer: Customer | null;
  selectedCar: Car | null;
  setSelectedCustomer: (customer: Customer | null) => void;
  setSelectedCar: (car: Car | null) => void;
  clearSelection: () => void;
}

export const useCustomerStore = create<CustomerStore>((set) => ({
  selectedCustomer: null,
  selectedCar: null,
  setSelectedCustomer: (customer) =>
    set({ selectedCustomer: customer, selectedCar: null }),
  setSelectedCar: (car) => set({ selectedCar: car }),
  clearSelection: () => set({ selectedCustomer: null, selectedCar: null }),
}));
