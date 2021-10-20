export function isFloat(num: number) {
  return num % 1 != 0;
}

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
    if (value < 10 && value >= 0) {
      toParse = value.toString();
    } else {
      toParse = value.toFixed(2);
    }
  } else {
    const stringNum = parseFloat(value);
    if (stringNum < 10 && stringNum >= 0) {
      toParse = stringNum.toString();
    } else {
      toParse = stringNum.toFixed(2);
    }
  }
  if (lon === 15) {
    return toParse.split('.')[0].padStart(lon, '0');
  }
  return toParse.split('.').join('').padStart(lon, '0');
}

export function sumFields(fieldA: Field, fieldB: Field): number {
  if (typeof fieldA === 'string' && typeof fieldB === 'string') {
    return parseFloat(fieldA) + parseFloat(fieldB);
  } else if (typeof fieldA === 'string' && typeof fieldB === 'number') {
    return parseFloat(fieldA) + fieldB;
  } else if (typeof fieldA === 'number' && typeof fieldB === 'string') {
    return fieldA + parseFloat(fieldB);
  } else if (typeof fieldA === 'number' && typeof fieldB === 'number') {
    return fieldA + fieldB;
  } else {
    return 0;
  }
}

export const blankKeywords = ['BLANCOS', 'blanco', 'En blanco', 'X', 'Blanco o C'];
