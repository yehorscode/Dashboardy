import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ClockStyleProps {
    value: string;
    onChange: (value: string) => void;
}

export const ClockStyle: React.FC<ClockStyleProps> = ({ value, onChange }) => (
    <div className="flex-col gap-2 mt-3">
        <h4 className="font-mono text-left">Clock style</h4>
        <RadioGroup value={value} onValueChange={onChange} className="mt-2">
            <div className="flex items-center gap-3">
                <RadioGroupItem value="stylish" id="ntcs-stylish-style" />
                <Label htmlFor="ntcs-stylish-style">Stylish (default)</Label>
            </div>
            <div className="flex items-center gap-3">
                <RadioGroupItem value="old" id="ntcs-old-style" />
                <Label htmlFor="ntcs-old-style">Simple (old)</Label>
            </div>
        </RadioGroup>
    </div>
);
