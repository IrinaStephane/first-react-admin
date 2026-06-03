import {
  Show,
  SimpleShowLayout,
  TextField,
  NumberField,
  BooleanField,
  EmailField,
  TopToolbar,
  ListButton,
  EditButton,
  useRecordContext,
} from "react-admin";
import { Divider } from "@mui/material";
import { InternsByManager } from "./InternsByManager";
import { DepartmentStats } from "./DepartmentStats";

const EmployeeTitle = () => {
  const record = useRecordContext();
  if (!record) return <span>Fiche employé</span>;
  return <span>{record.firstname} {record.lastname}</span>;
};

const ShowActions = () => (
  <TopToolbar>
    <ListButton label="Retour à la liste" />
    <EditButton />
  </TopToolbar>
);

export const EmployeeShow = () => (
  <Show title={<EmployeeTitle />} actions={<ShowActions />}>
    <SimpleShowLayout>
      <TextField source="id" label="ID" />
      <TextField source="firstname" label="Prénom" />
      <TextField source="lastname" label="Nom" />
      <EmailField source="email" label="Email" />
      <TextField source="department" label="Département" />
      <NumberField
        source="salary"
        label="Salaire"
        options={{ style: "currency", currency: "EUR" }}
      />
      <BooleanField source="active" label="Actif" />

      <DepartmentStats />

      <Divider sx={{ my: 2 }} />

      <InternsByManager />
    </SimpleShowLayout>
  </Show>
);