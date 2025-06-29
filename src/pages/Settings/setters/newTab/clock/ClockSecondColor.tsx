import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ClockSecondColorProps {
    value: string;
    onChange: (value: string) => void;
}

export const ClockSecondColor: React.FC<ClockSecondColorProps> = ({ value, onChange }) => (
    <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
            <h4 className="font-mono">Clock's second value color</h4>
        </div>
        <div className="flex gap-2">
            <RadioGroup value={value} onValueChange={onChange}>
                <div className="flex items-center gap-3">
                    <RadioGroupItem value="default" id="ntbs-default-color" />
                    <Label htmlFor="ntbs-default-color">Default</Label>
                </div>
                <div className="flex items-center gap-3">
                    <RadioGroupItem value="red" id="ntbs-red-color" />
                    <Label htmlFor="ntbs-red-color">Red</Label>
                </div>
                <div className="flex items-center gap-3">
                    <RadioGroupItem value="blue" id="ntbs-blue-color" />
                    <Label htmlFor="ntbs-blue-color">Blue</Label>
                </div>
                <div className="flex items-center gap-3">
                    <RadioGroupItem value="green" id="ntbs-green-color" />
                    <Label htmlFor="ntbs-green-color">Green</Label>
                </div>
                <div className="flex items-center gap-3">
                    <RadioGroupItem value="yellow" id="ntbs-yellow-color" />
                    <Label htmlFor="ntbs-yellow-color">Yellow</Label>
                </div>
            </RadioGroup>
        </div>
    </div>
);
