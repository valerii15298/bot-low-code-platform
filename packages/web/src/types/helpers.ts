declare global {
  interface ObjectConstructor {
    fromEntries<T>(obj: T): FromEntriesWithReadOnly<T>;
  }
}

export const ObjectKeys = <O>(o: O) => {
  return Object.keys(o) as (keyof O)[];
};
export type ArrayElement<A> = A extends readonly (infer T)[] ? T : never;

export type DeepWriteable<T> = {
  -readonly [P in keyof T]: DeepWriteable<T[P]>;
};

export type Cast<X, Y> = X extends Y ? X : Y;

type FromEntries<T> = T extends [infer Key, any][]
  ? {
      [K in Cast<Key, string | number | symbol>]: Extract<
        ArrayElement<T>,
        [K, any]
      >[1];
    }
  : { [key in string]: any };

export type FromEntriesWithReadOnly<T> = FromEntries<DeepWriteable<T>>;

export const isArray = Array.isArray as (
  arg: unknown
) => arg is unknown[] | readonly unknown[];

type Increment<A extends 0[]> = [...A, 0];

export type RecursivePartial<
  T,
  Depth extends number = -1,
  CurrentDepth extends 0[] = []
> = T extends primitiveType
  ? T
  : CurrentDepth["length"] extends Depth
  ? T
  : T extends (infer U)[]
  ? RecursivePartial<U, Depth, Increment<CurrentDepth>>[]
  : {
      [K in keyof T]?: RecursivePartial<T[K], Depth, Increment<CurrentDepth>>;
    };

export type RecursiveNull<T> = {
  [P in keyof T]: T[P] extends (infer U)[]
    ? RecursiveNull<U>[]
    : T[P] extends primitiveType
    ? T[P] | null
    : RecursiveNull<T[P]>;
};

// added symbol | bigint, ???
export type primitiveType =
  | string
  | number
  | boolean
  | undefined
  | null
  | symbol
  | bigint;

export interface pos {
  x: number;
  y: number;
}

export interface clientPos {
  clientX: number;
  clientY: number;
}

export interface canvasShape {
  x: number;
  y: number;
  width: number;
  height: number;
}
