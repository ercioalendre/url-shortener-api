export function urlHasProtocol(url: string): boolean {
  const regex = /^https?:\/\//i;

  return regex.test(url);
}
