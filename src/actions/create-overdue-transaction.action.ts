'use server';

// Credentials
import { cookies } from 'next/headers';

// Types
import { serverActionMessage } from '@/types';

export async function createOverdueTransactionAction(_: any, formData: FormData): Promise<serverActionMessage> {
    const cookieStore = await cookies();
    const credentials = cookieStore.get('access_token')?.value;

    const loanId = formData.get('loanId');
    const receivedPrincipal = formData.get('receivedPrincipal');
    const receivedInterest = formData.get('receivedInterest');
    const receivedOverdueInterest = formData.get('receivedOverdueInterest');

    if (!receivedPrincipal || !receivedInterest || !receivedOverdueInterest) {
        return {
            status: 500,
            message: 'Please enter all values. If there is no amount, enter 0.'
        }
    }

    const data = {
        received_principal: receivedPrincipal,
        received_interest: receivedInterest,
        received_overdue_interest: receivedOverdueInterest,
        overdue_interest: 0.28
    }

    const response = await fetch(`${process.env.API_SERVER_URL}/loan/overdue_transaction/${loanId}`, {
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

        if (status === 409) {
            return {
                status: status,
                message: 'You cannot enter a value before due date.'
            }
        }

        return {
            status: status,
            message: statusText
        }
    }

    return {
        status: 200,
        message: 'Successfully Saved.'
    };
}