"use server";

import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { ReorderList } from "./schema";
import { auth } from "@clerk/nextjs/server";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const listId = data.listId;
  let list;

  try {
    list = await db.list.findFirst({
      where: {
        id: listId,
      },
    });

    if (!list) {
      return {
        error: "List Not found",
      };
    }

    const updates = data.data.map(({ id, order }) => {
      return db.card.update({
        where: {
          id,
          listId,
          list: {
            board: {
              orgId,
            },
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

  return { data: list };
};

export const reorderList = createSafeAction(ReorderList, handler);
