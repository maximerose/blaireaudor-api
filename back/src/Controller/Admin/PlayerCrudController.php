<?php

declare(strict_types=1);

namespace App\Controller\Admin;

use App\Constants\AdminConstants;
use App\Entity\Player;
use App\Entity\User;
use App\Service\Manager\PlayerMerger;
use Doctrine\ORM\EntityManagerInterface;
use EasyCorp\Bundle\EasyAdminBundle\Attribute\AdminRoute;
use EasyCorp\Bundle\EasyAdminBundle\Config\Action;
use EasyCorp\Bundle\EasyAdminBundle\Config\Actions;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Context\AdminContext;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Router\AdminUrlGenerator;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

final class PlayerCrudController extends AbstractCrudController
{
    // Injection du générateur d'URL d'administration
    public function __construct(
        private readonly AdminUrlGenerator $adminUrlGenerator,
        private EntityManagerInterface $entityManager,
    ) {
    }

    public static function getEntityFqcn(): string
    {
        return Player::class;
    }

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

        $mergeAction = Action::new('mergePlayer', 'Fusionner vers un compte', 'fas fa-object-group')
            ->linkToCrudAction('renderMergeForm')
            ->displayIf(static fn (Player $player) => null === $player->getAssociatedUser());

        return $actions
            ->add(Crud::PAGE_INDEX, $editUserAction)
            ->add(Crud::PAGE_DETAIL, $editUserAction)
            ->add(Crud::PAGE_INDEX, $mergeAction)
            ->add(Crud::PAGE_DETAIL, $mergeAction);
    }

    public function configureFields(string $pageName): iterable
    {
        yield IdField::new('id')->hideOnForm();
        yield TextField::new('displayName', 'Nom d\'affichage');
        yield TextField::new('username', 'Pseudo technique')->hideOnForm();

        $associatedUserField = AssociationField::new('associatedUser', 'Compte Lié (User)');

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

    #[AdminRoute(path: '/merge-player/{entityId}', name: 'merge_player')]
    public function renderMergeForm(AdminContext $context, Request $request, PlayerMerger $merger): Response
    {
        /** @var Player $guestPlayer */
        $guestPlayer = $context->getEntity()->getInstance();

        if (null !== $guestPlayer->getAssociatedUser()) {
            $this->addFlash('danger', 'Impossible : Ce profil est déjà lié à un compte réel.');

            return $this->redirect($this->adminUrlGenerator->setAction(Crud::PAGE_INDEX)->generateUrl());
        }

        // Si le formulaire brut est soumis en POST
        if ($request->isMethod('POST')) {
            $targetUserId = $request->request->get('target_user_id');

            if (empty($targetUserId)) {
                $this->addFlash('danger', 'Veuillez sélectionner un compte cible valide.');
            } else {
                $targetUser = $this->entityManager->getRepository(User::class)->find($targetUserId);

                if (!$targetUser) {
                    $this->addFlash('danger', 'Utilisateur cible introuvable.');
                } else {
                    try {
                        // On exécute la fusion directement sans passer par le validateur d'entité
                        $merger->merge($guestPlayer, $targetUser);
                        $this->addFlash('success', 'Fusion réussie ! Le profil invité a été absorbé par '.$targetUser->getUsername());

                        return $this->redirect($this->adminUrlGenerator->setAction(Crud::PAGE_INDEX)->generateUrl());
                    } catch (\Exception $e) {
                        $this->addFlash('danger', 'Échec de la fusion : '.$e->getMessage());
                    }
                }
            }
        }

        // Pour l'affichage (GET), on va chercher tous les utilisateurs pour alimenter le select de la vue
        $users = $this->entityManager->getRepository(User::class)->findAll();

        return $this->render('admin/player_merge.html.twig', [
            'player' => $guestPlayer,
            'users' => $users,
        ]);
    }
}
