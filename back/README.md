# 🐘 Le Blaireau d'Or — API Backend

L'API du projet fournit un moteur de règles robuste et hautement sécurisé pour orchestrer le concours.

---

## 📐 Directives d'Ingénierie & Patterns

### 🧪 1. Développement Guidé par les Tests (TDD)

> **Règle absolue :** La rédaction des tests fonctionnels et unitaires précède systématiquement le développement des fonctionnalités. Aucun code n'est écrit tant qu'un test n'a pas échoué au préalable.

### 💾 2. Isolation de la Persistance (`Flush` Control)

- **Les Managers / Services** contiennent la logique métier pure mais restent totalement isolés des effets de bord liés à la persistance.
- **Les Contrôleurs** ont la responsabilité unique de déclencher le processus d'écriture finale (`$em->flush()`). Cela garantit des limites de transaction claires et de meilleures performances.

---

## 📂 Architecture des Dossiers

```text
src/
├── ApiResource/          # DTOs personnalisés exposés par API Platform (ex: ResetPassword)
├── Command/              # Commandes CLI de maintenance (Recalcul, levée du Brouillard)
├── Constants/            # Centralisation des messages d'erreur et des constantes KPIs
├── Controller/
│   ├── Admin/            # Contrôleurs du Back-office EasyAdmin
│   └── Api/              # Endpoints personnalisés (Competition, Player, User)
├── DataFixtures/         # Jeux de fausses données pour le développement local
├── DTO/                  # Objets de transfert de données pour la validation des payloads
├── Entity/
│   └── Trait/            # Trait réutilisables de structure (UUID v6/v7, Blameable, Timestampable)
├── Enum/                 # Énumérations strictes (ex: ActionStatus)
├── EventListener/
│   └── Notification/     # Écouteurs de cycle de vie Doctrine (Recalcul des scores, WebPush, Mercure)
├── Factory/              # Fabriques de données pour les tests (Zenstruck Foundry)
├── Repository/           # Requêtes personnalisées d'accès à la base de données
├── Security/
│   └── Voter/            # Abstraction des droits d'accès fins pour contrer les failles IDOR
├── Serializer/           # Normaliseurs et encodeurs de contextes spécifiques
├── Service/
│   ├── Helper/           # Générateurs de codes et validateurs génériques
│   ├── Manager/          # Services métiers principaux gérant l'intelligence de l'application
│   ├── Notification/     # Constructeurs de messages et gestionnaires d'envoi
│   └── Stats/            # Services de calculs et agrégations analytiques complexes
├── State/
│   ├── Processor/        # Intercepteurs d'écriture API Platform (Inscriptions, Créations)
│   └── Provider/         # Intercepteurs de lecture API Platform (Données de session /me)
├── Story/                # Scénarios d'initialisation des fixtures de test
├── Utils/                # Fonctions utilitaires de manipulation temporelle
└── Validator/            # Règles et contraintes de validation sur mesure (ex: ValidActionDate)
```

---

## 🧪 Structure & Exécution de la Suite de Tests

La suite de tests reproduit fidèlement la séparation des concepts pour assurer une couverture maximale.

```text
tests/
├── Api/                  # Tests fonctionnels complets des endpoints et de la sécurité (JWT/Voters)
├── Integration/          # Tests de composants couplés (Commandes CLI, Managers, Doctrine Listeners)
└── Unit/                 # Tests unitaires isolés de logique pure (Générateurs de code, Helpers)
```

Pour lancer l'ensemble des suites de tests à l'intérieur de l'environnement conteneurisé :
```bash
docker compose exec back bin/phpunit
```

## 📑 Documentation de l'API (Swagger / OpenAPI)

La spécification complète de l'API est disponible au format standard OpenAPI 3.0.

- 📄 Fichier source : [`back/docs/openapi.yaml`](./docs/openapi.yaml)
- 🚀 **[Visualiser interactivement l'API sur Swagger Editor](https://editor.swagger.io/?url=https://raw.githubusercontent.com/maximerose/blaireaudor-api/main/back/docs/openapi.yaml)**
