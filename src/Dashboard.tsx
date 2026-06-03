// src/Dashboard.tsx
import { useGetList } from "react-admin";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Box,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SchoolIcon from "@mui/icons-material/School";
import EuroIcon from "@mui/icons-material/Euro";

/**
 * Carte d'indicateur générique
 */
const StatCard = ({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number | undefined;
  icon: React.ReactNode;
  color: string;
}) => (
  <Card sx={{ height: "100%" }}>
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
  </Card>
);

/**
 * Dashboard — Exercice 12
 *
 * Les 4 useGetList se font EN PARALLÈLE (Q 12.1) :
 * React lance les 4 requêtes simultanément au premier rendu.
 * Chacun est indépendant — il n'y a pas d'await l'un après l'autre.
 *
 * perPage: 1 (Q 12.2) :
 * On n'a besoin QUE du total (X-Total-Count), pas des données.
 * Charger 100 enregistrements pour ne lire que le count serait inutile
 * et lent. perPage:1 minimise le payload réseau.
 */
export const Dashboard = () => {
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
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Employés actifs"
            value={activeEmployees}
            icon={<CheckCircleIcon />}
            color="#2e7d32"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total stagiaires"
            value={totalInterns}
            icon={<SchoolIcon />}
            color="#ed6c02"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Stagiaires rémunérés"
            value={remuneratedInterns}
            icon={<EuroIcon />}
            color="#9c27b0"
          />
        </Grid>
      </Grid>
    </Box>
  );
};
