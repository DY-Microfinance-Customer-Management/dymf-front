'use server';

// Credentials
import { cookies } from 'next/headers';

// Types
import { PostEmployeeSchema, GenderEnum, serverActionMessage, GetEmployeeSchema, PatchEmployeeSchema } from '@/types';
import { revalidatePath } from 'next/cache';

export async function createEmployeeAction(_: any, formData: FormData): Promise<serverActionMessage> {
    const cookieStore = await cookies();
    const credentials = cookieStore.get('access_token')?.value;

    const employeeId = formData.get('id');
    
    if (employeeId) {
        const response = await fetch(`${process.env.API_SERVER_URL}/personnel/${employeeId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${credentials}`
            },
        });

        const responseData: GetEmployeeSchema = await response.json();
        const compareData = {
            id: responseData.id,
            name: responseData.name,
            nrc_number: responseData.nrc_number,
            birth: responseData.birth,
            phone_number: responseData.phone_number,
            address: responseData.address,
            email: responseData.email,
            gender: responseData.gender,
            salary: responseData.salary,
            ssb: responseData.ssb,
            income_tax: responseData.income_tax,
            bonus: responseData.bonus,
            image: responseData.image,
            loan_officer: responseData.loan_officer?.id ?? null
        }

        const newData: PatchEmployeeSchema = {
            id: Number(formData.get('id')),
            name: formData.get("name")?.toString() ?? '',
            nrc_number: formData.get("nrcNo")?.toString() ?? '',
            birth: formData.get("dateOfBirth")?.toString() ?? '',
            phone_number: formData.get("phone")?.toString() ?? '',
            address: formData.get("address")?.toString() ?? '',
            email: formData.get("email")?.toString() ?? '',
            gender: formData.get("gender") === 'Male' ? GenderEnum.man : GenderEnum.woman,
            salary: Number(formData.get("salary")) ?? 0,
            ssb: Number(formData.get("ssb")) ?? 0,
            income_tax: Number(formData.get("incomeTax")) ?? 0,
            bonus: Number(formData.get("bonus")) ?? 0,
            working_status: 0,
            image: 'empty',
        }

        const patchData: Partial<PatchEmployeeSchema> = {};
        Object.entries(newData).forEach(([key, value]) => {
            if (value !== (compareData as any)[key]) {
                (patchData as any)[key] = value;
            }
        });

        if (Object.keys(patchData).length === 0) {
            return {
                status: 200,
                message: "No changes detected.",
            };
        }

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
                    patchData.image = imageName;
                    
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

        await fetch(`${process.env.API_SERVER_URL}/personnel/${employeeId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${credentials}`,
            },
            body: JSON.stringify(patchData),
        });
        
        const isLoanOfficer = formData.get("isLoanOfficer") === 'on' ? true : false;
        if (response.ok && compareData.loan_officer === null && isLoanOfficer) {
            const response = await fetch(`${process.env.API_SERVER_URL}/personnel/loan_officer/${employeeId}`, {
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
    
        revalidatePath('/hr');

        return {
            status: 200,
            message: 'Employee successfully updated.'
        };
        
    } else {
        const isLoanOfficer = formData.get("isLoanOfficer") === 'on' ? true : false;

        const data: PostEmployeeSchema = {
            name: formData.get("name")?.toString() ?? '',
            nrc_number: formData.get("nrcNo")?.toString() ?? '',
            birth: formData.get("dateOfBirth")?.toString() ?? '',
            phone_number: formData.get("phone")?.toString() ?? '',
            address: formData.get("address")?.toString() ?? '',
            email: formData.get("email")?.toString() ?? '',
            gender: formData.get("gender") === 'Male' ? GenderEnum.man : GenderEnum.woman,
            salary: Number(formData.get("salary")) ?? 0,
            ssb: Number(formData.get("ssb")) ?? 0,
            income_tax: Number(formData.get("incomeTax")) ?? 0,
            bonus: Number(formData.get("bonus")) ?? 0,
            working_status: 0,
            image: 'empty',
        }
    
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
    
        const response = await fetch(`${process.env.API_SERVER_URL}/personnel`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${credentials}`
            },
            body: JSON.stringify(data),
        });
        const responseData = await response.json();
        console.log(`responseData: ${JSON.stringify(responseData)}`)
        const createdId = responseData.id;
    
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
    
        revalidatePath('/hr');
        
        return {
            status: 200,
            message: 'Employee successfully registered.'
        };



    }

}