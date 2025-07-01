import * as React from "react"

import { Calendar } from "@/components/ui/calendar"

export default function Calendar01() {
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(2025, 5, 12)
  )
  
  const [newTabCalendarColor, setCalendarColor] = React.useState<string>(() => {
    return localStorage.getItem("newTabCalendarColor") || "#fca5a5"; 
  });
  React.useEffect(() => {
    const handler = () => {
      setCalendarColor(localStorage.getItem("newTabCalendarColor") || "#fca5a5");
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);
  // Helper: check if value is a gradient
  const isGradient = (val: string) => val.startsWith("linear-gradient") || val.startsWith("radial-gradient");

  const changeGradientDirection = (gradient: string) => {
    return gradient.replace(/(\d+)deg/, (match, p1) => `${(parseInt(p1) + 200) % 360}deg`);
  };

  return (
    <Calendar
      mode="single"
      defaultMonth={date}
      selected={date}
      onSelect={setDate}
      className="rounded-md shadow-sm border-black/20 p-4"
      style={isGradient(newTabCalendarColor)
        ? { background: changeGradientDirection(newTabCalendarColor) }
        : { backgroundColor: newTabCalendarColor }}
    />
  )
}
