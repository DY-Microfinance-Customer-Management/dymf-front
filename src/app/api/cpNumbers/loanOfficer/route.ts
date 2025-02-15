import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest
) {
    const cookieStore = await cookies();
    const credentials = cookieStore.get('access_token')?.value;

    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    const response = await fetch(`${process.env.API_SERVER_URL}/personnel/cpnumber/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${credentials}`
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch Loan Officers for CP No.: ${id}`);
    }

    const data = await response.json();
    const loanOfficers = data.data;

    return NextResponse.json({ loanOfficers })
}