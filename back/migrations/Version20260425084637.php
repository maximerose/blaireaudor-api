<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260425084637 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE competition ADD referee_id UUID DEFAULT NULL');
        $this->addSql('UPDATE competition SET referee_id = created_by_id');
        $this->addSql('ALTER TABLE competition ALTER COLUMN referee_id SET NOT NULL');
        $this->addSql('ALTER TABLE competition ADD CONSTRAINT FK_B50A2CB14A087CA2 FOREIGN KEY (referee_id) REFERENCES "user" (id) NOT DEFERRABLE');
        $this->addSql('CREATE INDEX IDX_B50A2CB14A087CA2 ON competition (referee_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE competition DROP CONSTRAINT FK_B50A2CB14A087CA2');
        $this->addSql('DROP INDEX IDX_B50A2CB14A087CA2');
        $this->addSql('ALTER TABLE competition DROP referee_id');
    }
}
