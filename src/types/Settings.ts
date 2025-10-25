export type Settings = {
  languages: {
    [key: string]: string;
  };
  scales: {
    [key: string]: {
      start: number;
      end: number;
    };
  };
};
