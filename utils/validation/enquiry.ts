import { z } from "zod"

/*
 * The enterprise enquiry form.
 *
 * Only a name and a work email are required — this books a call, it does not
 * qualify a lead, and every extra required field is a reason to abandon a form
 * whose whole purpose is to start a conversation. Company and team size are
 * asked because they change who picks up the phone, not because they gate it.
 * **/
export const salesEnquirySchema = z.object({
   full_name: z.string().trim().min(2, "Tell us who to ask for"),
   work_email: z.string().trim().email("Enter a valid email address"),
   phone: z.string().trim().max(40, "That does not look like a phone number").optional(),
   company: z.string().trim().max(200).optional(),
   team_size: z.string().trim().max(40).optional(),
   message: z.string().trim().max(2000, "Keep it under 2000 characters").optional(),
})

export type SalesEnquiryForm = z.infer<typeof salesEnquirySchema>
