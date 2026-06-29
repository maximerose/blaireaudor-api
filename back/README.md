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
├── ApiResource/   # DTOs et configurations spécifiques API Platform 3
├── Controller/    # Contrôleurs fins (Gestion exclusive des flushes)
├── Entity/        # Modèles Doctrine (Entités découplées, UUIDs v6/v7)
├── Security/      # Voters Symfony pour contrer les failles d'accès de type IDOR
└── Service/       # Managers métier isolés de la persistance
```

---

## 🧪 Exécution de la Suite de Tests

```bash
# Exécuter l'ensemble des tests (Unitaires, Intégration, API)
docker compose exec back bin/phpunit
```

## 📑 Documentation de l'API (Swagger / OpenAPI)

La spécification complète de l'API est disponible au format standard OpenAPI 3.0.

- 📄 Fichier source : [`back/docs/openapi.yaml`](./docs/openapi.yaml)
- 🚀 **[Visualiser interactivement l'API sur Swagger Editor](https://editor.swagger.io/?url=https://raw.githubusercontent.com/maximerose/blaireaudor-api/main/back/docs/openapi.yaml)**
