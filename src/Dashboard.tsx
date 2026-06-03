import { useGetList } from "react-admin";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Box,
  CardActionArea,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SchoolIcon from "@mui/icons-material/School";
import EuroIcon from "@mui/icons-material/Euro";

const StatCard = ({
  title,
  value,
  icon,
  color,
  onClick,
}: {
  title: string;
  value: number | undefined;
  icon: React.ReactNode;
  color: string;
  onClick?: () => void;
}) => (
  <Card sx={{ height: "100%" }}>
    <CardActionArea
      onClick={onClick}
      sx={{ height: "100%", textAlign: "left" }}
      disableRipple={!onClick}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle2" color="text.secondary">
            {title}
          </Typography>
          <Box sx={{ color }}>{icon}</Box>
        </Box>
        <Typography variant="h3" fontWeight="bold" mt={1} sx={{ color }}>
          {value === undefined ? <CircularProgress size={32} /> : value}
        </Typography>
      </CardContent>
    </CardActionArea>
  </Card>
);


export const Dashboard = () => {
  const navigate = useNavigate();
  const { total: totalEmployees } = useGetList("employees", {
    pagination: { page: 1, perPage: 1 },
  });

  const { total: activeEmployees } = useGetList("employees", {
    filter: { active: true },
    pagination: { page: 1, perPage: 1 },
  });

  const { total: totalInterns } = useGetList("interns", {
    pagination: { page: 1, perPage: 1 },
  });

  const { total: remuneratedInterns } = useGetList("interns", {
    filter: { isRemunerate: true },
    pagination: { page: 1, perPage: 1 },
  });

  const goTo = (path: string) => () => navigate(path);

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Tableau de bord RH
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total employés"
            value={totalEmployees}
            icon={<PeopleIcon />}
            color="#1976d2"
            onClick={goTo("/employees")}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Employés actifs"
            value={activeEmployees}
            icon={<CheckCircleIcon />}
            color="#2e7d32"
            onClick={goTo("/employees")}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total stagiaires"
            value={totalInterns}
            icon={<SchoolIcon />}
            color="#ed6c02"
            onClick={goTo("/interns")}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Stagiaires rémunérés"
            value={remuneratedInterns}
            icon={<EuroIcon />}
            color="#9c27b0"
            onClick={goTo("/interns")}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
