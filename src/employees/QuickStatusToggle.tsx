// src/employees/QuickStatusToggle.tsx
import { useUpdate, useRecordContext, useNotify, useRefresh } from "react-admin";
import { Button } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

/**
 * QuickStatusToggle — Exercice 10
 *
 * useUpdate bascule le champ `active` sans navigation.
 * previousData est obligatoire : json-server (et ra-data-json-server) fait un PUT
 * qui remplace l'objet entier. Sans previousData, tous les autres champs
 * seraient perdus (l'objet serait réduit à { id, active }).
 */
export const QuickStatusToggle = () => {
  const record = useRecordContext();
  const notify = useNotify();
  const refresh = useRefresh();

  const [update, { isPending }] = useUpdate();

  if (!record) return null;

  const handleToggle = () => {
    update(
      "employees",
      {
        id: record.id,
        data: { ...record, active: !record.active },
        previousData: record, // ← nécessaire pour que PUT envoie l'objet complet
      },
      {
        onSuccess: () => {
          notify(
            record.active ? "Employé désactivé" : "Employé activé",
            { type: "success" }
          );
          refresh();
        },
        onError: () => notify("Erreur lors de la mise à jour", { type: "error" }),
      }
    );
  };

  return (
    <Button
      size="small"
      variant="outlined"
      color={record.active ? "error" : "success"}
      startIcon={record.active ? <CancelIcon /> : <CheckCircleIcon />}
      onClick={(e) => {
        e.stopPropagation(); // évite le rowClick
        handleToggle();
      }}
      disabled={isPending}
    >
      {record.active ? "Désactiver" : "Activer"}
    </Button>
  );
};
