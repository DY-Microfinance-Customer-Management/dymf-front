'use server';

// Credentials
import { cookies } from 'next/headers';

// Types
import { PostCustomerSchema, GenderEnum, LoanTypeEnum, serverActionMessage } from '@/types';

export async function createCustomerAction(_: any, formData: FormData): Promise<serverActionMessage> {
    const cookieStore = await cookies();
    const credentials = cookieStore.get('access_token')?.value;

    const infos = ['info1', 'info2', 'info3', 'info4', 'info5']
    const family_infos = ['info6', 'info7', 'info8', 'info9', 'info10']
    const data: PostCustomerSchema = {
        name: formData.get("name")?.toString() ?? '',
        nrc_number: formData.get("nrcNo")?.toString() ?? '',
        birth: formData.get("dateOfBirth")?.toString() ?? '',
        phone_number: formData.get("phone")?.toString() ?? '', 
        email: formData.get("email")?.toString() ?? '',
        father_name: formData.get("fatherName")?.toString() ?? '',
        gender: formData.get("gender") === 'Male' ? GenderEnum.man : GenderEnum.woman,
        area_number: formData.get("cpNo")?.toString() ?? '',
        loan_type: formData.get("loanType")?.toString()=== 'Special Loan' ? LoanTypeEnum.special_loan : LoanTypeEnum.group_loan,
        home_address: formData.get("homeAddress")?.toString() ?? '',
        home_postal_code: formData.get("homePostalCode")?.toString() ?? '',
        office_address: formData.get("officeAddress")?.toString() ?? '',
        office_postal_code: formData.get("officePostalCode")?.toString() ?? '',
        details: infos.map((idx) => formData.get(idx)?.toString() ?? ''),
        family_information: family_infos.map((idx) => formData.get(idx)?.toString() ?? ''),
        image: "empty"
    }

    console.log(`Customer Registration Data: ${JSON.stringify(data)}`)

    const file = formData.get('image') as File;
    if (file.size !== 0) {

        if (file && file instanceof File) {
            const response = await fetch(`${process.env.API_SERVER_URL}/common`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${credentials}`
                },
            })
            const responseData = await response.json();
            const image_address = responseData.url;
            
            const extractFileName = (image_address: string): string | null => {
                const regex = /\/([^\/?]+\.jpg)/;
                const match = image_address.match(regex)
                return match ? match[1] : null
            }
            
            const imageName = extractFileName(String(image_address));
            
            if (imageName) {
                data.image = imageName;
                
                await fetch(`${image_address}`, {
                    method: 'PUT',
                    body: file,
                    headers: {
                        'Content-Type': file.type
                    }
                })
            }

        }
    }
    
    const response = await fetch(`${process.env.API_SERVER_URL}/customer`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${credentials}`
        },
        body: JSON.stringify(data), // 1MB 넘어가면 Error
    });

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
        } else if (status === 404) {
            return {
                status: status,
                message: 'Not Found: 404'
            }
        }
    }

    return {
        status: 200,
        message: 'Customer successfully registered.'
    };

    // return {
    //     status: 999,
    //     message: `${JSON.stringify(data)}`
    // }
}