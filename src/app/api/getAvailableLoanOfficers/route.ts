import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const cookieStore = await cookies();
    const credentials = cookieStore.get('access_token')?.value;

    const searchParams = request.nextUrl.searchParams;
    const cpNumber = searchParams.get('cpNumber');

    const response = await fetch(`${process.env.API_SERVER_URL}/personnel/cpnumber/${cpNumber}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${credentials}`
        },
    });
    const data = await response.json();
    const loanOfficerIds = data.loan_officers;

    const availableLoanOfficers: any[] = [];
    for (const idObj of loanOfficerIds) {
        const id = idObj.id;

        const response = await fetch(`${process.env.API_SERVER_URL}/personnel/loan_officer/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${credentials}`
            },
        });

        const data = await response.json();
        availableLoanOfficers.push({ id: data.id, name: data.personnel_id.name });
    }

    if (!response.ok) {
        throw new Error('Failed to fetch Available Loan Officers');
    }

    return NextResponse.json({ availableLoanOfficers: availableLoanOfficers })
}