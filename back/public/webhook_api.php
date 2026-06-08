<?php
$envLocalPath = dirname(__DIR__) . '/.env.local';
$expectedSecret = null;

// 1. On lit le secret dans le serveur
if (file_exists($envLocalPath)) {
    $lines = file($envLocalPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (str_starts_with(trim($line), 'DEPLOY_SECRET=')) {
            $expectedSecret = trim(explode('=', $line, 2)[1], " \t\n\r\0\x0B\"'");
            break;
        }
    }
}

// 2. On vérifie le secret passé dans l'URL (?secret=...)
if (!$expectedSecret || ($_GET['secret'] ?? '') !== $expectedSecret) {
    header('HTTP/1.1 403 Forbidden');
    die('Accès refusé.');
}

// 3. On crée le script de travail en arrière-plan
$scriptPath = dirname(__DIR__) . '/runner.php';
$runnerCode = <<<PHP
<?php
chdir(dirname(__DIR__));

\$zipFile = 'vendor.zip';
if (file_exists(\$zipFile)) {
    \$zip = new ZipArchive;
    if (\$zip->open(\$zipFile) === TRUE) {
        \$zip->extractTo('./');
        \$zip->close();
        unlink(\$zipFile);
    }
}

exec('php bin/console cache:clear --env=prod');
exec('php bin/console doctrine:migrations:migrate -n --env=prod');
exec('php bin/console lexik:jwt:generate-keypair --skip-if-exists');
PHP;

file_put_contents($scriptPath, $runnerCode);

// 4. On lance le travailur dans l'ombre et on répond tout de suite à GitHub !
exec("php " . escapeshellarg($scriptPath) . " > " . dirname(__DIR__) . "/deploy.log 2>&1 &");

echo "✅ Webhook reçu avec succès ! Le ZIP va être extrait en arrière-plan.";