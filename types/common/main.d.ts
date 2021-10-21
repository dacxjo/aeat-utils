// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="enums.d.ts" />

type Period = '1T' | '2T' | '3T' | '4T';
type DeclarationType = 'I' | 'U' | 'G' | 'N';
type VatDeclarationType = DeclarationType | 'C' | 'D' | 'V' | 'X';
type Field = string | number;

interface Declarant {
  name: string;
  lastname: string;
  nif: string;
  iban: string;
}

interface ModelInput {
  exercise: string;
  period: Period;
  version: string;
  devCompanyNIF: string;
}

interface Model111Input extends ModelInput {
  declarationType: DeclarationType;
  declarant: Declarant;
  fields: {
    field01: Field;
    field02: Field;
    field03: Field;
    field07: Field;
    field08: Field;
    field09: Field;
  };
}

interface Model115Input extends Omit<Model111Input, 'fields'> {
  fields: {
    field01: Field;
    field02: Field;
    field03: Field;
  };
}

interface Model130Input extends Omit<Model111Input, 'fields'> {
  fields: {
    field01: Field;
    field02: Field;
    field05: Field;
    field06: Field;
    field13: Field;
  };
}

interface Model303Input extends Omit<Model111Input, 'fields' | 'declarationType'> {
  declarationType: VatDeclarationType;
  fields: {
    field01: Field;
    field02: Field;
    field03: Field;
    field04: Field;
    field05: Field;
    field06: Field;
    field07: Field;
    field08: Field;
    field09: Field;
    field10: Field;
    field16: Field;
    field17: Field;
    field18: Field;
    field19: Field;
    field20: Field;
    field21: Field;
    field22: Field;
    field23: Field;
    field24: Field;
    field28: Field;
    field29: Field;
    field30: Field;
    field31: Field;
    field59: Field;
    field60: Field;
    field110: Field;
    field78: Field;
  };
}

interface PersistentField {
  [key: string]: Field;
}

type ModelOptions = {
  destinationPath?: string;
  asBuffer?: boolean;
};
