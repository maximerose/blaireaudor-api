<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260228183516 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE action (description VARCHAR(255) NOT NULL, points INT NOT NULL, status VARCHAR(255) NOT NULL, id UUID NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, player_id UUID NOT NULL, competition_id UUID NOT NULL, created_by_id UUID DEFAULT NULL, updated_by_id UUID DEFAULT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE INDEX IDX_47CC8C9299E6F5DF ON action (player_id)');
        $this->addSql('CREATE INDEX IDX_47CC8C927B39D312 ON action (competition_id)');
        $this->addSql('CREATE INDEX IDX_47CC8C92B03A8386 ON action (created_by_id)');
        $this->addSql('CREATE INDEX IDX_47CC8C92896DBBDE ON action (updated_by_id)');
        $this->addSql('ALTER TABLE action ADD CONSTRAINT FK_47CC8C9299E6F5DF FOREIGN KEY (player_id) REFERENCES player (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE action ADD CONSTRAINT FK_47CC8C927B39D312 FOREIGN KEY (competition_id) REFERENCES competition (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE action ADD CONSTRAINT FK_47CC8C92B03A8386 FOREIGN KEY (created_by_id) REFERENCES "user" (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE action ADD CONSTRAINT FK_47CC8C92896DBBDE FOREIGN KEY (updated_by_id) REFERENCES "user" (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE competition ALTER created_by_id DROP NOT NULL');
        $this->addSql('ALTER TABLE player ALTER created_by_id DROP NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE action DROP CONSTRAINT FK_47CC8C9299E6F5DF');
        $this->addSql('ALTER TABLE action DROP CONSTRAINT FK_47CC8C927B39D312');
        $this->addSql('ALTER TABLE action DROP CONSTRAINT FK_47CC8C92B03A8386');
        $this->addSql('ALTER TABLE action DROP CONSTRAINT FK_47CC8C92896DBBDE');
        $this->addSql('DROP TABLE action');
        $this->addSql('ALTER TABLE competition ALTER created_by_id SET NOT NULL');
        $this->addSql('ALTER TABLE player ALTER created_by_id SET NOT NULL');
    }
}
