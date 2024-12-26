"use client";

import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { Island_Moments } from "next/font/google";
import { useState } from "react";
import toast from "react-hot-toast";

interface CourseEnrollBottonProps {
  courseId: string;
  price: number;
}

export default function CourseEnrollBotton({
  courseId,
  price,
}: CourseEnrollBottonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/course/${courseId}/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error("Something went wrong");
      }
      const { url } = (await res.json()) as { url: string };
      window.location.assign(url);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      size={"sm"}
      className="w-full md:w-auto"
      disabled={isLoading}
    >
      Enroll for {formatPrice(price)}
    </Button>
  );
}
