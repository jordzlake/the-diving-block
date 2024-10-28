import { revalidatePath } from "next/cache";

export const getProducts = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/products`, {
    cache: "no-store",
    next: { revalidate: 0 },
  });
  if (!res.ok) {
    throw new Error("Something went wrong when fetching products.");
  }

  return res.json();
};

export const getProduct = async (id) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/products/${id}`,
    {
      cache: "no-store",
      next: { revalidate: 0 },
    }
  );
  if (!res.ok) {
    throw new Error("Something went wrong when fetching product.");
  }

  return res.json();
};
