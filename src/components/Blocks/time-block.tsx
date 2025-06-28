import { useEffect, useState } from "react";

export default function TimeBlock() {
    const [time, setTime] = useState(new Date());
    const [secondColor] = useState(localStorage.getItem("newTabSecondColor"))

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    function formatTwoDigits(num: number): string {
        return num < 10 ? `0${num}` : `${num}`;
    }

    return (
        <div className="flex-col text-left w-50">
            <h1 className="text-md">The time is</h1>
            <div className="flex text-5xl">
                <span>{formatTwoDigits(time.getHours())}</span>:
                <span>{formatTwoDigits(time.getMinutes())}</span>:
                <span className={`opacity-80 text-${secondColor}-600`}>{formatTwoDigits(time.getSeconds())}</span>
            </div>
        </div>
    );
}
