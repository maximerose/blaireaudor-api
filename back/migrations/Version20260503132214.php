<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260503132214 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE action DROP CONSTRAINT fk_47cc8c9299e6f5df');
        $this->addSql('ALTER TABLE action DROP CONSTRAINT fk_47cc8c927b39d312');
        $this->addSql('DROP INDEX idx_47cc8c927b39d312');
        $this->addSql('DROP INDEX idx_47cc8c9299e6f5df');
        $this->addSql('ALTER TABLE action ADD participation_id UUID NULL');
        $this->addSql('UPDATE action a SET participation_id = p.id FROM participation p WHERE a.player_id = p.player_id AND a.competition_id = p.competition_id');
        $this->addSql('ALTER TABLE action ALTER COLUMN participation_id SET NOT NULL');
        $this->addSql('ALTER TABLE action DROP player_id');
        $this->addSql('ALTER TABLE action DROP competition_id');
        $this->addSql('ALTER TABLE action ADD CONSTRAINT FK_47CC8C926ACE3B73 FOREIGN KEY (participation_id) REFERENCES participation (id) NOT DEFERRABLE');
        $this->addSql('CREATE INDEX IDX_47CC8C926ACE3B73 ON action (participation_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE action DROP CONSTRAINT FK_47CC8C926ACE3B73');
        $this->addSql('DROP INDEX IDX_47CC8C926ACE3B73');
        $this->addSql('ALTER TABLE action ADD competition_id UUID NOT NULL');
        $this->addSql('ALTER TABLE action RENAME COLUMN participation_id TO player_id');
        $this->addSql('ALTER TABLE action ADD CONSTRAINT fk_47cc8c9299e6f5df FOREIGN KEY (player_id) REFERENCES player (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE action ADD CONSTRAINT fk_47cc8c927b39d312 FOREIGN KEY (competition_id) REFERENCES competition (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX idx_47cc8c927b39d312 ON action (competition_id)');
        $this->addSql('CREATE INDEX idx_47cc8c9299e6f5df ON action (player_id)');
    }
}
