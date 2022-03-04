export type ColorFn =
  | 'rgba'
  | 'adjusthue'
  | 'saturate'
  | 'desaturate'
  | 'lighten'
  | 'darken'
  | 'color-invert'
  | 'dark-color'
  | 'light-color'

export interface ColorFnCall {
  fn: ColorFn
  fnArg: string | null
  composeArg: ColorFnCall | null
}

export interface ColorCallSet {
  [color: string]: {
    calls: ColorFnCall[]
  }
}
export const bulmaCssVariablesDefs: ColorCallSet = {
  danger: {
    calls: [],
  },
  dark: {
    calls: [],
  },
  info: {
    calls: [],
  },
  link: {
    calls: [
      {
        fn: 'color-invert',
        fnArg: null,
        composeArg: null,
      },
      {
        fn: 'dark-color',
        fnArg: null,
        composeArg: null,
      },
      {
        fn: 'light-color',
        fnArg: null,
        composeArg: null,
      },
    ],
  },
  primary: {
    calls: [
      {
        fn: 'color-invert',
        fnArg: null,
        composeArg: null,
      },
    ],
  },
  success: {
    calls: [],
  },
  warning: {
    calls: [],
  },
  white: {
    calls: [],
  },
}
