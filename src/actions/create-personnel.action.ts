'use server';

import { EmployeeSchema, serverActionMessage } from '@/types';
// Actions


// Credentials
import { cookies } from 'next/headers';

// Types


// React
import { redirect } from 'next/navigation';

export async function createEmployeeAction(_: any, formData: FormData): Promise<serverActionMessage> {
    const cookieStore = await cookies();
    const credentials = cookieStore.get('access_token')?.value;
    // console.log(credentials);

    if (!credentials) {
        redirect('/login');
    }

    const data: EmployeeSchema = {
        // POST personnel -> 생성되면 return 될때 id 값 받아와서 -> POST personnel/loan_officer/{id} -> id만 보내주면 됨
        isLoanOfficer: false,
        name: formData.get("name")?.toString() ?? '',
        nrc_number: formData.get("nrcNo")?.toString() ?? '',
        birth: formData.get("dateOfBirth") ? new Date(formData.get("dateOfBirth")!.toString()) : new Date(),
        phone_number: formData.get("phone")?.toString() ?? '',
        email: formData.get("email")?.toString() ?? '',
        gender: formData.get("gender") === 'Male' ? 0 : 1,
        home_address: formData.get("homeAddress")?.toString() ?? '',
        home_postal: formData.get("homePostalCode")?.toString() ?? '',
        salary: formData.get("homePostalCode")?.toString() ?? '',
        ssb: formData.get("homePostalCode")?.toString() ?? '',
        incomeTax: formData.get("homePostalCode")?.toString() ?? '',
        bonus: formData.get("homePostalCode")?.toString() ?? '',
        image: formData.get("image")?.toString() ?? '',
    }

    if (formData.has('image')) {
        const file = formData.get('image') as File;
        if (file && file instanceof File) {
            data['image'] = file.name;
        }
    }

    // console.log(JSON.stringify(data));

    const response = await fetch(`${process.env.API_SERVER_URL}/personnel`, {
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
                message: 'Something went wrong :( Please check the values of Employee information.'
            }
        } else if (status === 409) {
            return {
                status: 409,
                message: 'Employee already exists! Please check again.'
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
        message: 'Employee successfully registered.'
    };
}