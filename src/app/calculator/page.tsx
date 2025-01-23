"use client"

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Home() {
  const [principal, setPrincipal] = useState<number>(0);
  const [interestRate, setInterestRate] = useState<number>(0);
  const [repaymentCount, setRepaymentCount] = useState<number>(0);
  const [repaymentCycle, setRepaymentCycle] = useState<number>(0);
  const [schedule, setSchedule] = useState<{ date: string; principal: number; interest: number; total: number; balance: number }[]>([]);

  const calculateDate = (startDate: Date, cycle: number, index: number) => {
    const nextDate = new Date(startDate);
    nextDate.setDate(startDate.getDate() + cycle * index);
    return nextDate.toISOString().split("T")[0];
  };

  const calculateSchedule = () => {
    const result = [];
    const monthlyPrincipal = Math.floor(principal / repaymentCount);
    let remainingBalance = principal;

    for (let i = 1; i <= repaymentCount; i++) {
      const interest = Math.floor((remainingBalance * (interestRate / 100)) / 12);
      const totalPayment = monthlyPrincipal + interest;
      remainingBalance -= monthlyPrincipal;

      result.push({
        date: calculateDate(new Date(), repaymentCycle, i),
        principal: monthlyPrincipal,
        interest: interest,
        total: totalPayment,
        balance: remainingBalance,
      });
    }
    setSchedule(result);
  };

  return (
    <div className="flex flex-col p-10 space-y-8 min-h-screen">
      <div className="flex justify-between space-x-8">
        {/* 입력 섹션 */}
        <Card className="w-1/3 h-[490px]">
          <CardHeader>
            <CardTitle>Loan Calculator</CardTitle>
            <CardDescription>
              Enter the details below to calculate the repayment schedule.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col space-y-1">
                <Label>Principal</Label>
                <Input
                  className="w-full"
                  type="number"
                  value={principal}
                  onChange={(e) => setPrincipal(Number(e.target.value))}
                />
              </div>
              <div className="flex flex-col space-y-1">
                <Label>Interest Rate (%)</Label>
                <Input
                  className="w-full"
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                />
              </div>
              <div className="flex flex-col space-y-1">
                <Label>Number of Repayments</Label>
                <Input
                  className="w-full"
                  type="number"
                  value={repaymentCount}
                  onChange={(e) => setRepaymentCount(Number(e.target.value))}
                />
              </div>
              <div className="flex flex-col space-y-1">
                <Label>Repayment Cycle (days)</Label>
                <Input
                  className="w-full"
                  type="number"
                  value={repaymentCycle}
                  onChange={(e) => setRepaymentCycle(Number(e.target.value))}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={calculateSchedule}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Calculate
            </Button>
          </CardFooter>
        </Card>

        {/* 결과 섹션 */}
        <Card className="w-2/3">
          <CardHeader>
            <CardTitle>Repayment Schedule</CardTitle>
            <CardDescription>View your repayment breakdown below.</CardDescription>
          </CardHeader>
          <CardContent>
            {schedule.length > 0 ? (
              <Table>
                <TableCaption>Your repayment schedule details</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment Date</TableHead>
                    <TableHead>Principal</TableHead>
                    <TableHead>Interest</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Remaining Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schedule.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.date}</TableCell>
                      <TableCell className="text-right">
                        {row.principal.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {row.interest.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {row.total.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {row.balance.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-gray-500">Enter details to calculate the repayment schedule.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}