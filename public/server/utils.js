module.exports.paginateResults = ({
  after: cursor,
  pageSize = 50,
  results
}) => {
  if (pageSize < 1) return [];
  if (!cursor) return results.slice(0, pageSize);
  const cursorIndex = results.findIndex(item => {
    return cursor === item.ID;
  });
  return cursorIndex >= 0
    ? cursorIndex === results.length - 1
      ? []
      : results.slice(
          cursorIndex + 1,
          Math.min(results.length, cursorIndex + 1 + pageSize)
        )
    : results.slice(0, pageSize);
};

module.exports.parseCurrency = value => {
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
      if (i > 0 && i % 3 === 0) {
        out.push(".");
      }
      out.push(c);
    });

  return (
    out.reverse().join("") +
    stringNumber.slice(indexComma, stringNumber.length).join('') +
    " €"
  );
};
