"use client";

import { ListWithCards } from "@/types";
import ListHeader from "./list-header";
import { ElementRef, useRef, useState } from "react";
import CardForm from "./card-form";
import { cn } from "@/lib/utils";
import CardItem from "./card-item";
import { useAction } from "@/hooks/use-action";
import { reorderList } from "@/actions/reorder-list";
import { toast } from "sonner";

interface ListItemProps {
  data: ListWithCards;
  index: number;
}

function getDragAfterElement(container: any, y: any) {
  const draggableElements = [
    ...container.querySelectorAll(".draggable-card:not(.dragging-card)"),
  ];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

const ListItem = ({ data, index }: ListItemProps) => {
  const [orderedData, setOrderedData] = useState(data.cards);
  const textareaRef = useRef<ElementRef<"textarea">>(null);

  const { execute } = useAction(reorderList, {
    onSuccess: (data) => {
      toast.success("Card reorder successfull");
    },
  });

  const [isEditing, setIsEditing] = useState(false);

  const disableEditing = () => {
    setIsEditing(false);
  };

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      textareaRef.current?.focus();
    });
  };

  const onDragStart = (e: React.DragEvent) => {
    e.currentTarget.parentElement!.classList.add("dragging-list");
    e.dataTransfer.setData("text/plain", data.id);
  };

  const onDragEnd = (e: React.DragEvent) => {
    e.currentTarget.parentElement!.classList.remove("dragging-list");
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const afterElement = getDragAfterElement(e.currentTarget, e.clientY);
    const cardId = document
      .querySelector(".dragging-card")
      ?.getAttribute("data-id");
    const card = orderedData.find((card) => card.id === cardId);
    if (afterElement == null) {
      setOrderedData((prev) => {
        return [...prev.filter((card) => card.id !== cardId), card!];
      });
    } else {
      setOrderedData((prev) => {
        const filtered = prev.filter((card) => card.id !== cardId);
        const afterElementIndex = filtered.findIndex(
          (card) => card.id === afterElement.getAttribute("data-id")
        );
        filtered.splice(afterElementIndex, 0, card!);
        return filtered;
      });
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.stopPropagation();
    const reorderData: any = { listId: data.id, data: [] };

    orderedData.forEach((list, index) =>
      reorderData.data.push({ id: list.id, order: index + 1 })
    );

    execute(reorderData);
  };

  return (
    <li
      data-id={data.id}
      className="shrink-0 h-full w-[272px] select-none draggable-list"
    >
      <div
        draggable
        onDragStart={(e) => onDragStart(e)}
        onDragEnd={(e) => onDragEnd(e)}
        className="w-full rounded-md bg-[#f1f2f4] shadow-md pb-2"
      >
        <ListHeader onAddCard={enableEditing} data={data} />
        <ol
          onDragOver={(e) => onDragOver(e)}
          onDrop={(e) => onDrop(e)}
          className={cn(
            "mx-1 px-1 py-0.5 flex flex-col gap-y-2 ",
            orderedData.length > 0 ? "mt-2" : "mt-0"
          )}
        >
          {orderedData.map((card, index) => {
            return <CardItem index={index} key={card.id} data={card} />;
          })}
        </ol>
        <CardForm
          listId={data.id}
          ref={textareaRef}
          isEditing={isEditing}
          enableEditing={enableEditing}
          disableEditing={disableEditing}
        />
      </div>
    </li>
  );
};

export default ListItem;
