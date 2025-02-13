'use server';

import { Customer_Loan_Type, CustomerSchema, serverActionMessage } from '@/types';
// Credentials
import { cookies } from 'next/headers';

// Types

import { redirect } from 'next/navigation';



export async function createCustomerAction(_: any, formData: FormData): Promise<serverActionMessage> {
    const cookieStore = await cookies();
    const credentials = cookieStore.get('access_token')?.value;

    if (!credentials) {
        redirect('/login');
    }

    // 사진 있나 확인
    // 있으면: url 요청 -> uuid를 const imageName
    // 없으면: 그냥 넘어가
    
    const infos = ['info1', 'info2', 'info3', 'info4', 'info5']
    const data: CustomerSchema = {
        name: formData.get("name")?.toString() ?? '',
        nrc_number: formData.get("nrcNo")?.toString() ?? '',
        birth: formData.get("dateOfBirth")?.toString() ?? '',
        phone_number: formData.get("phone")?.toString() ?? '', 
        email: formData.get("email")?.toString() ?? '',
        gender: formData.get("gender") === 'Male' ? 0 : 1,
        // cp_number: formData.get("cpNo")?.toString() ?? '',
        area_number: 'A123',
        loan_type: formData.get("loanType")?.toString()=== 'Special Loan' ? Customer_Loan_Type.special_loan : Customer_Loan_Type.group_loan,
        home_address: formData.get("homeAddress")?.toString() ?? '',
        home_postal_code: formData.get("homePostalCode")?.toString() ?? '',
        office_address: formData.get("officeAddress")?.toString() ?? '',
        office_postal_code: formData.get("officePostalCode")?.toString() ?? '',
        details: infos.map((idx) => formData.get(idx)?.toString() ?? ''),
        image: "undefined"
    }


    if (formData.has('image')) {
        const file = formData.get('image') as File;
        if (file && file instanceof File) {
            const image_address = await fetch(`${process.env.API_SERVER_URL}/common`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${credentials}`
                },
            })

            console.log(image_address.json())

            const extractFileName  = (image_address: string): string | null => {
                const regex = /\/([^\/?]+\.jpg)/;
                const match = image_address.match(regex)
                return match ? match[1] : null
            }

            const imageName = extractFileName(String(image_address));
            // console.log("image_address:", image_address.json())

            if (imageName) {
                data.image = imageName;

                const response1 = await fetch(`${image_address}`, {
                    method: 'PUT',
                    body: file,
                    headers: {
                        'Content-Type': file.type
                    }
                })

                console.log("response1:", response1.statusText)
            }
            console.log("imageName:", imageName)

        }
    }

    console.log(JSON.stringify(data));

    const response = await fetch(`${process.env.API_SERVER_URL}/customer`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${credentials}`
        },
        body: JSON.stringify(data),
    });

    console.log(response.statusText)

    if (!response.ok) {
        const status = response.status;
        
        if (status === 400) {
            return {
                status: 400,
                message: 'Something went wrong :( Please check the values of the customer information.'
            }
        } else if (status === 409) {
            return {
                status: 409,
                message: 'Customer already exists! Please check again.'
            }
        } else if (status === 401 || 403) {
            return {
                status: status,
                message: 'Unauthorized request. Please Login again.'
            }
        }
    }

    return {
        status: 200,
        message: 'Customer successfully registered.'
        // presignedURL에 이미지 전송
    };
}