
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import TaskCard from "./SortableItem";
import { useMemo } from "react";




const containerStyle = {
  background: "#f14",
  padding: 10,
  margin: 10,
  flex: 1
};

type TaskColumnProps = {
  id:string
  items:{
    title:string,
    id:string,
}[]
}

export default function TaskColumn(props:TaskColumnProps) {
  const { id, items } = props;

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
      <div ref={setNodeRef} style={containerStyle}>
        {items.map((id) => (
          <TaskCard key={id.id} id={id.id} name={id.title} />
        ))}
      </div>
    </SortableContext>
  );
}
