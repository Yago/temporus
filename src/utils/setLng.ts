const setLng = (lng: string) => {
  const url = new URL(window.location.href);
  url.searchParams.set('l', lng);
  window.history.replaceState({}, '', url.toString());
};

export default setLng;
