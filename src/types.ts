// Auth
export interface loginForm {
	id: string;
	password: string
}

export interface jwtTokens {
	accessToken: string;
	refreshToken: string;
}

export interface serverActionMessage {
	status: number;
	message: string;
}

import { JwtPayload } from "jwt-decode";
export interface JwtData extends JwtPayload {
	role: number;
	userName: string;
	exp: number;
	iat: number;
}

// Enum
export enum LoanTypeEnum {
	special_loan,
	group_loan,
	etc
}
export enum GenderEnum {
	man,
	woman,
	notdefinded
}
export enum WorkingStatusEnum {
	working,
	notworking,
	etc
}
export enum LoanStateEnum {
	inprocess,
	overdue,
	complete
}
export enum RepaymentMethodEnum {
	Equal,
	Equal_Principal,
	Bullet
}
export enum CollateralTypeEnum {
	Property,
	Car
}

// Shemas
export type PostCustomerSchema = Omit<CustomerSchema, 'id'>;
export type PatchCustomerSchema = Omit<CustomerSchema, 'id'>;
export interface GetCustomerSchema extends Omit<CustomerSchema, 'area_number'> { loans: []; cp_number: GetCheckPointSchema; }
export interface CustomerSchema {
	id: number;
	name: string;
	nrc_number: string;
	birth: string;
	phone_number: string;
	father_name: string;
	email?: string;
	gender: GenderEnum;
	area_number: string;
	loan_type: LoanTypeEnum;
	home_address: string;
	home_postal_code: string;
	office_address?: string;
	office_postal_code?: string;
	details?: string[];
	family_information?: string[];
	image?: string;
}

export type PostGuarantorSchema = Omit<GuarantorSchema, 'id'>;
export type PatchGuarantorSchema = Omit<GuarantorSchema, 'id'>;
export interface GetGuarantorSchema extends Omit<GuarantorSchema, 'area_number'> { loans: []; cp_number: GetCheckPointSchema; }
export interface GuarantorSchema {
	id: number;
	name: string;
	nrc_number: string;
	birth: string;
	phone_number: string;
	father_name: string;
	email?: string;
	gender: GenderEnum;
	area_number: string;
	loan_type: LoanTypeEnum;
	home_address: string;
	home_postal_code: string;
	office_address?: string;
	office_postal_code?: string;
	details?: string[];
	image?: string;
}

export type GetCollateralSchema = Omit<CollateralSchema, 'loan'>;
export type PostCollateralSchema = Omit<CollateralSchema, 'id' | 'loan'>;
export interface CollateralSchema {
	id: number;
	type: CollateralTypeEnum;
	name: string;
	detail: string;
	price?: number;
	loan: GetLoanSchema;
}

export type GetCheckPointSchema = Omit<CheckPointSchema, 'customers' | 'guarantors'>;
export type PostCheckPointSchema = Pick<CheckPointSchema, 'area_number' | 'description'>;
export interface CheckPointSchema {
	id: number;
	area_number: string;
	description: string;
	loan_officers: LoanOfficerSchema[];
	customers: CustomerSchema[]
	guarantors: GuarantorSchema[];
}

export type PostEmployeeSchema = Omit<EmployeeSchema, 'id' | 'loan_officer'>;
export type PatchEmployeeSchema = Omit<EmployeeSchema, 'loan_officer'>;
export interface GetEmployeeSchema extends EmployeeSchema { }
export interface EmployeeSchema {
	id: number;
	name: string;
	loan_officer?: LoanOfficerSchema;
	nrc_number: string;
	birth: string;
	phone_number: string;
	address: string;
	email: string;
	gender: GenderEnum;
	salary: number;
	ssb: number;
	income_tax: number;
	bonus?: number;
	working_status: WorkingStatusEnum;
	image?: string;
}

export interface GetLoanOfficerSchema extends LoanOfficerSchema { name: string; }
export interface LoanOfficerSchema {
	id: number;
	personnel_id: EmployeeSchema;
	cp_numbers: CheckPointSchema[];
	loan: GetLoanSchema[];
}

export type GetLoanSchema = Omit<LoanSchema, 'loan_schedules' | 'loan_transactions'>;
export interface GetOneLoanSchema extends LoanSchema { }
export interface LoanSchema {
	id: number;
	loan_state: LoanStateEnum;
	loan_amount: number;
	contract_date: string;
	repayment_cycle: number;
	interest_rate: number;
	number_of_repayment: number;
	repayment_method: RepaymentMethodEnum;
	overdue_status: boolean;
	consulting_info: string[];
	loan_officer: LoanOfficerSchema;
	customer: GetCustomerSchema;
	collaterals: GetCollateralSchema[];
	guarantees: GetGuaranteeSchema[];
	loan_schedules: GetLoanScheduleSchema[];
	loan_transactions?: GetLoanTransactionSchema[];
}

export type GetLoanScheduleSchema = Omit<LoanScheduleSchema, 'loan'>;
export interface LoanScheduleSchema {
	id: number;
	principal: number;
	interest: number;
	loan_state: LoanStateEnum;
	payment_date: string;
	period: number;
	remaining_balance: number;
	total: number;
	loan_payment_status: boolean;
	loan: GetLoanSchema;
}

export interface GetOverdueLoanScheduleSchema extends OverdueLoanScheduleSchema { }
export interface OverdueLoanScheduleSchema {
	id: number;
	principal: number;
	interest: number;
	overdue_interest: number;
	payment_date: string;
	overdue_transaction?: GetOverdueLoanTransactionSchema;
	loan: GetLoanSchema;
}

export type GetOverdueLoanTransactionSchema = Omit<OverdueLoanTransactionSchema, 'overdue_schedule'>;
export interface OverdueLoanTransactionSchema {
	id: number;
	received_principal: number;
	received_interest: number;
	received_overdue_interest: number;
	// overdue_schedule: GetOverdueLoanScheduleSchema;
}

export type GetGuaranteeSchema = Pick<GuaranteeSchema, 'id' | 'guarantor'>;
export interface GuaranteeSchema {
	id: number;
	loan: GetLoanSchema;
	guarantor: { id: number };
}

export type GetLoanTransactionSchema = Omit<LoanTransactionSchema, 'loan'>;
export interface LoanTransactionSchema {
	id: number;
	before_re: number;
	repayment_amount: number;
	loan: GetLoanSchema;
	is_overdue: boolean;
}
