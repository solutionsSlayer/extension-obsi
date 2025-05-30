const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Chemins
const OBSIDIAN_VAULT_PATH = path.resolve('E:/obsidian');

console.log('=== Test de connectivité aux services ===');

// Test 1: Vérifier Python
console.log('\n1. Test de Python...');
exec('python --version', (err, stdout, stderr) => {
  if (err) {
    console.error('❌ Python n\'est pas accessible. Erreur:', err.message);
  } else {
    console.log(`✅ Python détecté: ${stdout.trim()}`);
  }
  
  // Test 2: Vérifier l'accès au coffre Obsidian
  console.log('\n2. Test d\'accès au coffre Obsidian...');
  if (fs.existsSync(OBSIDIAN_VAULT_PATH)) {
    console.log(`✅ Coffre Obsidian accessible: ${OBSIDIAN_VAULT_PATH}`);
    
    // Vérifier le dossier Notes Capturées
    const notesFolderPath = path.join(OBSIDIAN_VAULT_PATH, 'Notes Capturées');
    if (fs.existsSync(notesFolderPath)) {
      console.log(`✅ Dossier Notes Capturées trouvé: ${notesFolderPath}`);
    } else {
      console.log(`⚠️ Dossier Notes Capturées non trouvé, tentative de création...`);
      try {
        fs.mkdirSync(notesFolderPath, { recursive: true });
        console.log(`✅ Dossier Notes Capturées créé: ${notesFolderPath}`);
      } catch (e) {
        console.error(`❌ Impossible de créer le dossier Notes Capturées: ${e.message}`);
      }
    }
  } else {
    console.error(`❌ Coffre Obsidian inaccessible: ${OBSIDIAN_VAULT_PATH}`);
  }
  
  // Test 3: Vérifier Ollama
  console.log('\n3. Test de connexion à Ollama...');
  exec('curl -s http://localhost:11434/api/tags', (ollamaErr, ollamaOut) => {
    if (ollamaErr) {
      console.error('❌ Impossible de se connecter à Ollama. Erreur:', ollamaErr.message);
      console.log('⚠️ Assurez-vous qu\'Ollama est installé et en cours d\'exécution sur http://localhost:11434');
    } else {
      try {
        const models = JSON.parse(ollamaOut);
        if (models && models.models) {
          console.log('✅ Ollama détecté et fonctionne correctement');
          
          // Vérifier si llama3.1 est disponible
          const llama31Model = models.models.find(m => m.name.includes('llama3.1'));
          if (llama31Model) {
            console.log(`✅ Modèle llama3.1 trouvé: ${llama31Model.name}`);
          } else {
            console.log('⚠️ Modèle llama3.1 non trouvé. Modèles disponibles:');
            models.models.forEach(m => console.log(`  - ${m.name}`));
          }
        } else {
          console.error('❌ Réponse Ollama invalide:', ollamaOut);
        }
      } catch (e) {
        console.error('❌ Erreur de parsing de la réponse Ollama:', e.message);
        console.error('Réponse brute:', ollamaOut);
      }
    }
    
    console.log('\n=== Fin des tests ===');
  });
});
