export const getOrders = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/orders`, {
    cache: "no-store",
    next: { revalidate: 0 },
  });
  if (result.error) {
    throw new Error("Something went wrong when fetching orders.");
  }

  return res.json();
};

export const getOrder = async (orderId) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/orders/${orderId}`,
    {
      cache: "no-store",
      next: { revalidate: 0 },
    }
  );
  const result = await res.json();
  console.log("res", result.error.message);
  if (result.error) {
    console.log(true);
    throw new Error(
      `Something went wrong when fetching product with id ${orderId}`
    );
  }

  return result;
};

export const updateOrder = async (order) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/orders/${order._id}`,
    {
      cache: "no-store",
      next: { revalidate: 0 },
      data: order,
    }
  );
  if (result.error) {
    throw new Error(
      `Something went wrong when update product with id ${order._id}`
    );
  }

  return res.json();
};
