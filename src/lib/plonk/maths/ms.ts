export type FPS = 15 | 30 | 60;

export const MS_IN_SECOND = 1000;
export const MS_IN_MINUTE = 60 * MS_IN_SECOND;
export const MS_IN_HOUR = MS_IN_MINUTE * 60;

export const enum TimeFormat {
  FPS = 'fps',
  HOURS = 'h',
  HZ = 'hz',
  MILLISECONDS = 'ms',
  MINUTES = 'm',
  SECONDS = 's',
}

export type AvailableTimeFormats = `${TimeFormat}`;

export const FORMAT_IDENTIFIERS: AvailableTimeFormats[] = [
  TimeFormat.MILLISECONDS,
  TimeFormat.MINUTES,
  TimeFormat.SECONDS,
  TimeFormat.HOURS,
  TimeFormat.FPS,
  TimeFormat.HZ,
];

type FormatGetter = (val: number) => number;

const FORMATTERS = new Map<AvailableTimeFormats, FormatGetter>([
  [TimeFormat.FPS, (val: number) => MS_IN_SECOND / val],
  [TimeFormat.HZ, (val: number) => (1 / val) * MS_IN_SECOND],
  [TimeFormat.MILLISECONDS, (val: number) => val],
  [TimeFormat.SECONDS, (val: number) => val * MS_IN_SECOND],
  [TimeFormat.MINUTES, (val: number) => val * MS_IN_MINUTE],
  [TimeFormat.HOURS, (val: number) => val * MS_IN_HOUR],
]);

const sanitizeStringVal = (val: string) => val.toLocaleLowerCase().trim();

const parseStringValAndFormat = (val: string) => {
  for (let i = 0; i < FORMAT_IDENTIFIERS.length; i += 1) {
    const format = FORMAT_IDENTIFIERS[i];

    if (val.indexOf(format) !== -1) {
      return {
        format: FORMAT_IDENTIFIERS[i],
        parsed: Number(val.replace(' ', '').replace(format, '')),
      };
    }
  }

  return {
    format: undefined,
    parsed: undefined,
  };
};

export function ms(val: string | number | undefined | null): number | undefined;
export function ms(
  val: number | undefined | null,
  format: AvailableTimeFormats,
): number | undefined;

export default function ms(
  val: string | number | undefined | null,
  format = TimeFormat.MILLISECONDS,
): number | undefined {
  let parsedValue: number;
  let parsedFormat: AvailableTimeFormats = format;

  if (val === null || typeof val === 'undefined') {
    return undefined;
  }

  if (typeof val === 'string') {
    const { parsed: p, format: f } = parseStringValAndFormat(
      sanitizeStringVal(val),
    );

    if (typeof p !== 'undefined' && format) {
      parsedValue = p;
      parsedFormat = f;
    }
  } else {
    parsedValue = val;
  }

  if (Number.isNaN(val)) {
    return undefined;
  }

  const formatter = FORMATTERS.get(parsedFormat);

  if (!formatter) {
    return undefined;
  }

  return formatter(parsedValue);
}
