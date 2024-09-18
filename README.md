# Synchronisation de LocalStorage avec Socket.IO

Ce projet se compose de deux scripts qui permettent la synchronisation de données entre un serveur et les navigateurs des clients via WebSocket, en utilisant Socket.IO. L'objectif est de maintenir les données du `localStorage` synchronisées avec un serveur central.

## Contenu

1. [Serveur Socket.IO (Node.js)](#serveur-socketio-nodejs)
2. [UserScript (Tampermonkey)](#userscript-tampermonkey)

## Serveur Socket.IO (Node.js)

Le script serveur est écrit en TypeScript et utilise `socket.io` pour gérer les connexions WebSocket. Il permet de lire et écrire des données dans un fichier `data.json` à l'aide des modules `fs` pour les opérations de lecture et d'écriture.

### Fonctionnalités

- **Connexion des clients :** Lorsque des clients se connectent, le serveur envoie les données actuelles du `storage` au client.
- **Mise à jour des données :** Les clients peuvent envoyer de nouvelles données pour mettre à jour le `storage`. Ces données sont fusionnées avec les données existantes et sauvegardées dans `data.json`.
- **Émission des mises à jour :** Lorsqu'une mise à jour est effectuée, le serveur envoie les données mises à jour à tous les clients connectés.

### Installation

1. Installez les dépendances :
    ```bash
    pnpm install
    pnpm tsc
    ```

2. Créez un fichier `data.json` dans le répertoire `dist`. Le fichier devrait contenir un objet JSON valide (par exemple, `{}`).

3. Lancez le serveur :
    ```bash
    node serveur.js
    ```

4. Le serveur écoutera sur le port 3000.

## UserScript (Tampermonkey)

Ce script est destiné à être utilisé avec Tampermonkey (ou tout autre gestionnaire de scripts utilisateurs). Il synchronise le `localStorage` du navigateur avec le serveur Socket.IO.

### Fonctionnalités

- **Connexion au serveur :** Lors de la connexion, le script envoie les données du `localStorage` au serveur.
- **Mise à jour des données :** Lorsqu'une mise à jour des données est reçue du serveur, le script met à jour le `localStorage` en conséquence.
- **Observation des changements :** Le script surveille les changements dans le `localStorage` et envoie les modifications au serveur.

### Installation

1. Installez Tampermonkey dans votre navigateur (Chrome, Firefox, etc.).

2. Créez un nouveau script dans Tampermonkey et collez le code ci-dessous.

3. Remplacez `TON HEBERGEUR ICI` par l'adresse de votre serveur Socket.IO.

4. Enregistrez et activez le script.

### Code UserScript

```javascript
// ==UserScript==
// @name         PhenixScans Sync
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Synchronise le localStorage avec le serveur Socket.IO
// @author       Voxary
// @match        https://phenixscans.fr/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.7.5/socket.io.min.js
// ==/UserScript==

(function() {
    'use strict';

    // Initialisation de la connexion avec le serveur Socket.IO
    const socket = io('TON HEBERGEUR ICI'); 

    socket.on('connect', () => {
        console.log('Connecté au serveur via Socket.IO');

        // À la connexion, récupérer les données du localStorage et les envoyer au serveur
        let localData = {};
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                localData[key] = localStorage.getItem(key);
            }
        }

        console.log('Envoi des données locales au serveur:', localData);
        socket.emit('updateStorage', localData);
    });

    // Écoute des mises à jour depuis le serveur et mise à jour du localStorage
    socket.on('storageUpdated', (data) => {
        console.log('Données reçues du serveur pour mise à jour :', data);

        // Fusionner les nouvelles données avec celles du localStorage
        for (let key in data) {
            localStorage.setItem(key, data[key]);
        }

        console.log('LocalStorage mis à jour avec les nouvelles données:', data);
    });

    // Observer les changements dans le localStorage
    window.addEventListener('storage', (event) => {
        console.log('Changement dans le localStorage détecté:', event);

        // Envoyer les nouvelles données au serveur
        let updatedData = {};
        updatedData[event.key] = event.newValue;
        socket.emit('updateStorage', updatedData);
    });

})();
```
