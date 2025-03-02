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
	username: string;
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

export type PostGuarantorSchema = Omit<GuarantorSchema, 'id'>;
export type PatchGuarantorSchema = Omit<GuarantorSchema, 'id'>;
export interface GetGuarantorSchema extends Omit<GuarantorSchema, 'area_number'> { loans: []; cp_number: string; }
export interface GuarantorSchema {
	id: number;
	name: string;
	nrc_number: string;
	birth: string;
	phone_number: string;
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

export interface GetLoanSchema extends LoanSchema { }
export interface LoanSchema {
	id: number;
	loan_officer: LoanOfficerSchema;
	// loan_schedules: GetLoanScheduleSchema[];
	loan_state: LoanStateEnum;
	loan_amount: number;
	repayment_cycle: number;
	interest_rate: number;
	number_of_repayment: number;
	repayment_method: RepaymentMethodEnum;
	customer: GetCustomerSchema;
	consulting_info?: string[];
	// collaterals: GetCollateralSchema[];
	// guarantees: GetGuaranteeSchema[];
	// loan_transactions: GetLoanTransactionSchema[];
}