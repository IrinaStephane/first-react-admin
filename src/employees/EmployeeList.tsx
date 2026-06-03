import {
  List,
  Datagrid,
  TextField,
  NumberField,
  BooleanField,
  SearchInput,
  SelectInput,
  EditButton,
  DeleteButton,
  FilterButton,
  CreateButton,
  TopToolbar,
} from "react-admin";
import { QuickStatusToggle } from "./QuickStatusToggle";

const departmentChoices = [
  { id: "Informatique", name: "Informatique" },
  { id: "Marketing", name: "Marketing" },
  { id: "RH", name: "RH" },
  { id: "Finance", name: "Finance" },
];

const employeeFilters = [
  <SearchInput source="q" alwaysOn />,
  <SelectInput source="department" label="Département" choices={departmentChoices} />,
];

const ListActions = () => (
  <TopToolbar>
    <FilterButton />
    <CreateButton label="Ajouter un employé" />
  </TopToolbar>
);

export const EmployeeList = () => (
  <List
    filters={employeeFilters}
    actions={<ListActions />}
    perPage={5}
    sort={{ field: "id", order: "ASC" }}
    title="Liste des employés"
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
      <NumberField
        source="salary"
        label="Salaire"
        options={{ style: "currency", currency: "EUR" }}
      />
      <BooleanField source="active" label="Actif" />
      <QuickStatusToggle />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);