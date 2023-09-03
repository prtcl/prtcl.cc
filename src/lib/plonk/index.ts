export { default as clamp } from './maths/clamp';
export { default as Frames } from './timers/Frames';
export {
  default as Metro,
  type MetroOptions,
  type TimerCallback,
  type TimerState,
} from './timers/Metro';
export {
  default as Rand,
  type RandOptions,
  type RandState,
} from './maths/Rand';
export {
  default as Drunk,
  DEFAULT_DRUNK_STEP,
  type DrunkOptions,
  type DrunkState,
} from './maths/Drunk';
export {
  default as ms,
  MS_IN_HOUR,
  MS_IN_MINUTE,
  MS_IN_SECOND,
  TimeFormat,
  type AvailableTimeFormats,
  type FPS,
} from './maths/ms';
export { default as useMetro } from './hooks/useMetro';
export { default as useFrames } from './hooks/useFrames';
