// utils/loan-calculator.ts (Next.js 환경에서 사용 가능하게 수정된 코드)

export class LoanCalculator {
	constructor() { }

	// 반올림 하는 함수
	private roundUpTo100(value: number) {
		return Math.ceil(value / 100) * 100;
	}

	// 원리금 균등상환
	equalPayment(principal: number, contractDate: Date, cycleDays: number, annualInterestRate = 0.28, numPayments: number) {
		const periodInterestRate = (annualInterestRate / 365) * cycleDays;
		let amountPerPeriod = this.roundUpTo100(
			(principal * periodInterestRate * Math.pow(1 + periodInterestRate, numPayments)) /
			(Math.pow(1 + periodInterestRate, numPayments) - 1)
		);

		let totalCalculated = amountPerPeriod * numPayments;
		let schedule: any[] = [];
		let currentDate = new Date(contractDate);
		let remainingPrincipal = principal;
		let totalPrincipalPaid = 0;

		for (let period = 1; period <= numPayments; period++) {
			const interestPayment = this.roundUpTo100(remainingPrincipal * periodInterestRate);
			let principalPayment = this.roundUpTo100(amountPerPeriod - interestPayment);

			totalPrincipalPaid += principalPayment;

			if (period === numPayments) {
				const remainingDiff = this.roundUpTo100(totalCalculated - (principalPayment + interestPayment));
				if (remainingDiff !== 0) {
					principalPayment += remainingDiff;
				}
				amountPerPeriod = principalPayment + interestPayment;
			}

			totalCalculated -= (principalPayment + interestPayment);
			currentDate.setDate(currentDate.getDate() + cycleDays);

			schedule.push({
				Period: period,
				PaymentDate: currentDate.toISOString().split('T')[0],
				Principal: principalPayment,
				Interest: interestPayment,
				Total: this.roundUpTo100(amountPerPeriod),
				RemainingBalance: (period === numPayments) ? 0 : this.roundUpTo100(remainingPrincipal)
			});

			remainingPrincipal -= principalPayment;
		}

		const diff = totalPrincipalPaid - principal;

		if (diff !== 0) {
			schedule[numPayments - 1].Principal -= diff;
			schedule[numPayments - 1].Total = this.roundUpTo100(
				schedule[numPayments - 1].Principal + schedule[numPayments - 1].Interest
			);
		}

		let runningBalance = principal;
		for (let i = 0; i < schedule.length; i++) {
			runningBalance -= schedule[i].Principal;
			schedule[i].RemainingBalance = i === schedule.length - 1 ? 0 : this.roundUpTo100(runningBalance);
		}

		return schedule;
	}

	// 원금 균등상환
	equalPrincipalPayment(principal: number, contractDate: Date, cycleDays: number, annualInterestRate = 0.28, numPayments: number) {
		let principalPayment = this.roundUpTo100(principal / numPayments);
		const periodInterestRate = (annualInterestRate / 365) * cycleDays;

		const schedule: any[] = [];
		let currentDate = new Date(contractDate);
		let remainingPrincipal = principal;

		for (let period = 1; period <= numPayments; period++) {
			const interestPayment = this.roundUpTo100(remainingPrincipal * periodInterestRate);
			let amountPerPeriod = principalPayment + interestPayment;

			if (period === numPayments) {
				principalPayment = this.roundUpTo100(remainingPrincipal);
				amountPerPeriod = principalPayment + interestPayment;
			}

			remainingPrincipal -= principalPayment;
			currentDate.setDate(currentDate.getDate() + cycleDays);

			schedule.push({
				Period: period,
				PaymentDate: currentDate.toISOString().split('T')[0],
				Principal: principalPayment,
				Interest: interestPayment,
				Total: this.roundUpTo100(amountPerPeriod),
				RemainingBalance: (period === numPayments) ? 0 : this.roundUpTo100(remainingPrincipal),
			});
		}

		return schedule;
	}

	// 만기 일시상환
	bulletPayment(principal: number, contractDate: Date, cycleDays: number, annualInterestRate = 0.28, numPayments: number) {
		const periodInterestRate = annualInterestRate / 12; // 월 기준으로 유지

		const schedule: any[] = [];
		let currentDate = new Date(contractDate);
		let remainingPrincipal = principal;

		for (let period = 1; period <= numPayments; period++) {
			const interestPayment = this.roundUpTo100(remainingPrincipal * periodInterestRate);
			let principalPayment = 0;
			let totalPayment = interestPayment;

			if (period === numPayments) {
				principalPayment = this.roundUpTo100(remainingPrincipal);
				totalPayment += principalPayment;
				remainingPrincipal = 0;
			}

			currentDate.setDate(currentDate.getDate() + cycleDays);

			schedule.push({
				Period: period,
				PaymentDate: currentDate.toISOString().split('T')[0],
				Principal: principalPayment,
				Interest: interestPayment,
				Total: this.roundUpTo100(totalPayment),
				RemainingBalance: (period === numPayments) ? 0 : this.roundUpTo100(remainingPrincipal),
			});
		}

		return schedule;
	}

	overdueInterest(amount: number, overdueDays: number, overdueInterestRate: number) {
		return amount * (overdueInterestRate / 365 * overdueDays);
	}
}

export default new LoanCalculator();
