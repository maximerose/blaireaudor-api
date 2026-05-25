<?php

declare(strict_types=1);

namespace App\Tests\Api;

use App\Enum\ActionStatus;
use App\Factory\ActionFactory;
use App\Factory\CompetitionFactory;
use App\Factory\ParticipationFactory;
use App\Factory\PlayerFactory;
use App\Factory\UserFactory;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Zenstruck\Foundry\Test\Factories;
use Zenstruck\Foundry\Test\ResetDatabase;

final class CareerStatsTest extends WebTestCase
{
    use ResetDatabase;
    use Factories;

    public function testMeProviderReturnsCalculatedStats(): void
    {
        $client = static::createClient();

        $user = UserFactory::createOne(['username' => 'victime', 'player' => PlayerFactory::new()]);
        $player = $user->getPlayer();
        $otherUser = UserFactory::createOne();
        $client->loginUser($user);

        // COMPÉTITION 1 : Clôturée dans le passé (Prise en compte pour le classement historique)
        $pastCompetition = CompetitionFactory::createOne([
            'startDate' => new \DateTimeImmutable('-10 days'),
            'endDate' => new \DateTimeImmutable('-2 days'),
        ]);
        $participationPastMe = ParticipationFactory::createOne(['competition' => $pastCompetition, 'player' => $player, 'score' => 40]);

        // Un concurrent fait un moins bon score (60 pts), un autre fait mieux (20 pts) -> "victime" doit être 2ème
        ParticipationFactory::createOne(['competition' => $pastCompetition, 'score' => 60]);
        ParticipationFactory::createOne(['competition' => $pastCompetition, 'score' => 20]);

        // COMPÉTITION 2 : En cours d'activité (Doit être IGNORÉE du calcul des rangs historiques)
        $activeCompetition = CompetitionFactory::createOne([
            'startDate' => new \DateTimeImmutable('-2 days'),
            'endDate' => new \DateTimeImmutable('+5 days'),
        ]);
        ParticipationFactory::createOne(['competition' => $activeCompetition, 'player' => $player, 'score' => 999]);

        // Actions Subies existantes pour le calcul du Karma
        ActionFactory::createOne(['participation' => $participationPastMe, 'createdBy' => $otherUser, 'points' => 40, 'status' => ActionStatus::VALIDATED, 'description' => 'Méfait historique']);

        // Délation (Calcul de Précision)
        $targetPart = ParticipationFactory::createOne(['competition' => $pastCompetition]);
        ActionFactory::createOne(['participation' => $targetPart, 'createdBy' => $user, 'points' => 30, 'status' => ActionStatus::VALIDATED]);

        $client->request('GET', '/api/me');

        $this->assertResponseIsSuccessful();
        $data = json_decode($client->getResponse()->getContent(), true);
        $stats = $data['stats'];

        // --- ASSERTIONS DU TICKET [STA-01] ---
        $this->assertArrayHasKey('best_rank', $stats);
        $this->assertArrayHasKey('worst_rank', $stats);
        
        // Le joueur doit être classé 2ème de la compétition archivée (Dense Rank : 60 > 40 > 20)
        $this->assertEquals(2, $stats['best_rank']);
        $this->assertEquals(2, $stats['worst_rank']);
    }
}
