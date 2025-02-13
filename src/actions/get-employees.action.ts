'use server';

// Credentials
import { cookies } from 'next/headers';

// Fetch Employees API
export async function getEmployeesAction(search: string = "", cursor: number = 1) {
    const cookieStore = await cookies();
    const credentials = cookieStore.get("access_token")?.value;

    if (!credentials) {
        throw new Error("Unauthorized");
    }

    console.log('cursor: ',cursor)
    const queryParams = search
        ? `?name=${encodeURIComponent(search)}`
        // : `?cursor=${nextCursor}&order[]=id_DESC`;
        : `?order[]=id_DESC`;

    const response = await fetch(`${process.env.API_SERVER_URL}/personnel${queryParams}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${credentials}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch employees");
    }

    return await response.json();
}