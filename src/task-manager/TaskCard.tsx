import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { UniqueIdentifier } from "@dnd-kit/core";

export function Item(props:TaskCardProps) {
  const { id,name } = props;

  const style = {
    width: "100%",
    height:150,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid black",
    margin: "10px 0",
    background: "white",
    color:'black'
  };

  return <div style={style}>{name}</div>;
}

type TaskCardProps={
    id:string | UniqueIdentifier
    name:string
}

export default function TaskCard(props:TaskCardProps) {
    const {id,name} = props;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Item id={props.id} name={name} />
    </div>
  );
}