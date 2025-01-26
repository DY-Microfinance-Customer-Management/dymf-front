'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CounselingInfoTab() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-green-800">Counseling Info</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-40 bg-gray-200 border rounded-lg" />
            </CardContent>
        </Card>
    );
}