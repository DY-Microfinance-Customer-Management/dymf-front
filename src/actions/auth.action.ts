'use server';

// Types
import { JwtData, serverActionMessage } from "@/types";
import { jwtDecode } from "jwt-decode";

// Credentials
import { cookies } from 'next/headers';
import { redirect } from "next/navigation";

export async function login(_: any, formData: FormData): Promise<serverActionMessage> {
    const id = formData.get('id');
    const password = formData.get('password');

    const credentials = btoa(`${id}:${password}`);
    
    const response = await fetch(`${process.env.API_SERVER_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${credentials}`
        },
        credentials: 'include',
    });

    // console.log(`response: ${await response.text()}`)
    if (!response.ok) {
        return {
            status: 500,
            message: 'Login Failed! Please try again'
        }
    }

    // 'use server'; 때문에 쿠키가 client로 저장되지 않음
    const cookieList = response.headers.getSetCookie().map((v) => v.slice(0, v.indexOf(' ') - 1).split('='));

    const cookieStore = await cookies();
    for (const cookieInfo of cookieList) {
        const decoded: JwtData = jwtDecode(cookieInfo[1]);
        cookieStore.set({
            name: cookieInfo[0],
            value: decodeURIComponent(cookieInfo[1]),
            expires: new Date((decoded.exp + 9 * 60 * 60) * 1000) // 한국: GMT +9 = 9*60*60
        }); 
    }

    redirect('/home');
}