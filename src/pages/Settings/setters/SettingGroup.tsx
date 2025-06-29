import React from "react";
import { Button } from "@/components/ui/button";

interface SettingGroupProps<T> {
    label: string;
    value: T;
    onChange: (value: T) => void;
    defaultValue: T;
    children: React.ReactNode;
    className?: string;
}

export function SettingGroup<T>({ label, onChange, defaultValue, children, className = "" }: Omit<SettingGroupProps<T>, 'value'>) {
    const handleReset = () => onChange(defaultValue);
    return (
        <div className={`mb-2 ${className}`}>
            <div className="flex flex-col gap-1">
                <span className="font-mono text-lg text-left">{label}</span>
                {children}
                <Button variant="outline" size="sm" className="w-fit mt-1" onClick={handleReset}>
                    Reset to default
                </Button>
            </div>
        </div>
    );
}
