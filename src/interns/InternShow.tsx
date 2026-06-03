import {
  Show,
  SimpleShowLayout,
  TextField,
  NumberField,
  BooleanField,
  EmailField,
  ReferenceField,
  TopToolbar,
  ListButton,
  EditButton,
  useRecordContext,
} from "react-admin";
import { ManagerCard } from "./ManagerCard";
import { Divider, Typography } from "@mui/material";

const InternTitle = () => {
  const record = useRecordContext();
  if (!record) return <span>Fiche stagiaire</span>;
  return <span>{record.firstname} {record.lastname}</span>;
};

const ShowActions = () => (
  <TopToolbar>
    <ListButton label="Retour à la liste" />
    <EditButton />
  </TopToolbar>
);

export const InternShow = () => (
  <Show title={<InternTitle />} actions={<ShowActions />}>
    <SimpleShowLayout>
      <TextField source="id" label="ID" />
      <TextField source="firstname" label="Prénom" />
      <TextField source="lastname" label="Nom" />
      <EmailField source="email" label="Email" />
      <TextField source="department" label="Département" />

      <ReferenceField
        source="managerId"
        reference="employees"
        label="Manager"
        link="show"
      >
        <TextField source="firstname" />{" "}
        <TextField source="lastname" />
      </ReferenceField>

      <NumberField
        source="remuneration"
        label="Rémunération"
        options={{ style: "currency", currency: "EUR" }}
      />
      <BooleanField source="isRemunerate" label="Rémunéré" />

      <Divider sx={{ my: 2 }} />
      <Typography variant="subtitle2" color="text.secondary">
        Détails du manager
      </Typography>
      <ManagerCard />
    </SimpleShowLayout>
  </Show>
);
