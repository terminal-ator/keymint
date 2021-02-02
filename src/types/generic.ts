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
}
export interface nullableFloat {
  Float64: number;
  Valid: boolean;
}

export interface StatementMutation{
  stat_id: number
	bank_id : number
	cust_id: number,
	company_id: number
}


export interface NormalizedCache<T> {
  all: Array<number | string>;
  normalized: { [ key in number|string ]: T };
}

export interface HasId {
  id: number;
  cust_id?: NullInt;
}

export interface Has_id {
  _id: string;
}

export function normalize_id<T extends Has_id>(array: Array<T>) {
  let normal : NormalizedCache<T> ={
    all: [],
    normalized: {}
  };
  if (array === null ) return normal;
  if( array.length < 1) return normal;
  array.forEach( element => {
    normal.all.push(element._id);
    normal.normalized[element._id] = element
  });

  return normal

}

export function normalize<T extends HasId>(array: Array<T> | undefined, useCustID = false) {
  let normal: NormalizedCache<T> = {
    all: [],
    normalized: {}
  };
  if (array == undefined) return normal;
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

// export function DeNormalizeCustID<T extends HasId>(cache: NormalizedCache<T>):Array<T>{

// }

export interface Year {
  id: number;
  start_date: string;
  end_date: string;
  year_string: string;
  company_id: number;
}
