import { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TaskCard } from "./TaskCard";



type TaskDragCardProps={
    id:string | UniqueIdentifier
    name:string
    columnId?:string | number
}

export default function TaskDragCard(props:TaskDragCardProps) {
    const {id,name,columnId} = props;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,isDragging,
    transition
  } = useSortable({ id: id??'',data: {
    type: 'Task',
    cardData:{id,name},
    columnId
},});

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if(isDragging){
    return <div ref={setNodeRef} style={style} className="drag-placeholder"></div>
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard  id={id} name={name} />
    </div>
  );
}
