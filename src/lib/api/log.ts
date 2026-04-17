import type { LogEntry } from "$lib/types/Log";

const data: LogEntry[] = [
    {
        user: "System",
        lock: "Main Entrance",
        action: "Startup",
        date: new Date(),
        description: "",
    },
    {
        user: "Tobi",
        lock: "Main Entrance",
        action: "Open",
        date: new Date(),
        description: "Zu Besuch",
    },
    {
        user: "Tobi",
        lock: "Main Entrance",
        action: "Close",
        date: new Date(),
        description: "1 minute",
    },
];

export function getLogEntries(){
    return data;
}