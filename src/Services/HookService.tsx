import { useState } from "react";

export interface Hook<T> {
  value: T;
  set: (newValue: T) => void;
}

export function useHook<T>(value: T): Hook<T> {
  const [val, setter] = useState(value);
  return {
    value: val,
    set: setter,
  };
}
