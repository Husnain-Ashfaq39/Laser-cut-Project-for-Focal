import { z } from "zod"

export const taskSchema = z.object({
  id: z.string().optional(),
  part_name: z.string().optional(),
  status: z.string().optional(),
  label: z.string().optional(),
  priority: z.string().optional(),
  invoice_order: z.string().optional(),
  parts: z.array(z.string()).optional(),
  totalPrice: z.number().optional(),
  lastModified: z.string().optional(),
  cuttingTechnology: z.any().optional(),
  bounds_wxl: z.string().optional(),
  material: z.any().optional(),
  image_url: z.string().optional(),
  materialID: z.string().optional(),
  cuttingID: z.string().optional(),
  creditAccount:z.string().optional(),
  name:z.string().optional(),
})

export type Task = z.infer<typeof taskSchema>
