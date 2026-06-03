# REPONSES Partie 2

---

## Exercice 6 — InternList

### Question 6.1 : Quel appel HTTP ReferenceField génère-t-il pour résoudre le manager ?

React-Admin regroupe (batche) les appels. Pour une liste de 5 stagiaires ayant
des managerId différents, au lieu de 5 requêtes séparées, on observe une seule :

```
GET http://localhost:3002/employees?id=1&id=2&id=4&id=5
```

C'est le mécanisme de batching de `ra-data-json-server` : il collecte tous les ids
nécessaires et les envoie en une requête, ce qui réduit considérablement le nombre
d'allers-retours réseau.

### Question 6.2 : Que se passe-t-il si managerId ne correspond à aucun employé ?

React-Admin affiche une cellule vide (ou un indicateur de chargement figé) à la
place du nom du manager. Aucune erreur n'est levée dans l'interface : `ReferenceField`
gère silencieusement l'absence de donnée. Dans la console, on peut voir une erreur
réseau (404) pour l'id introuvable.

---

## Exercice 7 — InternCreate & InternEdit

### Question 7.1 : Quelle méthode HTTP est émise lors de la soumission de InternCreate ?

```
POST http://localhost:3002/interns
Content-Type: application/json

{ "firstname": "...", "lastname": "...", ... }
```

La méthode `POST` est utilisée pour la création. json-server génère automatiquement
un `id` et renvoie l'objet créé avec un status `201 Created`.

### Question 7.2 : Quel hook utilisez-vous pour la validation conditionnelle de remuneration, et pourquoi ?

On utilise **`useWatch`** de `react-hook-form` (intégré à React-Admin).

`useWatch({ name: "isRemunerate" })` observe en temps réel la valeur du champ
`isRemunerate` dans le formulaire. Quand l'utilisateur coche ou décoche la case,
le composant `RemunerationInput` se re-render et affiche ou masque le champ.

On ne peut pas utiliser `useRecordContext` ici car celui-ci donne les données
initiales de l'enregistrement, pas les valeurs en cours de saisie dans le formulaire.
`useWatch` est le seul hook qui lit l'état live du formulaire.

---

## Exercice 8 — InternShow & ManagerCard

### Question 8.1 : Quelle est la différence entre useGetOne et ReferenceField ?

| | `ReferenceField` | `useGetOne` |
|---|---|---|
| **Type** | Composant déclaratif | Hook impératif |
| **Usage** | Dans un layout de Show/List pour afficher des champs liés | Dans un composant custom pour logique avancée |
| **Rendu** | Gère automatiquement le chargement et l'affichage | On gère soi-même les états isPending/error/data |
| **Accès aux données** | Via les composants enfants (`<TextField>`, etc.) | Via la variable `data` retournée |
| **Batching** | Oui, automatique | Non, appel individuel |

**Quand préférer useGetOne ?** Quand on a besoin d'accéder programmatiquement aux
données de la ressource liée (conditionner un affichage, calculer une valeur,
afficher dans un composant entièrement custom comme ManagerCard).

### Question 8.2 : Que se passe-t-il si useGetOne reçoit `id: undefined` sans l'option `enabled` ?

Sans `{ enabled: !!id }`, React-Admin envoie immédiatement :

```
GET http://localhost:3002/employees/undefined
```

Cela provoque une erreur 404, et `useGetOne` passe dans l'état `error`. L'interface
affiche alors un message d'erreur alors que l'enregistrement est simplement en cours
de chargement.

L'option `enabled: !!record?.managerId` empêche l'appel tant que l'id est `undefined`
ou `null`. La requête n'est lancée qu'une fois le stagiaire chargé et son `managerId`
disponible, évitant ainsi un faux état d'erreur.

---

## Exercice 9 — Enrichissement EmployeeShow

### Question 9.1 : Différence entre useGetList et ReferenceManyField ?

| | `ReferenceManyField` | `useGetList` |
|---|---|---|
| **Type** | Composant déclaratif | Hook impératif |
| **Contexte** | Doit être dans un `<Show>` ou `<Edit>` | Utilisable partout |
| **Rendu** | Délègue à des composants enfants | On contrôle totalement le rendu |
| **Accès au total** | Via `useListContext()` dans un enfant | Directement via `{ total }` |
| **Logique custom** | Limitée | Illimitée |

