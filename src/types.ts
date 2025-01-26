export interface Schedule {
  Period: number;
  PaymentDate: string;
  Principal: number;
  Interest: number;
  Total: number;
  RemainingBalance: number;
}

export interface Customer {
  name: string;
  nrcNo: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  email: string;
  loanType: string;
  cpNo: string;
  homeAddress: string;
  homePostalCode: string;
  officeAddress: string;
  officePostalCode: string;
  info: Record<string, string>;
};