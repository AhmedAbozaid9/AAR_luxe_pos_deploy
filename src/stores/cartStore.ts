import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string; // Unique identifier for the cart item
  purchasable_id: number;
  purchasable_type: "service" | "package" | "product";
  quantity: number;
  option_ids?: number[] | null;
  name: string;
  price: number;
  image?: string;
  options?: Array<{
    id: number;
    name: string;
    price: number;
  }>;
}

export interface CartRequest {
  car_id: number;
  user_id: number;
  purchasables: Array<{
    purchasable_id: number;
    purchasable_type: "service" | "package" | "product";
    quantity: number;
    option_ids?: number[] | null;
  }>;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;

  // Actions
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;

  // Getters
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getCartRequest: (carId: number, userId: number) => CartRequest;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [] as CartItem[],
      isOpen: false,

      addItem: (item: Omit<CartItem, "id">) => {
        const items = get().items;
        const existingItemIndex = items.findIndex(
          (existingItem) =>
            existingItem.purchasable_id === item.purchasable_id &&
            existingItem.purchasable_type === item.purchasable_type &&
            JSON.stringify(existingItem.option_ids) ===
              JSON.stringify(item.option_ids)
        );

        if (existingItemIndex !== -1) {
          // Update quantity if item already exists
          const updatedItems = [...items];
          updatedItems[existingItemIndex].quantity += item.quantity;
          set({ items: updatedItems });
        } else {
          // Add new item with unique ID
          const newItem: CartItem = {
            ...item,
            id: `${item.purchasable_type}-${
              item.purchasable_id
            }-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
          };
          set({ items: [...items, newItem] });
        }
      },

      removeItem: (itemId: string) => {
        set({ items: get().items.filter((item) => item.id !== itemId) });
      },

      updateQuantity: (itemId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }

        const updatedItems = get().items.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        );
        set({ items: updatedItems });
      },

      clearCart: () => {
        set({ items: [] });
      },

      toggleCart: () => {
        set({ isOpen: !get().isOpen });
      },

      openCart: () => {
        set({ isOpen: true });
      },

      closeCart: () => {
        set({ isOpen: false });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const itemPrice =
            item.price +
            (item.options?.reduce((sum, option) => sum + option.price, 0) ?? 0);
          return total + itemPrice * item.quantity;
        }, 0);
      },

      getCartRequest: (carId: number, userId: number) => {
        const items = get().items;
        return {
          car_id: carId,
          user_id: userId,
          purchasables: items.map((item) => ({
            purchasable_id: item.purchasable_id,
            purchasable_type: item.purchasable_type,
            quantity: item.quantity,
            option_ids: item.option_ids,
          })),
        };
      },
    }),
    {
      name: "cart-storage",
    }
  )
);
