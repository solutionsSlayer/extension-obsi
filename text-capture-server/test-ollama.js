/**
 * Script de test pour vérifier l'intégration d'Ollama
 */
const http = require('http');

// Prompt de test simple
const testPrompt = 'Écris un court poème sur le printemps.';

console.log('=== Test d\'intégration Ollama ===');
console.log(`Envoi du prompt: "${testPrompt}"`);
console.log('');

// Préparation des données pour l'API Ollama
const requestData = JSON.stringify({
  model: "llama3.1:latest",
  prompt: testPrompt,
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

console.log('Envoi de la requête...');

// Création de la requête HTTP
const req = http.request(options, (res) => {
  console.log(`Statut de la réponse: ${res.statusCode}`);
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      console.log('\n=== Réponse reçue d\'Ollama ===');
      
      if (response.response) {
        console.log('Contenu généré:');
        console.log('-----------------');
        console.log(response.response);
        console.log('-----------------');
        console.log(`\nTemps d'exécution: ${response.total_duration / 1000000000} secondes`);
        console.log('\n✅ Test réussi: Ollama fonctionne correctement!');
      } else {
        console.error('❌ Erreur: Réponse sans contenu généré');
        console.error(response);
      }
    } catch (error) {
      console.error('❌ Erreur de parsing de la réponse:', error);
      console.error('Données brutes reçues:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Erreur de connexion à Ollama:', error.message);
  console.error('Assurez-vous qu\'Ollama est en cours d\'exécution sur http://localhost:11434');
});

// Envoi des données
req.write(requestData);
req.end();
