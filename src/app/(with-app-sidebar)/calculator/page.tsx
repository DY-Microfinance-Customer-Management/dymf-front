'use client';

// React
import React, { useState } from "react";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Icons
import { ChevronDown } from "lucide-react";

// Loan Calculation
import LoanCalculator from "@/util/loan-calculator";

export default function Home() {
	const [principal, setPrincipal] = useState<number>(0);
	const [interestRate, setInterestRate] = useState<number>(0);
	const [repaymentCount, setRepaymentCount] = useState<number>(0);
	const [repaymentCycle, setRepaymentCycle] = useState<number>(0);
	const [schedule, setSchedule] = useState<any[]>([]);
	const [loanType, setLoanType] = useState('Equal');

	const handleLoanType = (value: string) => {
		setLoanType(value);
	};

	const calculateSchedule = () => {
		if (!principal || !interestRate || !repaymentCount || !repaymentCycle) return;

		let result = [];
		if (loanType === "Equal") {
			result = LoanCalculator.equalPayment(principal, new Date(), repaymentCycle, interestRate / 100, repaymentCount);
		} else if (loanType === "Equal Principal") {
			result = LoanCalculator.equalPrincipalPayment(principal, new Date(), repaymentCycle, interestRate / 100, repaymentCount);
		} else if (loanType === "Bullet") {
			result = LoanCalculator.bulletPayment(principal, new Date(), repaymentCycle, interestRate / 100, repaymentCount);
		}

		setSchedule(result);
	};

	const totalPrincipal = schedule.reduce((sum, row) => sum + row.Principal, 0);
	const totalInterest = schedule.reduce((sum, row) => sum + row.Interest, 0);
	const totalPayment = schedule.reduce((sum, row) => sum + row.Total, 0);

	// Input Tag Handler
	const [principalText, setPrincipalText] = useState('');
	const handlePrincipalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const raw = e.target.value.replace(/,/g, '');
		if (raw === '') {
			setPrincipalText('');
			setPrincipal(0);
			return;
		}

		if (!/^\d*$/.test(raw)) return;

		const number = Number(raw);
		setPrincipalText(number.toLocaleString());
		setPrincipal(number);
	};

	return (
		<div className="flex flex-col p-10 space-y-8 min-h-screen">
			<h1 className="text-3xl font-bold">Loan Calculator</h1>

			<div className="flex justify-between space-x-8">
				<Card className="w-1/3">
					<CardHeader>
						<CardTitle className="text-green-800">Loan Calculator</CardTitle>
						<CardDescription>
							Enter the details below to calculate the repayment schedule.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div className="flex flex-col space-y-1">
								<Label>Principal</Label>
								{/* <Input className="appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" type="number" onChange={(e) => setPrincipal(Number(e.target.value))} /> */}
								<Input
									type="text"
									value={principalText}
									onChange={handlePrincipalChange}
									className="text-right"
								/>
							</div>
							<div className="flex flex-col space-y-1">
								<Label>Interest Rate (%)</Label>
								<Input className="appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" type="number" onChange={(e) => setInterestRate(Number(e.target.value))} />
							</div>
							<div className="flex flex-col space-y-1">
								<Label>Repayment Cycle (days)</Label>
								<Input className="appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" type="number" onChange={(e) => setRepaymentCycle(Number(e.target.value))} />
							</div>
							<div className="flex flex-col space-y-1">
								<Label>Number of Repayments</Label>
								<Input className="appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" type="number" onChange={(e) => setRepaymentCount(Number(e.target.value))} />
							</div>
							<div className="flex flex-col space-y-1">
								<Label>Loan Type</Label>
								<DropdownMenu>
									<input required name="loanType" value={loanType} hidden readOnly />
									<DropdownMenuTrigger asChild>
										<button className="flex items-center justify-between border rounded px-3 py-2 w-full text-left">
											{loanType}
											<ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
										</button>
									</DropdownMenuTrigger>
									<DropdownMenuContent>
										<DropdownMenuItem onClick={() => handleLoanType("Equal")}>Equal</DropdownMenuItem>
										<DropdownMenuItem onClick={() => handleLoanType("Equal Principal")}>Equal Principal</DropdownMenuItem>
										<DropdownMenuItem onClick={() => handleLoanType("Bullet")}>Bullet</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						</div>
					</CardContent>
					<CardFooter>
						<Button onClick={calculateSchedule} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
							Calculate
						</Button>
					</CardFooter>
				</Card>

				<Card className="w-2/3">
					<CardHeader>
						<CardTitle className="text-green-800">Repayment Schedule</CardTitle>
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
											<TableCell>{row.PaymentDate}</TableCell>
											<TableCell className="text-right">{row.Principal.toLocaleString()}</TableCell>
											<TableCell className="text-right">{row.Interest.toLocaleString()}</TableCell>
											<TableCell className="text-right">{row.Total.toLocaleString()}</TableCell>
											<TableCell className="text-right">{typeof row.RemainingBalance === 'number' ? row.RemainingBalance.toLocaleString() : '-'}</TableCell>
										</TableRow>
									))}
									<TableRow className="font-bold border-t">
										<TableCell className="text-center">Total</TableCell>
										<TableCell className="text-right">{totalPrincipal.toLocaleString()}</TableCell>
										<TableCell className="text-right">{totalInterest.toLocaleString()}</TableCell>
										<TableCell className="text-right">{totalPayment.toLocaleString()}</TableCell>
										<TableCell />
									</TableRow>
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
