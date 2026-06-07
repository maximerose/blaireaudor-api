<?php

// 1. Sécurisation par clé secrète pour éviter que n'importe qui ne déclenche le script
$secret = $_GET['secret'] ?? null;
$expectedSecret = 'BlaireauDorFaitDuDevOpsEn2026'; 

if ($secret !== $expectedSecret) {
    header('HTTP/1.1 403 Forbidden');
    die('Accès refusé.');
}

header('Content-Type: text/plain');
echo "🚀 Démarrage des tâches post-déploiement Symfony...\n\n";

// Se positionner à la racine du dossier back
chdir(dirname(__DIR__));

echo "1. Nettoyage du cache de production...\n";
passthru('php bin/console cache:clear --env=prod 2>&1');

echo "\n2. Exécution des migrations de base de données...\n";
passthru('php bin/console doctrine:migrations:migrate -n --env=prod 2>&1');

echo "\n3. Vérification des clés de chiffrement JWT...\n";
passthru('php bin/console lexik:jwt:generate-keypair --skip-if-exists 2>&1');

echo "\n✅ Tout est synchronisé avec succès !";