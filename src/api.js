const testConnection = src => {
  return fetch(src).then(response => response.json());
};

export const getFatture = () => {
  return testConnection("http://localhost:3001/fatture");
};
