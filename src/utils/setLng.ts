import { getLng } from '.';

const setLng = (lng: string) => {
  const currentLng = getLng();
  const url = new URL(window.location.href);
  url.searchParams.set('l', lng);
  window.history.replaceState({}, '', url.toString());
  if (lng !== currentLng) {
    window.location.reload();
  }
};

export default setLng;
