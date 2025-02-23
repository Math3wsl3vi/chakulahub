import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type Meal = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type CartState = {
  cart: Meal[];
  addToCart: (meal: Meal) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],

      addToCart: (meal) =>
        set((state) => {
          const existingMeal = state.cart.find((item) => item.id === meal.id);
          if (existingMeal) {
            return {
              cart: state.cart.map((item) =>
                item.id === meal.id ? { ...item, quantity: item.quantity + 1 } : item
              ),
            };
          }
          return { cart: [...state.cart, { ...meal, quantity: 1 }] };
        }),

      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((meal) => meal.id !== id),
        })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
          ),
        })),

      clearCart: () => set({ cart: [] }),

      getTotalPrice: () => {
        return get().cart.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: "cart-storage", // Unique key for localStorage
      storage: createJSONStorage(() => localStorage)
, // ✅ Fix: Use `storage` instead of `getStorage`
    }
  )
);
