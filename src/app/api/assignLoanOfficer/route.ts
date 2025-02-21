import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const cookieStore = await cookies();
    const credentials = cookieStore.get('access_token')?.value;

    const searchParams = request.nextUrl.searchParams;
    const cpNumber = searchParams.get('cpNumber');
    const assignData = JSON.parse(searchParams.get('data') || '[]').map((item: { id: number }) => item.id);
    
    const data = {
        'loan_officiersId': assignData,
    }

    const response = await fetch(`${process.env.API_SERVER_URL}/personnel/assign/${cpNumber}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${credentials}`
        },
        body: JSON.stringify(data)
    });
    const res = await response.json();

    if (!response.ok) {
        throw new Error('Failed to fetch CP numbers');
    }

    if (response.ok) {
        revalidatePath('/cp');
    }

    return NextResponse.json({ status: response.status, message: response.statusText })
}