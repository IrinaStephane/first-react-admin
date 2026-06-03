// src/interns/InternCreate.tsx
import {
  Create,
  SimpleForm,
  TextInput,
  NumberInput,
  SelectInput,
  BooleanInput,
  ReferenceInput,
  AutocompleteInput,
  required,
  email,
  minValue,
  useGetList,
} from "react-admin";
import { useWatch } from "react-hook-form";

const departmentChoices = [
  { id: "Informatique", name: "Informatique" },
  { id: "Marketing", name: "Marketing" },
  { id: "RH", name: "RH" },
  { id: "Finance", name: "Finance" },
];

/**
 * Champ remuneration conditionnel.
 * useWatch (react-hook-form) lit la valeur courante de isRemunerate
 * SANS provoquer de re-render du formulaire entier.
 * C'est le hook demandé pour la validation conditionnelle.
 */
const RemunerationInput = () => {
  // useWatch observe le champ isRemunerate en temps réel
  const isRemunerate = useWatch({ name: "isRemunerate" });

  if (!isRemunerate) return null;

  return (
    <NumberInput
      source="remuneration"
      label="Rémunération (€)"
      validate={[
        required("La rémunération est obligatoire si le stagiaire est rémunéré"),
        minValue(1, "La rémunération doit être supérieure à 0"),
      ]}
    />
  );
};

/**
 * Filtre les managers actifs du même département que le stagiaire.
 * useWatch lit le département sélectionné pour filtrer les managers.
 */
const ManagerInput = () => {
  const department = useWatch({ name: "department" });

  // Récupère les employés actifs du même département
  const { data: managers = [] } = useGetList("employees", {
    filter: { active: true, ...(department ? { department } : {}) },
    pagination: { page: 1, perPage: 100 },
  });

  const choices = managers.map((m) => ({
    id: m.id,
    name: `${m.firstname} ${m.lastname}`,
  }));

  return (
    <AutocompleteInput
      source="managerId"
      label="Manager (actif, même département)"
      choices={choices}
      validate={required("Le manager est obligatoire")}
      disabled={!department}
      helperText={!department ? "Sélectionnez d'abord un département" : ""}
    />
  );
};

export const InternCreate = () => (
  <Create title="Ajouter un stagiaire" redirect="list">
    <SimpleForm>
      <TextInput
        source="firstname"
        label="Prénom"
        validate={required("Le prénom est obligatoire")}
      />
      <TextInput
        source="lastname"
        label="Nom"
        validate={required("Le nom est obligatoire")}
      />
      <TextInput
        source="email"
        label="Email"
        validate={[
          required("L'email est obligatoire"),
          email("Format d'email invalide"),
        ]}
      />
      <SelectInput
        source="department"
        label="Département"
        choices={departmentChoices}
        validate={required("Le département est obligatoire")}
      />
      {/* Manager filtré dynamiquement selon le département — useWatch */}
      <ManagerInput />
      <BooleanInput source="isRemunerate" label="Rémunéré" defaultValue={false} />
      {/* Champ conditionnel — useWatch sur isRemunerate */}
      <RemunerationInput />
    </SimpleForm>
  </Create>
);
