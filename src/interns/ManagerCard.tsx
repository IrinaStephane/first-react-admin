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

export const ManagerCard = () => {
  const record = useRecordContext();

  const {
    data: manager,
    isPending,
    error,
  } = useGetOne(
    "employees",
    { id: record?.managerId },
    { enabled: !!record?.managerId }
  );

  if (isPending) {
    return (
      <Box display="flex" alignItems="center" gap={1} p={2}>
        <CircularProgress size={20} />
        <Typography variant="body2">Chargement du manager...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 1 }}>
        Impossible de charger les informations du manager.
      </Alert>
    );
  }

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
