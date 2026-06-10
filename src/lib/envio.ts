export const ENVIO_MXN = 100;
export const ENVIO_USD = 5;

export function formatPrecio(usd: number) {
  return `$${usd.toFixed(2)} USD`;
}
