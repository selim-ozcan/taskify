import { z } from "zod";

export const ReorderBoard = z.object({
  boardId: z.string(),
  data: z.array(z.object({ id: z.string(), order: z.number() })),
});
