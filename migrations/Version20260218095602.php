<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260218095602 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE player (display_name VARCHAR(255) NOT NULL, username VARCHAR(255) NOT NULL, id UUID NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, associated_user_id UUID DEFAULT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_98197A65BC272CD1 ON player (associated_user_id)');
        $this->addSql('ALTER TABLE player ADD CONSTRAINT FK_98197A65BC272CD1 FOREIGN KEY (associated_user_id) REFERENCES "user" (id)');
        $this->addSql('ALTER TABLE competition ALTER is_finished SET DEFAULT false');
        $this->addSql('ALTER TABLE participation DROP CONSTRAINT fk_ab55e24f2d521fdf');
        $this->addSql('DROP INDEX unique_participation');
        $this->addSql('DROP INDEX idx_ab55e24f2d521fdf');
        $this->addSql('ALTER TABLE participation RENAME COLUMN challenger_id TO player_id');
        $this->addSql('ALTER TABLE participation ADD CONSTRAINT FK_AB55E24F99E6F5DF FOREIGN KEY (player_id) REFERENCES player (id) NOT DEFERRABLE');
        $this->addSql('CREATE INDEX IDX_AB55E24F99E6F5DF ON participation (player_id)');
        $this->addSql('CREATE UNIQUE INDEX unique_participation ON participation (player_id, competition_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE player DROP CONSTRAINT FK_98197A65BC272CD1');
        $this->addSql('DROP TABLE player');
        $this->addSql('ALTER TABLE competition ALTER is_finished DROP DEFAULT');
        $this->addSql('ALTER TABLE participation DROP CONSTRAINT FK_AB55E24F99E6F5DF');
        $this->addSql('DROP INDEX IDX_AB55E24F99E6F5DF');
        $this->addSql('DROP INDEX unique_participation');
        $this->addSql('ALTER TABLE participation RENAME COLUMN player_id TO challenger_id');
        $this->addSql('ALTER TABLE participation ADD CONSTRAINT fk_ab55e24f2d521fdf FOREIGN KEY (challenger_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX idx_ab55e24f2d521fdf ON participation (challenger_id)');
        $this->addSql('CREATE UNIQUE INDEX unique_participation ON participation (challenger_id, competition_id)');
    }
}
