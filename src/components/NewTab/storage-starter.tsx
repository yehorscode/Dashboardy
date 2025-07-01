import { useEffect } from "react";

export default function StorageStarter() {
    useEffect(() => {
        // Session storage
        if (sessionStorage.getItem("__darkreader__wasEnabledForHost") === null) {
            sessionStorage.setItem("__darkreader__wasEnabledForHost", "false");
        }

        // Local storage
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
        if (localStorage.getItem("newTabBlocks") === null) {
            localStorage.setItem("newTabBlocks", '[\n {\n  "id": "block-1",\n  "type": "time",\n  "x": 860,\n  "y": 320,\n  "visible": true\n },\n {\n  "id": "block-2",\n  "type": "weather",\n  "x": 340,\n  "y": 120,\n  "visible": true\n },\n {\n  "id": "block-3",\n  "type": "calendar",\n  "x": 320,\n  "y": 480,\n  "visible": true\n },\n {\n  "id": "block-4",\n  "type": "tips",\n  "x": 1040,\n  "y": 680,\n  "visible": true\n }\n]');
        }
        if (localStorage.getItem("newTabWeatherLocation") === null) {
            localStorage.setItem("newTabWeatherLocation", '{\n "lat": "52.2319581",\n "lon": "21.0067249",\n "name": "Warszawa, województwo mazowieckie, Polska"\n}');
        }
        if (localStorage.getItem("newTabClockFontSize") === null) {
            localStorage.setItem("newTabClockFontSize", "80");
        }
        if (localStorage.getItem("newTabSecondColor") === null) {
            localStorage.setItem("newTabSecondColor", "green");
        }
        if (localStorage.getItem("newTabCalendarColor") === null) {
            localStorage.setItem("newTabCalendarColor", "linear-gradient(90deg, #a51d2d, #c01c28)");
        }
    }, []);
}
