import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Food } from "../types";

interface CartState {
  items: CartItem[];
  addToCart: (
    food: Food,
    quantity: number,
    customizations: CartItem["customizations"],
    specialInstructions?: string
  ) => void;
  updateCartItem: (
    index: number,
    quantity: number,
    customizations?: CartItem["customizations"],
    specialInstructions?: string
  ) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  getTotalAmount: () => number;
}

const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (food, quantity, customizations, specialInstructions) => {
        const { items } = get();

        // Calculate item price
        const basePrice = food.price;
        let customizationsCost = 0;

        if (customizations.size) {
          customizationsCost += customizations.size.price;
        }

        if (customizations.crust) {
          customizationsCost += customizations.crust.price;
        }

        if (customizations.toppings && customizations.toppings.length > 0) {
          customizationsCost += customizations.toppings.reduce(
            (total, topping) => total + topping.price,
            0
          );
        }

        const itemPrice = basePrice + customizationsCost;

        // Check if item already exists in cart with same customizations
        const existingItemIndex = items.findIndex(
          (item) =>
            item.food._id === food._id &&
            JSON.stringify(item.customizations) ===
              JSON.stringify(customizations) &&
            item.specialInstructions === specialInstructions
        );

        if (existingItemIndex !== -1) {
          // Update existing item
          const updatedItems = [...items];
          updatedItems[existingItemIndex].quantity += quantity;
          updatedItems[existingItemIndex].price =
            itemPrice * updatedItems[existingItemIndex].quantity;

          set({ items: updatedItems });
        } else {
          // Add new item
          const newItem: CartItem = {
            food,
            quantity,
            price: itemPrice * quantity,
            customizations,
            specialInstructions,
          };

          set({ items: [...items, newItem] });
        }
      },

      updateCartItem: (
        index,
        quantity,
        customizations,
        specialInstructions
      ) => {
        const { items } = get();

        if (index >= 0 && index < items.length) {
          const updatedItems = [...items];
          const item = { ...updatedItems[index] };

          item.quantity = quantity;

          if (customizations) {
            item.customizations = customizations;
          }

          if (specialInstructions !== undefined) {
            item.specialInstructions = specialInstructions;
          }

          // Recalculate price
          const basePrice = item.food.price;
          let customizationsCost = 0;

          if (item.customizations.size) {
            customizationsCost += item.customizations.size.price;
          }

          if (item.customizations.crust) {
            customizationsCost += item.customizations.crust.price;
          }

          if (
            item.customizations.toppings &&
            item.customizations.toppings.length > 0
          ) {
            customizationsCost += item.customizations.toppings.reduce(
              (total, topping) => total + topping.price,
              0
            );
          }

          const itemPrice = basePrice + customizationsCost;
          item.price = itemPrice * quantity;

          updatedItems[index] = item;
          set({ items: updatedItems });
        }
      },

      removeFromCart: (index) => {
        const { items } = get();

        if (index >= 0 && index < items.length) {
          const updatedItems = [...items];
          updatedItems.splice(index, 1);
          set({ items: updatedItems });
        }
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalAmount: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.price, 0);
      },
    }),
    {
      name: "orange-cheese-pizza-cart",
    }
  )
);

export default useCartStore;
