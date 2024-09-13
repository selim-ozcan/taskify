"use server";

import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { ReorderBoard } from "./schema";
import { auth } from "@clerk/nextjs/server";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const boardId = data.boardId;
  let board;

  try {
    board = await db.board.findFirst({
      where: {
        id: boardId,
      },
    });

    if (!board) {
      return {
        error: "Board Not found",
      };
    }

    const updates = data.data.map(({ id, order }) => {
      return db.list.update({
        where: {
          id,
          boardId,
          board: {
            orgId,
          },
        },
        data: {
          order,
        },
      });
    });

    await Promise.all(updates);
  } catch (error) {
    return {
      error: "Failed to reorder.",
    };
  }

  return { data: board };
};

export const reorderBoard = createSafeAction(ReorderBoard, handler);
