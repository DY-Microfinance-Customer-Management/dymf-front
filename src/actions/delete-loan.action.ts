'use server';

// Credentials
import { cookies } from 'next/headers';

// Types
import { serverActionMessage } from '@/types';

export async function deleteLoanAction(_: any, formData: FormData): Promise<serverActionMessage> {
    const cookieStore = await cookies();
    const credentials = cookieStore.get('access_token')?.value;

    const loanId = formData.get('loanId');

    const response = await fetch(`${process.env.API_SERVER_URL}/loan/${loanId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${credentials}`
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        return {
            status: response.status,
            message: errorData?.message || `Failed to delete loan.`,
        };
    }

    return {
        status: 200,
        message: `Loan No.${loanId?.toString().padStart(8, '0')} successfully deleted.`
    };
}
