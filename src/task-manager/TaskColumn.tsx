
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";
import { useMemo } from "react";






type TaskColumnProps = {
  id:string
  columnName:string
  items:{
    title:string,
    id:string,
}[]
}

export default function TaskColumn(props:TaskColumnProps) {
  const { id, items,columnName } = props;

  const { setNodeRef } = useDroppable({
    id
  });
  const tasksIds = useMemo(() => {
    return items?.length > 0 ? items?.map((task) => task?.id) : [];
}, [items]);

  return (
    <SortableContext
      id={id}
      items={tasksIds}
      strategy={verticalListSortingStrategy}
    >
      <div ref={setNodeRef} className="column">
        {columnName}
        {items.map((id) => (
          <TaskCard key={id?.id} id={id?.id} name={id?.title} />
        ))}
      </div>
    </SortableContext>
  );
}
