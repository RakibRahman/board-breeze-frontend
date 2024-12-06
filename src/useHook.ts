import { DragEndEvent, DragOverEvent, DragStartEvent, KeyboardSensor, PointerSensor, UniqueIdentifier, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { TaskList } from "./types";



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

  const [activeTask, setActiveTask] = useState<{title:string,id:string} | null>();
  const [clonedItems, setClonedItems] = useState<TaskList | null>(null);
  const [activeContainerId, setActiveContainerId] = useState<UniqueIdentifier | null>(null);
  const lastActiveId = useRef<string | number | null>(null);

  const findContainer = (id: string | number) => {
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

  const moveTaskBetweenColumn = ({overContainer, activeId, overId}: MoveTaskBetweenColumnParams) => {

      if (!activeContainerId) return;

      const activeItems = clonedItems![activeContainerId];
      const overItems = taskList[overContainer];
      let overIndex = overItems.content.findIndex((m) => m.id === overId);
      let activeIndex = activeItems.content.findIndex((m) => m.id === activeId);

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

  const onDragStart = (e: DragStartEvent) => {
      const {active} = e;
      const {id: activeTaskId, data} = active;

      if (activeTaskId) setActiveTask(data.current?.cardData);
      setClonedItems(taskList);

      const activeContainer = findContainer(active.id);
      if (activeContainer) setActiveContainerId(activeContainer);
  };

  const onDragEnd = (e: DragEndEvent) => {
      if (!e.over) return;

      const {active, over} = e;
      const {id} = active;
      const {id: overId} = over;

      const activeContainer = findContainer(id);
      const overContainer = findContainer(overId);

      if (!activeContainer || !overContainer || activeContainer !== overContainer) {
          return;
      }

      if (!activeContainer || overId === null) {
          setActiveTask(null);
          return;
      }

      if (overContainer === activeContainerId) {
          moveTaskWithinColumn({
              activeContainer: activeContainerId!,
              overContainer,
              activeId: active.id as string,
              overId,
          });
      } else if (
          overContainer &&
          activeContainerId &&
          activeContainerId !== overContainer &&
          !taskList[activeContainerId].content.some((m) => m.id === overId)
      ) {
          moveTaskBetweenColumn({overContainer, activeId: active.id as string, overId});
      }

      setActiveTask(null);
      setActiveContainerId(null);
  };

  const onDragOver = (e: DragOverEvent) => {
      if (!e.over) return;
      const {id} = e.active;
      const {id: overId} = e.over;

      const activeContainer = findContainer(id);
      const overContainer = findContainer(overId);

      if (!activeContainer || !overContainer || activeContainer === overContainer) {
          return;
      }

      const activeTranslated = e.active.rect.current.translated;
      const overRectObject = e.over.rect;

      requestAnimationFrame(() => {
          setTaskList((prev) => {
              const activeItems = prev[activeContainer]?.content || [];
              const overItems = prev[overContainer]?.content || [];

              const activeIndex = activeItems.findIndex((task) => task.id === id);
              const overIndex = overItems.findIndex((task) => task.id === overId);

              let newIndex;
              if (overId in prev) {
                  newIndex = overItems.length + 1;
              } else {
                  const isBelowOverItem =
                      e.over &&
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
                      content: prev[activeContainer]?.content?.filter((item) => item?.id !== id),
                      totalElements: prev[activeContainer]?.totalElements - 1,
                  },
                  [overContainer]: {
                      ...prev[overContainer],
                      content: [
                          ...prev[overContainer].content.slice(0, newIndex),
                          prev[activeContainer]?.content[activeIndex],
                          ...prev[overContainer].content.slice(newIndex),
                      ],
                      totalElements: prev[overContainer]?.totalElements + 1,
                  },
              };
          });
      });
  }

    return{sensors,onDragEnd,onDragStart,onDragOver, activeTask}
}