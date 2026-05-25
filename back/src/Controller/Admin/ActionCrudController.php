<?php

declare(strict_types=1);

namespace App\Controller\Admin;

use App\Entity\Action;
use App\Enum\ActionStatus;
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
    ) {
    }

    public static function getEntityFqcn(): string
    {
        return Action::class;
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
                    ->setController('App\\Controller\\Admin\\CompetitionCrudController')
                    ->setAction(Crud::PAGE_DETAIL)
                    ->setEntityId($participation->getCompetition()->getId())
                    ->generateUrl()
            );
        }

        return parent::getRedirectResponseAfterSave($context, $action);
    }
}
