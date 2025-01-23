import { addMonths, addWeeks, format } from "date-fns";
import { Schedule } from "@/\btypes";

export class LoanCalculator {
  startDate: Date;
  principal: number;
  expirationMonths: number;
  annualInterestRate: number;
  expireDate: Date;
  totalDays: number;

  constructor(
    startDate: Date,
    principal: number,
    expirationMonths: number,
    annualInterestRate = 0.28
  ) {
    this.startDate = startDate;
    this.principal = principal;
    this.expirationMonths = expirationMonths;
    this.annualInterestRate = annualInterestRate;
    this.expireDate = addMonths(startDate, expirationMonths);
    this.totalDays = (this.expireDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
  }

  private getScheduleDetails(cycle: string): { cycleCnt: number; totalPeriod: number } {
    if (cycle === "month") {
      return { cycleCnt: 12, totalPeriod: this.expirationMonths };
    } else if (cycle === "4week") {
      return { cycleCnt: 13, totalPeriod: Math.ceil(this.totalDays / 28) };
    } else if (cycle === "2week") {
      return { cycleCnt: 26, totalPeriod: Math.ceil(this.totalDays / 14) };
    } else if (cycle === "week") {
      return { cycleCnt: 52, totalPeriod: Math.ceil(this.totalDays / 7) };
    } else {
      throw new Error("Invalid cycle");
    }
  }

  equalPayment(cycle: string = "month"): Schedule[] {
    const { cycleCnt, totalPeriod } = this.getScheduleDetails(cycle);
    const periodInterestRate = Math.pow(1 + this.annualInterestRate / cycleCnt, totalPeriod) - 1;
    const amountPerPeriod = Math.round(
      (this.principal * (this.annualInterestRate / cycleCnt) * Math.pow(1 + this.annualInterestRate / cycleCnt, totalPeriod)) /
        periodInterestRate
    );

    let schedule: Schedule[] = [];
    let currentDate = this.startDate;
    let principal = this.principal;
    let totalPrincipalPayment = 0;
    let totalInterestPayment = 0;
    let totalPrincipalAndInterest = 0;

    for (let period = 1; period <= totalPeriod; period++) {
      currentDate = cycle === "month" ? addMonths(currentDate, 1) : addWeeks(currentDate, parseInt(cycle.replace("week", "")) || 1);

      const interestPayment = Math.round(principal * (this.annualInterestRate / cycleCnt));
      const principalPayment = Math.round(amountPerPeriod - interestPayment);
      principal -= principalPayment;

      totalPrincipalPayment += principalPayment;
      totalInterestPayment += interestPayment;
      totalPrincipalAndInterest += amountPerPeriod;

      schedule.push({
        Period: period,
        PaymentDate: format(currentDate, "yyyy-MM-dd (EEEE)"),
        Principal: principalPayment,
        Interest: interestPayment,
        Total: amountPerPeriod,
        RemainingBalance: Math.round(principal),
      });
    }

    schedule.push({
      Period: "Total",
      PaymentDate: "-",
      Principal: totalPrincipalPayment,
      Interest: totalInterestPayment,
      Total: totalPrincipalAndInterest,
      RemainingBalance: "-",
    });

    return schedule;
  }

  equalPrincipalPayment(cycle: string = "month"): Schedule[] {
    const { cycleCnt, totalPeriod } = this.getScheduleDetails(cycle);
    const principalPayment = Math.round(this.principal / totalPeriod);
    const periodInterestRate = this.annualInterestRate / cycleCnt;

    let schedule: Schedule[] = [];
    let currentDate = this.startDate;
    let principal = this.principal;
    let totalPrincipalPayment = 0;
    let totalInterestPayment = 0;
    let totalPrincipalAndInterest = 0;

    for (let period = 1; period <= totalPeriod; period++) {
      currentDate = cycle === "month" ? addMonths(currentDate, 1) : addWeeks(currentDate, parseInt(cycle.replace("week", "")) || 1);

      const interestPayment = Math.round(principal * periodInterestRate);
      const amountPerPeriod = principalPayment + interestPayment;
      principal -= principalPayment;

      totalPrincipalPayment += principalPayment;
      totalInterestPayment += interestPayment;
      totalPrincipalAndInterest += amountPerPeriod;

      schedule.push({
        Period: period,
        PaymentDate: format(currentDate, "yyyy-MM-dd (EEEE)"),
        Principal: principalPayment,
        Interest: interestPayment,
        Total: amountPerPeriod,
        RemainingBalance: Math.round(principal),
      });
    }

    schedule.push({
      Period: "Total",
      PaymentDate: "-",
      Principal: totalPrincipalPayment,
      Interest: totalInterestPayment,
      Total: totalPrincipalAndInterest,
      RemainingBalance: "-",
    });

    return schedule;
  }

  bulletPayment(cycle: string = "month"): Schedule[] {
    const { cycleCnt, totalPeriod } = this.getScheduleDetails(cycle);
    const periodInterestRate = this.annualInterestRate / cycleCnt;

    let schedule: Schedule[] = [];
    let currentDate = this.startDate;
    let totalInterestPayment = 0;
    let totalPrincipalAndInterest = 0;

    for (let period = 1; period <= totalPeriod; period++) {
      currentDate = cycle === "month" ? addMonths(currentDate, 1) : addWeeks(currentDate, parseInt(cycle.replace("week", "")) || 1);

      const interestPayment = Math.round(this.principal * periodInterestRate);
      totalInterestPayment += interestPayment;
      totalPrincipalAndInterest += interestPayment;

      schedule.push({
        Period: period,
        PaymentDate: format(currentDate, "yyyy-MM-dd (EEEE)"),
        Principal: 0,
        Interest: interestPayment,
        Total: interestPayment,
        RemainingBalance: Math.round(this.principal),
      });
    }

    schedule.push({
      Period: "Total",
      PaymentDate: "-",
      Principal: this.principal,
      Interest: totalInterestPayment,
      Total: totalPrincipalAndInterest + this.principal,
      RemainingBalance: "-",
    });

    return schedule;
  }
}