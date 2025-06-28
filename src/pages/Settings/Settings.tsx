import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import "./Settings.module.scss";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme-provider";

export default function Settings() {
    const { setTheme } = useTheme();
    const [offlineMode, setOfflineMode] = useState(
        localStorage.getItem("bgOffline") === "true"
    );
    const [debugMode, setDebugMode] = useState(
        localStorage.getItem("debug") === "true"
    );

    const handleToggle = (
        setValue: React.Dispatch<React.SetStateAction<boolean>>,
        localStorageKey: string
    ) => {
        return (checked: boolean) => {
            setValue(checked);
            localStorage.setItem(localStorageKey, checked ? "true" : "false");
        };
    };
    return (
        <div className="h-screen p-10 bg-[282828] text-[#66ff66]">
            <h1 className="font-mono text-4xl">Settings</h1>
            <div className="mt-4 flex-col flex justify-center items-center gap-1">
                <h4>Site-Wide Settings</h4>
                <div className="flex items-center gap-2 mt-1">
                    <Switch
                        id="debug-mode"
                        onCheckedChange={handleToggle(setDebugMode, "debug")}
                        checked={debugMode}
                    />
                    <Label htmlFor="debug-mode">Debug mode</Label>
                    <span>{debugMode ? "ON" : "OFF"}</span>
                    <span className="opacity-70 text-sm">
                        Turns on debug elements
                    </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                                <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                                <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                                <span className="sr-only">Toggle theme</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setTheme("light")}>
                                Light
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("dark")}>
                                Dark
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => setTheme("system")}
                            >
                                System
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="mt-4 flex-col flex justify-center items-center gap-1">
                <h4>New Tab Settings</h4>
                <div className="flex items-center gap-2 mt-1">
                    <Switch
                        id="airplane-mode"
                        onCheckedChange={handleToggle(
                            setOfflineMode,
                            "bgOffline"
                        )}
                        checked={offlineMode}
                    />
                    <Label htmlFor="airplane-mode">
                        Offline Background mode
                    </Label>
                    <span>{offlineMode ? "ON" : "OFF"}</span>
                    <span className="opacity-70 text-sm">
                        Uses offline images instead
                    </span>
                </div>
                <div className="flex items-center gap-2"></div>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <h4 className="font-mono">Background style</h4>
                    </div>
                    <div className="flex gap-2">
                        <RadioGroup
                            defaultValue={
                                localStorage.getItem("newTabSecondColor") ||
                                "default"
                            }
                            onValueChange={(value) => {
                                localStorage.setItem(
                                    "newTabSecondColor",
                                    value as string
                                );
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <RadioGroupItem
                                    value="default"
                                    id="ntbs-default-color"
                                />
                                <Label htmlFor="ntbs-default-color">
                                    Default
                                </Label>
                            </div>
                            <div className="flex items-center gap-3">
                                <RadioGroupItem
                                    value="red"
                                    id="ntbs-red-color"
                                />
                                <Label htmlFor="ntbs-red-color">Red</Label>
                            </div>
                            <div className="flex items-center gap-3">
                                <RadioGroupItem
                                    value="blue"
                                    id="ntbs-blue-color"
                                />
                                <Label htmlFor="ntbs-blue-color">Blue</Label>
                            </div>
                            <div className="flex items-center gap-3">
                                <RadioGroupItem
                                    value="green"
                                    id="ntbs-green-color"
                                />
                                <Label htmlFor="ntbs-green-color">Green</Label>
                            </div>
                            <div className="flex items-center gap-3">
                                <RadioGroupItem
                                    value="yellow"
                                    id="ntbs-yellow-color"
                                />
                                <Label htmlFor="ntbs-yellow-color">
                                    Yellow
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2"></div>
        </div>
    );
}
