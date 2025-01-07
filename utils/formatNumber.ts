export function formatNumber(num: number): string {
  if (num < 1000) {
    return num.toString();
  } else if (num < 1_000_000) {
    return `${(num / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  } else if (num < 1_000_000_000) {
    return `${(num / 1_000_000).toFixed(1).replace(/\.0$/, "")}m`;
  } else {
    return `${(num / 1_000_000_000).toFixed(1).replace(/\.0$/, "")}b`;
  }
}
