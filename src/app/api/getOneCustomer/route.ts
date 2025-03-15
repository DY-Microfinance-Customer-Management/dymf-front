import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const cookieStore = await cookies();
    const credentials = cookieStore.get('access_token')?.value;

    const searchParams = request.nextUrl.searchParams;
    const customerId = searchParams.get('customerId');

    const response = await fetch(`${process.env.API_SERVER_URL}/customer/${customerId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${credentials}`
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch All Loan Officers');
    }

    const data = await response.json();
    const customerData = data;

    return NextResponse.json({ customerData })
}