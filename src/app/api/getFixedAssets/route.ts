import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const cookieStore = await cookies();
    const credentials = cookieStore.get('access_token')?.value;

    const searchParams = request.nextUrl.searchParams;
    const nextCursor = searchParams.get('cursor');

    let apiUrl = `${process.env.API_SERVER_URL}/fixedasset`;

    if (nextCursor === "") {
        apiUrl += `?order[]=id_ASC&take=6`;
    } else {
        apiUrl += `?cursor=${nextCursor}`;
    }

    const response = await fetch(apiUrl, {
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
    const assets = data.data.map((asset: any) => ({
        ...asset,
        name: asset.name.split('_')[0]
    }));
    const count = data.count;
    const returnCursor = data.nextCursor;

    return NextResponse.json({ assets, returnCursor, count });
}