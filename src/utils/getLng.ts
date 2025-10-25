const getLng = (): string | null => {
  const url = new URL(window.location.href);
  return url.searchParams.get('l') ?? null;
};

export default getLng;
