"use client";

import { ListWithCards } from "@/types";
import ListForm from "./list-form";
import { ReactElement, useEffect, useState } from "react";
import ListItem from "./list-item";
import { useAction } from "@/hooks/use-action";
import { reorderBoard } from "@/actions/reorder-board";
import { toast } from "sonner";

interface ListContainerProps {
  data: ListWithCards[];
  boardId: string;
}

function getDragAfterElement(container: any, x: any) {
  const draggableElements = [
    ...container.querySelectorAll(".draggable-list:not(.dragging-list)"),
  ];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = x - box.left - box.width / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

const ListContainer = ({ data, boardId }: ListContainerProps) => {
  const [orderedData, setOrderedData] = useState(data);
  const { execute } = useAction(reorderBoard, {
    onSuccess: (data) => {
      toast.success("Reorder successfull");
    },
    onError: (error) => {
      console.log(error);
      toast.error("Cannot reorder lists");
    },
  });

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    console.log("babuuu");
    const afterElement = getDragAfterElement(e.currentTarget, e.clientX);
    const listId = document
      .querySelector(".dragging-list")
      ?.getAttribute("data-id");
    const list = orderedData.find((list) => list.id === listId);
    if (afterElement == null) {
      setOrderedData((prev) => {
        return [...prev.filter((list) => list.id !== listId), list!];
      });
    } else {
      setOrderedData((prev) => {
        const filtered = prev.filter((list) => list.id !== listId);
        const afterElementIndex = filtered.findIndex(
          (list) => list.id === afterElement.getAttribute("data-id")
        );
        filtered.splice(afterElementIndex, 0, list!);
        return filtered;
      });
    }
  };

  const onDrop = (e: React.DragEvent) => {
    const reorderData: any = { boardId, data: [] };

    orderedData.forEach((list, index) =>
      reorderData.data.push({ id: list.id, order: index + 1 })
    );

    execute(reorderData);
  };

  return (
    <ol
      className="flex gap-x-3 h-full"
      onDragOver={(e) => onDragOver(e)}
      onDrop={(e) => onDrop(e)}
    >
      {orderedData.map((list, index) => {
        return <ListItem key={list.id} index={index} data={list} />;
      })}
      <ListForm />
      <div className="flex-shrink-0 w-1"></div>
    </ol>
  );
};

export default ListContainer;
