'use server';

// Types
import { serverActionMessage } from "@/types";

// Credentials
import { cookies } from 'next/headers';
import { redirect } from "next/navigation";

export async function login(_: any, formData: FormData): Promise<serverActionMessage> {
    const id = formData.get('id');
    const password = formData.get('password');

    const credentials = btoa(`${id}:${password}`);


    // Fetch API 요청
    const response = await fetch(`${process.env.API_SERVER_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${credentials}`
        },
        credentials: 'include',
    });

    console.log(response)

    if (!response.ok) {
        throw new Error('Login Failed! Please try again');
    }

    // const data = await response.json();

    // 'use server'; 때문에 쿠키가 client로 저장되지 않음
    const cookieList = response.headers.getSetCookie().map((v) => v.slice(0, v.indexOf(' ') - 1).split('='));
    cookieList.forEach(async (v) => (await cookies()).set(v[0], decodeURIComponent(v[1])));

    redirect('/home');
}