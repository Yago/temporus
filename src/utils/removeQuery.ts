const removeQuery = (key: string) => {
  const url = new URL(window.location.href);
  url.searchParams.delete(key);
  window.history.replaceState({}, '', url.toString());
};

export default removeQuery;
