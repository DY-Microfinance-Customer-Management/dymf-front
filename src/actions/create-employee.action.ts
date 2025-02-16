'use server';

// Credentials
import { cookies } from 'next/headers';

// Types
import { EmployeeSchema, serverActionMessage } from '@/types';

export async function createEmployeeAction(_: any, formData: FormData): Promise<serverActionMessage> {
    const cookieStore = await cookies();
    const credentials = cookieStore.get('access_token')?.value;
    // console.log(credentials);

    const isLoanOfficer = formData.get("isLoanOfficer") === 'on' ? true : false;
    // console.log(isLoanOfficer)

    const data: EmployeeSchema = {
        // POST personnel -> 생성되면 return 될때 id 값 받아와서 -> POST personnel/loan_officer/{id} -> id만 보내주면 됨
        name: formData.get("name")?.toString() ?? '',
        nrc_number: formData.get("nrcNo")?.toString() ?? '',
        birth: formData.get("dateOfBirth") ? new Date(formData.get("dateOfBirth")!.toString()) : new Date(),
        phone_number: formData.get("phone")?.toString() ?? '',
        address: formData.get("homeAddress")?.toString() ?? '',
        email: formData.get("email")?.toString() ?? '',
        gender: formData.get("gender") === 'Male' ? 0 : 1,
        salary: Number(formData.get("salary")) ?? 0,
        ssb: Number(formData.get("ssb")) ?? 0,
        income_tax: Number(formData.get("incomeTax")) ?? 0,
        bonus: Number(formData.get("bonus")) ?? 0,
        working_status: 0,
        image: 'empty',
    }

    // image 안들어가면 s3 에러 뜸 - Postman 참조
    // 로직 변경 create customer action / create guarantor action - TODO
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

    console.log(`Fetch Data: ${JSON.stringify(data)}`)
    const response = await fetch(`${process.env.API_SERVER_URL}/personnel`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${credentials}`
        },
        body: JSON.stringify(data),
    });
    const responseData = await response.json();
    console.log(`responseData: ${responseData}`)
    const createdId = responseData.id;
    console.log(`personnel fetch response id: ${createdId}`)

    if (!response.ok) {
        const status = response.status;
        
        if (status === 400) {
            return {
                status: 400,
                message: 'Something went wrong :( Please check the values of Employee information.'
            }
        } else if (status === 409) {
            return {
                status: 409,
                message: 'Employee already exists! Please check again.'
            }
        } else if (status === 401 || 403) {
            return {
                status: status,
                message: 'Unauthorized request. Please Login again.'
            }
        }
    }

    if (response.ok && isLoanOfficer) {
        const response = await fetch(`${process.env.API_SERVER_URL}/personnel/loan_officer/${createdId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${credentials}`
            },
        });

        if (!response.ok) {
            return {
                status: 200,
                message: 'Employee successfully registered.\nBut Loan Officer has not been assigned successfully. Please check in the HR Search Page.'
            };
        }
    }

    return {
        status: 200,
        message: 'Employee successfully registered.'
    };
}