export interface NullString {
  String: string;
  Valid: boolean;
}

export interface CreateMasterInterface {
  name: string;
  group: number;
  company: number;
}

export interface NullInt {
  Int64: number;
  Valid: boolean;
}
export interface RenderItemProps<T> {
  item: T;
  style(index: number, rowHeight: number): any;
  isHighlighted: boolean;
  className?: string;
  setFocus?(index: number): void;
  index: number;
  rowHeight?: number;
}
export interface nullableFloat {
  Float64: number;
  Valid: boolean;
}

export interface NormalizedCache<T> {
  all: Array<number>;
  normalized: { [key: number]: T };
}

interface HasId {
  id: number;
  cust_id?: NullInt;
}

export function normalize<T extends HasId>(array: Array<T>, useCustID = false) {
  let normal: NormalizedCache<T> = {
    all: [],
    normalized: {}
  };
  if (array.length < 1) return normal;
  array.forEach(element => {
    normal.all.push(
      useCustID
        ? element.cust_id
          ? element.cust_id.Int64
          : element.id
        : element.id
    );
    normal.normalized[
      useCustID
        ? element.cust_id
          ? element.cust_id.Int64
          : element.id
        : element.id
    ] = element;
  });
  return normal;
}

export function GenerateCacheFromAll<T>(
  normalized: NormalizedCache<T>,
  all: Array<number>
) {
  let newCache: NormalizedCache<T> = {
    all: all,
    normalized: {}
  };
  all.forEach(id => {
    newCache.normalized[id] = normalized.normalized[id];
  });
  return newCache;
}

export function DeNormalize<T>(cache: NormalizedCache<T>): Array<T> {
  let cacheToArray = cache.all.map(id => cache.normalized[id]);

  return cacheToArray;
}
