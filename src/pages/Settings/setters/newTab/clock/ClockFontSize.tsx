import React from "react";

interface ClockFontSizeProps {
    value: number;
    onChange: (value: number) => void;
}

export const ClockFontSize: React.FC<ClockFontSizeProps> = ({ value, onChange }) => (
    <div className="flex items-center gap-2">
        <h4 className="font-mono">How much?</h4>
        <input
            type="range"
            min={40}
            max={200}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            style={{ width: 180 }}
        />
        <input
            type="number"
            min={40}
            max={200}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-16 ml-2 bg-[#222] text-[#66ff66] border border-[#444] rounded px-2 py-1"
        />
    </div>
);
