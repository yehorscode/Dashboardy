import { useEffect, useRef, useState } from "react";
import offlineSource from "@/assets/exmpl.jpeg";
import { Skeleton } from "@/components/ui/skeleton";
import type { ReactNode } from 'react';

// Define types for Pexels API response
interface PexelsPhoto {
    id: number;
    src: {
        original: string;
        medium: string;
        tiny: string;
    };
    alt: string;
    photographer: string;
    photographer_url: string;
    url: string;
}

interface PexelsResponse {
    photos: PexelsPhoto[];
    page: number;
    per_page: number;
    total_results: number;
    next_page?: string;
}

interface FetchSignal {
    cancelled: boolean;
}

export default function BGSetter({ children }: { children?: ReactNode }) {
    const API_KEY = import.meta.env.VITE_APP_PEXELS_API_KEY;
    const [secondColor] = useState(localStorage.getItem("newTabSecondColor"))
    const [bgUrl, setBgUrl] = useState<string | null>(null);
    const [imageSize, setImageSize] = useState<string>("Offline");
    const [isOffline] = useState<boolean>(() => {
        const stored = localStorage.getItem("newTabBgOffline");
        return stored === null ? false : stored === "true";
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [query] = useState<string>(
        localStorage.getItem("imgQuery") || "nature wallpaper"
    );
    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    const tinyImageRef = useRef<HTMLImageElement | null>(null);
    const mediumImageRef = useRef<HTMLImageElement | null>(null);
    const highResImageRef = useRef<HTMLImageElement | null>(null);
    const retryCountRef = useRef<number>(0);
    const MAX_RETRIES = 3;
    const [responseData, setResponseData] = useState<PexelsPhoto | null>(null);
    const [isDebug] = useState(localStorage.getItem("debug") === "true");

    // Fetch random photo from Pexels
    const fetchRandomPhoto = async (signal: FetchSignal) => {
        if (retryCountRef.current >= MAX_RETRIES) {
            setIsLoading(false);
            setBgUrl(null);
            setImageSize("None");
            return;
        }

        setIsLoading(true);
        const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(
            query
        )}&orientation=landscape&per_page=1&page=${
            Math.floor(Math.random() * 100) + 1
        }`;

        try {
            const res = await fetch(url, {
                headers: { Authorization: API_KEY },
            });

            if (!res.ok) throw new Error(`API error: ${res.status}`);
            const data: PexelsResponse = await res.json();
            const photo = data.photos?.[0];
            setResponseData(photo);
            if (
                !photo ||
                !photo.src?.tiny ||
                !photo.src?.medium ||
                !photo.src?.original
            ) {
                retryCountRef.current += 1;
                fetchRandomPhoto(signal); // Retry if no valid photo
                return;
            }
            if (!signal.cancelled) {
                // Preload tiny image to ensure it displays
                preloadTinyImage(
                    photo.src.tiny,
                    photo.src.medium,
                    photo.src.original,
                    signal
                );
            }
        } catch (error) {
            console.error("Failed to fetch photo:", error);
            if (!signal.cancelled) {
                retryCountRef.current += 1;
                fetchRandomPhoto(signal); // Retry on error
            }
        }
    };

    // Preload tiny image and set it first
    const preloadTinyImage = (
        tinyUrl: string,
        mediumUrl: string,
        originalUrl: string,
        signal: FetchSignal
    ) => {
        tinyImageRef.current = new Image();
        tinyImageRef.current.src = tinyUrl;

        tinyImageRef.current.onload = () => {
            if (!signal.cancelled) {
                setBgUrl(tinyUrl);
                setImageSize("Tiny");
                setIsLoading(false);
                // Start loading medium image after tiny is displayed
                preloadMediumImage(mediumUrl, originalUrl, signal);
            }
        };

        tinyImageRef.current.onerror = () => {
            if (!signal.cancelled) {
                setIsLoading(false);
                retryCountRef.current += 1;
                fetchRandomPhoto(signal); // Retry on image load failure
            }
        };
    };

    // Preload medium image and swap when ready
    const preloadMediumImage = (
        mediumUrl: string,
        originalUrl: string,
        signal: FetchSignal
    ) => {
        mediumImageRef.current = new Image();
        mediumImageRef.current.src = mediumUrl;

        mediumImageRef.current.onload = () => {
            if (!signal.cancelled) {
                setBgUrl(mediumUrl);
                setImageSize("Medium");
                // Start loading high-res image after medium is displayed
                preloadHighResImage(originalUrl, signal);
            }
        };

        mediumImageRef.current.onerror = () => {
            if (!signal.cancelled) {
                setIsLoading(false);
                retryCountRef.current += 1;
                fetchRandomPhoto(signal); // Retry on image load failure
            }
        };
    };

    // Preload high-resolution image and swap when ready
    const preloadHighResImage = (url: string, signal: FetchSignal) => {
        highResImageRef.current = new Image();
        highResImageRef.current.src = url;

        highResImageRef.current.onload = () => {
            if (!signal.cancelled) {
                setBgUrl(url); // Swap to high-res image
                setImageSize("Original");
                retryCountRef.current = 0; // Reset retry count on success
            }
        };

        highResImageRef.current.onerror = () => {
            if (!signal.cancelled) {
                retryCountRef.current += 1;
                fetchRandomPhoto(signal); // Retry on image load failure
            }
        };
    };

    // Handle background image fetching and offline mode
    useEffect(() => {
        if (isOffline) {
            setBgUrl(offlineSource);
            setImageSize("Offline");
            setIsLoading(false);
            return;
        }

        const signal: FetchSignal = { cancelled: false };
        setIsLoading(true);
        retryCountRef.current = 0; // Reset retries for new fetch

        // Debounce API call
        debounceRef.current = setTimeout(() => {
            fetchRandomPhoto(signal);
        }, 1000);

        // Cleanup
        return () => {
            signal.cancelled = true;
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
            if (tinyImageRef.current) {
                tinyImageRef.current.src = "";
            }
            if (mediumImageRef.current) {
                mediumImageRef.current.src = "";
            }
            if (highResImageRef.current) {
                highResImageRef.current.src = "";
            }
        };
    }, [isOffline, query]);
    return (
        <div
            className="absolute inset-0 w-full h-full bg-no-repeat bg-center bg-cover -z-10 transition-opacity duration-200"
            style={
                bgUrl && !isLoading ? { backgroundImage: `url(${bgUrl})` } : {}
            }
        >
            <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
            {/* {isLoading && (
                <Skeleton className="absolute inset-0 w-full h-full z-10" />
            )} */}
            <div className="absolute bottom-3 left-3 opacity-80 text-sm text-white flex flex-col gap-1 z-20">
                <span>
                    <a
                        href={responseData?.url}
                        target="_blank"
                        rel="noreferrer"
                    >
                        Photo
                    </a>{" "}
                    by{" "}
                    <a
                        href={responseData?.photographer_url}
                        target="_blank"
                        rel="noreferrer"
                    >
                        {responseData?.photographer}
                    </a>{" "}
                    on{" "}
                    <a
                        href="https://www.pexels.com/"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Pexels
                    </a>
                </span>
            </div>
            <button onClick={() => fetchRandomPhoto({ cancelled: false })} className="absolute bottom-2 right-1/2 translate-x-1/2 opacity-80 text-sm text-white">Next image</button>
            {isDebug && (
                <div className="absolute bottom-3 right-3 opacity-80 text-sm text-white flex flex-col gap-1 z-20 text-right">
                    <span>Image Size: {imageSize}</span>
                    <span>Retries: {retryCountRef.current}</span>
                    <span>Second Color: {secondColor}</span>
                    <span>Debug Mode: {isDebug ? "ON" : "OFF"}</span>
                </div>
            )}
            {children}
        </div>
    );
}
