import type { User } from "$lib/types/user";

const users: User[] = [
    {
        id: "0",
        name: "Tobi",
        groups: ["Mitglieder"],
        nfc: "",
        pin: "",
        isAdmin: false,
        isPriviledged: false
    },
    {
        id: "1",
        name: "Luca",
        groups: ["Mitglieder"],
        nfc: "",
        pin: "",
        isAdmin: false,
        isPriviledged: true
    },
    {
        id: "2",
        name: "Joschka",
        groups: ["Sumpf"],
        nfc: "",
        pin: "",
        isAdmin: false,
        isPriviledged: false
    },
    {
        id: "3",
        name: "Joram",
        groups: ["Mitglieder"],
        nfc: "",
        pin: "",
        isAdmin: true,
        isPriviledged: true
    },
];

export function getUser() {
    return users[3];
}

export function getUsers(){
    return users;
}