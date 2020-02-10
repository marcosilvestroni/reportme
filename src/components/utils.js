export const parseCurrency = value => {
  const stringNumber = Number.parseFloat(value)
    .toFixed(2)
    .toString()
    .replace(".", ",")
    .split("");

  const out = [];
  const indexComma = stringNumber.indexOf(",");
  stringNumber
    .slice(0, indexComma)
    .reverse()
    .forEach((c, i) => {
      if (i > 0 && i % 3 === 0 && !isNaN(c)) {
        out.push(".");
      }
      out.push(c);
    });

  return (
    out.reverse().join("") +
    stringNumber.slice(indexComma, stringNumber.length).join("") +
    " €"
  );
};


export const toDate = timeStamp => {
  const d = new Date(parseInt(timeStamp));
  return d.toLocaleDateString();
};