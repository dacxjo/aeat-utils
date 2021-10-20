import { Workbook, Worksheet } from 'exceljs';
import { existsSync, mkdirSync } from 'fs';
import { writeFile } from 'fs/promises';
import { extractText, parseNumericValue } from '../../utils';

function pageOneIteration(
  worksheet: Worksheet,
  fromRow: number,
  toRow: number,
  row: number,
  blankKeywords: string[],
  input: Model111Input,
) {
  let output = '';
  for (let index = fromRow; index < toRow; index++) {
    const id = Number(worksheet.getCell(`A${row}`).text);
    const lon = Number(worksheet.getCell(`C${row}`).text);
    const content = extractText(worksheet.getCell(`G${row}`).text);
    switch (id) {
      case 4:
        output += input.exercise;
        row++;
        continue;
      case 5:
        output += input.period;
        row++;
        continue;
      case 9:
        output += input.version;
        row++;
        continue;
      case 11:
        output += input.devCompanyNIF;
        row++;
        continue;
    }
    if (blankKeywords.includes(content)) {
      output += ''.padEnd(lon, ' ');
    } else {
      output += content;
    }
    row++;
  }
  return output;
}

function pageTwoIteration(
  worksheet: Worksheet,
  fromRow: number,
  toRow: number,
  row: number,
  blankKeywords: string[],
  input: Model111Input,
) {
  let output = '';
  for (let index = fromRow; index < toRow; index++) {
    const id = Number(worksheet.getCell(`A${row}`).text);
    const lon = Number(worksheet.getCell(`C${row}`).text);
    const type = worksheet.getCell(`D${row}`).text;
    const content = extractText(worksheet.getCell(`F${row}`).text);
    switch (id) {
      case 6:
        output += 'I';
        row++;
        continue;
      case 7:
        output += '16250182S';
        row++;
        continue;
      case 8:
        output += 'Martinez Davis'.padEnd(lon, ' ');
        row++;
        continue;
      case 9:
        output += 'Emily'.padEnd(lon, ' ');
        row++;
        continue;
      case 10:
        output += input.exercise;
        row++;
        continue;
      case 11:
        output += input.period;
        row++;
        continue;
      case 12:
        output += parseNumericValue(input.earnedIncomes.recipients, lon);
        row++;
        continue;
      case 13:
        output += parseNumericValue(input.earnedIncomes.collectionsAmount, lon);
        row++;
        continue;
      case 14:
        output += parseNumericValue(input.earnedIncomes.retentionsAmount, lon);
        row++;
        continue;
      case 18:
        output += parseNumericValue(input.economicEarnings.recipients, lon);
        row++;
        continue;
      case 19:
        output += parseNumericValue(input.economicEarnings.collectionsAmount, lon);
        row++;
        continue;
      case 20:
        output += parseNumericValue(input.economicEarnings.retentionsAmount, lon);
        row++;
        continue;
      case 39:
      case 41: {
        const sum =
          parseFloat(input.earnedIncomes.retentionsAmount) + parseFloat(input.economicEarnings.retentionsAmount);
        output += parseNumericValue(sum.toString(), lon);
        row++;
        continue;
      }
      case 45:
        output += 'ES5521003034132200453561'.padEnd(lon, ' ');
        row++;
        continue;
      case 48:
        output += '</T11101000>'.padEnd(lon, ' ');
        row++;
        continue;
    }

    if (blankKeywords.includes(content)) {
      output += ''.padEnd(lon, ' ');
    } else if (type === 'Num' || type === 'N') {
      output += '0'.padStart(lon, '0');
    }
    if (row > 46 && content === '') {
      output += ''.padEnd(lon, ' ');
    }
    row++;
  }
  return output;
}

export async function model111(filename: string) {
  // BEGIN USER INPUT
  const input: Model111Input = {
    exercise: '2021',
    period: '3T',
    version: '0001',
    devCompanyNIF: '85355680N',
    earnedIncomes: {
      recipients: '0',
      collectionsAmount: '0',
      retentionsAmount: '0',
    },
    economicEarnings: {
      recipients: '2',
      collectionsAmount: '150.50',
      retentionsAmount: '22.58',
    },
  };
  // END USER INPUT
  const workbook = new Workbook();
  const blankKeywords = ['BLANCOS', 'blanco', 'En blanco', 'X'];
  let output = '';
  await workbook.xlsx
    .readFile(filename)
    .then(async (wb: Workbook) => {
      // BEGIN PAGE 1
      const page1 = wb.getWorksheet(1);
      let row = 6;
      const page1FinalRow = 20;
      output += pageOneIteration(page1, 0, 14, row, blankKeywords, input);
      // END PAGE 1
      // BEGIN PAGE 2
      const page2 = wb.getWorksheet(2);
      const page2Constant = '<T11101000>';
      output += page2Constant;
      row = 10;
      output += pageTwoIteration(page2, 0, 44, row, blankKeywords, input);
      // END PAGE 2
      let finalConstant = extractText(page1.getCell(`G${page1FinalRow}`).text);
      finalConstant = finalConstant.replace('AAAA', input.exercise).replace('PP', input.period);
      output += finalConstant;
      const outputDir = process.cwd() + '/output/';
      if (!existsSync(outputDir)) {
        mkdirSync(outputDir);
      }
      await writeFile(process.cwd() + '/output/111.txt', output)
        .then(() => {
          console.log('Model 111 Generated');
        })
        .catch((err: Error) => {
          throw new Error(err.stack);
        });
    })
    .catch((err: Error) => {
      throw new Error(err.stack);
    });
}