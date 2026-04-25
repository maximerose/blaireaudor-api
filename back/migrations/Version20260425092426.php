<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260425092426 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE competition DROP CONSTRAINT fk_b50a2cb14a087ca2');
        $this->addSql('ALTER TABLE competition ADD CONSTRAINT FK_B50A2CB14A087CA2 FOREIGN KEY (referee_id) REFERENCES player (id) NOT DEFERRABLE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE competition DROP CONSTRAINT FK_B50A2CB14A087CA2');
        $this->addSql('ALTER TABLE competition ADD CONSTRAINT fk_b50a2cb14a087ca2 FOREIGN KEY (referee_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }
}
