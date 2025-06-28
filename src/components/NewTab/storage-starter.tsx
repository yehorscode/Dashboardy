import { useEffect } from "react";

export default function StorageStarter() {
    useEffect(() => {
        if (localStorage.getItem("bgOffline") === null) {
            localStorage.setItem("bgOffline", "false");
        }
        if (localStorage.getItem("debug") === null) {
            localStorage.setItem("debug", "false");
        }
        if (localStorage.getItem("newTabSecondColor") === null) {
            localStorage.setItem("newTabSecondColor", "default");
        }
    })

}