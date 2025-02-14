'use server';

// Credentials
import { cookies } from 'next/headers';

// Types
import { GuarantorSchema, Gender, LoanType, serverActionMessage } from '@/types';

export async function createGuarantorAction(_: any, formData: FormData): Promise<serverActionMessage> {
    const cookieStore = await cookies();
    const credentials = cookieStore.get('access_token')?.value;

    const infos = ['info1', 'info2', 'info3', 'info4', 'info5']
    const data: GuarantorSchema = {
        name: formData.get("name")?.toString() ?? '',
        nrc_number: formData.get("nrcNo")?.toString() ?? '',
        birth: formData.get("dateOfBirth")?.toString() ?? '',
        phone_number: formData.get("phone")?.toString() ?? '', 
        email: formData.get("email")?.toString() ?? '',
        gender: formData.get("gender") === 'Male' ? Gender.man : Gender.woman,
        // area_number: formData.get("cpNo")?.toString() ?? '',
        area_number: 'A123',
        loan_type: formData.get("loanType")?.toString()=== 'Special Loan' ? CustomerLoanType.special_loan : CustomerLoanType.group_loan,
        home_address: formData.get("homeAddress")?.toString() ?? '',
        home_postal_code: formData.get("homePostalCode")?.toString() ?? '',
        office_address: formData.get("officeAddress")?.toString() ?? '',
        office_postal_code: formData.get("officePostalCode")?.toString() ?? '',
        details: infos.map((idx) => formData.get(idx)?.toString() ?? ''),
        image: "undefined"
    }

    if (formData.has('image')) {
        const file = formData.get('image') as File;
        if (file && file instanceof File) {
            data['image'] = file.name;
        }
    }

    // console.log(JSON.stringify(data));

    const response = await fetch(`${process.env.API_SERVER_URL}/guarantor`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${credentials}`
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const status = response.status;
        
        if (status === 400) {
            return {
                status: 400,
                message: 'Something went wrong :( Please check the values of the guarantor information.'
            }
        } else if (status === 409) {
            return {
                status: 409,
                message: 'Guarantor already exists! Please check again.'
            }
        } else if (status === 401 || 403) {
            return {
                status: status,
                message: 'Unauthorized request. Please Login again.'
            }
        }
    }

    return {
        status: 200,
        message: 'Guarantor successfully registered.'
    };
}