`useGetList` est **indispensable** quand :
- on veut afficher le résultat dans un composant entièrement custom (liste MUI)
- on veut accéder au total pour l'afficher dans un titre
- on veut conditionner un message "liste vide" de manière programmatique

### Question 9.2 : Comment optimiser la requête de DepartmentStats ?

On utilise `pagination: { page: 1, perPage: 1 }`.

json-server (et la plupart des API REST) renvoie toujours le header
`X-Total-Count` qui contient le nombre total d'enregistrements correspondant au filtre,
quelle que soit la pagination. React-Admin expose ce header dans la propriété `total`
de `useGetList`.

En demandant `perPage: 1`, on ne télécharge qu'un seul objet (voire aucune donnée
utile) mais on obtient quand même le `total` exact. C'est beaucoup plus performant
que de charger tous les employés du département juste pour compter.

---

## Exercice 10 — QuickStatusToggle (useUpdate)

### Question 10.1 : Quelle méthode HTTP useUpdate utilise-t-il par défaut ? Comment forcer PATCH ?

Par défaut, `useUpdate` envoie **`PUT`** (remplacement complet de l'objet).

Pour forcer `PATCH` (mise à jour partielle), on peut passer le meta `method` :

```tsx
update("employees", {
  id: record.id,
  data: { active: !record.active },
  meta: { method: "PATCH" },
});
```

Note : cela dépend du dataProvider utilisé. `ra-data-json-server` supporte les deux.

### Question 10.2 : Pourquoi previousData est-il nécessaire ?

`ra-data-json-server` utilise `PUT` qui **remplace l'intégralité de l'objet**.
Si on n'envoie que `{ id: 1, active: false }`, json-server remplace l'employé par
cet objet minimal, perdant `firstname`, `lastname`, `email`, `salary`, etc.

`previousData` permet au dataProvider de construire l'objet complet :

```js
// Ce que le dataProvider fait en interne :
const fullObject = { ...previousData, ...data };
// PUT /employees/1  →  { id:1, firstname:"Alice", ..., active: false }
```

Sans `previousData`, certains dataProviders lèvent une erreur, et avec json-server
on risque de corrompre les données.

---

## Exercice 11 — useCreate & Formulaire rapide

### Question 11.1 : Différence entre useCreate et le composant \<Create\> ?

| | `<Create>` | `useCreate` |
|---|---|---|
| **Type** | Composant page entière | Hook bas niveau |
| **Navigation** | Redirige vers une nouvelle URL | Reste sur la page courante |
| **Formulaire** | Intègre `<SimpleForm>` et la gestion complète | On gère soi-même le formulaire |
| **Usage** | Page dédiée à la création | Création inline (modale, drawer, etc.) |

`useCreate` est utilisé quand on veut créer sans quitter la page — typiquement dans
une modale, un panneau latéral, ou un formulaire inline.

### Question 11.2 : Comment gérer le rechargement de la liste après useCreate ?

On utilise le hook `useRefresh()` fourni par React-Admin :

```tsx
const refresh = useRefresh();

// Dans le callback onSuccess :
onSuccess: () => {
  refresh(); // force React-Admin à re-fetcher la liste
  onClose();
}
```

`useRefresh()` invalide le cache de la ressource concernée et déclenche un nouveau
`getList`, ce qui met à jour le tableau sans rechargement complet de la page.

---

## Exercice 12 — Dashboard

### Question 12.1 : Les 4 appels useGetList se font-ils en parallèle ou en séquence ?

**En parallèle.** React exécute les 4 hooks au même rendu. Chacun déclenche
immédiatement sa requête HTTP sans attendre les autres. Dans l'onglet Network,
on voit les 4 requêtes partir quasi-simultanément.

Il n'y a aucune dépendance entre eux (contrairement à un enchaînement `await/await`),
donc React-Query (utilisé en interne par React-Admin) les lance tous en même temps.

### Question 12.2 : Pourquoi perPage: 1 est préférable à perPage: 100 ?

On n'a besoin que du **total** (`X-Total-Count`), pas des données elles-mêmes.
Avec `perPage: 1` :
- Le serveur renvoie **1 seul objet** dans le body (vs 100)
- Le payload JSON est minuscule (~100 octets vs potentiellement plusieurs ko)
- Le parsing et la mise en mémoire sont négligeables
- Le total est identique quelle que soit la pagination

C'est une optimisation classique quand on veut juste compter des enregistrements
via une API REST paginée.
