const getQuery = (key: string): string | null => {
  const url = new URL(window.location.href);
  return url.searchParams.get(key) ?? null;
};

export default getQuery;
