// Barcode utility functions

export const generateBarcode = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9).toUpperCase();
  return `BC${timestamp}${random}`;
};

export const validateBarcode = (barcode: string): boolean => {
  // Basic validation - can be enhanced
  return barcode.length >= 3 && /^[A-Z0-9]+$/.test(barcode);
};
