const fetchImages = async (page: number, search: string) => {
  const apiKey = process.env.NEXT_PUBLIC_ACCESS_KEY;

  const url = `https://api.unsplash.com/search/photos?page=${page || 1}&query=${
    search || "nature"
  }&client_id=${apiKey}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch photos");
  }

  return response.json();
};

export default fetchImages;
