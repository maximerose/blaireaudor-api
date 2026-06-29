# 🦡 Le Blaireau d'Or

[![Symfony](https://img.shields.io/badge/Symfony-7.1-black.svg?logo=symfony)](https://symfony.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6.svg?logo=typescript)](https://www.typescriptlang.org/)
[![API Platform](https://img.shields.io/badge/API_Platform-3-009688.svg?logo=api-platform)](https://api-platform.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg?logo=docker)](https://www.docker.com/)

**Le Blaireau d'Or** est une application web moderne (Architecture découplée API-first) conçue pour digitaliser et automatiser un concours amical basé sur l'autodénonciation et la délation bienveillante d'actions insolites (maladresses, oublis ou gestes de grande classe).

L'application intègre des mécaniques de gamification poussées, comme le concept de **Brouillard de Guerre**, maintenant le suspense sur le classement final jusqu'à la clôture de la saison.

---

## 🎯 Fonctionnalités Clés & Gamification

- **La Balance des Points :**
  - _Points de Blaireau (Positifs) :_ Attribués pour les méfaits, maladresses ou oublis selon un barème strict (Petit, Moyen, Gros, Énorme). Plus le score est élevé, plus on se rapproche du titre !
  - _Points de Classe (Négatifs) :_ Attribués pour des gestes de grande générosité (ex: payer l'apéro), permettant de réduire son score.
- **Brouillard de Guerre (Fog of War) :** Option activable par l'Arbitre. Lorsqu'elle est activée, les scores et rangs sont masqués pour les joueurs actifs. Le flux d'activité (Feed) devient volontairement cryptique pour préserver le secret.
- **Multiplicateurs Temporels :** Configuration dynamique de jours bonus (ex: _"Le jeudi, tous les points comptent double"_).
- **Gestion des Profils Fantômes :** Possibilité d'inclure des "Joueurs Passifs" (sans compte utilisateur) comme cibles de délation, avec un module d'administration permettant la fusion définitive vers un compte réel une fois inscrit.
- **Système d'Arbitrage Dédié :** File d'attente de modération (Validation/Rejet) en temps réel pour l'Arbitre de la compétition.

---

## 🛠️ Architecture & Stack Technique

Le projet a été développé dans le respect des standards d'ingénierie logicielle (Clean Code, architecture orientée fonctionnalités, automatisation de la qualité).

### Backend (API-First)

- **Framework :** PHP 8.3 / Symfony 7.1
- **Moteur d'API :** API Platform 3 (REST, sortie JSON-LD)
- **Sécurité & Sessions :** Authentification Stateless par **JWT (LexikJWT)** combinée à un mécanisme sécurisé de **Refresh Token (Gesdinet)** stocké dans un cookie sécurisé `HttpOnly` (Protection Anti-F5).
- **Contrôle d'accès :** Utilisation de _Voters_ Symfony pour une isolation stricte des droits d'accès (IDOR protection) et utilisation exclusive d'UUIDs pour les entités exposées.

### Frontend (Mobile-First SPA)

- **Framework :** React 18+ (TypeScript)
- **Structure :** _Feature-Driven Structure_ (organisation par domaine fonctionnel pour une scalabilité maximale).
- **State Management & Data Fetching :** React Query (TanStack Query) pour une synchronisation fluide et une gestion optimisée du cache de l'API.
- **Design System :** Composants atomiques réutilisables stylisés avec Tailwind CSS et architectures en verre (Glassmorphism), pensés en approche Mobile-First.

### Outillage & Qualité (CI/CD Local)

Pour garantir une base de code saine et standardisée, un pipeline de validation automatique est configuré via **Husky (Pre-commit hooks)** :

1. **Qualité Front :** Analyse statique stricte avec ESLint et vérification du typage via TypeScript compiler (`tsc`).
2. **Formatage :** Embellissement automatique du Front via Prettier.
3. **Style Back :** Alignement du code PHP sur les standards PSR-12 via PHP-CS-Fixer.
4. **Tests :** Exécution automatisée des tests unitaires et d'intégration via PHPUnit.

---

## 🐋 Déploiement & Environnement

Le projet est entièrement conteneurisé sous **Docker**, garantissant un environnement de développement et de production strictement identique.

- `compose.yaml` : Stack de développement locale (Nginx, PostgreSQL, PHP-FPM, Node).
- Prévu pour un déploiement autonome, le projet est optimisé pour tourner de manière isolée sur un serveur domestique via des conteneurs Docker légers.

---

## 🚀 Installation Locale

### Prérequis

- Docker et Docker Compose installés sur votre machine.
- Git.

### Étape 1 : Cloner le projet

```bash
git clone [https://github.com/votre-username/blaireau-dor.git](https://github.com/votre-username/blaireau-dor.git)
cd blaireau-dor
```

### Étape 2 : Configurer les variables d'environnement

Copiez le fichier d'exemple et adaptez les variables si nécessaire :

```bash
cp .env.example .env
```

### Étape 3 : Lancer la stack Docker

```bash
docker compose up -d --build
```

_Cette commande télécharge les images, configure la base de données PostgreSQL, applique les migrations Doctrine, génère les fixtures et lance le serveur de développement React._

### Étape 4 : Accéder à l'application

- **Frontend :** `http://localhost:3000`
- **Documentation Interactive de l'API (Swagger) :** `http://localhost:8000/api/docs`

---

## 🧠 Principes de Développement Appliqués

- **YAGNI (You Ain't Gonna Need It) & Séparation Logique/Vue :** Côté Front, l'affichage et la logique métier sont découplés au maximum via des Hooks personnalisés, évitant le _prop-drilling_ et la redondance d'informations.
- **TDD & Architecture Légère :** Côté Back, l'accent est mis sur la rédaction préalable des tests de validation d'API. Les contrôleurs restent ultra-légers, la logique métier étant entièrement encapsulée dans des _Managers_ dédiés. Les opérations d'écriture (`flush`) sont centralisées pour optimiser les performances de la base de données.

---

🐘 [Consulter le README Backend](./back/README.md) | ⚛️ [Consulter le README Frontend](./front/README.md)
