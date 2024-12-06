import { DndContext, DragOverlay, rectIntersection } from "@dnd-kit/core";
import { useState } from "react";
import { columnData, initialData } from "../data";
import { Column, TaskList } from "../types";
import TaskColumn from "./TaskColumn";
import { useTaskDnD } from "./useTaskDnD";
import { TaskCard } from "./TaskCard";




const TaskManager = () => {
    const [columns, setColumns] = useState<Column>(columnData);
    const [taskList,setTaskList] = useState<TaskList>(initialData);

    const {sensors,onDragEnd,onDragOver,onDragStart,activeTask}=useTaskDnD({taskList,setTaskList})
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
                      <TaskColumn name={col.name} key={col.id} id={col.id} items={taskList[col.id].content} totalElements={taskList[col.id].totalElements} />
                    ))
                }
            
                <DragOverlay dropAnimation={{
                    easing:"ease",
                    duration:200
                }}>{activeTask?.id ? <TaskCard id={activeTask.id} name={activeTask.title} /> : null}</DragOverlay>
              </DndContext>
            </div>
          );

        }
  export default TaskManager;
  