import { DndContext, useDraggable } from "@dnd-kit/core";
import { useCallback } from "react";
import { useBlocks } from "@/blocks-context";

import TimeBlock from "@/components/Blocks/time-block";
import WeatherBlock from "@/components/Blocks/weather-block";
import CalendarBlock from "@/components/Blocks/calendar-block";
import BGSetter from "@/components/NewTab/BGSetter";
import StorageStarter from "@/components/NewTab/storage-starter";

const BLOCK_TYPES = [
    { type: "time", label: "Clock", component: TimeBlock },
    { type: "weather", label: "Weather", component: WeatherBlock },
    { type: "calendar", label: "Calendar", component: CalendarBlock },
] as const;

function DraggableBlock({
    id,
    x,
    y,
    children,
}: {
    id: string;
    x: number;
    y: number;
    children: React.ReactNode;
}) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id,
    });
    const grid = 20;

    let tx = (transform ? Math.round(transform.x / grid) * grid : 0) + x;
    let ty = (transform ? Math.round(transform.y / grid) * grid : 0) + y;
    ty = Math.max(ty, 20);
    ty = Math.min(ty, window.innerHeight - 20);
    tx = Math.max(tx, 1);
    const style = { transform: `translate3d(${tx}px, ${ty}px, 0)` };
    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className="absolute"
        >
            {children}
        </div>
    );
}

export default function NewTab() {
    StorageStarter();
    const { blocks, setBlocks } = useBlocks();

    function isCollision(
        blocksArr: typeof blocks,
        newX: number,
        newY: number,
        id: string
    ) {
        return blocksArr.some(
            (b) => b.id !== id && b.x === newX && b.y === newY && b.visible
        );
    }

    const handleDragEnd = useCallback(
        (event: any) => {
            if (!event.active || !event.delta) return;
            const id = event.active.id as string;
            setBlocks((prevBlocks) => {
                return prevBlocks.map((b) => {
                    if (b.id !== id) return b;
                    const newX = b.x + Math.round(event.delta.x / 40) * 40;
                    let newY = b.y + Math.round(event.delta.y / 40) * 40;
                    newY = Math.max(newY, 20);

                    if (isCollision(prevBlocks, newX, newY, id)) return b;
                    return { ...b, x: newX, y: newY };
                });
            });
        },
        [setBlocks]
    );

    return (
        <BGSetter>
            <div className="h-full relative">
                <DndContext onDragEnd={handleDragEnd}>
                    {blocks
                        .filter((b) => b.visible)
                        .map((b) => {
                            const BlockComp = BLOCK_TYPES.find(
                                (bt) => bt.type === b.type
                            )?.component;
                            if (!BlockComp) return null;
                            return (
                                <DraggableBlock
                                    key={b.id}
                                    id={b.id}
                                    x={b.x}
                                    y={b.y}
                                >
                                    <BlockComp />
                                </DraggableBlock>
                            );
                        })}
                </DndContext>
            </div>
        </BGSetter>
    );
}
