<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260218115200 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE competition ADD created_by_id UUID NOT NULL');
        $this->addSql('ALTER TABLE competition ADD updated_by_id UUID DEFAULT NULL');
        $this->addSql('ALTER TABLE competition ADD CONSTRAINT FK_B50A2CB1B03A8386 FOREIGN KEY (created_by_id) REFERENCES "user" (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE competition ADD CONSTRAINT FK_B50A2CB1896DBBDE FOREIGN KEY (updated_by_id) REFERENCES "user" (id) NOT DEFERRABLE');
        $this->addSql('CREATE INDEX IDX_B50A2CB1B03A8386 ON competition (created_by_id)');
        $this->addSql('CREATE INDEX IDX_B50A2CB1896DBBDE ON competition (updated_by_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE competition DROP CONSTRAINT FK_B50A2CB1B03A8386');
        $this->addSql('ALTER TABLE competition DROP CONSTRAINT FK_B50A2CB1896DBBDE');
        $this->addSql('DROP INDEX IDX_B50A2CB1B03A8386');
        $this->addSql('DROP INDEX IDX_B50A2CB1896DBBDE');
        $this->addSql('ALTER TABLE competition DROP created_by_id');
        $this->addSql('ALTER TABLE competition DROP updated_by_id');
    }
}
