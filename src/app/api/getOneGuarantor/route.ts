import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const cookieStore = await cookies();
    const credentials = cookieStore.get('access_token')?.value;

    const searchParams = request.nextUrl.searchParams;
    const guarantorsRaw = searchParams.get('guarantors');

    if (!guarantorsRaw) {
        return NextResponse.json({ guarantorsData: [] });
    }

    try {
        const guarantorIds = guarantorsRaw.split(",").map(id => Number(id.trim())).filter(id => !isNaN(id));

        if (guarantorIds.length === 0) {
            return NextResponse.json({ guarantorsData: [] });
        }

        const responses = await Promise.all(
            guarantorIds.map(async (id) => {
                const response = await fetch(`${process.env.API_SERVER_URL}/guarantor/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${credentials}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch Guarantor with ID: ${id}`);
                }

                const data = await response.json();
                return data;
            })
        );

        return NextResponse.json({ guarantorsData: responses });
    } catch (error) {
        console.error("Error fetching guarantors:", error);
        return NextResponse.json({ error: "Failed to fetch guarantors" }, { status: 500 });
    }
}