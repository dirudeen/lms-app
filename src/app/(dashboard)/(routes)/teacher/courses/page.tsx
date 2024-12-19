import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/column";

type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

const payments: Payment[] = [
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
  {
    id: "489e1d42",
    amount: 125,
    status: "processing",
    email: "example@gmail.com",
  },
]

 async function getData():Promise<Payment[]> { 
   return new Promise((resolve) => {
      setTimeout(() => {
        resolve(payments)
      }, 1000)
    })
  }

export default async function CoursesPage() {
const data = await getData()
  return (
    <div className="p-6">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
