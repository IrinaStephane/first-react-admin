import { Edit, SimpleForm, TextInput, NumberInput, SelectInput, BooleanInput, required, minValue, useRecordContext, email } from "react-admin";

const departmentChoices = [
  { id: "Informatique", name: "Informatique" },
  { id: "Marketing", name: "Marketing" },
  { id: "RH", name: "RH" },
  { id: "Finance", name: "Finance" },
];

const EmployeeTitle = () => {
  const record = useRecordContext();
  if (!record) return <span>Modifier un employé</span>;
  return <span>Modifier : {record.firstname} {record.lastname}</span>;
};

export const EmployeeEdit = () => (
  <Edit title={<EmployeeTitle />}>
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
      <BooleanInput source="active" label="Actif" />
    </SimpleForm>
  </Edit>
);
