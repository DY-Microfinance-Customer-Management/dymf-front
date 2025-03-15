import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const cookieStore = await cookies();
    const credentials = cookieStore.get('access_token')?.value;

    const searchParams = request.nextUrl.searchParams;
    const loanOfficerId = searchParams.get('loanOfficerId');

    const response = await fetch(`${process.env.API_SERVER_URL}/personnel/loan_officer/${loanOfficerId}`, {
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
    const loanOfficer = data.personnel_id;

    return NextResponse.json({ loanOfficer })
}