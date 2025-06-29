import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface OfflineBgModeProps {
    value: boolean;
    onChange: (checked: boolean) => void;
}

export const OfflineBgMode: React.FC<OfflineBgModeProps> = ({ value, onChange }) => (
    <div className="flex text-left flex-col gap-2 mt-2">
        <h4 className="font-mono">Offline Background mode</h4>
        <div className="flex items-center gap-2">
            <Switch
                id="airplane-mode"
                onCheckedChange={onChange}
                checked={value}
            />
            <Label htmlFor="airplane-mode">Offline Background mode</Label>
            <span>{value ? "ON" : "OFF"}</span>
            <span className="opacity-70 text-sm">Uses offline images instead</span>
        </div>
    </div>
);
