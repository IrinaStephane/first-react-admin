import {
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
  SelectInput,
  BooleanInput,
  AutocompleteInput,
  required,
  email,
  minValue,
  useRecordContext,
  useGetList,
} from "react-admin";
import { useWatch } from 'react-hook-form';
import { Card } from "@mui/material";

const departmentChoices = [
  { id: "Informatique", name: "Informatique" },
  { id: "Marketing", name: "Marketing" },
  { id: "RH", name: "RH" },
  { id: "Finance", name: "Finance" },
];

const InternTitle = () => {
  const record = useRecordContext();
  if (!record) return <span>Modifier un stagiaire</span>;
  return <span>Modifier : {record.firstname} {record.lastname}</span>;
};

const RemunerationInput = () => {
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
      fullWidth
    />
  );
};

const ManagerInput = () => {
  const department = useWatch({ name: "department" });

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
      fullWidth
    />
  );
};

export const InternEdit = () => (
  <Edit 
    title={<InternTitle />}
    sx={{
      background: "linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)",
      minHeight: "100vh",
    }}
  >
    <SimpleForm
      component={Card}
      sx={{
        maxWidth: "600px",
        margin: "auto",
        mt: 3,
        backgroundColor: "#1a1f3a",
        border: "1px solid #334155",
        padding: 3,
      }}
    >
      <TextInput 
        source="firstname" 
        label="Prénom" 
        validate={required("Obligatoire")}
        fullWidth
      />
      <TextInput 
        source="lastname" 
        label="Nom" 
        validate={required("Obligatoire")}
        fullWidth
      />
      <TextInput
        source="email"
        label="Email"
        validate={[required("Obligatoire"), email("Format invalide")]}
        fullWidth
      />
      <SelectInput
        source="department"
        label="Département"
        choices={departmentChoices}
        validate={required("Obligatoire")}
        fullWidth
      />
      <ManagerInput />
      <BooleanInput source="isRemunerate" label="Rémunéré" />
      <RemunerationInput />
    </SimpleForm>
  </Edit>
);
