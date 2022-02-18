export const defaultBackgroundConfig = {
  opacity: 50,
  blur: 50,
  imageUrl: "",
};

export const getDefaultZoomConfig = () => ({
  max: 2,
  min: 0.5,
  tick: 0.1,
  value: 1,
});

// const arr1 = [1, 2, 3] as const;
//
// type ArrayElement<ArrayType extends readonly unknown[]> =
//   ArrayType extends readonly (infer ElementType)[] ? ElementType : never;
//
// const myMap = <U, C extends readonly ArrayElement<C>[]>(
//   arr: C,
//   callbackfn: (
//     value: ArrayElement<C>,
//     index: number,
//     array: readonly ArrayElement<C>[]
//   ) => U,
//   thisArg?: any
// ): {
//   [Index in keyof C]: U;
// } => {
//   return arr.map(callbackfn, thisArg) as any;
// };
// //
// // const arr2 = myMap(arr1, (ii) => ({
// //   k: ii.toString(),
// // }));
// //
// // const arr3 = arr1.map((ii) => ({
// //   k: ii.toString(),
// // }));
//
// const generateMainOrientations = <T extends readonly ArrayElement<T>[]>(
//   mainOrientationsNames: T
// ) => {
//   const temp = myMap(
//     mainOrientationsNames,
//     (mainOrientationName) =>
//       ({
//         name: mainOrientationName,
//         getYear(date: Date) {
//           return date.getFullYear();
//         },
//       } as const)
//   );
//
//   return temp;
// };
//
// const mainOrientations = generateMainOrientations([
//   "One",
//   "Two",
//   "Three",
// ] as const);
