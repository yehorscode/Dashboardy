import { useEffect } from "react";

export default function StorageStarter() {
    const blockExample = `[{"id": "block-3","type": "time","x": 600,"y": 360,"visible": true}]`;
    const locationExample = `{
    "lat": "52.2319581",
    "lon": "21.0067249",
    "name": "Warszawa, województwo mazowieckie, Polska"
    }`;
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
        if (localStorage.getItem("newTabBlocks") === null) {
            localStorage.setItem("newTabBlocks", JSON.stringify(blockExample));
        }
        if (localStorage.getItem("newTabWeatherLocation") === null) {
            localStorage.setItem("newTabWeatherLocation", JSON.stringify(locationExample));
        }
    }, []);
}
