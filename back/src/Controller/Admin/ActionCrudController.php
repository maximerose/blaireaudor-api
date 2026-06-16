<?php

declare(strict_types=1);

namespace App\Controller\Admin;

use App\Entity\Action;
use App\Entity\Participation; // Ne pas oublier cet import
use App\Enum\ActionStatus;
use Doctrine\ORM\EntityManagerInterface; // Ne pas oublier cet import
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Context\AdminContext;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ChoiceField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateTimeField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IntegerField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Router\AdminUrlGenerator;
use Symfony\Component\HttpFoundation\RedirectResponse;

final class ActionCrudController extends AbstractCrudController
{
    public function __construct(
        private AdminUrlGenerator $adminUrlGenerator,
        private EntityManagerInterface $entityManager,
    ) {
    }

    public static function getEntityFqcn(): string
    {
        return Action::class;
    }

    // Nouvelle méthode pour pré-remplir la participation
    public function createEntity(string $entityFqcn): Action
    {
        $action = new Action();

        $participationId = $this->getContext()?->getRequest()->query->get('participation_id');

        if ($participationId) {
            $participation = $this->entityManager->getRepository(Participation::class)->find($participationId);

            if ($participation) {
                $action->setParticipation($participation);
            }
        }

        return $action;
    }

    public function configureFields(string $pageName): iterable
    {
        yield IdField::new('id')->hideOnForm();
        yield TextField::new('description', 'Méfait');
        yield IntegerField::new('points', 'Points');

        yield ChoiceField::new('status', 'Statut')->setChoices([
            'En attente' => ActionStatus::PENDING,
            'Validée' => ActionStatus::VALIDATED,
            'Refusée' => ActionStatus::REJECTED,
        ]);

        yield DateTimeField::new('dateAction', 'Date de l\'action');

        yield AssociationField::new('participation', 'Joueur & Compétition');
        yield AssociationField::new('createdBy', 'Dénoncé par')->hideOnForm();
    }

    protected function getRedirectResponseAfterSave(AdminContext $context, string $action): RedirectResponse
    {
        /** @var Action $entityInstance */
        $entityInstance = $context->getEntity()->getInstance();
        $participation = $entityInstance->getParticipation();

        if (null !== $participation && null !== $participation->getCompetition()) {
            return $this->redirect(
                $this->adminUrlGenerator
                    ->unsetAll() // Bonne pratique ici aussi avant une redirection
                    ->setController('App\\Controller\\Admin\\CompetitionCrudController')
                    ->setAction(Crud::PAGE_DETAIL)
                    ->setEntityId($participation->getCompetition()->getId())
                    ->generateUrl()
            );
        }

        return parent::getRedirectResponseAfterSave($context, $action);
    }
}
