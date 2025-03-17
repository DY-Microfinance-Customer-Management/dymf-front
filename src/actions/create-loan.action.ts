'use server';

// Credentials
import { cookies } from 'next/headers';

// Types
import { serverActionMessage, PostCollateralSchema, LoanStateEnum, RepaymentMethodEnum } from "@/types";
import { revalidatePath } from 'next/cache';

export async function createLoanAction(_: any, formData: FormData): Promise<serverActionMessage> {
    const cookieStore = await cookies();
    const credentials = cookieStore.get('access_token')?.value;

    const selectedLoanOfficer = formData.get('loanOfficer');
    if (!selectedLoanOfficer) {
        return {
            status: 400,
            message: 'Please select a Loan Officer.'
        };
    }

    const ensureArray = (key: string) => {
        const values = formData.getAll(key);
        if (values.length === 0 || (values.length === 1 && typeof values[0] === 'string' && !values[0].trim())) {
            formData.set(key, JSON.stringify([]));
        } else {
            formData.set(key, JSON.stringify(values));
        }
    };

    ensureArray("guarantors");
    ensureArray("collaterals");
    ensureArray("consultingInfos");

    const collateralsRaw = formData.get('collaterals');
    let collateralIds: number[] = [];

    if (collateralsRaw) {
        try {
            const parsedCollaterals = JSON.parse(collateralsRaw as string);
            const collaterals: PostCollateralSchema[] = parsedCollaterals.map((item: string) => JSON.parse(item));

            const responses = await Promise.all(
                collaterals.map(async (collateral) => {
                    const collateralData = {
                        name: collateral.name,
                        detail: collateral.detail,
                        collateral_type: collateral.type,
                        price: 0
                    };

                    const response = await fetch(`${process.env.API_SERVER_URL}/collateral`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${credentials}`
                        },
                        body: JSON.stringify(collateralData),
                    });

                    if (!response.ok) {
                        throw new Error(`Failed to create collateral: ${collateral.name}`);
                    }

                    const responseData = await response.json();
                    return responseData.id;
                })
            );

            collateralIds = responses;
        } catch (error) {
            console.error("Collateral creation failed:", error);
            return {
                status: 500,
                message: "Collateral creation failed. Please try again."
            };
        }
    }

    formData.set("collaterals", JSON.stringify(collateralIds));

    const loanOfficerId = formData.get('loanOfficer');
    const customerId = formData.get('customerId');
    const repaymentMethodString = formData.get('repaymentMethod');

    const repaymentMethodEnumValue = (() => {
        switch (repaymentMethodString) {
            case "Equal":
                return RepaymentMethodEnum.Equal;
            case "Equal Principal":
                return RepaymentMethodEnum.Equal_Principal;
            case "Bullet":
                return RepaymentMethodEnum.Bullet;
            default:
                console.error(`Invalid repayment method: ${repaymentMethodString}`);
                return null;
        }
    })();

    if (repaymentMethodEnumValue === null) {
        return {
            status: 400,
            message: "Invalid repayment method. Please select a valid option."
        };
    }

    let consultingInfos = formData.get('consultingInfos');
    let parsedConsultingInfos: string[];

    try {
        parsedConsultingInfos = consultingInfos ? JSON.parse(consultingInfos as string) : [''];
        if (!Array.isArray(parsedConsultingInfos) || parsedConsultingInfos.length === 0) {
            parsedConsultingInfos = [''];
        }
    } catch {
        parsedConsultingInfos = [''];
    }

    const data = {
        loan_amount: Number(formData.get('loanAmount')) || 0,
        contract_date: formData.get('contractDate') ?? new Date().toISOString().split("T")[0],
        repayment_cycle: Number(formData.get('repaymentCycle')) || 0,
        interest_rate: Number(formData.get('interestRate')) / 100 || 0,
        number_of_repayment: Number(formData.get('numberOfRepayment')) || 0,
        repayment_method: repaymentMethodEnumValue,
        consulting_info: parsedConsultingInfos,
        collateral_ids: collateralIds,
        guarantor_ids: JSON.parse(formData.get('guarantors') as string).map((id: string | number) => Number(id)),
    };

    try {
        const response = await fetch(`${process.env.API_SERVER_URL}/loan/${loanOfficerId}/${customerId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${credentials}`
            },
            body: JSON.stringify(data),
        });

        const responseData = await response.json();
        if (!response.ok) {
            if (collateralIds.length > 0) {
                await Promise.all(
                    collateralIds.map(async (collateralId) => {
                        await fetch(`${process.env.API_SERVER_URL}/collateral/${collateralId}`, {
                            method: 'DELETE',
                            headers: {
                                'Authorization': `Bearer ${credentials}`
                            }
                        });
                    })
                );
            }

            return {
                status: response.status,
                message: responseData.message || "Failed to create loan."
            };
        }

        const createdLoanId = responseData.id.toString().padStart(8, '0');
        return {
            status: 200,
            message: `Loan successfully created.\nLoan No.: ${createdLoanId}`
        };
    } catch (error) {
        console.error("Loan creation failed:", error);
        return {
            status: 500,
            message: "Loan creation failed. Please try again."
        };
    }
}