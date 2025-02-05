'use server';

export async function createLoanAction(_: any, formData: FormData) {
    console.log('loanNumber: ', formData.get('loanNumber'));
}