# ⚛️ Le Blaireau d'Or — Application Frontend

Une interface utilisateur performante, fluide et découplée, construite pour offrir une expérience utilisateur (UX) irréprochable.

---

## 🧠 Principes de Conception Appliqués

### 🪓 1. Séparation Radicale : Logic vs View
> **Architecture étanche :** Les composants graphiques doivent rester purement déclaratifs. Toute la logique complexe, le state management et les appels asynchrones sont déportés dans des **Hooks personnalisés**.

### 🍃 2. Philosophie YAGNI & Performance des Flux
* **Pas de sur-ingénierie :** Nous appliquons strictement le principe **YAGNI** (You Ain't Gonna Need It). L'état global lourd est banni au profit d'un cache serveur performant géré par **TanStack Query**.
* **Consommation ciblée :** Interdiction de faire transiter des flots de propriétés (props) inutilisées à travers des sous-composants. Chaque composant vient récupérer les données dont il a besoin exactement là où il est instancié.

---

## 📐 Organisation Feature-Driven

Le code est structuré en modules autonomes représentant les domaines fonctionnels de l'application :

```text
src/features/
├── account/       # Profil, authentification, session
├── competition/   # Ligues, classements, gestion du Brouillard de Guerre
├── notification/  # Abonnements WebPush et réactivité Mercure
└── stats/         # Graphiques et indicateurs de performance
```

---

## ⚡ Commandes de Maintenance

```bash
# Validation du typage strict TypeScript
npm run tsc

# Analyse statique et correction automatique des écarts de style
npm run lint
```