import { useState } from "react";
import "./Settings.module.scss";

import { useBlocks } from "@/blocks-context";
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
import { ChangeLocation } from "./setters/newTab/weather/change-location";

export default function Settings() {
    const { setTheme } = useTheme();
    const { blocks, toggleBlock, addBlock, removeBlock, resetBlocks } = useBlocks();
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

    // Weather location state
    const [weatherLocation, setWeatherLocation] = useState(() => {
        const raw = localStorage.getItem("newTabWeatherLocation");
        if (!raw) return null;
        try {
            return JSON.parse(raw);
        } catch {
            return null;
        }
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
    const handleLocationChange = (value: { lat: string; lon: string; name: string }) => {
        setWeatherLocation(value);
        localStorage.setItem("newTabWeatherLocation", JSON.stringify(value));
        forceRerender();
    }
    
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
                    <div>
                        <SettingGroup
                            label="Weather location"
                            onChange={handleLocationChange}
                            defaultValue={{ lat: "52.2297", lon: "21.0122", name: "Warsaw" }}
                        >
                            <ChangeLocation  onChange={handleLocationChange} />
                        </SettingGroup>
                    </div>
                </div>
            </div>
            <div className="mt-4 flex-col flex justify-center items-center gap-1">
                <h4 className="font-mono text-2xl mb-2 mt-5">Enabled blocks</h4>
                <div className="flex flex-col gap-2 w-full max-w-xs">
                  {blocks.map(b => (
                    <div key={b.id} className="flex items-center gap-2">
                      <input type="checkbox" checked={b.visible} onChange={() => toggleBlock(b.id)} />
                      <span>{b.type}</span>
                      <button className=" bg-red-500 text-white p-1 rounded" onClick={() => removeBlock(b.id)}>Remove</button>
                    </div>
                  ))}
                  <div className="mt-2">
                    <label className="mr-2">Dodaj blok:</label>
                    <select id="add-block-type" className="bg-[#66ff66] text-black p-1 rounded" onChange={e => { if (e.target.value) { addBlock(e.target.value as any); e.target.value = ""; } }}>
                      <option value="" className="">Choose which one</option>
                      <option value="time">Zegar</option>
                      <option value="weather">Pogoda</option>
                    </select>
                  </div>
                  <button className="mt-2 text-xs underline" onClick={resetBlocks}>Przywróć domyślne bloki</button>
                </div>
            </div>
            <div className="flex items-center gap-2"></div>
        </div>
    );
}
