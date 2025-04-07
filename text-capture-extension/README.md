# Text Capture pour Obsidian

Cette extension navigateur permet de capturer le texte survolé ou sélectionné sur une page web, de le transformer avec un modèle Llama 3.1 local via Dolphin-MCP, et de l'enregistrer dans Obsidian.

## Fonctionnalités

- Capture de texte survolé ou sélectionné sur n'importe quelle page web
- Transformation du texte dans différents styles (historien, concis, analytique, créatif)
- Intégration avec Llama 3.1 en local via Dolphin-MCP
- Sauvegarde automatique dans Obsidian via Obsidian-MCP

## Prérequis

- Chrome ou Firefox
- Node.js et npm
- Dolphin-MCP configuré avec Llama 3.1 (situé à `C:\Users\DorianDOUSSAIN\Documents\projects\tools\dolphin-mcp`)
- Obsidian-MCP (situé à `C:\Users\DorianDOUSSAIN\Documents\projects\tools\obsidian-mcp`)
- Un coffre Obsidian (situé à `E:\obsidian`)

## Installation

### 1. Installation du serveur MCP

```bash
cd C:\Users\DorianDOUSSAIN\Documents\projects\tools\text-capture-server
npm install
npm start
```

### 2. Installation de l'extension dans Chrome

1. Ouvrez Chrome et naviguez vers `chrome://extensions/`
2. Activez le "Mode développeur" en haut à droite
3. Cliquez sur "Charger l'extension non empaquetée"
4. Sélectionnez le dossier `C:\Users\DorianDOUSSAIN\Documents\projects\tools\text-capture-extension`

### 3. Vérification

1. Une icône de l'extension devrait apparaître dans la barre d'outils de Chrome
2. Cliquez sur l'icône pour vérifier que le serveur MCP est connecté
3. Sélectionnez un style pour la transformation du texte

## Utilisation

1. Sur n'importe quelle page web, sélectionnez du texte
2. Faites un clic droit et choisissez "Capturer pour Obsidian"
3. Le texte sera capturé, transformé dans le style choisi, et enregistré dans Obsidian
4. Une notification apparaîtra pour confirmer le succès ou signaler une erreur

## Styles disponibles

- **Historien** : Analyse le texte d'un point de vue historique, contextualise l'information
- **Concis** : Résume le texte en points essentiels, élimine les détails superflus
- **Analytique** : Décompose le texte, identifie les arguments principaux, évalue les preuves
- **Créatif** : Reformule le contenu de manière originale, utilise des métaphores

## Structure du projet

- `text-capture-extension/` - Extension navigateur
  - `manifest.json` - Configuration de l'extension
  - `popup.html/js` - Interface utilisateur de l'extension
  - `background.js` - Gestion des menus contextuels et communications
  - `content.js` - Capture du texte sur la page web
  - `icons/` - Icônes de l'extension

- `text-capture-server/` - Serveur MCP local
  - `server.js` - API Express pour communiquer avec Dolphin-MCP et Obsidian-MCP
  - `package.json` - Dépendances du serveur

## Dépannage

- Si l'extension affiche "Serveur MCP non connecté", vérifiez que le serveur est en cours d'exécution (`npm start` dans le dossier du serveur)
- Si les notes ne sont pas créées dans Obsidian, vérifiez les chemins d'accès dans `server.js`
- Pour les problèmes avec Dolphin-MCP, consultez les journaux dans la console du serveur
