import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { syncCartWithUser, updateCartItem } from '@/actions/cart-actions';
import prisma from '@/lib/prisma';

export type CartItem = {
  // This id stands for sanityProductid
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
};

export type CartStore = {
  items: CartItem[];
  isLoaded: boolean;
  isOpen: boolean;
  cartId: string | null;
  setStore: (store: Partial<CartStore>) => void;
  addItem: (item: CartItem) => Promise<void | CartStore>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  open: () => void;
  close: () => void;
  setLoaded: (loaded: boolean) => void;
  syncWithUser: () => Promise<void>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoaded: false,
      isOpen: false,
      cartId: null,
      setStore: (store: Partial<CartStore>) => set(store),
      addItem: async (item: CartItem) => {
        // We need to judge if the cartId is null or not, if it's null, we just return simply.
        const cartId = get().cartId;
        if (!cartId) {
          return;
        }

        // Update the database
        const updatedCart = await updateCartItem(cartId, item.id, {
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        });

        // Update the store state
        set((prevState) => {
          return {
            ...prevState,
            cartId: updatedCart.id,
            items: [...prevState.items, item],
          };
        });
      },
      removeItem: async (id: string) => {
        // We need to judge if the cartId is null or not, if it's null, we just return simply.
        const cartId = get().cartId;
        if (!cartId) {
          return;
        }

        // Update the database
        const updatedCart = await updateCartItem(cartId, id, {
          // We just need to set the quantity to 0 to remove the item from the cart. Other fields are not needed.
          quantity: 0,
        });

        // Update the store state
        set((prevState) => {
          return {
            ...prevState,
            cartId: updatedCart.id,
            items: prevState.items.filter((item) => item.id !== id),
          };
        });
      },
      updateQuantity: async (id: string, quantity: number) => {
        // We need to judge if the cartId is null or not, if it's null, we just return simply.
        const cartId = get().cartId;
        if (!cartId) {
          return;
        }

        // Update the database
        const updatedCart = await updateCartItem(cartId, id, {
          // We just need to set the quantity to 0 to remove the item from the cart. Other fields are not needed.
          quantity: quantity,
        });

        // Update the store state
        set((prevState) => {
          return {
            ...prevState,
            cartId: updatedCart.id,
            items: prevState.items.map((item) => {
              if (item.id === id) {
                return { ...item, quantity: quantity };
              } else return item;
            }),
          };
        });
      },
      clearCart: () => {
        set((prevState) => ({ ...prevState, items: [] }));
      },
      open: () => {
        set((prevState) => ({ ...prevState, isOpen: true }));
      },
      close: () => {
        set((prevState) => ({ ...prevState, isOpen: false }));
      },
      setLoaded: (loaded: boolean) => {
        set((prevState) => ({ ...prevState, isLoaded: loaded }));
      },
      syncWithUser: async () => {
        const { cartId } = get();
        if (!cartId) {

        }

        const syncedCart = await syncCartWithUser(cartId);
      },
      getTotalItems: () => {
        const items = get().items;
        return items.reduce((acc, item) => acc + item.quantity, 0);
      },
      getTotalPrice: () => {
        const items = get().items;
        return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'cart',
      skipHydration: true,
    }
  )
);
