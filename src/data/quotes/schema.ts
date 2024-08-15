import { z } from "zod"

export const taskSchema = z.object({
  id: z.string().optional(),
  part_name: z.string().optional(),
  status: z.string().optional(),
  label: z.string().optional(),
  priority: z.string().optional(),
  invoice_order: z.string().optional(),
  parts: z.number().optional(),
  total_price: z.number().optional(),
  last_modified_date: z.date().optional(),
  cutting_tech: z.string().optional(),
  bounds_wxl: z.string().optional(),
  material: z.string().optional(),
  image_url: z.string().optional(),
})

export type Task = z.infer<typeof taskSchema>
