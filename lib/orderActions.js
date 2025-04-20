export const getOrders = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/orders`, {
    cache: "no-store",
    next: { revalidate: 0 },
  });

  const result = await res.json(); // you need to parse the response first

  if (result.errors) {
    throw new Error("Something went wrong when fetching orders.");
  }

  return result;
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
  return result;
};

export const updateOrder = async (order) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/orders/${order._id}`,
    {
      method: "POST",
      cache: "no-store",
      next: { revalidate: 0 },
      body: JSON.stringify({ order }),
    }
  );
  const result = await res.json();
  return result;
};

export async function createOrder(data) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/orders`, {
    cache: "no-store",
    method: "POST",
    next: { revalidate: 0 },
    body: JSON.stringify({
      data,
    }),
  });
  const result = await res.json();
  return result;
}
