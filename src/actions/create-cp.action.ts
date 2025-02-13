'use server';

// Credentials
import { cookies } from 'next/headers';

// Types
import { serverActionMessage } from '@/\btypes';
import { redirect } from 'next/navigation';

import { CheckPointSchema } from '@/\btypes';

export async function createEmployeeAction(_: any, formData: FormData): Promise<serverActionMessage> {
    const cookieStore = await cookies();
    const credentials = cookieStore.get('access_token')?.value;
    // console.log(credentials);

    if (!credentials) {
        redirect('/login');
    }

    const data: CheckPointSchema = {
        area_number: formData.get("area_number")?.toString() ?? '',
        description: formData.get("description")?.toString() ?? '',
    }

    // console.log(JSON.stringify(data));

    const response = await fetch(`${process.env.API_SERVER_URL}/personnel/cpnumber`, {
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
                message: 'Something went wrong :( Please check the values of CP No. information.'
            }
        } else if (status === 409) {
            return {
                status: 409,
                message: 'CP No. already exists! Please check again.'
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
        message: 'CP No. successfully registered.'
    };
}