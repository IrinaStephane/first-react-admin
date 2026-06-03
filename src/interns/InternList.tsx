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
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Ajouter un stagiaire rapide</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
        {error && <Alert severity="error">{error}</Alert>}
        <MuiTextField
          label="Prénom"
          value={form.firstname}
          onChange={(e) => setForm({ ...form, firstname: e.target.value })}
          size="small"
        />
        <MuiTextField
          label="Nom"
          value={form.lastname}
          onChange={(e) => setForm({ ...form, lastname: e.target.value })}
          size="small"
        />
        <MuiTextField
          label="ID Manager"
          type="number"
          value={form.managerId}
          onChange={(e) => setForm({ ...form, managerId: e.target.value })}
          size="small"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isPending}>Annuler</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={isPending}>
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
      >
        <Datagrid rowClick="show">
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
