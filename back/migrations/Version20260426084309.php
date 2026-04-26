<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260426084309 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE competition_player (competition_id UUID NOT NULL, player_id UUID NOT NULL, PRIMARY KEY (competition_id, player_id))');
        $this->addSql('CREATE INDEX IDX_F75ABAB67B39D312 ON competition_player (competition_id)');
        $this->addSql('CREATE INDEX IDX_F75ABAB699E6F5DF ON competition_player (player_id)');
        $this->addSql('ALTER TABLE competition_player ADD CONSTRAINT FK_F75ABAB67B39D312 FOREIGN KEY (competition_id) REFERENCES competition (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE competition_player ADD CONSTRAINT FK_F75ABAB699E6F5DF FOREIGN KEY (player_id) REFERENCES player (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE competition DROP CONSTRAINT fk_b50a2cb14a087ca2');
        $this->addSql('DROP INDEX idx_b50a2cb14a087ca2');
        $this->addSql('ALTER TABLE competition DROP referee_id');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE competition_player DROP CONSTRAINT FK_F75ABAB67B39D312');
        $this->addSql('ALTER TABLE competition_player DROP CONSTRAINT FK_F75ABAB699E6F5DF');
        $this->addSql('DROP TABLE competition_player');
        $this->addSql('ALTER TABLE competition ADD referee_id UUID DEFAULT NULL');
        $this->addSql('ALTER TABLE competition ADD CONSTRAINT fk_b50a2cb14a087ca2 FOREIGN KEY (referee_id) REFERENCES player (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX idx_b50a2cb14a087ca2 ON competition (referee_id)');
    }
}
