import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const cookieStore = await cookies();
    const credentials = cookieStore.get('access_token')?.value;

    const searchParams = request.nextUrl.searchParams;
    const start_date = searchParams.get('start_date');
    const end_date = searchParams.get('end_date');

    const response = await fetch(`${process.env.API_SERVER_URL}/loan/schedule?order=id_ASC&get_start_date=${start_date}&get_last_date=${end_date}&take=1000`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${credentials}`
        },
    });

    if (!response.ok) {
        return NextResponse.json(null);
    }

    const data = await response.json();
    let schedules = data.data;

    schedules.sort((a: any, b: any) => {
        const dateA = new Date(a.payment_date).getTime();
        const dateB = new Date(b.payment_date).getTime();

        if (dateA !== dateB) {
            return dateA - dateB;
        }
        return a.id - b.id;
    });

    return NextResponse.json({ schedules });
}