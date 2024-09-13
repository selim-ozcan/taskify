import { z } from "zod";

export const ReorderList = z.object({
  listId: z.string(),
  data: z.array(z.object({ id: z.string(), order: z.number() })),
});
