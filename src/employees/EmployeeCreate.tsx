import { Create, SimpleForm, TextInput, NumberInput, SelectInput, BooleanInput, required, minValue, email } from "react-admin";

const departmentChoices = [
  { id: "Informatique", name: "Informatique" },
  { id: "Marketing", name: "Marketing" },
  { id: "RH", name: "RH" },
  { id: "Finance", name: "Finance" },
];

export const EmployeeCreate = () => (
  <Create title="Ajouter un employé" redirect="list">
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
        type="email"
        validate={[
          required("L'email est obligatoire"),
          email("L'adresse email n'est pas valide")
        ]}
      />
      <SelectInput
        source="department"
        label="Département"
        choices={departmentChoices}
        validate={required("Le département est obligatoire")}
      />
      <NumberInput
        source="salary"
        label="Salaire (€)"
        validate={[
          required("Le salaire est obligatoire"),
          minValue(1500, "Le salaire minimum est de 1 500 €"),
        ]}
      />
      <BooleanInput source="active" label="Actif" defaultValue={true} />
    </SimpleForm>
  </Create>
);
