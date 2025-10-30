const getLng = (): string => {
  const url = new URL(window.location.href);
  return url.searchParams.get('l') ?? 'fr';
};

export default getLng;
