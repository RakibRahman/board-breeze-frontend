import { closestCorners, DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, KeyboardSensor, MeasuringStrategy, PointerSensor, rectIntersection, UniqueIdentifier, useSensor, useSensors } from "@dnd-kit/core";
import { columnData, initialData } from "./data";
import { useRef, useState } from "react";
import { arrayMove, horizontalListSortingStrategy, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import TaskCard, { Item } from "./SortableItem";
import { Column, TaskList } from "./types";
import TaskColumn from "./Column";


const wrapperStyle = {
    display: "flex",
    flexDirection: "row"
  };



const MultiColumnDragAndDrop = () => {
    const [columns, setColumns] = useState<Column>(columnData);
    const [taskList,setTaskList] = useState<TaskList>(initialData);
    const [activeId, setActiveId] = useState<{id:string,title:string} | null>();
    const lastActiveId = useRef<string | number | null>(null);
   const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
          distance: 3,
      },
  }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

    function findContainer(id:string | number) {
        if (id in taskList) {
            return id;
        }

        for (const columnId in taskList) {
            const isTaskFound = taskList[columnId].content?.find(task => task?.id === id);
            if (isTaskFound) {
                return columnId;
            }
        }
        return undefined;
      }

      function handleDragStart(event:DragStartEvent) {
        const { active } = event;
        const { id ,data} = active;
    console.log({data:data.current});
    const findActiveTask = taskList[data?.current?.columnId].content.find((task)=>task.id===id);
        setActiveId(findActiveTask);
      }

      function handleDragOver(event: any) {
        const { active, over } = event;
        const { id: activeId } = active;
        const { id: overId } = over;
      
        // Find the containers
        const activeContainer = findContainer(activeId);
        const overContainer = findContainer(overId);
      
        if (!activeContainer || !overContainer || activeContainer === overContainer) {
          return;
        }
      
        setTaskList((prev) => {
          const activeItems = prev[activeContainer].content;
          const overItems = prev[overContainer].content;
      
          // Find the indexes for the items
          const activeIndex = activeItems.findIndex((item) => item.id === activeId);
          const overIndex = overItems.findIndex((item) => item.id === overId);
      
      const activeTranslated = event.active.rect.current.translated;
          let newIndex;
          if (overId in prev) {
            // We're at the root droppable of a container
            newIndex = overItems.length + 1;
          } else {
            const isBelowLastItem =
              overIndex === overItems.length - 1 &&
              activeTranslated.offsetTop > over.rect.offsetTop + over.rect.height;
      
            const modifier = isBelowLastItem ? 1 : 0;
      
            newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
          }
          lastActiveId.current = activeContainer;
          return {
            ...prev,
            [activeContainer]: {
              ...prev[activeContainer],
              content: activeItems.filter((item) => item.id !== activeId),
              totalElements:prev[activeContainer].totalElements-1
            },
            [overContainer]: {
              ...prev[overContainer],
              content: [
                ...overItems.slice(0, newIndex),
                activeItems[activeIndex],
                ...overItems.slice(newIndex, overItems.length),
              ],
              totalElements:prev[overContainer].totalElements+1
            },
          };
        });
      }
      
   
console.log({taskList});

      function handleDragEnd(event:any) {
        const { active, over } = event;
        const { id } = active;
        const { id: overId } = over;
    
        const activeContainer = findContainer(id);
        const overContainer = findContainer(overId);
    
        if (
          !activeContainer ||
          !overContainer ||
          activeContainer !== overContainer
        ) {
          return;
        }
    
        const activeIndex = taskList[activeContainer].content?.findIndex((m) => m?.id === activeId?.id);
        const overIndex = taskList[overContainer].content?.findIndex((m) => m?.id === overId);
    
        if (activeIndex !== overIndex) {
            setTaskList((tasks) => ({
                ...tasks,
                [overContainer]: {
                    ...tasks[overContainer],
                    content: arrayMove(tasks[overContainer].content, activeIndex, overIndex),
                },
            }));

        }
    
        setActiveId(null);
      console.log({toCOl:activeContainer,fromCOlId:lastActiveId.current,activeIndex,overIndex});
      
    }
    return (
            <div style={{
                display:'flex'
            }}>
              <DndContext
                sensors={sensors}
                collisionDetection={rectIntersection}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
                measuring={{
                  droppable: {
                      strategy: MeasuringStrategy.WhileDragging,
                  },
              }}
              >
                {
                    columns.map((col)=>(
                      <TaskColumn key={col.id} id={col.id} name={col.name} items={taskList[col.id].content} totalElements={taskList[col.id].totalElements} />
                  
                    ))
                }
            
                <DragOverlay>{activeId ? <Item id={activeId.id} name={activeId.title} /> : null}</DragOverlay>
              </DndContext>
            </div>
          );

        }
  export default MultiColumnDragAndDrop;
  