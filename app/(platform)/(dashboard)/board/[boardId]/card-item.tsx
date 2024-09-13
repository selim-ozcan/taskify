"use client";

import { Card } from "@prisma/client";

interface CardItemProps {
  data: Card;
  index: Number;
}

const CardItem = ({ data, index }: CardItemProps) => {
  const onDragStart = (e: React.DragEvent) => {
    e.currentTarget.classList.add("dragging-card");
    e.dataTransfer.setData("text/plain", data.id);
  };

  const onDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("dragging-card");
  };

  return (
    <div
      data-id={data.id}
      draggable
      onDragStart={(e) => onDragStart(e)}
      onDragEnd={(e) => onDragEnd(e)}
      role="button"
      className="truncate border-2 border-transparent hover:border-black py-2 px-3 text-sm bg-white rounded-md shadow-sm draggable-card"
    >
      {data.title}
    </div>
  );
};

export default CardItem;
