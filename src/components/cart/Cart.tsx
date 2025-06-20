'use client';
import React, { useEffect, useMemo } from 'react';
import { useCartStore } from '@/stores/cart-store';
import { useShallow } from 'zustand/react/shallow';
import { Minus, Plus, ShoppingCart, Trash2, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';

const FREE_SHIPPING_AMOUNT = 15;

const Cart = () => {
  const {
    isOpen,
    close,
    syncWithUser,
    setLoaded,
    getTotalItems,
    getTotalPrice,
    items,
    updateQuantity,
    removeItem,
  } = useCartStore(
    // Perform a shallow Comparison to check if the specified properties have been changed.
    useShallow((state) => ({
      isOpen: state.isOpen,
      close: state.close,
      syncWithUser: state.syncWithUser,
      setLoaded: state.setLoaded,
      getTotalItems: state.getTotalItems,
      getTotalPrice: state.getTotalPrice,
      items: state.items,
      updateQuantity: state.updateQuantity,
      removeItem: state.removeItem,
    }))
  );

  useEffect(() => {
    const initCart = async () => {
      // Take the persisted cart data from local storage
      await useCartStore.persist.rehydrate();
      await syncWithUser();
      setLoaded(true);
    };

    initCart();
  }, []);

  const totalPrice = getTotalPrice();

  const remainingForFreeShipping = useMemo(() => {
    return Math.max(0, FREE_SHIPPING_AMOUNT - totalPrice);
  }, [totalPrice]);

  return (
    <>
      {isOpen && (
        <div
          // Because of Tailwind CSS V4, we CANNOT use bg-opacity-50, but we can use bg-black/50 instead.
          className="fixed inset-0 bg-black/50 z-50 transition-opacity backdrop-blur-sm"
          onClick={close}
        />
      )}
      <div
        className={`fixed right-0 top-0 w-full h-full bg-white sm:w-[400px] z-50 transform shadow-2xl 
        transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          {/*  Header  */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              <h2 className="text-black text-lg font-semibold">
                Shopping Cart
              </h2>
              <span className="rounded-full text-sm min-w-7 text-center font-medium bg-gray-200 px-2 py-1">
                {getTotalItems()}
              </span>
            </div>
            <button
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              onClick={close}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {/*  Items  */}
          <div className="flex-1 overflow-y-auto">
            {/* If the cart is empty, just show some hints */}
            {items.length === 0 ? (
              <div className="flex flex-col items-center p-4 text-center justify-center h-full">
                <div className="flex h-16 w-16 bg-gray-100 rounded-full items-center justify-center mb-4">
                  <ShoppingCart className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Your cart is empty
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Looks like you have not added any items to your cart yet!
                </p>
                <Link
                  className="bg-black text-white px-4 py-2 rounded-full font-medium hover:bg-gray-700 transition-colors duration-100"
                  href={'/'}
                  onClick={close}
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              // Show the items normally
              <div className="p-4 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {/* Product Image */}
                    <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-white">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {formatPrice(item.price)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center border border-gray-300 rounded-md bg-white">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                Math.max(1, item.quantity - 1)
                              )
                            }
                            className="p-1.5 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 py-1.5 text-sm font-medium min-w-[2.5rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="p-1.5 hover:bg-gray-100 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Item Total */}
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/*  Footer  */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 p-4 space-y-4">
              {/* Order Summary */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Subtotal ({getTotalItems()} items)
                  </span>
                  <span className="font-medium">
                    {formatPrice(getTotalPrice())}
                  </span>
                </div>
                <div className="flex-col space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-green-600">
                      {remainingForFreeShipping > 0
                        ? `🚚 Add $${remainingForFreeShipping.toFixed(2)} more for FREE shipping`
                        : 'FREE'}
                    </span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div
                      className={`bg-blue-600 h-2 rounded-full transition-all duration-300]`}
                      style={{
                        width: `${Math.min(100, (totalPrice / FREE_SHIPPING_AMOUNT) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">
                      Total
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      ${getTotalPrice().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                  Proceed to Checkout
                </button>
                <button
                  onClick={close}
                  className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
