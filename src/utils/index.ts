export function extractText(text: string) {
  const match = text.match(/(?:"[^"]*"|^[^"]*$)/);
  if (match) {
    return match[0].replace(/"/g, '');
  }
  return '';
}

export function parseNumericValue(text: string, lon: number) {
  return text.split('.').join('').padStart(lon, '0');
}

export const blankKeywords = ['BLANCOS', 'blanco', 'En blanco', 'X'];
