import { useState } from "react";
import "./Settings.module.scss";

import { useTheme } from "@/components/theme-provider";
import { ClockFontSize } from "./setters/newTab/clock/ClockFontSize";
import { ClockGap } from "./setters/newTab/clock/ClockGap";
import { ClockSecondColor } from "./setters/newTab/clock/ClockSecondColor";
import { ClockStyle } from "./setters/newTab/clock/ClockStyle";
import { DebugMode } from "./setters/siteWide/DebugMode";
import { ThemeSwitcher } from "./setters/siteWide/ThemeSwitcher";
import { OfflineBgMode } from "./setters/newTab/OfflineBgMode";
import { Button } from "@/components/ui/button";
import { SettingGroup } from "./setters/SettingGroup";

export default function Settings() {
    const { setTheme } = useTheme();
    const [offlineMode, setOfflineMode] = useState(
        localStorage.getItem("newTabBgOffline") === "true"
    );
    const [debugMode, setDebugMode] = useState(
        localStorage.getItem("debug") === "true"
    );
    const [clockFontSize, setClockFontSize] = useState(() => {
        const size = localStorage.getItem("newTabClockFontSize");
        return size ? parseInt(size, 10) : 80;
    });
    const [clockGap, setClockGap] = useState(() => {
        const gap = localStorage.getItem("newTabClockGap");
        return gap ? parseInt(gap, 10) : 10;
    });

    const handleToggle = (
        setValue: React.Dispatch<React.SetStateAction<boolean>>,
        localStorageKey: string
    ) => {
        return (checked: boolean) => {
            setValue(checked);
            localStorage.setItem(localStorageKey, checked ? "true" : "false");
        };
    };

    const handleFontSizeChange = (value: number) => {
        setClockFontSize(value);
        localStorage.setItem("newTabClockFontSize", value.toString());
    };
    const handleGapChange = (value: number) => {
        setClockGap(value);
        localStorage.setItem("newTabClockGap", value.toString());
    };

    const resetClockSecondColor = () => {
        localStorage.setItem("newTabSecondColor", "default");
        
        forceRerender();
    };
    const resetClockStyle = () => {
        localStorage.setItem("newTabClockStyle", "stylish");
        forceRerender();
    };
    const resetOfflineMode = () => {
        setOfflineMode(false);
        localStorage.setItem("newTabBgOffline", "false");
    };
    
    const [, setRerender] = useState(0);
    const forceRerender = () => setRerender((v) => v + 1);

    return (
        <div className="h-screen p-10 bg-[282828] text-[#66ff66]">
            <h1 className="font-mono text-4xl">Settings</h1>
            <div className="mt-4 flex-col flex justify-center items-center gap-1">
                <h4 className="font-mono text-2xl mb-2">Site-Wide Settings</h4>
                <DebugMode value={debugMode} onChange={handleToggle(setDebugMode, "debug")} />
                <ThemeSwitcher setTheme={(theme: string) => setTheme(theme as any)} />
            </div>

            <div className="mt-4 flex-col flex justify-center items-center gap-1">
                <h4 className="font-mono text-2xl mb-2 mt-5">New Tab Settings</h4>
                <OfflineBgMode value={offlineMode} onChange={handleToggle(setOfflineMode, "newTabBgOffline")} />
                <Button variant="outline" size="sm" className="w-fit mt-1 mb-2" onClick={resetOfflineMode}>Reset to default</Button>
                <div className="flex flex-col gap-2 mt-3">
                    <div>
                        <SettingGroup
                            label="Clock font size"
                            onChange={handleFontSizeChange}
                            defaultValue={80}
                        >
                            <ClockFontSize value={clockFontSize} onChange={handleFontSizeChange} />
                        </SettingGroup>
                    </div>
                    <div>
                        <SettingGroup
                            label="Clock gap"
                            onChange={handleGapChange}
                            defaultValue={10}
                        >
                            <ClockGap value={clockGap} onChange={handleGapChange} />
                        </SettingGroup>
                    </div>
                    <div>
                        <ClockSecondColor
                            value={localStorage.getItem("newTabSecondColor") || "default"}
                            onChange={(value) => {
                                localStorage.setItem("newTabSecondColor", value);
                                forceRerender();
                            }}
                        />
                        <Button variant="outline" size="sm" className="w-fit mt-1" onClick={resetClockSecondColor}>Reset to default</Button>
                    </div>
                    <div>
                        <ClockStyle
                            value={localStorage.getItem("newTabClockStyle") || "stylish"}
                            onChange={(value) => {
                                localStorage.setItem("newTabClockStyle", value);
                                forceRerender();
                            }}
                        />
                        <Button variant="outline" size="sm" className="w-fit mt-1" onClick={resetClockStyle}>Reset to default</Button>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2"></div>
        </div>
    );
}
