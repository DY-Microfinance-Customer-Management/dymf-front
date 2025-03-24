'use server';

// Credentials
import { cookies } from 'next/headers';

// Types
import { GetGuarantorSchema, PatchGuarantorSchema, GenderEnum, LoanTypeEnum, serverActionMessage } from '@/types';

// React
import { revalidatePath } from 'next/cache';

export async function updateGuarantorAction(_: any, formData: FormData): Promise<serverActionMessage> {
    const cookieStore = await cookies();
    const credentials = cookieStore.get('access_token')?.value;

    const guarantorId = formData.get('id');

    const response = await fetch(`${process.env.API_SERVER_URL}/guarantor/${guarantorId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${credentials}`
        },
    });

    const responseData: GetGuarantorSchema = await response.json();
    const compareData = {
        id: responseData.id,
        name: responseData.name,
        nrc_number: responseData.nrc_number,
        birth: responseData.birth,
        phone_number: responseData.phone_number,
        email: responseData.email,
        father_name: responseData.father_name,
        gender: responseData.gender,
        area_number: responseData.cp_number,
        loan_type: responseData.loan_type,
        home_address: responseData.home_address,
        home_postal_code: responseData.home_postal_code,
        office_address: responseData.office_address,
        office_postal_code: responseData.office_postal_code,
        details: responseData.details,
        image: responseData.image,
    }

    const infos = ['info1', 'info2', 'info3', 'info4', 'info5']
    const newData: PatchGuarantorSchema = {
        name: formData.get("name")?.toString() ?? '',
        nrc_number: formData.get("nrcNo")?.toString() ?? '',
        birth: formData.get("dateOfBirth")?.toString() ?? '',
        phone_number: formData.get("phone")?.toString() ?? '',
        email: formData.get("email")?.toString() ?? '',
        father_name: formData.get("fatherName")?.toString() ?? '',
        gender: formData.get("gender") === 'Male' ? GenderEnum.man : GenderEnum.woman,
        area_number: formData.get("cpNo")?.toString() ?? '',
        loan_type: formData.get("loanType")?.toString() === 'Special Loan' ? LoanTypeEnum.special_loan : LoanTypeEnum.group_loan,
        home_address: formData.get("homeAddress")?.toString() ?? '',
        home_postal_code: formData.get("homePostalCode")?.toString() ?? '',
        office_address: formData.get("officeAddress")?.toString() ?? '',
        office_postal_code: formData.get("officePostalCode")?.toString() ?? '',
        details: infos.map((idx) => formData.get(idx)?.toString() ?? ''),
        image: "empty"
    }

    const patchData: Partial<PatchGuarantorSchema> = {};
    Object.entries(newData).forEach(([key, value]) => {
        if (key === "details") {
            const oldDetails = compareData.details ?? [];
            const newDetails = value as string[];

            if (JSON.stringify(oldDetails) !== JSON.stringify(newDetails)) {
                patchData.details = newDetails;
            }
        } else if (value !== (compareData as any)[key]) {
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

    await fetch(`${process.env.API_SERVER_URL}/guarantor/${guarantorId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${credentials}`,
        },
        body: JSON.stringify(patchData),
    });

    revalidatePath('/search/guarantor');

    return {
        status: 200,
        message: 'Guarantor successfully updated.'
    };
}
