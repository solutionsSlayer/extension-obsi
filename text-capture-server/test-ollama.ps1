# Script de test pour vérifier l'intégration d'Ollama avec PowerShell

# Prompt de test simple
$testPrompt = "Écris un court poème sur le printemps."

Write-Host "=== Test d'intégration Ollama avec PowerShell ===" -ForegroundColor Cyan
Write-Host "Envoi du prompt: '$testPrompt'" -ForegroundColor Yellow
Write-Host ""

# Préparation des données pour l'API Ollama
$requestBody = @{
    model = "llama3.1:latest"
    prompt = $testPrompt
    stream = $false
} | ConvertTo-Json

try {
    Write-Host "Envoi de la requête..." -ForegroundColor Gray
    
    # Envoi de la requête à l'API Ollama
    $response = Invoke-RestMethod -Uri "http://localhost:11434/api/generate" -Method Post -Body $requestBody -ContentType "application/json" -ErrorAction Stop
    
    Write-Host "`n=== Réponse reçue d'Ollama ===" -ForegroundColor Green
    
    if ($response.response) {
        Write-Host "Contenu généré:" -ForegroundColor Cyan
        Write-Host "-----------------" -ForegroundColor Gray
        Write-Host $response.response -ForegroundColor White
        Write-Host "-----------------" -ForegroundColor Gray
        
        # Conversion de nanosecondes en secondes
        $executionTime = $response.total_duration / 1000000000
        Write-Host "`nTemps d'exécution: $executionTime secondes" -ForegroundColor Cyan
        
        Write-Host "`n✅ Test réussi: Ollama fonctionne correctement!" -ForegroundColor Green
    } else {
        Write-Host "❌ Erreur: Réponse sans contenu généré" -ForegroundColor Red
        Write-Host ($response | ConvertTo-Json -Depth 3) -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Erreur de connexion à Ollama: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Assurez-vous qu'Ollama est en cours d'exécution sur http://localhost:11434" -ForegroundColor Yellow
    
    # Tentative de vérification de l'état d'Ollama
    try {
        $ollamaStatus = Invoke-RestMethod -Uri "http://localhost:11434/api/tags" -Method Get -ErrorAction Stop
        Write-Host "`nOllama semble être en cours d'exécution, mais a rencontré une erreur lors du traitement." -ForegroundColor Yellow
        Write-Host "Modèles disponibles:" -ForegroundColor Cyan
        foreach ($model in $ollamaStatus.models) {
            Write-Host " - $($model.name)" -ForegroundColor White
        }
    } catch {
        Write-Host "`nOllama ne semble pas être en cours d'exécution." -ForegroundColor Red
    }
}
