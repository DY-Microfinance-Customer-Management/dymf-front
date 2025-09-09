"use client"

import Image from "next/image"

export default function Page() {
    return (
        <div className="flex flex-col justify-center items-center h-screen space-y-6">
            <h1 className="text-4xl font-bold text-gray-700">Welcome to</h1>
            <Image src="/dymf_logo.png" width={300} height={0} alt="DYMF Logo" className="object-contain" priority />
            <h1 className="text-4xl font-semi-bold text-gray-700">Loan Management System</h1>
        </div>
    );
}