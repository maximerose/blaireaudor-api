<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260608085000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE action (description VARCHAR(255) NOT NULL, points INT NOT NULL, status VARCHAR(255) NOT NULL, date_action DATETIME NOT NULL, id BINARY(16) NOT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, participation_id BINARY(16) NOT NULL, created_by_id BINARY(16) DEFAULT NULL, updated_by_id BINARY(16) DEFAULT NULL, INDEX IDX_47CC8C926ACE3B73 (participation_id), INDEX IDX_47CC8C92B03A8386 (created_by_id), INDEX IDX_47CC8C92896DBBDE (updated_by_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE bonus_day (date DATE NOT NULL, multiplier INT NOT NULL, id BINARY(16) NOT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, competition_id BINARY(16) NOT NULL, created_by_id BINARY(16) DEFAULT NULL, updated_by_id BINARY(16) DEFAULT NULL, INDEX IDX_2ACCD1387B39D312 (competition_id), INDEX IDX_2ACCD138B03A8386 (created_by_id), INDEX IDX_2ACCD138896DBBDE (updated_by_id), UNIQUE INDEX UNIQ_COMPETITION_DATE (competition_id, date), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE competition (name VARCHAR(255) NOT NULL, join_code VARCHAR(25) NOT NULL, start_date DATETIME NOT NULL, end_date DATETIME DEFAULT NULL, fog_of_war TINYINT DEFAULT 1 NOT NULL, id BINARY(16) NOT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, created_by_id BINARY(16) DEFAULT NULL, updated_by_id BINARY(16) DEFAULT NULL, UNIQUE INDEX UNIQ_B50A2CB1E64D7D01 (join_code), INDEX IDX_B50A2CB1B03A8386 (created_by_id), INDEX IDX_B50A2CB1896DBBDE (updated_by_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE competition_player (competition_id BINARY(16) NOT NULL, player_id BINARY(16) NOT NULL, INDEX IDX_F75ABAB67B39D312 (competition_id), INDEX IDX_F75ABAB699E6F5DF (player_id), PRIMARY KEY (competition_id, player_id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE notification (title VARCHAR(255) NOT NULL, message LONGTEXT NOT NULL, type VARCHAR(50) NOT NULL, is_read TINYINT DEFAULT 0 NOT NULL, target_url VARCHAR(255) DEFAULT NULL, created_at DATETIME NOT NULL, id BINARY(16) NOT NULL, recipient_id BINARY(16) NOT NULL, INDEX IDX_BF5476CAE92F8F78 (recipient_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE participation (score INT DEFAULT 0 NOT NULL, id BINARY(16) NOT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, competition_id BINARY(16) NOT NULL, player_id BINARY(16) NOT NULL, INDEX IDX_AB55E24F7B39D312 (competition_id), INDEX IDX_AB55E24F99E6F5DF (player_id), UNIQUE INDEX unique_participation (player_id, competition_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE player (display_name VARCHAR(255) NOT NULL, slug VARCHAR(255) NOT NULL, username VARCHAR(255) NOT NULL, id BINARY(16) NOT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, associated_user_id BINARY(16) DEFAULT NULL, created_by_id BINARY(16) DEFAULT NULL, updated_by_id BINARY(16) DEFAULT NULL, UNIQUE INDEX UNIQ_98197A65BC272CD1 (associated_user_id), INDEX IDX_98197A65B03A8386 (created_by_id), INDEX IDX_98197A65896DBBDE (updated_by_id), UNIQUE INDEX UNIQ_PLAYER_USERNAME (username), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE push_subscription (endpoint LONGTEXT NOT NULL, p256dh VARCHAR(255) NOT NULL, auth VARCHAR(255) NOT NULL, id BINARY(16) NOT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, user_id BINARY(16) NOT NULL, INDEX IDX_562830F3A76ED395 (user_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE refresh_tokens (refresh_token VARCHAR(128) NOT NULL, username VARCHAR(255) NOT NULL, valid DATETIME NOT NULL, id INT AUTO_INCREMENT NOT NULL, UNIQUE INDEX UNIQ_9BACE7E1C74F2195 (refresh_token), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE reset_password_request (id INT AUTO_INCREMENT NOT NULL, selector VARCHAR(20) NOT NULL, hashed_token VARCHAR(100) NOT NULL, requested_at DATETIME NOT NULL, expires_at DATETIME NOT NULL, user_id BINARY(16) NOT NULL, INDEX IDX_7CE748AA76ED395 (user_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE `user` (username VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, notification_preferences JSON DEFAULT \'[]\' NOT NULL, id BINARY(16) NOT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, UNIQUE INDEX UNIQ_IDENTIFIER_USERNAME (username), UNIQUE INDEX UNIQ_IDENTIFIER_EMAIL (email), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('ALTER TABLE action ADD CONSTRAINT FK_47CC8C926ACE3B73 FOREIGN KEY (participation_id) REFERENCES participation (id)');
        $this->addSql('ALTER TABLE action ADD CONSTRAINT FK_47CC8C92B03A8386 FOREIGN KEY (created_by_id) REFERENCES `user` (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE action ADD CONSTRAINT FK_47CC8C92896DBBDE FOREIGN KEY (updated_by_id) REFERENCES `user` (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE bonus_day ADD CONSTRAINT FK_2ACCD1387B39D312 FOREIGN KEY (competition_id) REFERENCES competition (id)');
        $this->addSql('ALTER TABLE bonus_day ADD CONSTRAINT FK_2ACCD138B03A8386 FOREIGN KEY (created_by_id) REFERENCES `user` (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE bonus_day ADD CONSTRAINT FK_2ACCD138896DBBDE FOREIGN KEY (updated_by_id) REFERENCES `user` (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE competition ADD CONSTRAINT FK_B50A2CB1B03A8386 FOREIGN KEY (created_by_id) REFERENCES `user` (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE competition ADD CONSTRAINT FK_B50A2CB1896DBBDE FOREIGN KEY (updated_by_id) REFERENCES `user` (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE competition_player ADD CONSTRAINT FK_F75ABAB67B39D312 FOREIGN KEY (competition_id) REFERENCES competition (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE competition_player ADD CONSTRAINT FK_F75ABAB699E6F5DF FOREIGN KEY (player_id) REFERENCES player (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE notification ADD CONSTRAINT FK_BF5476CAE92F8F78 FOREIGN KEY (recipient_id) REFERENCES `user` (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE participation ADD CONSTRAINT FK_AB55E24F7B39D312 FOREIGN KEY (competition_id) REFERENCES competition (id)');
        $this->addSql('ALTER TABLE participation ADD CONSTRAINT FK_AB55E24F99E6F5DF FOREIGN KEY (player_id) REFERENCES player (id)');
        $this->addSql('ALTER TABLE player ADD CONSTRAINT FK_98197A65BC272CD1 FOREIGN KEY (associated_user_id) REFERENCES `user` (id)');
        $this->addSql('ALTER TABLE player ADD CONSTRAINT FK_98197A65B03A8386 FOREIGN KEY (created_by_id) REFERENCES `user` (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE player ADD CONSTRAINT FK_98197A65896DBBDE FOREIGN KEY (updated_by_id) REFERENCES `user` (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE push_subscription ADD CONSTRAINT FK_562830F3A76ED395 FOREIGN KEY (user_id) REFERENCES `user` (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE reset_password_request ADD CONSTRAINT FK_7CE748AA76ED395 FOREIGN KEY (user_id) REFERENCES `user` (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE action DROP FOREIGN KEY FK_47CC8C926ACE3B73');
        $this->addSql('ALTER TABLE action DROP FOREIGN KEY FK_47CC8C92B03A8386');
        $this->addSql('ALTER TABLE action DROP FOREIGN KEY FK_47CC8C92896DBBDE');
        $this->addSql('ALTER TABLE bonus_day DROP FOREIGN KEY FK_2ACCD1387B39D312');
        $this->addSql('ALTER TABLE bonus_day DROP FOREIGN KEY FK_2ACCD138B03A8386');
        $this->addSql('ALTER TABLE bonus_day DROP FOREIGN KEY FK_2ACCD138896DBBDE');
        $this->addSql('ALTER TABLE competition DROP FOREIGN KEY FK_B50A2CB1B03A8386');
        $this->addSql('ALTER TABLE competition DROP FOREIGN KEY FK_B50A2CB1896DBBDE');
        $this->addSql('ALTER TABLE competition_player DROP FOREIGN KEY FK_F75ABAB67B39D312');
        $this->addSql('ALTER TABLE competition_player DROP FOREIGN KEY FK_F75ABAB699E6F5DF');
        $this->addSql('ALTER TABLE notification DROP FOREIGN KEY FK_BF5476CAE92F8F78');
        $this->addSql('ALTER TABLE participation DROP FOREIGN KEY FK_AB55E24F7B39D312');
        $this->addSql('ALTER TABLE participation DROP FOREIGN KEY FK_AB55E24F99E6F5DF');
        $this->addSql('ALTER TABLE player DROP FOREIGN KEY FK_98197A65BC272CD1');
        $this->addSql('ALTER TABLE player DROP FOREIGN KEY FK_98197A65B03A8386');
        $this->addSql('ALTER TABLE player DROP FOREIGN KEY FK_98197A65896DBBDE');
        $this->addSql('ALTER TABLE push_subscription DROP FOREIGN KEY FK_562830F3A76ED395');
        $this->addSql('ALTER TABLE reset_password_request DROP FOREIGN KEY FK_7CE748AA76ED395');
        $this->addSql('DROP TABLE action');
        $this->addSql('DROP TABLE bonus_day');
        $this->addSql('DROP TABLE competition');
        $this->addSql('DROP TABLE competition_player');
        $this->addSql('DROP TABLE notification');
        $this->addSql('DROP TABLE participation');
        $this->addSql('DROP TABLE player');
        $this->addSql('DROP TABLE push_subscription');
        $this->addSql('DROP TABLE refresh_tokens');
        $this->addSql('DROP TABLE reset_password_request');
        $this->addSql('DROP TABLE `user`');
    }
}
