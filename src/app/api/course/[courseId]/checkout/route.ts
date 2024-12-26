import { db } from "@/db";
import { courseTable, purchaseTable, stripeCustomerTable } from "@/db/schema";
import { stripe } from "@/lib/stripe";
import { auth, currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import Stripe from "stripe";


export async function POST(req: Request, { params }: { params: { courseId: string } }) {
    const courseId = params.courseId
    try {
        const user = await currentUser();
    
        if (!user || !user.id || !user.emailAddresses[0].emailAddress) {
          return new NextResponse("Unautherized", {status: 401});
        }
    
        const course = await db
          .select()
          .from(courseTable)
          .where(
            and(
              eq(courseTable.id, courseId),
              eq(courseTable.userId, user.id),
              eq(courseTable.isPublished, true)
            )
          )
          .then((res) => res[0]);
    
        const coursePurchase = await db
          .select()
          .from(purchaseTable)
          .where(
            and(
              eq(purchaseTable.userId, user.id),
              eq(purchaseTable.courseId, courseId)
            )
          )
          .then((res) => res[0]);
    
        if (coursePurchase) {
          return new NextResponse("Course already purchased", {status: 400});
        }
    
        if (!course) {
          return new NextResponse("Not found", {status: 404});
        }
    
        const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
          {
            quantity: 1,
            price_data: {
              currency: "USD",
              product_data: {
                name: course.title,
                description: course.description!,
                images: [course.imageUrl!],
              },
              unit_amount: Math.round(parseFloat(course.price!) * 100),
            },
          },
        ];
        let stripeCustomer = await db
        .select({stripeCustomerId: stripeCustomerTable.stripeCustomerId})
        .from(stripeCustomerTable)
        .where(eq(stripeCustomerTable.userId, user.id))
        .then((res) => res[0])
    
        if(!stripeCustomer){
            const customer = await stripe.customers.create({
                email: user.emailAddresses[0].emailAddress,
            })
            
            const result = await db
            .insert(stripeCustomerTable)
            .values({
                stripeCustomerId: customer.id,
                userId: user.id
            })
            .returning({stripeCustomerId: stripeCustomerTable.stripeCustomerId})
            stripeCustomer = result[0]
        }
        const session = await stripe.checkout.sessions.create({
            customer: stripeCustomer.stripeCustomerId,
            line_items,
            mode: "payment",
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseId}?success=1`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseId}?canceled=1`,
            metadata: {
                courseId: course.id,
                userId: user.id,
            }
        })
        return NextResponse.json({url: session.url})
      } catch (error) {
        console.log("COURSE_ID_CHECKOUT", error);
        return new NextResponse("Internal server error", {status: 500});
      }
}