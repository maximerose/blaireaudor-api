<?php

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

$secret = $_GET['secret'] ?? null;

if (!$expectedSecret || $secret !== $expectedSecret) {
    header('HTTP/1.1 403 Forbidden');
    die('Accès refusé.');
}

header('Content-Type: text/plain');
echo "🚀 Démarrage des tâches post-déploiement directement sur o2switch...\n\n";

chdir(dirname(__DIR__));

echo "1. Installation des dépendances PHP (Composer) sur le serveur...\n";
passthru('composer install --no-dev --optimize-autoloader --no-interaction 2>&1');

echo "\n2. Nettoyage du cache de production...\n";
passthru('php bin/console cache:clear --env=prod 2>&1');

echo "\n3. Exécution des migrations de base de données...\n";
passthru('php bin/console doctrine:migrations:migrate -n --env=prod 2>&1');

echo "\n4. Vérification des clés de chiffrement JWT...\n";
passthru('php bin/console lexik:jwt:generate-keypair --skip-if-exists 2>&1');

echo "\n✅ Tout est installé et synchronisé avec succès !";