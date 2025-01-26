'use server';

export async function createCustomerAction(_: any, formData: FormData) {
    console.log('image', formData.get('image'));
    console.log('name', formData.get('name'));
    console.log('nrcNo', formData.get('nrcNo'));
    console.log('dateOfBirth', formData.get('dateOfBirth'));
    console.log('gender', formData.get('gender'));
    console.log('phone', formData.get('phone'));
    console.log('email', formData.get('email'));
    console.log('loanType', formData.get('loanType'));
    console.log('cpNo', formData.get('cpNo'));
    console.log('homeAddress', formData.get('homeAddress'));
    console.log('homePostalCode', formData.get('homePostalCode'));
    console.log('officeAddress', formData.get('officeAddress'));
    console.log('officePostalCode', formData.get('officePostalCode'));
    console.log('info1', formData.get('info1'));
    console.log('info2', formData.get('info2'));
    console.log('info3', formData.get('info3'));
    console.log('info4', formData.get('info4'));
    console.log('info5', formData.get('info5'));
}