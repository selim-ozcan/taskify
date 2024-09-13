import { z } from "zod";
import { ReorderBoard } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { Board } from "@prisma/client";

export type InputType = z.infer<typeof ReorderBoard>;
export type ReturnType = ActionState<InputType, Board>;
