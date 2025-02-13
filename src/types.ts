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

export enum Customer_Loan_Type {
    special_loan,
    group_loan,
    etc
}
// Shemas
export interface CustomerSchema {
	name: string;
	nrc_number: string;
	birth: string;
	phone_number: string;
	email?: string;
	gender: 0 | 1;
	area_number: string;
	loan_type: Customer_Loan_Type;
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
	birth: Date;
	phone_number: string;
	email?: string;
	gender: 0 | 1;
	cp_number: string;
	loan_type: string;
	home_address: string;
	home_postal: string;
	office_address?: string;
	office_postal?: string;
	details?: string[];
	image?: string;
}

export interface EmployeeSchema {
	isLoanOfficer: boolean;
	name: string;
	nrc_number: string;
	birth: Date;
	phone_number: string;
	email: string;
	gender: 0 | 1;
	home_address: string;
	home_postal: string;
	salary: string;
	ssb: string;
	incomeTax: string;
	bonus?: string;
	image?: string;
}

export interface CheckPointSchema {
	area_number: string;
	description: string;
}