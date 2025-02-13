import { Employee } from "@/types";

// API 요청 함수
export async function fetchEmployees(page: number, searchQuery: string): Promise<{ employees: Employee[]; totalPages: number }> {
    try {
        const response = await fetch(`${process.env.SERVER_URL}/personal`);
        if (!response.ok) throw new Error("Failed to fetch employees");

        const data = await response.json();
        return {
            employees: data.employees as Employee[],
            totalPages: data.totalPages,
        };
    } catch (error) {
        console.error("Error fetching employees:", error);
        return { employees: [], totalPages: 1 };
    }
}
