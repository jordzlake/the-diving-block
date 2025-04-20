export const getUsers = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/users`, {
    cache: "no-store",
    next: { revalidate: 0 },
  });

  const result = await res.json();
  return result;
};

export const getUser = async (id) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/users/${id}`,
    {
      cache: "no-store",
      next: { revalidate: 0 },
    }
  );

  const result = await res.json();
  return result;
};

export const deleteUser = async (data) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/users/${data.id}`,
    {
      method: "DELETE", // Specify DELETE method
      cache: "no-store",
      body: JSON.stringify({
        id: data.id,
      }),
      next: { revalidate: 0 },
    }
  );

  const result = await res.json();
  return result; // Assuming the API returns a JSON response
};

export const updateUser = async (data) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/users/${data.id}}`,
    {
      cache: "no-store",
      method: "POST",
      next: { revalidate: 0 },
      body: JSON.stringify({
        user: data.formData,
      }),
    }
  );
  const result = await res.json();
  return result;
};

export const createUser = async (data) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/users`, {
    cache: "no-store",
    method: "POST",
    next: { revalidate: 0 },
    body: JSON.stringify({
      user: data.formData,
    }),
  });
  const result = await res.json();
  return result;
};
