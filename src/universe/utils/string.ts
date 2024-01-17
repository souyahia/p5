export function hash(str?: string): number {
  let hash = 0;
  if (!str) {
    return hash;
  }
  str.split('').forEach((char) => {
    hash = char.charCodeAt(0) + ((hash << 5) - hash)
  });
  return hash;
}
