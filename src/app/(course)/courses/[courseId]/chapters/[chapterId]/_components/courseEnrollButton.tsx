"use client"

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";

interface CourseEnrollBottonProps {
    courseId: string;
    price: number;
}

export default function CourseEnrollBotton({courseId, price}: CourseEnrollBottonProps) {
  return (
    <Button
    size={"sm"}
    className="w-full md:w-auto"
    >
        Enroll for {formatPrice(price)}
    </Button>
  )
}
