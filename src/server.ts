import { Server } from "socket.io";
import { readFileSync, writeFileSync } from "fs";

// Lire les données depuis le fichier data.json
let storage = JSON.parse(readFileSync("./data.json", "utf-8"));

const io = new Server(3000, {
    cors: {
        origin: "*",
    },
});

// Fonction pour sauvegarder les données dans le fichier
function saveDataToFile(data:any) {
    writeFileSync("./data.json", JSON.stringify(data, null, 2), "utf-8");
}

// Lorsqu'un client se connecte
io.on("connection", (socket) => {
    console.log("Un utilisateur s'est connecté");

    // Envoyer les données actuelles au client
    socket.on("getStorage", () => {
        socket.emit("storage", { data: storage });
        console.log("Le storage a été envoyé");
    });

    // Réception de données à mettre à jour
    socket.on("updateStorage", (newData) => {
        // Fusionner les nouvelles données avec les anciennes
        storage = { ...storage, ...newData };

        // Sauvegarder les données dans le fichier
        saveDataToFile(storage);

        // Envoyer un signal de mise à jour à tous les clients
        io.emit("storageUpdated", { data: storage });
        console.log("Le storage a été mis à jour");
    });

    // Déconnexion du client
    socket.on("disconnect", () => {
        console.log("Un utilisateur s'est déconnecté");
    });
});

console.log("Serveur en écoute sur le port 3000");
