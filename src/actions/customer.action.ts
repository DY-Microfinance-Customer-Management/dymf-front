'use server';

// Credentials
import { cookies } from 'next/headers';

// Types
import { serverActionMessage } from '@/\btypes';
import { redirect } from 'next/navigation';

import { CustomerSchema } from '@/\btypes';

export async function createCustomerAction(_: any, formData: FormData): Promise<serverActionMessage> {
    const cookieStore = await cookies();
    const credentials = cookieStore.get('access_token')?.value;
    // console.log(credentials);

    if (!credentials) {
        redirect('/login');
    }

    const infos = ['info1', 'info2', 'info3', 'info4', 'info5']
    const data: CustomerSchema = {
        name: formData.get("name")?.toString() ?? '',
        nrc_number: formData.get("nrcNo")?.toString() ?? '',
        birth: formData.get("dateOfBirth") ? new Date(formData.get("dateOfBirth")!.toString()) : new Date(),
        phone_number: formData.get("phone")?.toString() ?? '',
        email: formData.get("email")?.toString() ?? '',
        gender: formData.get("gender") === 'Male' ? 0 : 1,
        cp_number: formData.get("cpNo")?.toString() ?? '',
        loan_type: formData.get("loanType")?.toString() ?? '',
        home_address: formData.get("homeAddress")?.toString() ?? '',
        home_postal: formData.get("homePostalCode")?.toString() ?? '',
        office_address: formData.get("officeAddress")?.toString() ?? '',
        office_postal: formData.get("officePostalCode")?.toString() ?? '',
        details: infos.map((idx) => formData.get(idx)?.toString() ?? ''),
    }

    if (formData.has('image')) {
        const file = formData.get('image') as File;
        if (file && file instanceof File) {
            data['image'] = file.name;
        }
    }

    console.log(JSON.stringify(data));

    // const data = {
    //     "name": "James5",
    //     "nrc_number": "98989898",
    //     "birth": "1999/01/01",
    //     "phone_number": "010-2322-2222",
    //     "home_address": "xxx-xxx-xxx",
    //     "email": "example@example.com",
    //     "gender": 0,
    //     "salary": 50000000,
    //     "ssb": 1000000,
    //     "income_tax": 2000000,
    //     "bonus": 3000000,
    //     "customer_Loan_Type": 2,
    //     "home_postal_code": "123-123",
    //     "office_address": "google",
    //     "office_postal_code": "123-456",
    //     "details": "고구마를 좋아함",
    //     "image": "aaa-bbb-ccc-ddd-eee.jpg"
    // }

    const response = await fetch(`${process.env.API_SERVER_URL}/customer`, {
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
                message: 'Something went wrong :( Please check the values of the customer information.'
            }
        } else if (status === 409) {
            return {
                status: 409,
                message: 'Customer already exists! Please check again.'
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
        message: 'Customer successfully registered.'
    };
}