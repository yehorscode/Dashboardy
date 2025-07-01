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
    const { blocks, toggleBlock, addBlock, removeBlock, resetBlocks } =
        useBlocks();
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

    const [calendarColor1, setCalendarColor1] = useState(() => {
        const stored = localStorage.getItem("newTabCalendarColor");
        if (!stored) return "#fca5a5";
        if (stored.startsWith("linear-gradient")) {
            const match = stored.match(/linear-gradient\([^,]+,\s*([^,]+),/);
            return match ? match[1].trim() : "#fca5a5";
        }
        return stored;
    });
    const [calendarColor2, setCalendarColor2] = useState(() => {
        const stored = localStorage.getItem("newTabCalendarColor");
        if (!stored) return "#66ff66";
        if (stored.startsWith("linear-gradient")) {
            const match = stored.match(
                /linear-gradient\([^,]+,\s*[^,]+,\s*([^\)]+)\)/
            );
            return match ? match[1].trim() : "#66ff66";
        }
        return "#66ff66";
    });
    const [useGradient, setUseGradient] = useState(() => {
        const stored = localStorage.getItem("newTabCalendarColor");
        return stored ? stored.startsWith("linear-gradient") : false;
    });
    const [gridValue, setGridValue] = useState(() => {
        const stored = localStorage.getItem("newTabGrid");
        const parsed = stored ? parseInt(stored, 10) : 10;
        return isNaN(parsed) ? 10 : Math.max(0, Math.min(50, parsed));
    });
    const [funimgsType, setFunimgsType] = useState(() => {
        const stored = localStorage.getItem("newTabFunIMGSType");
        return stored === "cat" || stored === "dog" ? stored : "dog";
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
    const handleCalendarColor1Change = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const newColor1 = e.target.value;
        setCalendarColor1(newColor1);
        if (useGradient) {
            const gradient = `linear-gradient(90deg, ${newColor1}, ${calendarColor2})`;
            localStorage.setItem("newTabCalendarColor", gradient);
        } else {
            localStorage.setItem("newTabCalendarColor", newColor1);
        }
        forceRerender();
    };
    const handleCalendarColor2Change = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const newColor2 = e.target.value;
        setCalendarColor2(newColor2);
        if (useGradient) {
            const gradient = `linear-gradient(90deg, ${calendarColor1}, ${newColor2})`;
            localStorage.setItem("newTabCalendarColor", gradient);
        }
        forceRerender();
    };
    const handleUseGradientChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const checked = e.target.checked;
        setUseGradient(checked);
        if (checked) {
            const gradient = `linear-gradient(90deg, ${calendarColor1}, ${calendarColor2})`;
            localStorage.setItem("newTabCalendarColor", gradient);
        } else {
            localStorage.setItem("newTabCalendarColor", calendarColor1);
        }
        forceRerender();
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
    const handleLocationChange = (value: {
        lat: string;
        lon: string;
        name: string;
    }) => {
        localStorage.setItem("newTabWeatherLocation", JSON.stringify(value));
        forceRerender();
    };
    const handleGridChange = (value: number) => {
        const clamped = Math.max(0, Math.min(50, value));
        setGridValue(clamped);
        localStorage.setItem("newTabGrid", clamped.toString());
        forceRerender();
    };
    const handleFunimgsTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFunimgsType(e.target.value);
        localStorage.setItem("newTabFunIMGSType", e.target.value);
        forceRerender();
    };

    const [, setRerender] = useState(0);
    const forceRerender = () => setRerender((v) => v + 1);

    return (
        <div className="h-screen p-10 bg-[282828] text-[#66ff66]">
            <h1 className="font-mono text-4xl">Settings</h1>
            <div className="mt-4 flex-col flex justify-center items-center gap-1">
                <h4 className="font-mono text-2xl mb-2">Site-Wide Settings</h4>
                <DebugMode
                    value={debugMode}
                    onChange={handleToggle(setDebugMode, "debug")}
                />
                <ThemeSwitcher
                    setTheme={(theme: string) => setTheme(theme as any)}
                />
            </div>

            <div className="mt-4 flex-col flex justify-center items-center gap-1">
                <h4 className="font-mono text-2xl mb-2 mt-5">
                    New Tab Settings
                </h4>
                <OfflineBgMode
                    value={offlineMode}
                    onChange={handleToggle(setOfflineMode, "newTabBgOffline")}
                />
                <Button
                    variant="outline"
                    size="sm"
                    className="w-fit mt-1 mb-2"
                    onClick={resetOfflineMode}
                >
                    Reset to default
                </Button>
                <div className="flex flex-col gap-2 mt-3">
                    <div>
                        <SettingGroup
                            label="Clock font size"
                            onChange={handleFontSizeChange}
                            defaultValue={80}
                        >
                            <ClockFontSize
                                value={clockFontSize}
                                onChange={handleFontSizeChange}
                            />
                        </SettingGroup>
                    </div>
                    <div>
                        <SettingGroup
                            label="Clock gap"
                            onChange={handleGapChange}
                            defaultValue={10}
                        >
                            <ClockGap
                                value={clockGap}
                                onChange={handleGapChange}
                            />
                        </SettingGroup>
                    </div>
                    <div>
                        <ClockSecondColor
                            value={
                                localStorage.getItem("newTabSecondColor") ||
                                "default"
                            }
                            onChange={(value) => {
                                localStorage.setItem(
                                    "newTabSecondColor",
                                    value
                                );
                                forceRerender();
                            }}
                        />
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-fit mt-1"
                            onClick={resetClockSecondColor}
                        >
                            Reset to default
                        </Button>
                    </div>
                    <div>
                        <ClockStyle
                            value={
                                localStorage.getItem("newTabClockStyle") ||
                                "stylish"
                            }
                            onChange={(value) => {
                                localStorage.setItem("newTabClockStyle", value);
                                forceRerender();
                            }}
                        />
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-fit mt-1"
                            onClick={resetClockStyle}
                        >
                            Reset to default
                        </Button>
                    </div>
                    <div>
                        <SettingGroup
                            label="Weather location"
                            onChange={handleLocationChange}
                            defaultValue={{
                                lat: "52.2297",
                                lon: "21.0122",
                                name: "Warsaw",
                            }}
                        >
                            <ChangeLocation onChange={handleLocationChange} />
                        </SettingGroup>
                    </div>
                    <div>
                        <SettingGroup
                            label="Calendar color"
                            onChange={() => {}}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                }}
                            >
                                <input
                                    type="color"
                                    value={calendarColor1}
                                    onChange={handleCalendarColor1Change}
                                    style={{
                                        width: 40,
                                        height: 30,
                                        border: "none",
                                        background: "none",
                                    }}
                                />
                                {useGradient && (
                                    <>
                                        <span>→</span>
                                        <input
                                            type="color"
                                            value={calendarColor2}
                                            onChange={
                                                handleCalendarColor2Change
                                            }
                                            style={{
                                                width: 40,
                                                height: 30,
                                                border: "none",
                                                background: "none",
                                            }}
                                        />
                                    </>
                                )}
                                <label
                                    style={{
                                        marginLeft: 12,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 4,
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={useGradient}
                                        onChange={handleUseGradientChange}
                                    />
                                    Gradient
                                </label>
                            </div>
                        </SettingGroup>
                    </div>
                    <div>
                        <SettingGroup
                            label="Grid size (0-50)"
                            onChange={() => {}}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <input
                                    type="range"
                                    min={1}
                                    max={50}
                                    value={gridValue}
                                    onChange={e => handleGridChange(Number(e.target.value))}
                                    style={{ width: 120 }}
                                />
                                <input
                                    type="number"
                                    min={0}
                                    max={50}
                                    value={gridValue}
                                    onChange={e => handleGridChange(Number(e.target.value))}
                                    style={{ width: 50 }}
                                />
                            </div>
                        </SettingGroup>
                    </div>
                    <div className="mt-4 flex-col flex justify-center items-center gap-1">
                        <h4 className="font-mono text-2xl mb-2 mt-5">FunIMGS type</h4>
                        <div className="flex gap-4 mb-4">
                            <label className="flex items-center gap-1">
                                <input
                                    type="radio"
                                    name="funimgs-type"
                                    value="dog"
                                    checked={funimgsType === "dog"}
                                    onChange={handleFunimgsTypeChange}
                                />
                                Dog
                            </label>
                            <label className="flex items-center gap-1">
                                <input
                                    type="radio"
                                    name="funimgs-type"
                                    value="cat"
                                    checked={funimgsType === "cat"}
                                    onChange={handleFunimgsTypeChange}
                                />
                                Cat
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-4 flex-col flex justify-center items-center gap-1">
                <h4 className="font-mono text-2xl mb-2 mt-5">Enabled blocks</h4>
                <div className="flex flex-col gap-2 w-full max-w-xs">
                    {blocks.map((b) => (
                        <div key={b.id} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={b.visible}
                                onChange={() => toggleBlock(b.id)}
                            />
                            <span>{b.type}</span>
                            <button
                                className=" bg-red-500 text-white p-1 rounded"
                                onClick={() => removeBlock(b.id)}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <div className="mt-2">
                        <label className="mr-2">Dodaj blok:</label>
                        <select
                            id="add-block-type"
                            className="bg-[#66ff66] text-black p-1 rounded"
                            onChange={(e) => {
                                if (e.target.value) {
                                    addBlock(e.target.value as any);
                                    e.target.value = "";
                                }
                            }}
                        >
                            <option value="" className="">
                                Choose which one
                            </option>
                            <option value="time">Clock</option>
                            <option value="weather">Weather</option>
                            <option value="calendar">Calendar</option>
                            <option value="tips">Tips</option>
                            <option value="funimgs">FunIMGS</option>
                            <option value="uselessfact">Useless Facts</option>
                        </select>
                    </div>
                    <button
                        className="mt-2 text-xs underline"
                        onClick={resetBlocks}
                    >
                        Przywróć domyślne bloki
                    </button>
                </div>
            </div>
            <div className="flex items-center gap-2"></div>
        </div>
    );
}
