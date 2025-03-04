import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
    const cookieStore = await cookies();
    const credentials = cookieStore.get('access_token')?.value;

    const response = await fetch(`${process.env.API_SERVER_URL}/personnel/loan_officer`, {
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
    const loanOfficers = data.data;

    for (const [idx, officer] of loanOfficers.entries()) {
        const personnelId = officer.personnel_id.id;

        const response = await fetch(`${process.env.API_SERVER_URL}/personnel/${personnelId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${credentials}`
            },
        });

        const data = await response.json();
        // console.log(data)
        const officerName = data.name;

        loanOfficers[idx] = { ...officer, name: officerName, personnelId: data.id }
    }

    return NextResponse.json({ loanOfficers })
}