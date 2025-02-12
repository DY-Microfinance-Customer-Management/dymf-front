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

export interface CustomerSchema {
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
	dob: string;
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

export interface Employee {
	name: string;
	nrcNo: string;
	dob: string;
	gender: string;
	phone: string;
	email: string;
	homeAddress: string;
	homePostalCode: string;
	salary: number;
	ssb: number;
	incomeTax: number;
	bonus: number;
}