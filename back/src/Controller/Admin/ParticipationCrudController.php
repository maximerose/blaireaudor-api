<?php

declare(strict_types=1);

namespace App\Controller\Admin;

use App\Entity\Competition;
use App\Entity\Participation;
use Doctrine\ORM\EntityManagerInterface;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Context\AdminContext;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IntegerField;
use EasyCorp\Bundle\EasyAdminBundle\Router\AdminUrlGenerator;
use Symfony\Component\HttpFoundation\RedirectResponse;

final class ParticipationCrudController extends AbstractCrudController
{
    public function __construct(
        private AdminUrlGenerator $adminUrlGenerator,
        private EntityManagerInterface $entityManager,
    ) {
    }

    public static function getEntityFqcn(): string
    {
        return Participation::class;
    }

    // Interception de l'URL pour pré-remplir la compétition
    public function createEntity(string $entityFqcn): Participation
    {
        $participation = new Participation();

        $competitionId = $this->getContext()?->getRequest()->query->get('competition_id');

        if ($competitionId) {
            $competition = $this->entityManager->getRepository(Competition::class)->find($competitionId);

            if ($competition) {
                $participation->setCompetition($competition);
            }
        }

        return $participation;
    }

    public function configureFields(string $pageName): iterable
    {
        yield IdField::new('id')->hideOnForm();

        // On masque la compétition sur le formulaire car elle est pré-remplie automatiquement
        yield AssociationField::new('competition', 'Compétition')->hideOnForm();

        yield AssociationField::new('player', 'Joueur');

        yield IntegerField::new('score', 'Score (historique)')
            ->setHelp('Permet de forcer un score manuel si la compétition n\'a pas le détail des actions.');
    }

    // Redirection automatique vers le Dashboard de la compétition
    protected function getRedirectResponseAfterSave(AdminContext $context, string $action): RedirectResponse
    {
        /** @var Participation $participation */
        $participation = $context->getEntity()->getInstance();
        $competition = $participation->getCompetition();

        if (null !== $competition) {
            return $this->redirect(
                $this->adminUrlGenerator
                    ->unsetAll()
                    ->setController(CompetitionCrudController::class)
                    ->setAction(Crud::PAGE_DETAIL)
                    ->setEntityId($competition->getId())
                    ->generateUrl()
            );
        }

        return parent::getRedirectResponseAfterSave($context, $action);
    }
}
