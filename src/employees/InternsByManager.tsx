import { useRecordContext, useGetList } from "react-admin";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Chip,
  Box,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";
import { Link } from "react-router-dom";
import SchoolIcon from "@mui/icons-material/School";

export const InternsByManager = () => {
  const record = useRecordContext();

  const { data: interns, total, isPending } = useGetList("interns", {
    filter: { managerId: record?.id },
    pagination: { page: 1, perPage: 100 },
  });

  if (!record) return null;
  if (isPending) return <CircularProgress size={20} />;

  return (
    <Card sx={{ mt: 3, border: "1px solid #334155", backgroundColor: "#1a1f3a" }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <SchoolIcon sx={{ color: "#0ea5e9" }} />
          <Typography variant="h6" sx={{ color: "#f8fafc" }}>
            Stagiaires encadrés ({total ?? 0})
          </Typography>
        </Box>

        {!interns || interns.length === 0 ? (
          <Typography variant="body2" sx={{ color: "#cbd5e1" }}>
            Aucun stagiaire rattaché à cet employé.
          </Typography>
        ) : (
          <List dense disablePadding>
            {interns.map((intern) => (
              <ListItem 
                key={intern.id} 
                disablePadding
                sx={{
                  "&:hover": {
                    backgroundColor: "rgba(59, 130, 246, 0.1)",
                  },
                  borderRadius: "4px",
                  mb: 1,
                }}
              >
                <ListItemButton 
                  component={Link} 
                  to={`/interns/${intern.id}/show`}
                  sx={{
                    padding: 1,
                    borderRadius: "4px",
                    border: "1px solid #334155",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      borderColor: "#3b82f6",
                    }
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography sx={{ color: "#f8fafc", fontWeight: 500 }}>
                        {intern.firstname} {intern.lastname}
                      </Typography>
                    }
                    secondary={
                      <Typography sx={{ color: "#cbd5e1" }}>
                        {intern.email}
                      </Typography>
                    }
                  />
                  <Chip
                    label={intern.isRemunerate ? `${intern.remuneration} €` : "Non rémunéré"}
                    size="small"
                    sx={{
                      backgroundColor: intern.isRemunerate ? "#10b981" : "#64748b",
                      color: "#f8fafc",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};
