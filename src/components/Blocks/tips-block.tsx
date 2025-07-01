import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function TipsBlock() {
    const titles = [
        "Did you know?",
        "Look!",
        "Would you believe?",
        "What a tip!",
        "Linus wouldn't believe that:", 
        "Hey im clippy! And did you know?"
    ];
    
    const tips = [
        <>Go to <Link to="/settings" className=""><u>settings</u></Link> to add your widgets</>,
        <>You can move blocks with a mouse! Try</>,
        <>Calendar block can change colours</>,
        <>Try moving blocks</>,
        <>Widgets are called blocks</>,
        <>Suggest new blocks at my discord @.egorro</>,
        <>GO TO SETTINGS AND GO BACK TO FIX ERRORS</>,
        <>GO TO SETTINGS AND GO BACK TO FIX ERRORS</>,
        <>GO TO SETTINGS AND GO BACK TO FIX ERRORS</>,
        <>GO TO SETTINGS AND GO BACK TO FIX ERRORS</>,
        <>GO TO SETTINGS AND GO BACK TO FIX ERRORS</>,
    ];

    function getRandom(arr: any[]) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    const [title, setTitle] = useState(() => getRandom(titles));
    const [tip, setTip] = useState(() => getRandom(tips));

    useEffect(() => {
        const interval = setInterval(() => {
            setTitle(getRandom(titles));
            setTip(getRandom(tips));
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex-col text-left p-4 rounded-md shadow bg-gradient-to-br from-pink-500/100 to-pink-700/100">
            <h3 className="font-mono">{title}</h3>
            <span>{tip}</span>
        </div>
    );
}
