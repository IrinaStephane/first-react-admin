import { useUpdate, useRecordContext, useNotify, useRefresh } from "react-admin";
import { Button } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

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
        previousData: record,
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
        e.stopPropagation();
        handleToggle();
      }}
      disabled={isPending}
    >
      {record.active ? "Désactiver" : "Activer"}
    </Button>
  );
};
