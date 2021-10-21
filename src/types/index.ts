export type Period =
  | '1T'
  | '2T'
  | '3T'
  | '4T'
  | '01'
  | '02'
  | '03'
  | '04'
  | '05'
  | '06'
  | '07'
  | '08'
  | '09'
  | '10'
  | '11'
  | '12';
export type DeclarationType = 'I' | 'U' | 'G' | 'N';
export type VatDeclarationType = DeclarationType | 'C' | 'D' | 'V' | 'X';
export type Field = string | number;

export interface Declarant {
  name: string;
  lastname: string;
  nif: string;
  iban: string;
}

export interface ModelInput {
  exercise: string;
  period: Period;
  version: string;
  devCompanyNIF: string;
}

export interface Model111Input extends ModelInput {
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

export interface Model115Input extends Omit<Model111Input, 'fields'> {
  fields: {
    field01: Field;
    field02: Field;
    field03: Field;
  };
}

export interface Model130Input extends Omit<Model111Input, 'fields'> {
  fields: {
    field01: Field;
    field02: Field;
    field05: Field;
    field06: Field;
    field13: Field;
  };
}

export interface Model303Input extends Omit<Model111Input, 'fields' | 'declarationType'> {
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

export interface PersistentField {
  [key: string]: Field;
}

export type ModelOptions = {
  destinationPath?: string;
  asBuffer?: boolean;
};

export enum SpecsName {
  MODEL111 = 'dr111e16v18',
  MODEL115 = 'DR115e15v13',
  MODEL130 = 'DR130e15v12',
  MODEL303 = 'DR303e21v200',
}

export declare function model111(input: Model111Input, options: ModelOptions): Promise<void>;
export declare function model115(input: Model115Input, options: ModelOptions): Promise<void>;
export declare function model130(input: Model130Input, options: ModelOptions): Promise<void>;
export declare function model303(input: Model303Input, options: ModelOptions): Promise<void>;
