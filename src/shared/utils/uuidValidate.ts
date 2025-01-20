export function isUUIDValidV4(value: string): boolean {
  const uuidV4Regex = new RegExp(
    '^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$',
    'i'
  );
  return uuidV4Regex.test(value);
}
