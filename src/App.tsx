import { Admin, Resource } from "react-admin";
import jsonServerProvider from "ra-data-json-server";
import { EmployeeList } from "./employees/EmployeeList";
import { EmployeeCreate } from "./employees/EmployeeCreate";
import { EmployeeEdit } from "./employees/EmployeeEdit";
import { EmployeeShow } from "./employees/EmployeeShow";
import { InternList } from "./interns/InternList";
import { InternCreate } from "./interns/InternCreate";
import { InternEdit } from "./interns/InternEdit";
import { InternShow } from "./interns/InternShow";
import { Dashboard } from "./Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import SchoolIcon from "@mui/icons-material/School";
import { createTheme } from "@mui/material/styles";

const dataProvider = jsonServerProvider("http://localhost:3002");

// Thème bleu nuit personnalisé
const darkNightTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#0a0e27",
      paper: "#1a1f3a",
    },
    primary: {
      main: "#3b82f6",
      light: "#60a5fa",
      dark: "#1e40af",
    },
    secondary: {
      main: "#0ea5e9",
      light: "#38bdf8",
      dark: "#0369a1",
    },
    text: {
      primary: "#f8fafc",
      secondary: "#cbd5e1",
    },
    divider: "#334155",
    success: {
      main: "#10b981",
    },
    error: {
      main: "#ef4444",
    },
    warning: {
      main: "#f59e0b",
    },
    info: {
      main: "#3b82f6",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 600,
      fontSize: "1.5rem",
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: "1px solid #334155",
          transition: "all 0.3s ease",
          "&:hover": {
            borderColor: "#3b82f6",
            boxShadow: "0 10px 40px rgba(59, 130, 246, 0.15)",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
        },
        contained: {
          background: "linear-gradient(135deg, #3b82f6 0%, #0ea5e9 100%)",
          "&:hover": {
            background: "linear-gradient(135deg, #1e40af 0%, #0369a1 100%)",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: "linear-gradient(135deg, #1a1f3a 0%, #0f1729 100%)",
          borderBottom: "1px solid #334155",
        },
      },
    },
  },
});

const App = () => (
  <Admin dataProvider={dataProvider} dashboard={Dashboard} theme={darkNightTheme}>
    <Resource
      name="employees"
      list={EmployeeList}
      create={EmployeeCreate}
      edit={EmployeeEdit}
      show={EmployeeShow}
      icon={PeopleIcon}
      options={{ label: "Employés" }}
    />
    <Resource
      name="interns"
      list={InternList}
      create={InternCreate}
      edit={InternEdit}
      show={InternShow}
      icon={SchoolIcon}
      options={{ label: "Stagiaires" }}
    />
  </Admin>
);

export default App;