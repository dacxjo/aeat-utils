type Period = '1T' | '2T' | '3T' | '4T';

interface ModelInput {
  exercise: string;
  period: Period;
  version: string;
  devCompanyNIF: string;
}

interface Model111Input extends ModelInput {
  earnedIncomes: {
    [key: string]: string;
  };
  economicEarnings: {
    [key: string]: string;
  };
}

interface Model115Input extends ModelInput {
  retentionsAndIncomes: {
    [key: string]: string;
  };
}

type ModelOptions = {
  destinationPath?: string;
  asBuffer?: boolean;
};
