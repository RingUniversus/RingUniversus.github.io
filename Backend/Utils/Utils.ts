export const getRandomActionId = () => {
  const hex = "0123456789abcdef";

  let ret = "";
  for (let i = 0; i < 10; i += 1) {
    ret += hex[Math.floor(hex.length * Math.random())];
  }
  return ret;
};
