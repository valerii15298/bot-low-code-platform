const used = new Set();

export const getId = () => {
  const value = Math.floor(Math.random() * 2147483647);
  if (used.has(value)) {
    throw new TypeError("Repeating id!!");
  }
  used.add(value);
  return value;
};
