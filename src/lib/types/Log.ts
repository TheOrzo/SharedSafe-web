
type LogEntry = {
    user: string;
    lock: string;
    action: "Shutdown" | "Startup" | "Open" | "Close" | "Bypass" | "Error";
    date: Date;
    description: string;
};