'use server';

// Actions
import { serverActionMessage } from '@/types';

// Credentials
import { cookies } from 'next/headers';

// Types
import { EmployeeSchema } from '@/types';

// React
import { redirect } from 'next/navigation';

export async function createEmployeeAction(_: any, formData: FormData): Promise<serverActionMessage> {
    const cookieStore = await cookies();
    const credentials = cookieStore.get('access_token')?.value;
    // console.log(credentials);

    if (!credentials) {
        redirect('/login');
    }

    const isLoanOfficer = formData.get("isLoanOfficer") === 'on' ? true : false;
    // console.log(isLoanOfficer)

    const data: EmployeeSchema = {
        // POST personnel -> 생성되면 return 될때 id 값 받아와서 -> POST personnel/loan_officer/{id} -> id만 보내주면 됨
        name: formData.get("name")?.toString() ?? '',
        nrc_number: formData.get("nrcNo")?.toString() ?? '',
        birth: formData.get("dateOfBirth") ? new Date(formData.get("dateOfBirth")!.toString()) : new Date(),
        phone_number: formData.get("phone")?.toString() ?? '',
        address: formData.get("homeAddress")?.toString() ?? '',
        email: formData.get("email")?.toString() ?? '',
        gender: formData.get("gender") === 'Male' ? 0 : 1,
        salary: Number(formData.get("salary")) ?? 0,
        ssb: Number(formData.get("ssb")) ?? 0,
        income_tax: Number(formData.get("incomeTax")) ?? 0,
        bonus: Number(formData.get("bonus")) ?? 0,
        working_status: 0,
        image: 'test.jpg',
    }

    // if (formData.has('image')) {
    //     const file = formData.get('image') as File;
    //     if (file && file instanceof File) {
    //         data['image'] = file.name;
    //     }
    // }

    // console.log(JSON.stringify(data));

    const response = await fetch(`${process.env.API_SERVER_URL}/personnel`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${credentials}`
        },
        body: JSON.stringify(data),
    });
    const responseData = await response.json();
    const createdId = responseData.id;
    console.log(`personnel fetch response id: ${createdId}`)

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

    if (response.ok && isLoanOfficer) {
        const response = await fetch(`${process.env.API_SERVER_URL}/personnel/loan_officer/${createdId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${credentials}`
            },
        });

        return {
            status: 200,
            message: 'Employee successfully registered.'
        };
    }

    return {
        status: 200,
        message: 'Employee successfully registered.'
    };
}