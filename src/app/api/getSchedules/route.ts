import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const cookieStore = await cookies();
    const credentials = cookieStore.get('access_token')?.value;

    const searchParams = request.nextUrl.searchParams;
    const start_date = searchParams.get('start_date');
    const end_date = searchParams.get('end_date');
    const page = searchParams.get('page');

    const response = await fetch(`${process.env.API_SERVER_URL}/loan/schedule?page_size=5&get_start_date=${start_date}&get_last_date=${end_date}&page=${page}`, {
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
    const totalPages = data.total_pages;
    const schedules = data.data;

    return NextResponse.json({ schedules, totalPages });
}
