'use server';

// Credentials
import { cookies } from 'next/headers';

// Types
import { serverActionMessage } from '@/types';

export async function changeLoan2OverdueAction(_: any, formData: FormData): Promise<serverActionMessage> {
    const cookieStore = await cookies();
    const credentials = cookieStore.get('access_token')?.value;

    const selectedLoanId = formData.get('selectedLoanId');
    const data = {
        overdue_status: true
    }

    const response = await fetch(`${process.env.API_SERVER_URL}/loan/overdue/${selectedLoanId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${credentials}`
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const status = response.status;
        const statusText = response.statusText;

        return {
            status: status,
            message: statusText
        }
    }

    const data2 = {
        overdue_interest_rate: 0.28
    }

    const response2 = await fetch(`${process.env.API_SERVER_URL}/loan/overdue_schedule/${selectedLoanId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${credentials}`
        },
        body: JSON.stringify(data2),
    });

    if (!response2.ok) {
        const status = response2.status;
        const statusText = response2.statusText;

        return {
            status: status,
            message: statusText
        }
    }

    const responseData = await response2.json();
    const generatedId = responseData?.id;

    return {
        status: 200,
        message: 'Status successfully changed.'
    };
}