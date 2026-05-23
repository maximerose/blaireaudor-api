<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260523083806 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Ajoute le champ slug à l’entité Player et convertit l’historique des displayName sans accents.';
    }

    public function up(Schema $schema): void
    {
        // 1. Ajout de la colonne en mode Nullable pour ne pas bloquer la table s'il y a déjà des lignes
        $this->addSql('ALTER TABLE player ADD slug VARCHAR(255) DEFAULT NULL');

        // 2. MIGRATION DES DONNÉES : Génération d'un slug de base universel (minuscules + tirets à la place des espaces)
        $this->addSql("UPDATE player SET slug = LOWER(REPLACE(display_name, ' ', '-'))");

        // Nettoyage chirurgical et PORTABLE des accents de tes blaireaux historiques (sans besoin d'extension BDD)
        $this->addSql("UPDATE player SET slug = REPLACE(slug, 'é', 'e')");
        $this->addSql("UPDATE player SET slug = REPLACE(slug, 'è', 'e')");
        $this->addSql("UPDATE player SET slug = REPLACE(slug, 'à', 'a');");

        // 3. Forçage de la contrainte NOT NULL maintenant que toute la table est propre
        $this->addSql('ALTER TABLE player ALTER slug SET NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE player DROP slug');
    }
}
