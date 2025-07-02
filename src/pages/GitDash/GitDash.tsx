import { useEffect, useState } from "react";
import GitHubCalendar from "react-github-calendar";
import { toast } from "sonner";
import TimeBlock from "@/components/Blocks/time-block";

export default function GitDash() {
    const [githubUsername] = useState<string>(
        localStorage.getItem("githubUsername") || ""
    );
    const [isError, setIsError] = useState<boolean>(false);
    const [time, setTime] = useState(new Date());
    const [title, setTitle] = useState<string>("");

    const titles = [
        "Pr's won't make themselves",
        "Keep grinding",
        "Keep learning",
        "I believe in Git",
        "Git is god",
        "Use git, be git",
        "Linus Torvalds would be proud",
        "We need more green!",
        "Green like a carpet",
        "MORE SQUARES",
        "We need MORE!!!",
    ];

    function getTitle() {
        return titles[Math.floor(Math.random() * titles.length)];
    }

    useEffect(() => {
        setTitle(getTitle());
    }, []);

    useEffect(() => {
        if (!githubUsername) {
            setIsError(true);
            toast.error("Go into settings to set your username");
        }
    }, [githubUsername]);

    function formatTwoDigits(num: number): string {
        return num < 10 ? `0${num}` : `${num}`;
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="bg-black min-h-screen flex items-center justify-center">
            <div className="bg-black border-white/40 border-2 text-left w-auto h-auto m-auto p-20 rounded-sm flex flex-col items-center">
                <div className="text-8xl font-mono">
                    <span>{formatTwoDigits(time.getHours())}</span>:
                    <span>{formatTwoDigits(time.getMinutes())}</span>:
                    <span className="opacity-80 text-green-500">{formatTwoDigits(time.getSeconds())}</span>
                </div>
                <h1 className="opacity-100 text-white text-lg">{title}</h1>
                <div className="text-white p-4 rounded-md mt-5">
                    <GitHubCalendar
                        username={githubUsername}
                        blockSize={20}
                        blockMargin={4}
                        colorScheme="dark"
                        fontSize={15}
                        showWeekdayLabels
                    />
                </div>
                {isError && (
                    <span className="text-red-500">
                        No GitHub username found, go into{" "}
                        <a href="/settings">Settings</a>
                    </span>
                )}
            </div>
        </div>
    );
}
