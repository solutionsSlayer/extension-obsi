const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const http = require('http');

const app = express();
const PORT = 3000;

// Chemins vers les outils MCP
const OBSIDIAN_VAULT_PATH = path.resolve('E:/obsidian');
const NOTES_FOLDER = 'Notes Capturées';

// Middleware
app.use(cors());
app.use(express.json());

// Route de santé pour vérifier que le serveur fonctionne
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Route pour capturer du texte
app.post('/capture', async (req, res) => {
  try {
    const { text, style, source, title } = req.body;
    
    if (!text || !style) {
      return res.status(400).json({ 
        success: false, 
        message: 'Le texte et le style sont requis' 
      });
    }

    // Créer un titre pour la note basé sur le titre de la page web
    const safeTitle = (title || 'Note sans titre')
      .replace(/[\\/:*?"<>|]/g, '_')  // Remplacer les caractères non valides
      .substring(0, 50);  // Limiter la longueur
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `${safeTitle}_${timestamp}.md`;
    const filePath = path.join(NOTES_FOLDER, fileName);

    // Construire le prompt pour Llama 3.1
    const prompt = `
Voici un texte capturé depuis une page web: "${text}"

Transforme ce texte en une note structurée dans le style "${style}".

Information sur la source:
- URL: ${source || 'Non disponible'}
- Titre: ${title || 'Non disponible'}
- Date de capture: ${new Date().toLocaleDateString()}

Formate la note en Markdown pour Obsidian.
`;

    // Traiter le texte avec Llama 3.1 via Ollama
    processWithOllama(prompt, async (processedContent) => {
      if (!processedContent) {
        return res.status(500).json({
          success: false,
          message: 'Erreur lors du traitement du texte avec Ollama'
        });
      }

      // Créer la note dans Obsidian
      try {
        await createObsidianNote(filePath, processedContent);
        res.status(200).json({
          success: true,
          message: 'Note créée avec succès',
          path: filePath
        });
      } catch (error) {
        console.error('Erreur de création de note:', error);
        res.status(500).json({
          success: false,
          message: 'Erreur lors de la création de la note dans Obsidian'
        });
      }
    });
  } catch (error) {
    console.error('Erreur serveur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
});

// Fonction pour traiter le texte avec Ollama directement
function processWithOllama(prompt, callback) {
  console.log('Prompt envoyé à Ollama:');
  console.log('-----------------------------------');
  console.log(prompt);
  console.log('-----------------------------------');
  
  // Préparation des données pour l'API Ollama
  const requestData = JSON.stringify({
    model: "llama3.1:latest",
    prompt: prompt,
    stream: false
  });
  
  // Options pour la requête HTTP
  const options = {
    hostname: 'localhost',
    port: 11434,
    path: '/api/generate',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(requestData)
    }
  };
  
  console.log('Envoi de la requête à Ollama...');
  
  // Création de la requête HTTP
  const req = http.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      if (res.statusCode !== 200) {
        console.error(`Erreur Ollama: Code ${res.statusCode}`);
        console.error(`Réponse: ${data}`);
        const fallbackNote = generateFallbackNote(prompt);
        callback(fallbackNote);
        return;
      }
      
      try {
        const response = JSON.parse(data);
        if (response.response) {
          console.log('Réponse d\'Ollama obtenue avec succès:');
          console.log('-----------------------------------');
          console.log(response.response.substring(0, 200) + '...');
          console.log('-----------------------------------');
          callback(response.response);
        } else {
          console.error('Réponse Ollama sans contenu:', response);
          const fallbackNote = generateFallbackNote(prompt);
          callback(fallbackNote);
        }
      } catch (error) {
        console.error('Erreur de parsing de la réponse Ollama:', error);
        const fallbackNote = generateFallbackNote(prompt);
        callback(fallbackNote);
      }
    });
  });
  
  req.on('error', (error) => {
    console.error('Erreur de communication avec Ollama:', error);
    
    // Tentative de vérifier si Ollama est en cours d'exécution
    const checkOllama = http.request({
      hostname: 'localhost',
      port: 11434,
      path: '/api/tags',
      method: 'GET'
    }, (checkRes) => {
      console.log(`Statut du serveur Ollama: ${checkRes.statusCode}`);
      if (checkRes.statusCode === 200) {
        console.error('Ollama est en cours d\'exécution mais a rencontré une erreur lors du traitement.');
      } else {
        console.error('Ollama ne semble pas être en cours d\'exécution correctement.');
      }
      
      const fallbackNote = generateFallbackNote(prompt);
      callback(fallbackNote);
    });
    
    checkOllama.on('error', () => {
      console.error('Ollama ne semble pas être en cours d\'exécution.');
      const fallbackNote = generateFallbackNote(prompt);
      callback(fallbackNote);
    });
    
    checkOllama.end();
  });
  
  // Envoi des données
  req.write(requestData);
  req.end();
}

