import { DndContext, DragOverlay, rectIntersection } from "@dnd-kit/core";
import { useState } from "react";
import { columnData, initialData } from "../data";
import { Column, TaskList } from "../types";
import { Item } from "./TaskCard";
import TaskColumn from "./TaskColumn";
import { useTaskDnD } from "./useTaskDnD";




const TaskManager = () => {
    const [columns, setColumns] = useState<Column>(columnData);
    const [taskList,setTaskList] = useState<TaskList>(initialData);

    const {sensors,onDragEnd,onDragOver,onDragStart,activeId}=useTaskDnD({taskList,setTaskList})
    return (
            <div style={{
                display:'flex'
            }}>
              <DndContext
                sensors={sensors}
                collisionDetection={rectIntersection}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDragEnd={onDragEnd}
              >
                {
                    columns.map((col)=>(
                      <TaskColumn columnName={col.name} key={col.id} id={col.id} items={taskList[col.id].content} />
                    ))
                }
            
                <DragOverlay dropAnimation={{
                    easing:"ease",
                    duration:200
                }}>{activeId ? <Item id={activeId} name="some" /> : null}</DragOverlay>
              </DndContext>
            </div>
          );

        }
  export default TaskManager;
  