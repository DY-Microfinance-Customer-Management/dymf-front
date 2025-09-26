'use server';

// Credentials
import { cookies } from 'next/headers';

// React
import { revalidatePath } from 'next/cache';

// Types
import { PostCheckPointSchema, serverActionMessage } from '@/types';

export async function createCheckPointAction(_: any, formData: FormData): Promise<serverActionMessage> {
    const cookieStore = await cookies();
    const credentials = cookieStore.get('access_token')?.value;

    const data: PostCheckPointSchema = {
        area_number: formData.get("area_number")?.toString() ?? '',
        description: formData.get("description")?.toString() ?? '',
    }

    const response = await fetch(`${process.env.API_SERVER_URL}/personnel/cpnumber`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${credentials}`
        },
        body: JSON.stringify(data),
    });
    
    // console.log(`response; ${await response.text()}`)
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

    revalidatePath('/cp');
    
    return {
        status: 200,
        message: data.area_number,
    };
}