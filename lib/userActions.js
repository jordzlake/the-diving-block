export const getUsers = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/users`, {
    cache: "no-store",
    next: { revalidate: 0 },
  });
  if (res.error) {
    throw new Error("Something went wrong when fetching users.");
  }

  return res.json();
};

export const getUser = async (id) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/users/${id}`,
    {
      cache: "no-store",
      next: { revalidate: 0 },
    }
  );
  if (res.error) {
    throw new Error("Something went wrong when fetching user.");
  }

  return res.json();
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
  if (res.error) {
    throw new Error("Something went wrong when deleting user.");
  }

  return res.json(); // Assuming the API returns a JSON response
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
  return res.json();
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
  return res.json();
};
