import { useEffect } from "react";

export default function StorageStarter() {
    useEffect(() => {
        if (localStorage.getItem("newTabBgOffline") === null) {
            localStorage.setItem("newTabBgOffline", "false");
        }
        if (localStorage.getItem("debug") === null) {
            localStorage.setItem("debug", "false");
        }
        if (localStorage.getItem("newTabSecondColor") === null) {
            localStorage.setItem("newTabSecondColor", "default");
        }
        if (localStorage.getItem("newTabClockStyle") === null) {
            localStorage.setItem("newTabClockStyle", "stylish");
        }
        if (localStorage.getItem("newTabClockFontSize") === null) {
            localStorage.setItem("newTabClockFontSize", "80");
        }
        if (localStorage.getItem("newTabClockGap") === null) {
            localStorage.setItem("newTabClockGap", "10");
        }
    }, []);
}