// Fonction pour générer une note de repli en cas d'échec d'Ollama
function generateFallbackNote(prompt) {
  try {
    // Extraire les informations essentielles du prompt
    const textMatch = prompt.match(/"([^"]+)"/); 
    const styleMatch = prompt.match(/style "([^"]+)"/); 
    const sourceMatch = prompt.match(/URL: ([^\n]+)/); 
    const titleMatch = prompt.match(/Titre: ([^\n]+)/); 
    const dateMatch = prompt.match(/Date de capture: ([^\n]+)/); 
    
    const text = textMatch ? textMatch[1] : 'Texte non disponible';
    const style = styleMatch ? styleMatch[1] : 'standard';
    const source = sourceMatch ? sourceMatch[1] : 'Source non disponible';
    const title = titleMatch ? titleMatch[1] : 'Titre non disponible';
    const date = dateMatch ? dateMatch[1] : new Date().toLocaleDateString();
    
    return `# Note capturée (style: ${style})

${text}

---

**Source:** [${title}](${source})
**Date de capture:** ${date}

> Note: Cette note a été générée automatiquement suite à un problème de traitement avec Ollama.`;
  } catch (e) {
    console.error('Erreur lors de la génération de la note de repli:', e);
    return `# Note capturée

Impossible de traiter le texte avec Ollama.

${new Date().toISOString()}`;
  }
}

// Fonction pour créer une note dans Obsidian via écriture directe
async function createObsidianNote(filePath, content) {
  return new Promise((resolve, reject) => {
    try {
      const fullPath = path.join(OBSIDIAN_VAULT_PATH, filePath);
      const dirPath = path.dirname(fullPath);
      
      // Créer le répertoire s'il n'existe pas
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
      
      // Écrire directement le fichier
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`Note créée avec succès à: ${fullPath}`);
      resolve("Note créée avec succès");
    } catch (error) {
      console.error('Erreur lors de la création de la note:', error);
      reject(error);
    }
  });
}

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur écoute sur le port ${PORT}`);
  console.log(`Obsidian vault: ${OBSIDIAN_VAULT_PATH}`);
  
  // Vérifier si Ollama est accessible au démarrage
  const checkOllama = http.request({
    hostname: 'localhost',
    port: 11434,
    path: '/api/tags',
    method: 'GET'
  }, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      if (res.statusCode === 200) {
        try {
          const models = JSON.parse(data);
          const llama31 = models.models.find(m => m.name.includes('llama3.1'));
          
          if (llama31) {
            console.log(`Ollama est accessible avec llama3.1 (${llama31.name})`);
          } else {
            console.warn('Ollama est accessible mais le modèle llama3.1 n\'a pas été trouvé.');
            console.warn('Modèles disponibles:', models.models.map(m => m.name).join(', '));
          }
        } catch (error) {
          console.error('Erreur lors du parsing de la réponse Ollama:', error);
        }
      } else {
        console.error(`Erreur de connexion à Ollama: Code ${res.statusCode}`);
      }
    });
  });
  
  checkOllama.on('error', (error) => {
    console.error('Erreur de connexion à Ollama:', error.message);
    console.error('Assurez-vous qu\'Ollama est en cours d\'exécution sur http://localhost:11434');
  });
  
  checkOllama.end();
});
