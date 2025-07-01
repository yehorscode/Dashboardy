import { DndContext, useDraggable } from "@dnd-kit/core";
import { useCallback, useEffect, useState } from "react";
import { useBlocks } from "@/blocks-context";

import TimeBlock from "@/components/Blocks/time-block";
import WeatherBlock from "@/components/Blocks/weather-block";
import CalendarBlock from "@/components/Blocks/calendar-block";
import TipsBlock from "@/components/Blocks/tips-block";
import FunIMGSBlock from "@/components/Blocks/funimgs-block";
import BGSetter from "@/components/NewTab/BGSetter";

const BLOCK_TYPES = [
    { type: "time", label: "Clock", component: TimeBlock },
    { type: "weather", label: "Weather", component: WeatherBlock },
    { type: "calendar", label: "Calendar", component: CalendarBlock },
    { type: "tips", label: "Tips", component: TipsBlock },
    { type: "funimgs", label: "FunIMGS", component: FunIMGSBlock },
] as const;

function DraggableBlock({
    id,
    x,
    y,
    grid,
    children,
}: {
    id: string;
    x: number;
    y: number;
    grid: number;
    children: React.ReactNode;
}) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id,
    });

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
    const { blocks, setBlocks } = useBlocks();
    const [grid, setGrid] = useState<number>(() => {
        const stored = localStorage.getItem("newTabGrid");
        return stored ? Number(stored) : 20;
    });
    useEffect(() => {
        
        if (
            sessionStorage.getItem("__darkreader__wasEnabledForHost") === null
        ) {
            sessionStorage.setItem("__darkreader__wasEnabledForHost", "false");
        }
        
        if (localStorage.getItem("debug") === null) {
            localStorage.setItem("debug", "false");
        }
        if (localStorage.getItem("newTabClockStyle") === null) {
            localStorage.setItem("newTabClockStyle", "stylish");
        }
        if (localStorage.getItem("newTabBgOffline") === null) {
            localStorage.setItem("newTabBgOffline", "false");
        }
        if (localStorage.getItem("newTabClockGap") === null) {
            localStorage.setItem("newTabClockGap", "10");
        }
        let blocksJustSet = false;
        if (localStorage.getItem("newTabBlocks") === null) {
            localStorage.setItem(
                "newTabBlocks",
                '[\n {\n  "id": "block-1",\n  "type": "time",\n  "x": 860,\n  "y": 320,\n  "visible": true\n },\n {\n  "id": "block-2",\n  "type": "weather",\n  "x": 340,\n  "y": 120,\n  "visible": true\n },\n {\n  "id": "block-3",\n  "type": "calendar",\n  "x": 320,\n  "y": 480,\n  "visible": true\n },\n {\n  "id": "block-4",\n  "type": "tips",\n  "x": 1040,\n  "y": 680,\n  "visible": true\n }\n]'
            );
            blocksJustSet = true;
        }
        if (localStorage.getItem("newTabWeatherLocation") === null) {
            localStorage.setItem(
                "newTabWeatherLocation",
                '{\n "lat": "52.2319581",\n "lon": "21.0067249",\n "name": "Warszawa, województwo mazowieckie, Polska"\n}'
            );
        }
        if (localStorage.getItem("newTabClockFontSize") === null) {
            localStorage.setItem("newTabClockFontSize", "80");
        }
        if (localStorage.getItem("newTabSecondColor") === null) {
            localStorage.setItem("newTabSecondColor", "green");
        }
        if (localStorage.getItem("newTabCalendarColor") === null) {
            localStorage.setItem(
                "newTabCalendarColor",
                "linear-gradient(90deg, #a51d2d, #c01c28)"
            );
        }
        if (localStorage.getItem("newTabGrid") === null) {
            localStorage.setItem("newTabGrid", "20")
        }
        if (localStorage.getItem("newTabFunIMGSType") === null) {
            localStorage.setItem("newTabFunIMGSType", "cat");
        }
        
        if (blocksJustSet) {
            try {
                const blocksFromStorage = JSON.parse(
                    localStorage.getItem("newTabBlocks") || "[]"
                );
                if (Array.isArray(blocksFromStorage)) {
                    setBlocks(blocksFromStorage);
                }
            } catch {}
        }
        
        const onStorage = (e: StorageEvent) => {
            if (e.key === "newTabGrid") {
                setGrid(e.newValue ? Number(e.newValue) : 20);
            }
        };
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, [setBlocks]);

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
                    const newX = b.x + Math.round(event.delta.x / grid) * grid;
                    let newY = b.y + Math.round(event.delta.y / grid) * grid;
                    newY = Math.max(newY, 20);

                    if (isCollision(prevBlocks, newX, newY, id)) return b;
                    return { ...b, x: newX, y: newY };
                });
            });
        },
        [setBlocks, grid]
    );

    return (
        <BGSetter>
            <DndContext onDragEnd={handleDragEnd}>
                <div className="relative h-screen overflow-hidden">
                    {blocks.map((block) => {
                        const BlockComponent = BLOCK_TYPES.find(
                            (b) => b.type === block.type
                        )?.component;
                        if (!BlockComponent || !block.visible) return null;
                        return (
                            <DraggableBlock
                                key={block.id}
                                id={block.id}
                                x={block.x}
                                y={block.y}
                                grid={grid}
                            >
                                <BlockComponent />
                            </DraggableBlock>
                        );
                    })}
                </div>
            </DndContext>
        </BGSetter>
    );
}
