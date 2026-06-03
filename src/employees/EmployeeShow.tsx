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
import { Divider, Card, CardContent, Typography } from "@mui/material";
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
  <Show 
    title={<EmployeeTitle />} 
    actions={<ShowActions />}
    sx={{
      background: "linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)",
      minHeight: "100vh",
    }}
  >
    <SimpleShowLayout sx={{ maxWidth: "800px" }}>
      <Card sx={{ mb: 2, border: "1px solid #334155" }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" mb={2} sx={{ color: "#f8fafc" }}>
            Informations personnelles
          </Typography>
          <TextField source="id" label="ID" />
          <TextField source="firstname" label="Prénom" />
          <TextField source="lastname" label="Nom" />
          <EmailField source="email" label="Email" />
        </CardContent>
      </Card>

      <Card sx={{ mb: 2, border: "1px solid #334155" }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" mb={2} sx={{ color: "#f8fafc" }}>
            Informations professionnelles
          </Typography>
          <TextField source="department" label="Département" />
          <NumberField
            source="salary"
            label="Salaire"
            options={{ style: "currency", currency: "EUR" }}
          />
          <BooleanField source="active" label="Statut" />
        </CardContent>
      </Card>

      <DepartmentStats />

      <Divider sx={{ my: 3, borderColor: "#334155" }} />

      <InternsByManager />
    </SimpleShowLayout>
  </Show>
);