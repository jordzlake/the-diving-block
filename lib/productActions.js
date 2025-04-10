export const getProducts = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/products`, {
    cache: "no-store",
    next: { revalidate: 0 },
  });
  if (res.error) {
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
  if (res.error) {
    throw new Error("Something went wrong when fetching product.");
  }

  return res.json();
};

export const deleteProduct = async (data) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/products/${data.id}`,
    {
      method: "DELETE", // Specify DELETE method
      cache: "no-store",
      body: JSON.stringify({
        id: data.id,
        images: data.images,
      }),
      next: { revalidate: 0 },
    }
  );
  if (res.error) {
    throw new Error("Something went wrong when deleting product.");
  }

  return res.json(); // Assuming the API returns a JSON response
};

export const updateProduct = async (data) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/products/${data.id}}`,
    {
      cache: "no-store",
      method: "POST",
      next: { revalidate: 0 },
      body: JSON.stringify({
        product: data.formData,
      }),
    }
  );
  return res.json();
};

export const addProduct = async (data) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/products`, {
    cache: "no-store",
    method: "POST",
    next: { revalidate: 0 },
    body: JSON.stringify({
      product: data.formData,
    }),
  });
  return res.json();
};
