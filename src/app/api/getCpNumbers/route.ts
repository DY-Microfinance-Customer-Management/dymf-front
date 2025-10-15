import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const cookieStore = await cookies();
    const credentials = cookieStore.get('access_token')?.value;

    const searchParams = request.nextUrl.searchParams;
    const nextCursor = searchParams.get('cursor');
    const order = searchParams.getAll('order[]');
    const goBack = searchParams.get('goBack') ?? 'false';
    const take = searchParams.get('take') ?? '1000';

    let apiUrl = `${process.env.API_SERVER_URL}/personnel/cpnumber`;

    if (nextCursor) {
        apiUrl += `?cursor=${encodeURIComponent(nextCursor)}&take=1000`;
    } else {
        const query = new URLSearchParams();
        if (order.length > 0) {
            order.forEach(o => query.append('order[]', o));
        } else {
            query.append('order[]', 'id_ASC');
        }
        query.append('goBack', goBack);
        query.append('take', take);

        apiUrl += `?${query.toString()}`;
    }

    const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${credentials}`
        },
    });

    if (!response.ok) {
        return NextResponse.json({ error: 'Failed to fetch CP numbers' }, { status: response.status });
    }

    const data = await response.json();

    return NextResponse.json({
        cpNumbers: data.data,
        nextCursor: data.nextCursor,
        prevCursor: data.prevCursor,
        count: data.count ?? null
    });
}