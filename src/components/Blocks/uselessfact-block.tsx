import { useCallback, useEffect, useState } from "react";

export default function UselessFactBlock() {
  const [fact, setFact] = useState("");
  const [error, setError] = useState(null);

  const fetchFact = useCallback(async () => {
    try {
      const response = await fetch("https://uselessfacts.jsph.pl/random.json?language=en");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setFact(data.text);
    } catch (error: any) {
      setError(error.message);
    }
  }, []);

  useEffect(() => {
    fetchFact();
  }, [fetchFact]);

  return (
    <div className="p-4 bg-gradient-to-br from-purple-400 to-purple-800 rounded font-mono">
      {error ? (
        <h1>Error: {error}</h1>
      ) : (
        <h1>{fact}</h1>
      )}
    </div>
  );
}