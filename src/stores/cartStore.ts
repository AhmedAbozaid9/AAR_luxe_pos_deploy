import { create } from "zustand";
import { submitCartForPricing, type CartItemRequest } from "../api/cart";

export interface CartItem {
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
  // Server response data (updated after API call)
  id?: string;
  discounted_price?: number;
  discount_percentage?: number;
  total_price?: number;
}

interface CartStore {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  discountAmount: number;
  totalPrice: number;
  isLoading: boolean;
  error: string | null;

  // Extended cart information from API
  shippingPrice: number;
  servicePrice: number;
  servicePercentage: number;
  minOrderPercentage: number;
  isValidCoupon: {
    value: boolean;
    reasons: string;
  };
  cartCount: number;
  minPaymentPrice: number;

  // Local cart actions
  addItem: (
    item: Omit<
      CartItem,
      "id" | "discounted_price" | "discount_percentage" | "total_price"
    >
  ) => void;
  removeItem: (
    purchasableId: number,
    purchasableType: string,
    optionIds?: number[] | null
  ) => void;
  updateQuantity: (
    purchasableId: number,
    purchasableType: string,
    optionIds: number[] | null | undefined,
    quantity: number
  ) => void;
  clearCart: () => void;

  // Server sync actions
  syncWithServer: (carId: number, userId: number) => Promise<void>;

  // State management
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useCartStore = create<CartStore>()((set, get) => ({
  items: [],
  totalItems: 0,
  subtotal: 0,
  discountAmount: 0,
  totalPrice: 0,
  isLoading: false,
  error: null,

  // Extended cart information
  shippingPrice: 0,
  servicePrice: 0,
  servicePercentage: 0,
  minOrderPercentage: 0,
  isValidCoupon: {
    value: false,
    reasons: "",
  },
  cartCount: 0,
  minPaymentPrice: 0,

  addItem: (item) => {
    const items = get().items;
    const existingItemIndex = items.findIndex(
      (existingItem) =>
        existingItem.purchasable_id === item.purchasable_id &&
        existingItem.purchasable_type === item.purchasable_type &&
        JSON.stringify(existingItem.option_ids?.sort()) ===
          JSON.stringify(item.option_ids?.sort())
    );

    if (existingItemIndex !== -1) {
      // Update quantity if item already exists
      const updatedItems = [...items];
      updatedItems[existingItemIndex].quantity += item.quantity;
      set({
        items: updatedItems,
        totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
      });
    } else {
      // Add new item
      const newItems = [...items, item];
      set({
        items: newItems,
        totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
      });
    }
  },

  removeItem: (purchasableId, purchasableType, optionIds) => {
    const items = get().items;
    const updatedItems = items.filter(
      (item) =>
        !(
          item.purchasable_id === purchasableId &&
          item.purchasable_type === purchasableType &&
          JSON.stringify(item.option_ids?.sort()) ===
            JSON.stringify(optionIds?.sort())
        )
    );
    set({
      items: updatedItems,
      totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
    });
  },

  updateQuantity: (purchasableId, purchasableType, optionIds, quantity) => {
    if (quantity <= 0) {
      get().removeItem(purchasableId, purchasableType, optionIds);
      return;
    }

    const items = get().items;
    const updatedItems = items.map((item) =>
      item.purchasable_id === purchasableId &&
      item.purchasable_type === purchasableType &&
      JSON.stringify(item.option_ids?.sort()) ===
        JSON.stringify(optionIds?.sort())
        ? { ...item, quantity }
        : item
    );
    set({
      items: updatedItems,
      totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
    });
  },

  clearCart: () => {
    set({
      items: [],
      totalItems: 0,
      subtotal: 0,
      discountAmount: 0,
      totalPrice: 0,
    });
  },
  syncWithServer: async (carId: number, userId: number) => {
    const items = get().items;
    if (items.length === 0) {
      set({
        totalItems: 0,
        subtotal: 0,
        discountAmount: 0,
        totalPrice: 0,
        shippingPrice: 0,
        servicePrice: 0,
        cartCount: 0,
        minPaymentPrice: 0,
      });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const cartRequest = {
        car_id: carId,
        user_id: userId,
        purchasables: items.map(
          (item): CartItemRequest => ({
            purchasable_id: item.purchasable_id,
            purchasable_type: item.purchasable_type,
            quantity: item.quantity,
            option_ids: item.option_ids,
          })
        ),
      };

      const response = await submitCartForPricing(cartRequest);

      if (response.success) {
        // Combine services and products from the response
        const allServerItems = [
          ...response.cart.services.map((item) => ({
            ...item.cart,
            payload: item.payload,
            name: item.cart.purchasable.name.en,
            price: item.payload.price,
            status: item.payload.status,
          })),
          ...response.cart.products.map((item) => ({
            ...item.cart,
            payload: item.payload,
            name: item.cart.purchasable.name.en,
            price: item.payload.price,
            status: item.payload.status,
          })),
        ];

        // Update items with server pricing data
        const updatedItems = items.map((localItem) => {
          const serverItem = allServerItems.find(
            (sItem) =>
              sItem.purchasable_id === localItem.purchasable_id &&
              sItem.purchasable_type === localItem.purchasable_type
          );

          if (serverItem) {
            return {
              ...localItem,
              id: `${serverItem.purchasable_id}-${serverItem.purchasable_type}`,
              price: serverItem.price,
              total_price: serverItem.price * localItem.quantity,
            };
          }
          return localItem;
        });

        set({
          items: updatedItems,
          totalItems: response.cart.quantity,
          subtotal: response.cart.subtotal_price,
          discountAmount: response.cart.discount_price,
          totalPrice: response.cart.total_price,
          shippingPrice: response.cart.shipping_price,
          servicePrice: response.cart.service_price,
          servicePercentage: response.cart.service_percentage,
          minOrderPercentage: response.cart.min_order_percentage,
          isValidCoupon: response.cart.is_valid_coupon,
          cartCount: response.cart.count,
          minPaymentPrice: response.cart.min_payment_price,
        });
      } else {
        set({ error: response.message });
      }
    } catch (error) {
      console.error("Error syncing cart with server:", error);
      set({ error: "Failed to sync cart with server" });
    } finally {
      set({ isLoading: false });
    }
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  setError: (error) => {
    set({ error });
  },
}));
