import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { toast } from "sonner";

interface LocationOption {
    display_name: string;
    lat: string;
    lon: string;
}

export const ChangeLocation = ({
    onChange,
}: {
    onChange?: (coords: { lat: string; lon: string; name: string }) => void;
}) => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<LocationOption[]>([]);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState<LocationOption | null>(null);
    const [error, setError] = useState("");

    async function fetchLocations(q: string) {
        setLoading(true);
        setError("");
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                    q
                )}`
            );
            if (!res.ok) throw new Error("API error");
            const data = await res.json();
            setResults(data.slice(0, 10));
        } catch (e) {
            toast.error("Error while fetching locations");
            setError("Error while fetching locations");
            setResults([]);
        } finally {
            setLoading(false);
        }
    }

    function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
        const val = e.target.value;
        setQuery(val);
        setSelected(null);
        if (val.length > 2) {
            fetchLocations(val);
        } else {
            setResults([]);
        }
    }

    function handleSelect(idx: number) {
        const loc = results[idx];
        setSelected(loc);
        setQuery(loc.display_name);
        setResults([]);
        if (onChange)
            onChange({ lat: loc.lat, lon: loc.lon, name: loc.display_name });
        localStorage.setItem(
            "newTabWeatherLocation",
            JSON.stringify({
                lat: loc.lat,
                lon: loc.lon,
                name: loc.display_name,
            })
        );
    }

    return (
        <div className="flex flex-col gap-2">
            <label className="font-mono text-sm">Find location</label>
            <Input
                value={query}
                onChange={handleInput}
                placeholder="like. Warsaw, London"
                aria-label="Find location"
                autoComplete="off"
            />
            {loading && (
                <span className="text-xs text-muted-foreground">Szukam...</span>
            )}
            {error && <span className="text-xs text-red-500">{error}</span>}
            {results.length > 0 && (
                <div className="border rounded bg-background shadow p-2 max-h-48 overflow-auto z-10">
                    {results.map((loc, idx) => (
                        <button
                            key={loc.lat + loc.lon}
                            className="block w-full text-left hover:bg-accent px-2 py-1 text-sm"
                            onClick={() => handleSelect(idx)}
                        >
                            {loc.display_name}
                        </button>
                    ))}
                </div>
            )}
            {selected && (
                <div className="text-xs text-muted-foreground mt-1">
                    Chosen: <b>{selected.display_name}</b> <br />
                    Coordinates: {selected.lat}, {selected.lon}
                </div>
            )}
        </div>
    );
};
