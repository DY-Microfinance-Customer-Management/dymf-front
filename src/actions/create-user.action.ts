'use server';

// Credentials
import { cookies } from 'next/headers';

// Types
import { serverActionMessage } from '@/types';

export async function createUserAction(_: any, formData: FormData): Promise<serverActionMessage> {
    const cookieStore = await cookies();
    const credentials = cookieStore.get('access_token')?.value;

    const data = {
        userName: formData.get("username")?.toString() ?? '',
        password: formData.get("password")?.toString() ?? '',
    }

    const response = await fetch(`${process.env.API_SERVER_URL}/auth/create/user`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${credentials}`
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const status = response.status;
        const statusText = response.statusText;

        if (status === 400) {
            return {
                status: status,
                message: 'Something went wrong :( Please check the values of the user information.'
            }
        } else if (status === 409) {
            return {
                status: status,
                message: 'User already exists! Please check again.'
            }
        } else if (status === 401 || 403) {
            return {
                status: status,
                message: 'Unauthorized request. Please Login again.'
            }
        } else if (status === 404) {
            return {
                status: status,
                message: 'Not Found: 404'
            }
        } else {
            return {
                status: status,
                message: statusText
            }
        }
    }

    return {
        status: 200,
        message: 'User successfully registered.'
    };
}