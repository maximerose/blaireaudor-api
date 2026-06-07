<?php
// back/public/deploy.php

header('X-LiteSpeed-NoAbort: true');
set_time_limit(300);

// 1. Récupération du secret dans le .env.local
$envLocalPath = dirname(__DIR__) . '/.env.local';
$expectedSecret = null;

if (file_exists($envLocalPath)) {
    $lines = file($envLocalPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (str_starts_with(trim($line), 'DEPLOY_SECRET=')) {
            $parts = explode('=', $line, 2);
            $expectedSecret = trim($parts[1], " \t\n\r\0\x0B\"'");
            break;
        }
    }
}

$secret = $_SERVER['HTTP_X_DEPLOY_SECRET'] ?? null;
if (!$expectedSecret || $secret !== $expectedSecret) {
    header('HTTP/1.1 403 Forbidden');
    die('Accès refusé.');
}

header('Content-Type: text/plain');
echo "🚀 Démarrage de l'extraction à haute vitesse...\n\n";

chdir(dirname(__DIR__));

// 2. Désarchivage du dossier vendor
$zipFile = 'vendor.zip';
if (file_exists($zipFile)) {
    echo "1. Extraction de vendor.zip en cours...\n";
    $zip = new ZipArchive;
    if ($zip->open($zipFile) === TRUE) {
        $zip->extractTo('./');
        $zip->close();
        echo "✅ Dossier vendor extrait avec succès !\n";
        unlink($zipFile); // On supprime le zip après extraction
    } else {
        echo "❌ Échec du désarchivage de vendor.zip\n";
    }
} else {
    echo "ℹ️ vendor.zip introuvable, étape ignorée.\n";
}

echo "\n2. Nettoyage du cache Symfony...\n";
passthru('php bin/console cache:clear --env=prod 2>&1');

echo "\n3. Exécution des migrations de base de données...\n";
passthru('php bin/console doctrine:migrations:migrate -n --env=prod 2>&1');

echo "\n4. Clés de chiffrement JWT...\n";
passthru('php bin/console lexik:jwt:generate-keypair --skip-if-exists 2>&1');

echo "\n✨ Déploiement terminé avec succès !";