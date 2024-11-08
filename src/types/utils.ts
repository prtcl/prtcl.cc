export type EnumValues<T> = T[keyof T];
export type EnumToString<T> = T extends { [K in keyof T]: infer U } ? U : never;

export const createEnumGuard = <T extends { [key: string]: string }>(
  enumObj: T,
) => {
  return (value: string): value is EnumToString<typeof enumObj> =>
    Object.values(enumObj).includes(value);
};
