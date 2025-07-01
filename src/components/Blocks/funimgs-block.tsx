import { useState, useEffect, useCallback } from "react";

export default function FunIMGSBlock() {
    const [type, setType] = useState(
        (localStorage.getItem("newTabFunIMGSType") === "dog" ||
            localStorage.getItem("newTabFunIMGSType") === "cat"
            ? localStorage.getItem("newTabFunIMGSType")
            : "dog")
    );

    const [imageSrc, setImageSrc] = useState("");

    const fetchImage = useCallback(async () => {
        if (type === "dog") {
            const response = await fetch("https://dog.ceo/api/breeds/image/random");
            const data = await response.json();
            setImageSrc(data.message); 
        } else {
            setImageSrc("https://cataas.com/cat");
        }
    }, [type]);

    useEffect(() => {
        fetchImage();
    }, [fetchImage]);

    return (
    <div>
        {imageSrc && (
            <img src={imageSrc} alt={`a random ${type}`} style={{ maxWidth: "300px", maxHeight: "300px" }} />
        )}
    </div>
);
}
