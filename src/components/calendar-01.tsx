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

  return (
    <Calendar
      mode="single"
      defaultMonth={date}
      selected={date}
      onSelect={setDate}
      className="rounded-lg border shadow-sm border-input"
      style={{ backgroundColor: newTabCalendarColor }}
    />
  )
}
