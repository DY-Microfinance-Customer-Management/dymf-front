'use server';

// Credentials
import { cookies } from 'next/headers';

// Types
import { PostFixedAssetSchema, serverActionMessage } from '@/types';

export async function createFixedAssetAction(_: any, formData: FormData): Promise<serverActionMessage> {
    const cookieStore = await cookies();
    const credentials = cookieStore.get('access_token')?.value;

    const isStraightLineMethod = formData.get("isStraightLineMethod") === 'on' ? false : true;
    const name = `${formData.get("itemName")?.toString() ?? ''}_${formData.get("purchaseDate")?.toString() ?? ''}`

    let data: PostFixedAssetSchema = { name: '', purchase_date: '', price: 0, method_status: true, depreciation_period: 0, depreciation_ratio: 0, };
    if (isStraightLineMethod === false) { // 정률법
        const depreciationRatio = formData.get("depreciationRatio");
        if (!depreciationRatio) {
            return {
                status: 400,
                message: "Depreciation ratio is required for declining balance method.",
            };
        }

        data = {
            name: name,
            purchase_date: formData.get("purchaseDate")?.toString() ?? '',
            price: Number(formData.get("value")) ?? 0,
            method_status: true,
            depreciation_period: Number(formData.get("depreciationPeriod")) ?? 0,
            depreciation_ratio: Number(formData.get("depreciationRatio")),
        }
    } else { // 정액법
        data = {
            name: name,
            purchase_date: formData.get("purchaseDate")?.toString() ?? '',
            price: Number(formData.get("value")) ?? 0,
            method_status: false,
            depreciation_period: Number(formData.get("depreciationPeriod")) ?? 0,
        }
    }
    console.log(data)

    const response = await fetch(`${process.env.API_SERVER_URL}/fixedasset`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${credentials}`
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const status = response.status;
        const statusText = response.statusText;
        const res = await response.json();
        console.log(res)

        return {
            status: status,
            message: statusText
        }
    }

    return {
        status: 200,
        message: 'Fixed Asset successfully registered.'
    };
}