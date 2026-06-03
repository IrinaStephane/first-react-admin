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
import { Divider, Typography, Card, CardContent } from "@mui/material";

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
  <Show 
    title={<InternTitle />} 
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
            source="remuneration"
            label="Rémunération"
            options={{ style: "currency", currency: "EUR" }}
          />
          <BooleanField source="isRemunerate" label="Rémunéré" />
        </CardContent>
      </Card>

      <Card sx={{ mb: 2, border: "1px solid #334155" }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" mb={2} sx={{ color: "#f8fafc" }}>
            Manager
          </Typography>
          <ReferenceField
            source="managerId"
            reference="employees"
            label="Responsable"
            link="show"
          >
            <TextField source="firstname" />{" "}
            <TextField source="lastname" />
          </ReferenceField>
        </CardContent>
      </Card>

      <Divider sx={{ my: 3, borderColor: "#334155" }} />
      
      <ManagerCard />
    </SimpleShowLayout>
  </Show>
);
