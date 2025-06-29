import BGSetter from "@/components/NewTab/BGSetter"
import TimeBlock from "@/components/Blocks/time-block"
import StorageStarter from "@/components/NewTab/storage-starter"
import { DndContext, useDraggable } from "@dnd-kit/core";
import { useState } from "react";

function DraggableTimeBlock({x, y}: {x: number, y: number}) {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({id: "time-block"});
  const grid = 40;
  // Pozycja końcowa + aktualny transform podczas drag
  const tx = (transform ? Math.round(transform.x / grid) * grid : 0) + x;
  const ty = (transform ? Math.round(transform.y / grid) * grid : 0) + y;
  const style = { transform: `translate3d(${tx}px, ${ty}px, 0)` };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      <TimeBlock/>
    </div>
  );
}

export default function NewTab() {
    StorageStarter();
    const grid = 40;
    // Wczytaj pozycję z localStorage lub domyślnie (0,0)
    const getInitialPos = () => {
      try {
        const saved = localStorage.getItem("newTabTimeBlockPos");
        if (saved) return JSON.parse(saved);
      } catch {}
      return {x: 0, y: 0};
    };
    const [pos, setPos] = useState<{x: number, y: number}>(getInitialPos);
    function handleDragEnd(event: any) {
      if (!event.delta) return;
      setPos(pos => {
        const newPos = {
          x: pos.x + Math.round(event.delta.x / grid) * grid,
          y: pos.y + Math.round(event.delta.y / grid) * grid
        };
        localStorage.setItem("newTabTimeBlockPos", JSON.stringify(newPos));
        return newPos;
      });
    }
    return (
        <div className="h-full">
            <BGSetter/>
            <div className="flex justify-center">
                <DndContext onDragEnd={handleDragEnd}>
                  <DraggableTimeBlock x={pos.x} y={pos.y}/>
                </DndContext>
            </div>
        </div>
    )
}