<?php

$envLocalPath = dirname(__DIR__) . '/.env.local';
$expectedSecret = null;
$phpBinary = null;

if (file_exists($envLocalPath)) {
    foreach (file($envLocalPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        if (str_starts_with(trim($line), 'DEPLOY_SECRET=')) {
            $expectedSecret = trim(explode('=', $line, 2)[1], " \t\n\r\0\x0B\"'");
        }
        if (str_starts_with(trim($line), 'PHP_PATH=')) {
            $phpBinary = trim(explode('=', $line, 2)[1], " \t\n\r\0\x0B\"'");
        }
    }
}

$secret = $_GET['secret'] ?? '';
if (!$expectedSecret || $secret !== $expectedSecret) {
    http_response_code(403);
    die("❌ Accès refusé.");
}

header('X-LiteSpeed-NoAbort: true');
set_time_limit(300);

echo "<pre style='background:#1e1e1e; color:#0f0; padding:20px; font-family:monospace;'>";
echo "🚀 Démarrage du déploiement...\n\n";

$logFile = dirname(__DIR__) . '/var/log/prod.log';
if (file_exists($logFile)) {
    $lines = file($logFile);
    $last = array_slice($lines, -30);
    foreach ($last as $line) {
        $decoded = json_decode($line, true);
        if ($decoded && isset($decoded['level_name']) && in_array($decoded['level_name'], ['ERROR', 'CRITICAL'])) {
            echo htmlspecialchars($decoded['datetime'] . ' [' . $decoded['level_name'] . '] ' . $decoded['message'] . "\n");
            if (!empty($decoded['context']['exception']['message'])) {
                echo htmlspecialchars('  → ' . $decoded['context']['exception']['message'] . "\n");
                echo htmlspecialchars('  → ' . ($decoded['context']['exception']['file'] ?? '') . "\n");
            }
        }
    }
}

echo "✅ Secret valide, autorisation accordée.\n";
chdir(dirname(__DIR__));

if (!$phpBinary) {
    $o2switchPhp84 = '/opt/cpanel/ea-php84/root/usr/bin/php';
    if (file_exists($o2switchPhp84)) {
        $phpBinary = $o2switchPhp84;
    } else {
        $currentBinary = defined('PHP_BINARY') ? PHP_BINARY : 'php';
        $phpBinary = preg_replace('/(lsphp|php-cgi)$/', 'php', $currentBinary);
    }
}

echo "🐘 Binaire PHP utilisé : $phpBinary\n\n";

$zipFile = dirname(__DIR__, 2) . '/deploy.zip';
if (file_exists($zipFile)) {
    echo "📦 Extraction de deploy.zip en cours...\n";
    $zip = new ZipArchive();
    if ($zip->open($zipFile) === true) {
        $zip->extractTo(dirname(__DIR__, 2) . '/');
        $zip->close();
        unlink($zipFile);
        echo "✅ ZIP extrait et supprimé.\n\n";
    } else {
        echo "❌ Erreur lors de l'extraction du ZIP.\n\n";
    }
} else {
    echo "ℹ️ Pas de deploy.zip trouvé.\n\n";
}

echo "⚙️ Exécution de cache:clear...\n";
system($phpBinary . ' bin/console cache:clear --env=prod 2>&1');

echo "\n\n⚙️ Exécution des migrations BDD...\n";
system($phpBinary . ' bin/console doctrine:migrations:migrate -n --env=prod 2>&1');

echo "\n\n⚙️ Génération des clés JWT...\n";
system($phpBinary . ' bin/console lexik:jwt:generate-keypair --skip-if-exists 2>&1');

echo "\n\n🎉 DÉPLOIEMENT TERMINÉ AVEC SUCCÈS !";
echo "</pre>";