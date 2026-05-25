<?php

declare(strict_types=1);

namespace App\Controller\Admin;

use App\Constants\AdminConstants;
use App\Entity\Player;
use EasyCorp\Bundle\EasyAdminBundle\Config\Action;
use EasyCorp\Bundle\EasyAdminBundle\Config\Actions;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Router\AdminUrlGenerator;

final class PlayerCrudController extends AbstractCrudController
{
    // Injection du générateur d'URL d'administration
    public function __construct(
        private readonly AdminUrlGenerator $adminUrlGenerator,
    ) {
    }

    public static function getEntityFqcn(): string
    {
        return Player::class;
    }

    /**
     * 🟢 ACCÈS DIRECT 1 : Un bouton d'action apparaît sur la ligne (Index) et sur la page de Détail.
     */
    public function configureActions(Actions $actions): Actions
    {
        $editUserAction = Action::new('editUser', AdminConstants::ACTION_EDIT_USER, 'fas fa-user-shield')
            ->linkToUrl(function (Player $player) {
                if (null === $player->getAssociatedUser()) {
                    return '#';
                }

                return $this->adminUrlGenerator
                    ->setController(UserCrudController::class)
                    ->setAction(Crud::PAGE_EDIT)
                    ->setEntityId($player->getAssociatedUser()->getId())
                    ->generateUrl();
            })
            // Le bouton ne s'affiche que si le joueur possède un vrai compte
            ->displayIf(static function (Player $player) {
                return null !== $player->getAssociatedUser();
            });

        return $actions
            ->add(Crud::PAGE_INDEX, $editUserAction)
            ->add(Crud::PAGE_DETAIL, $editUserAction);
    }

    public function configureFields(string $pageName): iterable
    {
        yield IdField::new('id')->hideOnForm();
        yield TextField::new('displayName', 'Nom d\'affichage');
        yield TextField::new('username', 'Pseudo technique')->hideOnForm();

        $associatedUserField = AssociationField::new('associatedUser', 'Compte Lié (User)');

        // 🟢 ACCÈS DIRECT 2 : Lien d'aide cliquable sous le champ si on est dans le formulaire d'édition
        if (Crud::PAGE_EDIT === $pageName) {
            $player = $this->getContext()?->getEntity()?->getInstance();
            if ($player instanceof Player && null !== $player->getAssociatedUser()) {
                $userEditUrl = $this->adminUrlGenerator
                    ->setController(UserCrudController::class)
                    ->setAction(Crud::PAGE_EDIT)
                    ->setEntityId($player->getAssociatedUser()->getId())
                    ->generateUrl();

                // Injection du lien HTML sécurisé dans le bloc de description d'EasyAdmin
                $associatedUserField->setHelp(\sprintf(
                    '<a href="%s" class="text-warning fw-bold"><i class="fas fa-pencil-alt me-1"></i> %s</a>',
                    $userEditUrl,
                    \sprintf(AdminConstants::FIELD_PLAYER_HELP_USER, $player->getAssociatedUser()->getUsername())
                ));
            }
        }

        yield $associatedUserField;
    }
}
