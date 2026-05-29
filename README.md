# Questions théoriques

---

## Exercice 1 — Configuration de l'application

### Question 1.1 : Que représente le dataProvider dans React-Admin ? Quel est son rôle ?

Le **dataProvider** est la couche d'abstraction qui fait le lien entre React-Admin et
l'API back-end. Il expose une interface standardisée avec des méthodes comme
`getList`, `getOne`, `create`, `update`, `delete`, etc.

Concrètement, quand React-Admin a besoin de récupérer la liste des employés, il
appelle `dataProvider.getList('employees', { ... })`. C'est le dataProvider qui
traduit cet appel en une requête HTTP concrète vers l'API (`GET /employees?...`),
puis il transforme la réponse pour que React-Admin puisse la consommer.

Cela permet de changer d'API (REST, GraphQL, Firebase…) sans toucher aux
composants — il suffit de changer le dataProvider.

### Question 1.2 : Quelle requête HTTP est envoyée au chargement de la liste ?

Dans l'onglet **Network** du navigateur (filtre XHR/Fetch), on observe :

```
GET http://localhost:3002/employees?_sort=id&_order=ASC&_start=0&_end=5
```

- `_sort` et `_order` : tri par défaut sur l'id
- `_start` et `_end` : pagination (les 5 premiers enregistrements)

json-server comprend nativement ces paramètres de query string.

---

## Exercice 2 — Liste des employés

### Question 2.1 : Que fait la prop `rowClick="edit"` sur le Datagrid ?

Elle configure le comportement lors du clic sur une ligne du tableau.
Avec `rowClick="edit"`, cliquer n'importe où sur une ligne redirige
l'utilisateur vers le formulaire de **modification** (`/employees/:id/edit`)
de l'employé correspondant.

D'autres valeurs possibles : `"show"` (fiche détail), `"expand"` (ligne dépliante),
`false` (désactive le clic), ou une fonction personnalisée.

### Question 2.2 : Que se passe-t-il si on passe `perPage` à 2 ?

L'API reçoit `_end=2` au lieu de `_end=5` :

```
GET /employees?_start=0&_end=2
```

L'interface affiche **2 employés par page** au lieu de 5. La barre de pagination
en bas du tableau montre plus de pages (ex. : 3 pages pour 5 employés). L'utilisateur
doit naviguer entre les pages pour voir tous les employés.

---

## Exercice 3 — Création d'un employé

### Question 3.1 : Que se passe-t-il si on soumet le formulaire sans remplir le prénom ?

La soumission est **bloquée**. React-Admin affiche un message d'erreur de validation
directement sous le champ vide : *"Le prénom est obligatoire"* (le message qu'on a
passé à `required()`). Aucune requête HTTP n'est envoyée à l'API. L'utilisateur
doit corriger les champs invalides avant de pouvoir soumettre.

### Question 3.2 : Que se passe-t-il si on saisit un salaire de 500 € ?

La validation `minValue(1500)` se déclenche. Un message d'erreur apparaît sous
le champ : *"Le salaire minimum est de 1 500 €"*. Le formulaire ne peut pas être
soumis tant que le salaire est inférieur à 1 500 €. Aucun appel API n'est effectué.

---

## Exercice 4 — Modification d'un employé

### Question 4.1 : Quelle méthode HTTP est utilisée lors de la sauvegarde d'une modification ?

Dans l'onglet Network, on observe une requête **`PUT`** :

```
PUT http://localhost:3002/employees/1
Content-Type: application/json

{ "id": 1, "firstname": "Alice", "lastname": "Martin", ... }
```

React-Admin envoie l'intégralité de l'objet mis à jour. Certains dataProviders
utilisent `PATCH` (mise à jour partielle), mais `ra-data-json-server` utilise `PUT`
car json-server attend un remplacement complet de la ressource.

### Question 4.2 : À quel moment `useRecordContext()` est-il disponible ? Que retourne-t-il si l'enregistrement n'est pas encore chargé ?

`useRecordContext()` est disponible **uniquement à l'intérieur d'un composant enfant
d'un `<Edit>`, `<Show>` ou `<Datagrid>`** — ces composants fournissent le contexte
via un Provider.

Si l'enregistrement n'est pas encore chargé (requête en cours), `useRecordContext()`
retourne **`undefined`**. C'est pourquoi il faut toujours ajouter une garde :

```tsx
const record = useRecordContext();
if (!record) return <span>Chargement...</span>;
```

---

## Exercice 5 — Fiche détail

### Question 5.1 : Quelle différence y a-t-il entre `SimpleShowLayout` et `TabbedShowLayout` ?

| | `SimpleShowLayout` | `TabbedShowLayout` |
|---|---|---|
| **Affichage** | Tous les champs sur une seule page verticale | Champs répartis en **onglets** cliquables |
| **Usage** | Fiches simples avec peu de champs | Fiches complexes avec beaucoup de champs à organiser thématiquement |
| **Navigation** | Aucune — tout est visible d'un coup | L'utilisateur clique sur un onglet pour afficher sa section |
| **Syntaxe** | `<SimpleShowLayout>` avec des champs directs | `<TabbedShowLayout>` avec des `<TabbedShowLayout.Tab label="...">` |

Exemple `TabbedShowLayout` :
```tsx
<TabbedShowLayout>
  <TabbedShowLayout.Tab label="Identité">
    <TextField source="firstname" />
    <TextField source="lastname" />
  </TabbedShowLayout.Tab>
  <TabbedShowLayout.Tab label="RH">
    <TextField source="department" />
    <NumberField source="salary" />
  </TabbedShowLayout.Tab>
</TabbedShowLayout>
```