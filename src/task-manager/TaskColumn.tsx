
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import TaskDragCard from "./TaskDragCard";
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
name:string
totalElements:number

}

export default function TaskColumn(props:TaskColumnProps) {
  const { id:columnId, items,totalElements,name } = props;

  const { setNodeRef } = useDroppable({
   id: columnId??''
  });
  const tasksIds = useMemo(() => {
    return items?.length > 0 ? items?.map((task) => task?.id) : [];
}, [items]);

  return (
    <SortableContext
      id={columnId}
      items={tasksIds}
      strategy={verticalListSortingStrategy}
    >
      <div ref={setNodeRef} style={containerStyle}>
        {name}--{totalElements}---{items.length}
        <div  className="column">
        {items.map((id) => (
         id?.id ? <TaskDragCard key={id.id} id={id.id} name={id.title} columnId={columnId as never} /> :null
        ))}
        </div>
       
      </div>
    </SortableContext>
  );
}
