const getLng = () => {
  const url = new URL(window.location.href);
  return url.searchParams.get('l') || 'en';
};

export default getLng;
