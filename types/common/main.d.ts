type Period = '1T' | '2T' | '3T' | '4T';
type DeclarationType = 'I' | 'U' | 'G' | 'N';
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

type ModelOptions = {
  destinationPath?: string;
  asBuffer?: boolean;
};
