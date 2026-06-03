// src/employees/InternsByManager.tsx
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

/**
 * InternsByManager — Exercice 9.1
 *
 * useGetList est indispensable ici (vs ReferenceManyField) car :
 * - on veut un accès programmatique au total et aux données
 * - on affiche des informations custom hors d'un contexte <Show> standard
 * - on doit conditionner l'affichage sur le total (message si vide)
 */
export const InternsByManager = () => {
  const record = useRecordContext(); // employé courant

  const { data: interns, total, isPending } = useGetList("interns", {
    filter: { managerId: record?.id },
    pagination: { page: 1, perPage: 100 },
    // Ne lance pas la requête si l'employé n'est pas encore chargé
  });

  if (!record) return null;
  if (isPending) return <CircularProgress size={20} />;

  return (
    <Box mt={2}>
      {/* Titre avec total */}
      <Typography variant="h6" gutterBottom>
        Stagiaires encadrés ({total ?? 0})
      </Typography>

      {/* Message si aucun stagiaire */}
      {!interns || interns.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Aucun stagiaire rattaché à cet employé.
        </Typography>
      ) : (
        <List dense disablePadding>
          {interns.map((intern) => (
            <ListItem key={intern.id} disablePadding>
              {/* Lien vers InternShow */}
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
