import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface DebugModeProps {
    value: boolean;
    onChange: (checked: boolean) => void;
}

export const DebugMode: React.FC<DebugModeProps> = ({ value, onChange }) => (
    <div className="flex items-center gap-2 mt-1">
        <Switch
            id="debug-mode"
            onCheckedChange={onChange}
            checked={value}
        />
        <Label htmlFor="debug-mode">Debug mode</Label>
        <span>{value ? "ON" : "OFF"}</span>
        <span className="opacity-70 text-sm">Turns on debug elements</span>
    </div>
);
