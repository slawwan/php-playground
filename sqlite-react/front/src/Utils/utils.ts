export function toObject<T, TKey extends number | string>(array: T[], keySelector: (item: T) => TKey): Record<TKey, T> {
  const result = {} as Record<TKey, T>;
  for (const item of array) {
    result[keySelector(item)] = item;
  }
  return result;
}

export function groupBy<T, TKey extends number | string>(
  array: T[],
  keySelector: (item: T) => TKey
): Record<TKey, T[]> {
  const result = {} as Record<TKey, T[]>;
  for (const item of array) {
    const key = keySelector(item);
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(item);
  }
  return result;
}

export function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
