<?php

// On empêche le serveur de couper pour cause de délai (Litespeed)
header('X-LiteSpeed-NoAbort: true');
set_time_limit(300);

echo "<pre style='background:#1e1e1e; color:#0f0; padding:20px; font-family:monospace;'>";
echo "🚀 Démarrage du déploiement...\n\n";

$expectedSecret = null;
$envLocalPath = dirname(__DIR__) . '/.env.local';

// 1. On lit le secret sur le serveur
if (file_exists($envLocalPath)) {
    $lines = file($envLocalPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (str_starts_with(trim($line), 'DEPLOY_SECRET=')) {
            $expectedSecret = trim(explode('=', $line, 2)[1], " \t\n\r\0\x0B\"'");
            break;
        }

        if (str_starts_with($line, 'PHP_PATH=')) {
            $phpBinary = trim(explode('=', $line, 2)[1], " \t\n\r\0\x0B\"'");
        }
    }
}

// 2. On vérifie ton accès
$secret = $_GET['secret'] ?? '';
if (!$expectedSecret || $secret !== $expectedSecret) {
    die("❌ Accès refusé. Le secret est incorrect ou introuvable.");
}

echo "✅ Secret valide, autorisation accordée.\n";
chdir(dirname(__DIR__));

if (!$phpBinary) {
    // Chemin absolu officiel de cPanel o2switch pour PHP 8.4 CLI
    $o2switchPhp84 = '/opt/cpanel/ea-php84/root/usr/bin/php';

    if (file_exists($o2switchPhp84)) {
        $phpBinary = $o2switchPhp84;
    } else {
        // Détection dynamique de secours basée sur l'instance en cours d'exécution
        $currentBinary = defined('PHP_BINARY') ? PHP_BINARY : 'php';
        $phpBinary = preg_replace('/(lsphp|php-cgi)$/', 'php', $currentBinary);
    }
}

echo "🐘 Binaire PHP utilisé : $phpBinary\n\n";

// 3. Extraction du ZIP
$zipFile = dirname(__DIR__, 2) . '/deploy.zip'; // On cherche le zip à la racine de /blaireaudor/
if (file_exists($zipFile)) {
    echo "📦 Extraction de deploy.zip en cours...\n";
    $zip = new ZipArchive();
    if ($zip->open($zipFile) === true) {
        $zip->extractTo(dirname(__DIR__, 2) . '/'); // Extrait à la racine de /blaireaudor/
        $zip->close();
        unlink($zipFile);
        echo "✅ ZIP global extrait avec succès et supprimé.\n\n";
    } else {
        echo "❌ Erreur critique lors de l'extraction du ZIP.\n\n";
    }
} else {
    echo "ℹ️ Pas de deploy.zip trouvé à la racine.\n\n";
}

// 4. Commandes Symfony (on utilise system() pour voir la sortie en direct)
echo "⚙️ Exécution de cache:clear...\n";
system($phpBinary . ' bin/console cache:clear --env=prod 2>&1');

echo "\n\n⚙️ Exécution des migrations BDD...\n";
system($phpBinary . ' bin/console doctrine:migrations:migrate -n --env=prod 2>&1');

echo "\n\n⚙️ Génération des clés JWT...\n";
system($phpBinary . ' bin/console lexik:jwt:generate-keypair --skip-if-exists 2>&1');

echo "\n\n🎉 DÉPLOIEMENT TERMINÉ AVEC SUCCÈS !";
echo "</pre>";
