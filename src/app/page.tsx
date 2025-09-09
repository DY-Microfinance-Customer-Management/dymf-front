'use client';

// Components
import Image from "next/image";

// React
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Utils
import { delay } from "@/util/delay";

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        delay(3000);
        router.push('/home');
    }, []);

    return (
        <div className="h-screen w-screen flex items-center justify-center">
            <Image src="/dymf_logo.png" alt="DYM Finance Logo" width={500} height={200} priority />
        </div>
    );
}