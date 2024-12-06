import { DragEndEvent, DragOverEvent, DragStartEvent, KeyboardSensor, PointerSensor, UniqueIdentifier, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Dispatch, SetStateAction, useCallback, useRef, useState } from "react";
import { TaskList } from "../types";


type UseTaskDnDProps = {
    taskList:TaskList
    setTaskList:Dispatch<SetStateAction<TaskList>>

}
export const useTaskDnD = ({taskList,setTaskList}:UseTaskDnDProps)=>{

    const [activeId, setActiveId] = useState<UniqueIdentifier | null>();
    const lastActiveId = useRef<string | number | null>(null);

   const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

    const findContainer=useCallback ((id:string | number)=>{
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
      },[])

      const onDragStart=(event:DragStartEvent) =>{
        const { active } = event;
        const { id,data } = active;
    console.log({data:data.current?.cardData??'963'});
    
        setActiveId(id);
      }

      const onDragOver = (event: DragOverEvent)=> {
        const { active, over } = event;

        if(!over){
            return;
        }

        const { id: activeId } = active;
        const { id: overId } = over;

        
      
        // Find the containers
        const activeContainer = findContainer(activeId);
        const overContainer = findContainer(overId);   
        
        if (
            !activeContainer ||
            !overContainer ||
            activeContainer === overContainer
        ) {
            return;
        }
      
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
      const overRectObject = event?.over?.rect;
          let newIndex;
          if (overId in prev) {
            // We're at the root droppable of a container
            newIndex = overItems.length + 1;
          } else {
            const isBelowOverItem =
                    event.over &&
                    overRectObject&&
                    activeTranslated &&
                    activeTranslated.top > overRectObject.top + overRectObject.height;
      
            const modifier = isBelowOverItem ? 1 : 0;
      
            newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
          }
          lastActiveId.current = activeContainer;
          return {
            ...prev,
            [activeContainer]: {
              ...prev[activeContainer],
              content: activeItems.filter((item) => item.id !== activeId),
            },
            [overContainer]: {
              ...prev[overContainer],
              content: [
                ...overItems.slice(0, newIndex),
                activeItems[activeIndex],
                ...overItems.slice(newIndex, overItems.length),
              ],
            },
          };
        });
      }
      
   

      const  onDragEnd=(event:DragEndEvent)=> {
        const { active, over } = event;
        const { id } = active;

        if(!over){
            return;
        }
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
    
        const activeIndex = taskList[activeContainer].content?.findIndex((m) => m?.id === activeId);
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
      
    }
    return{sensors,onDragEnd,onDragStart,onDragOver,activeId}
}