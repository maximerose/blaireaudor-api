<?php
// back/public/deploy.php

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

// Le script principal à exécuter en arrière-plan
$scriptPath = dirname(__DIR__) . '/runner.php';

// Création du script runner.php s'il n'existe pas
$runnerCode = <<<PHP
<?php
chdir(dirname(__DIR__));

// Extraction du ZIP
\$zipFile = 'vendor.zip';
if (file_exists(\$zipFile)) {
    \$zip = new ZipArchive;
    if (\$zip->open(\$zipFile) === TRUE) {
        \$zip->extractTo('./');
        \$zip->close();
        unlink(\$zipFile);
    }
}

// Commandes Symfony
exec('php bin/console cache:clear --env=prod');
exec('php bin/console doctrine:migrations:migrate -n --env=prod');
exec('php bin/console lexik:jwt:generate-keypair --skip-if-exists');
PHP;

file_put_contents($scriptPath, $runnerCode);

// Lancement de la commande en arrière-plan (Linux)
// On redirige les sorties vers un fichier log pour ne pas bloquer le script actuel
$command = "php " . escapeshellarg($scriptPath) . " > " . dirname(__DIR__) . "/deploy.log 2>&1 &";
exec($command);

echo "Déploiement lancé en arrière-plan avec succès ! Vérifiez le fichier deploy.log dans quelques secondes.";