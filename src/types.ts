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

export interface FetchedCheckPoint {
	id: number;
	area_number: string;
	description: string;
	loan_officers: string[];
}

// Shemas
export enum LoanType {
    special_loan,
    group_loan,
    etc
}
export enum Gender {
    man,
    woman,
    notdefinded
}
export interface CustomerSchema {
	name: string;
	nrc_number: string;
	birth: string;
	phone_number: string;
	email?: string;
	gender: Gender;
	area_number: string;
	loan_type: LoanType;
	home_address: string;
	home_postal_code: string;
	office_address?: string;
	office_postal_code?: string;
	details?: string[];
	image?: string;
}

export interface GuarantorSchema {
	name: string;
	nrc_number: string;
	birth: string;
	phone_number: string;
	email?: string;
	gender: Gender;
	area_number: string;
	loan_type: LoanType;
	home_address: string;
	home_postal_code: string;
	office_address?: string;
	office_postal_code?: string;
	details?: string[];
	image?: string;
}

export interface EmployeeSchema {
	name: string;
	nrc_number: string;
	birth: Date;
	phone_number: string;
	email: string;
	gender: 0 | 1;
	address: string;
	salary: number;
	ssb: number;
	income_tax: number;
	bonus?: number;
	working_status: 0 | 1;
	image?: string;
}

export interface CheckPointSchema {
	area_number: string;
	description?: string;
}