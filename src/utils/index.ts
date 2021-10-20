const formatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function extractText(text: string) {
  const match = text.match(/(?:"[^"]*"|^[^"]*$)/);
  if (match) {
    return match[0].replace(/"/g, '');
  }
  return '';
}

export function parseNumericValue(value: string | number, lon: number) {
  let toParse: string;
  if (typeof value === 'number') {
    toParse = formatter.format(value);
  } else {
    toParse = formatter.format(parseFloat(value));
  }
  return toParse.split('.').join('').padStart(lon, '0');
}

export function sumFields(fieldA: Field, fieldB: Field): number {
  if (typeof fieldA === 'string' && typeof fieldB === 'string') {
    return parseFloat(fieldA) + parseFloat(fieldB);
  } else if (typeof fieldA === 'string' && typeof fieldB === 'number') {
    return parseFloat(fieldA) + parseFloat(formatter.format(fieldB));
  } else if (typeof fieldA === 'number' && typeof fieldB === 'string') {
    return parseFloat(formatter.format(fieldA)) + parseFloat(fieldB);
  } else if (typeof fieldA === 'number' && typeof fieldB === 'number') {
    return parseFloat(formatter.format(fieldA)) + parseFloat(formatter.format(fieldB));
  } else {
    return 0;
  }
}

export const blankKeywords = ['BLANCOS', 'blanco', 'En blanco', 'X'];
