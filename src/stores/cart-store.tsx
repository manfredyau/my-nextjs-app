import { create } from 'zustand';
import { persist, PersistStorage, StorageValue } from 'zustand/middleware';
import {
  getOrCreateCart,
  syncCartWithUser,
  updateCartItem,
} from '@/actions/cart-actions';
import Cookies from 'js-cookie';

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
  addItem: (item: CartItem) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  open: () => void;
  close: () => void;
  setLoaded: (loaded: boolean) => void;
  syncWithUser: () => Promise<void>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  clearPersistedData: () => void;
};
const cookieStorage: PersistStorage<CartStore> = {
  setItem: (key: string, value: StorageValue<CartStore>) => {
    Cookies.set(key, JSON.stringify(value), { expires: 7 }); // 设置过期时间为7天
  },
  getItem: (key: string) => {
    return JSON.parse(
      Cookies.get(key) || 'null'
    ) as StorageValue<CartStore> | null;
  },
  removeItem: (key: string) => {
    Cookies.remove(key);
  },
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
        const { cartId, items } = get();
        if (!cartId) {
          return;
        }

        // Perhaps there is already an item that has the same id, we need to add the quantity instead of creating a new item.
        const existingItem = items.find((i) => i.id === item.id);
        // If the item that you want to add has been in cart, just use its quantity simply, otherwise set it to 0.
        const existingQuantity = existingItem?.quantity || 0;
        const addedQuantity = item.quantity + existingQuantity;

        // Update the database
        const updatedCart = await updateCartItem(cartId, item.id, {
          title: item.title,
          price: item.price,
          quantity: addedQuantity,
          image: item.image,
        });

        // Update the store state
        set((prevState) => {
          const existingItem = prevState.items.find((i) => i.id === item.id);
          if (existingItem) {
            return {
              ...prevState,
              cartId: updatedCart.id,
              items: prevState.items.map((i) =>
                i.id === item.id
                  ? {
                      ...i,
                      quantity: addedQuantity,
                    }
                  : i
              ),
            };
          } else {
            return {
              ...prevState,
              cartId: updatedCart.id,
              items: [...prevState.items, item],
            };
          }
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
        if (cartId) {
          const syncedCart = await syncCartWithUser(cartId);
          // Make sure the user is logged in before syncing the cart, or syncedCard will be null.
          if (syncedCart?.id) {
            set((prevState) => ({
              ...prevState,
              cartId: syncedCart.id,
              items: syncedCart.items,
            }));
          }
        } else {
          const newCart = await getOrCreateCart();
          set((prevState) => ({
            ...prevState,
            cartId: newCart.id,
            items: newCart.items,
          }));
        }
      },
      getTotalItems: () => {
        const items = get().items;
        return items.reduce((acc, item) => acc + item.quantity, 0);
      },
      getTotalPrice: () => {
        const items = get().items;
        return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      },
      clearPersistedData: () => {
        Cookies.remove('cart-storage');
        set((prevState) => ({
          ...prevState,
          items: [],
          isLoaded: false,
          isOpen: false,
          cartId: null,
        }));
      },
    }),
    {
      name: 'cart-storage',
      skipHydration: true,
      storage: cookieStorage,
    }
  )
);
