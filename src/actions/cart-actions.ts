'use server';
import { getCurrentSession } from '@/actions/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const createCart = async () => {
  const user = (await getCurrentSession()).user;

  // Don't have to use await keyword here, as create() method is already an async method.
  return prisma.cart.create({
    data: {
      id: crypto.randomUUID(),
      // If there is no user, we don't need to connect it to the cart. Just keep it as undefined.
      user: user
        ? {
            connect: {
              id: user.id,
            },
          }
        : undefined,
      items: {
        create: [],
      },
    },
    include: {
      items: true,
    },
  });
};

export const getOrCreateCart = async (cartId?: string | null) => {
  const user = (await getCurrentSession()).user;
  if (user) {
    const cart = await prisma.cart.findUnique({
      where: {
        userId: user.id,
      },
      include: {
        items: true,
      },
    });

    if (cart) {
      return cart;
    }
  }

  if (!cartId) {
    return createCart();
  }

  const cart = await prisma.cart.findUnique({
    where: {
      id: cartId,
    },
    include: {
      items: true,
    },
  });

  if (!cart) {
    return createCart();
  }

  return cart;
};

export const updateCartItem = async (
  cartId: string,
  sanityProductId: string,
  data: {
    title?: string;
    price?: number;
    quantity?: number;
    image?: string;
  }
) => {
  const cart = await getOrCreateCart(cartId);

  const existingItem = cart.items.find(
    (item) => item.sanityProductId === sanityProductId
  );

  if (existingItem) {
    // Update quantity
    // If quantity is 0, delete the item
    if (data.quantity === 0) {
      await prisma.cartLineItem.delete({
        where: {
          id: existingItem.id,
        },
      });
      // Or update the quantity with the new value
    } else if (data.quantity && data.quantity > 0) {
      await prisma.cartLineItem.update({
        where: {
          id: existingItem.id,
        },
        data: {
          quantity: data.quantity,
        },
      });
    }
  } else if (data.quantity && data.quantity > 0) {
    // Create a new item
    await prisma.cartLineItem.create({
      data: {
        id: crypto.randomUUID(),
        cartId: cart.id,
        sanityProductId,
        quantity: data.quantity,
        title: data.title || '',
        price: data.price || 0,
        image: data.image || '',
      },
    });
  }

  revalidatePath('/');

  return getOrCreateCart(cartId);
};

// cartId means the anonymous cart id
export const syncCartWithUser = async (cartId: string | null) => {
  const { user } = await getCurrentSession();

  if (!user) {
    return null;
  }

  const existingUserCart = await prisma.cart.findUnique({
    where: {
      userId: user.id,
    },
    include: {
      items: true,
    },
  });

  const existingAnonymousCart = cartId
    ? await prisma.cart.findUnique({
        where: {
          id: cartId,
        },
        include: {
          items: true,
        },
      })
    : null;

  if (!cartId && existingUserCart) {
    return existingUserCart;
  }

  if (!cartId || (!existingAnonymousCart && !existingUserCart)) {
    return createCart();
  }

  if (existingUserCart && existingUserCart.id === cartId) {
    return existingUserCart;
  }

  if (!existingUserCart) {
    return prisma.cart.update({
      where: {
        id: cartId,
      },
      data: {
        userId: user.id,
      },
      include: {
        items: true,
      },
    });
  }

  // If there is no anonymous cart, we don't need to merge it with the user's cart. Just return the user's cart.
  if (!existingAnonymousCart) {
    return existingUserCart;
  }

  // Finally, merge the anonymous cart with the user's cart.
  for (const item of existingAnonymousCart?.items) {
    const existingItem = existingUserCart.items.find(
      (i) => i.sanityProductId === item.sanityProductId
    );

    if (existingItem) {
      // Update the quantity with the new value
      await prisma.cartLineItem.update({
        where: {
          id: existingItem.id,
        },
        data: {
          quantity: item.quantity + existingItem.quantity,
        },
      });
    } else {
      // Create a new item
      await prisma.cartLineItem.create({
        data: {
          id: crypto.randomUUID(),
          cartId: existingUserCart.id,
          sanityProductId: item.sanityProductId,
          quantity: item.quantity,
          title: item.title,
          price: item.price,
          image: item.image,
        },
      });
    }
  }
  // Don't remember to delete the anonymous cart because it's not needed anymore.
  await prisma.cart.delete({
    where: {
      id: cartId,
    },
  });

  // Make sure to fetch the data from database(but not from cache or React state) as soon as possible
  revalidatePath('/');
  return getOrCreateCart(existingUserCart.id);
};
