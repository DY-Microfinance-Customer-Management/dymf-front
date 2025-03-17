'use server';

// Credentials
import { cookies } from 'next/headers';

// Types
import { serverActionMessage } from '@/types';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function changeScheduleStatusAction(_: any, formData: FormData): Promise<serverActionMessage> {
    const cookieStore = await cookies();
    const credentials = cookieStore.get('access_token')?.value;

    interface selectedScheduleType { id: number; status: boolean }

    const selectedScheduleRaw = formData.get('selectedSchedule');
    let selectedSchedule: selectedScheduleType | null = null;
    selectedSchedule = JSON.parse(selectedScheduleRaw as string) as selectedScheduleType;

    const selectedScheduleId = selectedSchedule.id;
    const selectedScheduleStatus = selectedSchedule.status;

    const data = {
        "loan_payment_status": !selectedScheduleStatus
    }

    const response = await fetch(`${process.env.API_SERVER_URL}/loan/schedule/${selectedScheduleId}`, {
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

    return {
        status: 200,
        message: 'Status successfully changed.'
    };
}