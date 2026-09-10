export interface TenisSizeRow {
  us: string;
  mx: string;
}

export function usToMexicanSize(us: number): number {
  return Math.round((us - 1) * 2) / 2;
}

export function formatTenisSize({ us, mx }: TenisSizeRow): string {
  return `US ${us} / MX ${mx}`;
}

const TENIS_SIZE_PATTERN = /US\s*([\d.]+)\s*\/\s*MX\s*([\d.]+)/i;

export function parseTenisSize(value: string): TenisSizeRow {
  const match = value.match(TENIS_SIZE_PATTERN);
  if (match) return { us: match[1], mx: match[2] };
  return { us: value.trim(), mx: "" };
}
