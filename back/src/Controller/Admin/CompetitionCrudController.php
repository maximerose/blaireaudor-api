<?php

declare(strict_types=1);

namespace App\Controller\Admin;

use App\Constants\AdminConstants;
use App\Entity\Competition;
use EasyCorp\Bundle\EasyAdminBundle\Config\Action;
use EasyCorp\Bundle\EasyAdminBundle\Config\Actions;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\BooleanField;
use EasyCorp\Bundle\EasyAdminBundle\Field\CollectionField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateTimeField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Router\AdminUrlGenerator;

final class CompetitionCrudController extends AbstractCrudController
{
    public function __construct(
        private AdminUrlGenerator $adminUrlGenerator,
    ) {
    }

    public static function getEntityFqcn(): string
    {
        return Competition::class;
    }

    public function configureActions(Actions $actions): Actions
    {
        return $actions
            ->add(Crud::PAGE_INDEX, Action::DETAIL)
            ->remove(Crud::PAGE_INDEX, Action::EDIT);
    }

    public function configureFields(string $pageName): iterable
    {
        yield IdField::new('id')->hideOnForm();
        yield TextField::new('name', 'Nom');
        yield TextField::new('joinCode', 'Code d\'accès');
        yield DateTimeField::new('startDate', 'Début');
        yield DateTimeField::new('endDate', 'Fin');
        yield BooleanField::new('fogOfWar', 'Brouillard');
        yield AssociationField::new('createdBy', 'Créateur')->hideOnIndex();

        if (Crud::PAGE_INDEX === $pageName) {
            yield CollectionField::new('participations', 'Joueurs')
        ->formatValue(function ($value) {
            $count = is_countable($value) ? \count($value) : 0;

            return \sprintf('%d joueur%s', $count, $count > 1 ? 's' : '');
        });
        }

        if (Crud::PAGE_DETAIL === $pageName) {
            yield CollectionField::new('participations', AdminConstants::FIELD_COLLECTION_TITLE)
                ->setTemplatePath('admin/fields/competition_actions.html.twig')
                ->setCustomOption('admin_constants', AdminConstants::class)
                ->setCustomOption('url_generator', $this->adminUrlGenerator);
        }
    }
}
