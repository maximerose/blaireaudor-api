<?php

declare(strict_types=1);

namespace App\EventListener;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Http\Event\LogoutEvent;

/**
 * Intercepte l'événement de déconnexion de Symfony.
 * * Par défaut, Symfony redirige vers une page HTML après le logout.
 * Ce listener force une réponse JSON vide (204 No Content) adaptée aux API.
 */
class LogoutListener
{
    /**
     * Définit la réponse de déconnexion.
     * @param LogoutEvent $event L'événement déclenché lors de l'appel à la route de logout.
     */
    public function onSymfonyComponentSecurityHttpEventLogoutEvent(LogoutEvent $event): void
    {
        $response = new JsonResponse(null, Response::HTTP_NO_CONTENT);
        $event->setResponse($response);
    }
}
