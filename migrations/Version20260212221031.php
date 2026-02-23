<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260212221031 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE competition (name VARCHAR(255) NOT NULL, start_date TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, end_date TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, is_finished BOOLEAN NOT NULL, id UUID NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE TABLE participation (score INT NOT NULL, id UUID NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, challenger_id UUID NOT NULL, competition_id UUID NOT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE INDEX IDX_AB55E24F2D521FDF ON participation (challenger_id)');
        $this->addSql('CREATE INDEX IDX_AB55E24F7B39D312 ON participation (competition_id)');
        $this->addSql('ALTER TABLE participation ADD CONSTRAINT FK_AB55E24F2D521FDF FOREIGN KEY (challenger_id) REFERENCES "user" (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE participation ADD CONSTRAINT FK_AB55E24F7B39D312 FOREIGN KEY (competition_id) REFERENCES competition (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE "user" ADD created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL');
        $this->addSql('ALTER TABLE "user" ADD updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE participation DROP CONSTRAINT FK_AB55E24F2D521FDF');
        $this->addSql('ALTER TABLE participation DROP CONSTRAINT FK_AB55E24F7B39D312');
        $this->addSql('DROP TABLE competition');
        $this->addSql('DROP TABLE participation');
        $this->addSql('ALTER TABLE "user" DROP created_at');
        $this->addSql('ALTER TABLE "user" DROP updated_at');
    }
}
