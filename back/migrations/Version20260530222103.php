<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260530222103 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE action DROP CONSTRAINT fk_47cc8c92b03a8386');
        $this->addSql('ALTER TABLE action DROP CONSTRAINT fk_47cc8c92896dbbde');
        $this->addSql('ALTER TABLE action ADD CONSTRAINT FK_47CC8C92B03A8386 FOREIGN KEY (created_by_id) REFERENCES "user" (id) ON DELETE SET NULL NOT DEFERRABLE');
        $this->addSql('ALTER TABLE action ADD CONSTRAINT FK_47CC8C92896DBBDE FOREIGN KEY (updated_by_id) REFERENCES "user" (id) ON DELETE SET NULL NOT DEFERRABLE');
        $this->addSql('ALTER TABLE bonus_day DROP CONSTRAINT fk_2accd138b03a8386');
        $this->addSql('ALTER TABLE bonus_day DROP CONSTRAINT fk_2accd138896dbbde');
        $this->addSql('ALTER TABLE bonus_day ADD CONSTRAINT FK_2ACCD138B03A8386 FOREIGN KEY (created_by_id) REFERENCES "user" (id) ON DELETE SET NULL NOT DEFERRABLE');
        $this->addSql('ALTER TABLE bonus_day ADD CONSTRAINT FK_2ACCD138896DBBDE FOREIGN KEY (updated_by_id) REFERENCES "user" (id) ON DELETE SET NULL NOT DEFERRABLE');
        $this->addSql('ALTER TABLE competition DROP CONSTRAINT fk_b50a2cb1b03a8386');
        $this->addSql('ALTER TABLE competition DROP CONSTRAINT fk_b50a2cb1896dbbde');
        $this->addSql('ALTER TABLE competition ADD CONSTRAINT FK_B50A2CB1B03A8386 FOREIGN KEY (created_by_id) REFERENCES "user" (id) ON DELETE SET NULL NOT DEFERRABLE');
        $this->addSql('ALTER TABLE competition ADD CONSTRAINT FK_B50A2CB1896DBBDE FOREIGN KEY (updated_by_id) REFERENCES "user" (id) ON DELETE SET NULL NOT DEFERRABLE');
        $this->addSql('ALTER TABLE player DROP CONSTRAINT fk_98197a65896dbbde');
        $this->addSql('ALTER TABLE player DROP CONSTRAINT fk_98197a65b03a8386');
        $this->addSql('ALTER TABLE player ADD CONSTRAINT FK_98197A65896DBBDE FOREIGN KEY (updated_by_id) REFERENCES "user" (id) ON DELETE SET NULL NOT DEFERRABLE');
        $this->addSql('ALTER TABLE player ADD CONSTRAINT FK_98197A65B03A8386 FOREIGN KEY (created_by_id) REFERENCES "user" (id) ON DELETE SET NULL NOT DEFERRABLE');
        $this->addSql('ALTER TABLE reset_password_request DROP CONSTRAINT fk_7ce748aa76ed395');
        $this->addSql('ALTER TABLE reset_password_request ADD CONSTRAINT FK_7CE748AA76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) ON DELETE CASCADE NOT DEFERRABLE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE action DROP CONSTRAINT FK_47CC8C92B03A8386');
        $this->addSql('ALTER TABLE action DROP CONSTRAINT FK_47CC8C92896DBBDE');
        $this->addSql('ALTER TABLE action ADD CONSTRAINT fk_47cc8c92b03a8386 FOREIGN KEY (created_by_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE action ADD CONSTRAINT fk_47cc8c92896dbbde FOREIGN KEY (updated_by_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE bonus_day DROP CONSTRAINT FK_2ACCD138B03A8386');
        $this->addSql('ALTER TABLE bonus_day DROP CONSTRAINT FK_2ACCD138896DBBDE');
        $this->addSql('ALTER TABLE bonus_day ADD CONSTRAINT fk_2accd138b03a8386 FOREIGN KEY (created_by_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE bonus_day ADD CONSTRAINT fk_2accd138896dbbde FOREIGN KEY (updated_by_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE competition DROP CONSTRAINT FK_B50A2CB1B03A8386');
        $this->addSql('ALTER TABLE competition DROP CONSTRAINT FK_B50A2CB1896DBBDE');
        $this->addSql('ALTER TABLE competition ADD CONSTRAINT fk_b50a2cb1b03a8386 FOREIGN KEY (created_by_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE competition ADD CONSTRAINT fk_b50a2cb1896dbbde FOREIGN KEY (updated_by_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE player DROP CONSTRAINT FK_98197A65B03A8386');
        $this->addSql('ALTER TABLE player DROP CONSTRAINT FK_98197A65896DBBDE');
        $this->addSql('ALTER TABLE player ADD CONSTRAINT fk_98197a65b03a8386 FOREIGN KEY (created_by_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE player ADD CONSTRAINT fk_98197a65896dbbde FOREIGN KEY (updated_by_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE reset_password_request DROP CONSTRAINT FK_7CE748AA76ED395');
        $this->addSql('ALTER TABLE reset_password_request ADD CONSTRAINT fk_7ce748aa76ed395 FOREIGN KEY (user_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }
}
