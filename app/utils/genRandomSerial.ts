// from: https://stackoverflow.com/a/1349426/5835100 with a little tweak
export default function genRandomSerial(): string {
  // TODO: collision check
  const length = 7;
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}
