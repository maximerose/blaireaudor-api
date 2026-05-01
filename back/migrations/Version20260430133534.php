<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260430133534 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE bonus_day (date DATE NOT NULL, multiplier INT NOT NULL, id UUID NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, competition_id UUID NOT NULL, created_by_id UUID DEFAULT NULL, updated_by_id UUID DEFAULT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE INDEX IDX_2ACCD1387B39D312 ON bonus_day (competition_id)');
        $this->addSql('CREATE INDEX IDX_2ACCD138B03A8386 ON bonus_day (created_by_id)');
        $this->addSql('CREATE INDEX IDX_2ACCD138896DBBDE ON bonus_day (updated_by_id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_COMPETITION_DATE ON bonus_day (competition_id, date)');
        $this->addSql('ALTER TABLE bonus_day ADD CONSTRAINT FK_2ACCD1387B39D312 FOREIGN KEY (competition_id) REFERENCES competition (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE bonus_day ADD CONSTRAINT FK_2ACCD138B03A8386 FOREIGN KEY (created_by_id) REFERENCES "user" (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE bonus_day ADD CONSTRAINT FK_2ACCD138896DBBDE FOREIGN KEY (updated_by_id) REFERENCES "user" (id) NOT DEFERRABLE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE bonus_day DROP CONSTRAINT FK_2ACCD1387B39D312');
        $this->addSql('ALTER TABLE bonus_day DROP CONSTRAINT FK_2ACCD138B03A8386');
        $this->addSql('ALTER TABLE bonus_day DROP CONSTRAINT FK_2ACCD138896DBBDE');
        $this->addSql('DROP TABLE bonus_day');
    }
}
