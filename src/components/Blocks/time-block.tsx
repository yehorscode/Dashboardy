import { useEffect, useState } from "react";
import Counter from "../ui/other/Counter/Counter";

export default function TimeBlock() {
    const [time, setTime] = useState(new Date());
    const correctedColours: Record<string, string> = {
        red: "#E7000B",
        blue: "#155DFC",
        green: "#00A53E",
        yellow: "#FDC700",
    };
    const [secondColor, setSecondColor] = useState(() => {
        const color = localStorage.getItem("newTabSecondColor") || "none";
        return color;
    });
    const [clockStyle] = useState(() => {
        const style = localStorage.getItem("newTabClockStyle") || "default";
        return style;
    });
    const [fontSize, setFontSize] = useState(() => {
        const size = localStorage.getItem("newTabClockFontSize");
        return size ? parseInt(size, 10) : 80;
    });
    const [gap, setGap] = useState(() => {
        const gapVal = localStorage.getItem("newTabClockGap");
        return gapVal ? parseInt(gapVal, 10) : 10;
    });

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const poll = setInterval(() => {
            const color = localStorage.getItem("newTabSecondColor") || "none";
            setSecondColor(color);
            const size = localStorage.getItem("newTabClockFontSize");
            setFontSize(size ? parseInt(size, 10) : 80);
            const gapVal = localStorage.getItem("newTabClockGap");
            setGap(gapVal ? parseInt(gapVal, 10) : 10);
        }, 1000);
        return () => clearInterval(poll);
    }, []);

    function formatTwoDigits(num: number): string {
        return num < 10 ? `0${num}` : `${num}`;
    }

    const colorHex =
        correctedColours[secondColor as keyof typeof correctedColours] ||
        "#E7000B";

    return (
        <div className="flex-col text-left w-50">
            <h1 className="text-md">The time is</h1>
            {clockStyle === "stylish" ? (
                <div className="flex" style={{ fontSize: fontSize }}>
                    <Counter
                        value={time.getHours()}
                        places={[10, 1]}
                        fontSize={fontSize}
                        padding={5}
                        gap={gap}
                        textColor="white"
                        fontWeight={900}
                    />
                    <Counter
                        value={time.getMinutes()}
                        places={[10, 1]}
                        fontSize={fontSize}
                        padding={5}
                        gap={gap}
                        textColor="white"
                        fontWeight={900}
                    />
                    <Counter
                        value={time.getSeconds()}
                        places={[10, 1]}
                        fontSize={fontSize}
                        padding={5}
                        gap={gap}
                        textColor={secondColor}
                    />
                </div>
            ) : (
                <div className="flex" style={{ fontSize: fontSize * 0.6 }}>
                    <span>{formatTwoDigits(time.getHours())}</span>:
                    <span>{formatTwoDigits(time.getMinutes())}</span>:
                    <span className="opacity-80" style={{ color: colorHex }}>
                        {formatTwoDigits(time.getSeconds())}
                    </span>
                </div>
            )}
        </div>
    );
}
