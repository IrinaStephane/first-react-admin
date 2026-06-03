import { useState } from "react";
import {
  List,
  Datagrid,
  TextField,
  NumberField,
  BooleanField,
  ReferenceField,
  SearchInput,
  SelectInput,
  BooleanInput,
  EditButton,
  DeleteButton,
  FilterButton,
  CreateButton,
  TopToolbar,
  useCreate,
  useRefresh,
  useNotify,
} from "react-admin";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField as MuiTextField,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const departmentChoices = [
  { id: "Informatique", name: "Informatique" },
  { id: "Marketing", name: "Marketing" },
  { id: "RH", name: "RH" },
  { id: "Finance", name: "Finance" },
];

const internFilters = [
  <SearchInput source="q" alwaysOn />,
  <SelectInput source="department" label="Département" choices={departmentChoices} />,
  <BooleanInput source="isRemunerate" label="Rémunéré" />,
];

const QuickCreateModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [create, { isPending }] = useCreate();
  const refresh = useRefresh();
  const notify = useNotify();
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({ firstname: "", lastname: "", managerId: "" });

  const handleSubmit = async () => {
    setError(null);
    try {
      await create(
        "interns",
        {
          data: {
            firstname: form.firstname,
            lastname: form.lastname,
            managerId: Number(form.managerId),
            isRemunerate: false,
            remuneration: 0,
          },
        },
        {
          onSuccess: () => {
            notify("Stagiaire créé avec succès");
            refresh();
            onClose();
            setForm({ firstname: "", lastname: "", managerId: "" });
          },
          onError: (err: any) => {
            setError(err?.message ?? "Erreur lors de la création");
          },
        }
      );
    } catch (e: any) {
      setError(e?.message ?? "Erreur inconnue");
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="xs" 
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: "#1a1f3a",
          borderColor: "#334155",
          border: "1px solid #334155",
        }
      }}
    >
      <DialogTitle sx={{ color: "#f8fafc", fontWeight: 600 }}>Ajouter un stagiaire rapide</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
        {error && <Alert severity="error" sx={{ backgroundColor: "rgba(239, 68, 68, 0.1)" }}>{error}</Alert>}
        <MuiTextField
          label="Prénom"
          value={form.firstname}
          onChange={(e) => setForm({ ...form, firstname: e.target.value })}
          size="small"
          fullWidth
          InputLabelProps={{ style: { color: "#cbd5e1" } }}
        />
        <MuiTextField
          label="Nom"
          value={form.lastname}
          onChange={(e) => setForm({ ...form, lastname: e.target.value })}
          size="small"
          fullWidth
          InputLabelProps={{ style: { color: "#cbd5e1" } }}
        />
        <MuiTextField
          label="ID Manager"
          type="number"
          value={form.managerId}
          onChange={(e) => setForm({ ...form, managerId: e.target.value })}
          size="small"
          fullWidth
          InputLabelProps={{ style: { color: "#cbd5e1" } }}
        />
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={isPending} sx={{ color: "#cbd5e1" }}>Annuler</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={isPending}
          sx={{ 
            background: "linear-gradient(135deg, #3b82f6 0%, #0ea5e9 100%)",
            "&:hover": {
              background: "linear-gradient(135deg, #1e40af 0%, #0369a1 100%)"
            }
          }}
        >
          {isPending ? "Création..." : "Créer"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const ListActions = ({ onQuickCreate }: { onQuickCreate: () => void }) => (
  <TopToolbar>
    <FilterButton />
    <Button
      startIcon={<AddIcon />}
      onClick={onQuickCreate}
      size="small"
      variant="outlined"
      sx={{ mr: 1 }}
    >
      Ajouter stagiaire rapide
    </Button>
    <CreateButton label="Création complète" />
  </TopToolbar>
);

export const InternList = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <List
        filters={internFilters}
        actions={<ListActions onQuickCreate={() => setModalOpen(true)} />}
        perPage={5}
        title="Liste des stagiaires"
        sx={{
          background: "linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)",
          minHeight: "100vh",
          "& .RaList-main": {
            backgroundColor: "transparent",
          },
        }}
      >
        <Datagrid 
          rowClick="show"
          sx={{
            backgroundColor: "#1a1f3a",
            border: "1px solid #334155",
            borderRadius: "8px",
            overflow: "hidden",
            "& .RaDatagrid-tableWrapper": {
              backgroundColor: "#1a1f3a",
            },
          }}
        >
          <TextField source="firstname" label="Prénom" />
          <TextField source="lastname" label="Nom" />
          <TextField source="email" label="Email" />
          <TextField source="department" label="Département" />
          <ReferenceField source="managerId" reference="employees" label="Manager">
            <TextField source="firstname" /> <TextField source="lastname" />
          </ReferenceField>
          <NumberField
            source="remuneration"
            label="Rémunération"
            options={{ style: "currency", currency: "EUR" }}
          />
          <BooleanField source="isRemunerate" label="Rémunéré" />
          <EditButton />
          <DeleteButton />
        </Datagrid>
      </List>

      <QuickCreateModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};
