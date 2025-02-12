'use client';

// UI
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Page
import { LoginForm } from "./form"

export default function Page() {
	return (
		<div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
			<div className="w-full max-w-sm">
				<Card>
					<CardHeader>
						<CardTitle className="text-2xl">
							<div>
								{/* img */}
								<h1>DY System Login</h1>
							</div>
						</CardTitle>
						<CardDescription>
							Enter your ID and Password below to login
						</CardDescription>
					</CardHeader>
					<CardContent>
						<LoginForm />
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
