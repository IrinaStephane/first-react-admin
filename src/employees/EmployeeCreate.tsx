import { Create, SimpleForm, TextInput, NumberInput, SelectInput, BooleanInput, required, minValue, email } from "react-admin";
import { Card } from "@mui/material";

const departmentChoices = [
  { id: "Informatique", name: "Informatique" },
  { id: "Marketing", name: "Marketing" },
  { id: "RH", name: "RH" },
  { id: "Finance", name: "Finance" },
];

export const EmployeeCreate = () => (
  <Create 
    title="Ajouter un employé" 
    redirect="list"
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
        validate={required("Le prénom est obligatoire")}
        fullWidth
      />
      <TextInput
        source="lastname"
        label="Nom"
        validate={required("Le nom est obligatoire")}
        fullWidth
      />
      <TextInput
        source="email"
        label="Email"
        type="email"
        validate={[
          required("L'email est obligatoire"),
          email("L'adresse email n'est pas valide")
        ]}
        fullWidth
      />
      <SelectInput
        source="department"
        label="Département"
        choices={departmentChoices}
        validate={required("Le département est obligatoire")}
        fullWidth
      />
      <NumberInput
        source="salary"
        label="Salaire (€)"
        validate={[
          required("Le salaire est obligatoire"),
          minValue(1500, "Le salaire minimum est de 1 500 €"),
        ]}
        fullWidth
      />
      <BooleanInput source="active" label="Actif" defaultValue={true} />
    </SimpleForm>
  </Create>
);
