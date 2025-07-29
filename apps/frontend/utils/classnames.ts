import { IAnyObj } from "@code-pulse-next/backend/src/type";

/**
 * 动态classname，会自动将string类型的拼接，并将object中为false的过滤掉，然后将为true的key拼接到一起
 * @param args
 */
export function classnames(...args: (string | IAnyObj)[]) {
  return args.map(arg => {
    if (typeof arg === 'string') {
      return arg
    }
    return Object.keys(arg)
      .filter(key => !!arg[key])
      .join(' ')
  }).join(' ')
}
