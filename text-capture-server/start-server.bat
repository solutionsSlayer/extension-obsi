@echo off
echo === Demarrage du serveur de capture de texte pour Obsidian ===
echo.

echo Verification d'Ollama...
curl -s http://localhost:11434/api/tags >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERREUR] Ollama n'est pas en cours d'execution. 
    echo Pour installer Ollama:
    echo 1. Telecharger depuis https://ollama.com/download
    echo 2. Executer l'installateur et demarrer Ollama
    echo 3. Relancer ce script
    echo.
    echo Appuyez sur une touche pour quitter...
    pause >nul
    exit /b 1
)

echo Verification du modele Llama 3.1...
curl -s http://localhost:11434/api/tags | findstr "llama3.1" >nul
if %ERRORLEVEL% NEQ 0 (
    echo [AVERTISSEMENT] Le modele llama3.1 n'est pas installe.
    echo Installation en cours...
    echo.
    echo Cela peut prendre quelques minutes selon votre connexion internet.
    echo.
    echo Si l'installation echoue, vous pouvez l'installer manuellement:
    echo ollama pull llama3.1
    echo.
    start /b /wait ollama pull llama3.1
    
    REM Verifier a nouveau apres l'installation
    curl -s http://localhost:11434/api/tags | findstr "llama3.1" >nul
    if %ERRORLEVEL% NEQ 0 (
        echo [ERREUR] L'installation automatique a echoue.
        echo Veuillez installer manuellement avec: ollama pull llama3.1
        echo.
        echo Appuyez sur une touche pour continuer quand meme...
        pause >nul
    ) else (
        echo [SUCCÉS] Modele llama3.1 installe avec succes!
    )
) else (
    echo [SUCCÉS] Modele llama3.1 trouve!
)

echo Verification du dossier Obsidian...
if not exist "E:\obsidian" (
    echo [ERREUR] Le coffre Obsidian n'est pas accessible a E:\obsidian
    echo Veuillez verifier le chemin dans server.js
    echo.
    echo Appuyez sur une touche pour quitter...
    pause >nul
    exit /b 1
)

echo Verification du dossier Notes Capturees...
if not exist "E:\obsidian\Notes Capturees" (
    echo Creation du dossier Notes Capturees...
    mkdir "E:\obsidian\Notes Capturees"
    echo [SUCCÉS] Dossier cree!
)

echo Verification des dependances Node.js...
cd "%~dp0"
npm list express cors http fs path >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Installation des dependances manquantes...
    npm install express cors
    if %ERRORLEVEL% NEQ 0 (
        echo [ERREUR] Erreur lors de l'installation des dependances.
        echo.
        echo Appuyez sur une touche pour quitter...
        pause >nul
        exit /b 1
    )
)

echo.
echo === Demarrage du serveur ===
echo Adresse: http://localhost:3000
echo.
echo Pour tester le serveur:
echo - Executez test-ollama.js pour verifier l'integration avec Ollama
echo - Installez l'extension navigateur pour capturer du texte
echo.
echo Appuyez sur Ctrl+C pour arreter le serveur
echo.

node server.js

echo.
echo Serveur arrete.
echo.
echo Appuyez sur une touche pour quitter...
pause >nul
