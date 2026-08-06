import type { en } from './messages/en';

type Dictionary<T> = {
  [K in keyof T]: T[K] extends string ? string : Dictionary<T[K]>;
};

export type Messages = Dictionary<typeof en>;
