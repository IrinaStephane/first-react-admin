// src/interns/ManagerCard.tsx
import { useRecordContext, useGetOne } from "react-admin";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Box,
  Link,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

/**
 * ManagerCard — Exercice 8.2
 *
 * 1. useRecordContext() → lit le stagiaire courant (fourni par <Show>)
 * 2. useGetOne()        → charge l'employé (manager) par son id
 *
 * L'option { enabled: !!record?.managerId } évite un appel API
 * avec id=undefined tant que le stagiaire n'est pas encore chargé.
 */
export const ManagerCard = () => {
  const record = useRecordContext(); // stagiaire courant

  const {
    data: manager,
    isPending,
    error,
  } = useGetOne(
    "employees",
    { id: record?.managerId },
    { enabled: !!record?.managerId } // ← évite l'appel si id est undefined
  );

  // État 1 — chargement
  if (isPending) {
    return (
      <Box display="flex" alignItems="center" gap={1} p={2}>
        <CircularProgress size={20} />
        <Typography variant="body2">Chargement du manager...</Typography>
      </Box>
    );
  }

  // État 2 — erreur
  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 1 }}>
        Impossible de charger les informations du manager.
      </Alert>
    );
  }

  // État 3 — données disponibles
  return (
    <Card variant="outlined" sx={{ mt: 2, maxWidth: 400 }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <PersonIcon color="primary" />
          <Typography variant="h6">Manager</Typography>
        </Box>

        <Typography variant="subtitle1" fontWeight="bold">
          {manager?.firstname} {manager?.lastname}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {manager?.department}
        </Typography>

        <Link href={`mailto:${manager?.email}`} underline="hover" display="block" mt={0.5}>
          {manager?.email}
        </Link>

        <Box mt={1}>
          <Chip
            label={manager?.active ? "Actif" : "Inactif"}
            color={manager?.active ? "success" : "default"}
            size="small"
          />
        </Box>
      </CardContent>
    </Card>
  );
};
