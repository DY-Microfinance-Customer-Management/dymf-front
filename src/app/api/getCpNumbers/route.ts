import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const cookieStore = await cookies();
    const credentials = cookieStore.get('access_token')?.value;

    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get('cursor') ?? '';
    const order = searchParams.getAll('order[]');
    const goBack = searchParams.get('goBack') ?? 'false';
    const take = searchParams.get('take') ?? '20';

    const query = new URLSearchParams();
    if (cursor) query.append('cursor', cursor);
    order.forEach(o => query.append('order[]', o));
    query.append('goBack', goBack);
    query.append('take', take);

    const response = await fetch(`${process.env.API_SERVER_URL}/personnel/cpnumber?${query.toString()}`, {
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