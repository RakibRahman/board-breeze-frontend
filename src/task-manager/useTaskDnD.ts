import { DragEndEvent, DragOverEvent, DragStartEvent, KeyboardSensor, PointerSensor, UniqueIdentifier, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { TaskList } from "../types";


type UseTaskDnDProps = {
    taskList:TaskList
    setTaskList:Dispatch<SetStateAction<TaskList>>
}

type MoveTaskWithinColumnParams = {
  activeContainer: UniqueIdentifier
  overContainer: UniqueIdentifier
  activeId: string
  overId: UniqueIdentifier
}


type MoveTaskBetweenColumnParams = Omit<MoveTaskWithinColumnParams, 'activeContainer'>

export const useTaskDnD = ({taskList,setTaskList}:UseTaskDnDProps)=>{
  const [activeTask, setActiveTask] = useState<{id:string,title:string} | null>();
  const lastActiveId = useRef<string | number | null>(null);
  const activeContainerId = useRef<UniqueIdentifier | null>(null);
  const activeContainerTaskIndex = useRef<number | null>(null);


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



  const moveTaskBetweenColumn = ({overContainer, activeId, overId}: MoveTaskBetweenColumnParams) => {

    if (!activeContainerId.current) return;

    const activeItems = taskList![activeContainerId.current];
    const overItems = taskList[overContainer];
    let overIndex = overItems.content.findIndex((m) => m.id === overId);
    let activeIndex =       activeContainerTaskIndex.current;
console.log({overIndex});

    if (activeIndex === -1) activeIndex = 0;
    if (overIndex === -1) overIndex = 0;

    console.log
    ({
        activeTaskId: activeId,
        taskTransitionPayload: {
            fromPosition: activeIndex,
            toPosition: overIndex,
            fromColumnId: lastActiveId.current!,
            toColumnId: overContainer,
        },
    });
};


const moveTaskWithinColumn = ({activeContainer, overContainer, activeId, overId}: MoveTaskWithinColumnParams) => {
  const activeIndex = taskList[activeContainer].content?.findIndex((m) => m?.id === activeId);
  const overIndex = taskList[overContainer].content?.findIndex((m) => m?.id === overId);

  if (activeIndex === -1 || overIndex === -1) {
      return;
  }

  if (activeIndex !== overIndex) {
      setTaskList((tasks) => ({
          ...tasks,
          [overContainer]: {
              ...tasks[overContainer],
              content: arrayMove(tasks[overContainer].content, activeIndex, overIndex),
          },
      }));

      console.log({
          activeTaskId: activeId,
          taskTransitionPayload: {
              fromPosition: activeIndex,
              toPosition: overIndex,
              fromColumnId: activeContainer,
              toColumnId: overContainer,
          },
      });
  }
};

    const findContainer = (id:string | number)=> {
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

      function onDragStart(event:DragStartEvent) {
        const { active } = event;
        const { id ,data} = active;
    console.log({data:data.current});
    const findActiveTask = taskList[data?.current?.columnId].content.find((task)=>task.id===id);
    const findActiveTaskIndex = taskList[data?.current?.columnId].content.findIndex((task)=>task.id===id);
    console.log({findActiveTaskIndex});
    activeContainerTaskIndex.current = findActiveTaskIndex
    
        setActiveTask(findActiveTask);

        const activeContainer = findContainer(active.id);
        if (activeContainer){
          activeContainerId.current = activeContainer
        }
      }

      const  onDragOver=(event: DragOverEvent)=> {
        const { active, over } = event;

        if(!over){
          return;
        }

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
              overIndex === overItems.length - 1 && activeTranslated &&
              activeTranslated?.top > over.rect.top + over.rect.height;
      
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
      


      const onDragEnd=(event:DragEndEvent)=> {
        const { active, over } = event;

        if(!over){
          return;
        }
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
    console.log({overContainer,activeContainer:activeContainerId.current});
    
        if (overContainer === activeContainerId.current) {
          moveTaskWithinColumn({
              activeContainer: activeContainer,
              overContainer,
              activeId: active.id as string,
              overId,
          });
      } else if (
          overContainer &&
          activeContainerId.current  &&
          activeContainerId.current  !== overContainer &&
          !taskList[activeContainerId.current].content.some((m) => m.id === overId)
      ) {
        console.log('qwerty');
        
          moveTaskBetweenColumn({overContainer, activeId: active.id as string, overId });
      }
    
        setActiveTask(null);
      activeContainerId.current=null
      activeContainerTaskIndex.current =null

    
    }
    return{sensors,onDragEnd,onDragStart,onDragOver, activeTask}
}