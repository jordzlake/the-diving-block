export const getSettings = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/settings`, {
    cache: "no-store",
    next: { revalidate: 0 },
  });
  if (res.error) {
    throw new Error("Something went wrong when fetching settings.");
  }

  return res.json();
};

export const updateSettings = async (data) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/settings`, {
    cache: "no-store",
    method: "POST",
    next: { revalidate: 0 },
    body: JSON.stringify({
      settings: data.formData,
    }),
  });
  return res.json();
};
