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
} from "@mui/material";
import { Link } from "react-router-dom";

export const InternsByManager = () => {
  const record = useRecordContext();

  const { data: interns, total, isPending } = useGetList("interns", {
    filter: { managerId: record?.id },
    pagination: { page: 1, perPage: 100 },
  });

  if (!record) return null;
  if (isPending) return <CircularProgress size={20} />;

  return (
    <Box mt={2}>
      <Typography variant="h6" gutterBottom>
        Stagiaires encadrés ({total ?? 0})
      </Typography>

      {!interns || interns.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Aucun stagiaire rattaché à cet employé.
        </Typography>
      ) : (
        <List dense disablePadding>
          {interns.map((intern) => (
            <ListItem key={intern.id} disablePadding>
              <ListItemButton component={Link} to={`/interns/${intern.id}/show`}>
                <ListItemText
                  primary={`${intern.firstname} ${intern.lastname}`}
                  secondary={intern.email}
                />
                <Chip
                  label={intern.isRemunerate ? `${intern.remuneration} €` : "Non rémunéré"}
                  size="small"
                  color={intern.isRemunerate ? "success" : "default"}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};
