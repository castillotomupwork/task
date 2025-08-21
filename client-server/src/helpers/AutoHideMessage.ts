import { useEffect, useState } from "react";

type MessageType = "success" | "error";

interface MessageData {
    text: string;
    type: MessageType;
}

export function useAutoHideMessage(
    delay = 4000, 
    fadeDuration = 1000
) {
    const [message, setMessage] = useState<MessageData | null>(null);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        if (message) {
            const fadeTimer = setTimeout(() => setFadeOut(true), delay);

            const removeTimer = setTimeout(() => {
                setMessage(null);
                setFadeOut(false);
            }, delay + fadeDuration);

            return () => {
                clearTimeout(fadeTimer);
                clearTimeout(removeTimer);
            };
        }
    }, [message, delay, fadeDuration]);

    const showMessage = (text: string, type: MessageType) => {
        setMessage({ text, type });
        setFadeOut(false);
    };

    return { message, showMessage, fadeOut };
}
