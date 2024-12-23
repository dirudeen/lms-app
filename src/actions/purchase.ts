import { db } from "@/db";
import { purchaseTable } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function getCoursePurchase({courseId}: {courseId: string}) {
    try {
        const { userId } = auth();
        if (!userId) redirect("/");

        const coursePurchase = await db
        .select()
        .from(purchaseTable)
        .where(and(
            eq(purchaseTable.userId, userId),
            eq(purchaseTable.courseId, courseId)
        ))
        .then(res => res[0]);
        return coursePurchase
    } catch (error) {
        console.log(["GET COURSE PURCHASE", error]);
        throw new Error("Failed to get course purchase");
    }
}