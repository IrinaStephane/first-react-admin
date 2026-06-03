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
import EmailIcon from "@mui/icons-material/Email";
import BusinessIcon from "@mui/icons-material/Business";

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
      <Alert 
        severity="error" 
        sx={{ 
          mt: 1,
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          color: "#ef4444",
          borderLeft: "4px solid #ef4444",
        }}
      >
        Impossible de charger les informations du manager.
      </Alert>
    );
  }

  return (
    <Card 
      sx={{ 
        mt: 3, 
        border: "1px solid #334155", 
        backgroundColor: "#1a1f3a",
        transition: "all 0.3s ease",
        "&:hover": {
          borderColor: "#3b82f6",
          boxShadow: "0 10px 40px rgba(59, 130, 246, 0.15)",
        }
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <PersonIcon sx={{ color: "#0ea5e9", fontSize: 28 }} />
          <Typography variant="h6" sx={{ color: "#f8fafc" }}>Responsable</Typography>
        </Box>

        <Typography 
          variant="subtitle1" 
          fontWeight="bold"
          sx={{ color: "#f8fafc", mb: 1 }}
        >
          {manager?.firstname} {manager?.lastname}
        </Typography>

        <Box display="flex" alignItems="center" gap={1} mb={1.5}>
          <BusinessIcon sx={{ color: "#cbd5e1", fontSize: 18 }} />
          <Typography variant="body2" sx={{ color: "#cbd5e1" }}>
            {manager?.department}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={1} mb={1.5}>
          <EmailIcon sx={{ color: "#cbd5e1", fontSize: 18 }} />
          <Link 
            href={`mailto:${manager?.email}`} 
            underline="hover"
            sx={{
              color: "#3b82f6",
              transition: "color 0.2s ease",
              "&:hover": {
                color: "#0ea5e9",
              }
            }}
          >
            {manager?.email}
          </Link>
        </Box>

        <Box mt={2}>
          <Chip
            label={manager?.active ? "Actif" : "Inactif"}
            sx={{
              backgroundColor: manager?.active ? "#10b981" : "#64748b",
              color: "#f8fafc",
              fontWeight: 500,
            }}
            size="small"
          />
        </Box>
      </CardContent>
    </Card>
  );
};
