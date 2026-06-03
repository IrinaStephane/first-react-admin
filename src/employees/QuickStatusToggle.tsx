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
      variant="contained"
      onClick={(e) => {
        e.stopPropagation();
        handleToggle();
      }}
      disabled={isPending}
      startIcon={record.active ? <CancelIcon /> : <CheckCircleIcon />}
      sx={{
        background: record.active 
          ? "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
          : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        color: "#f8fafc",
        fontWeight: 500,
        transition: "all 0.3s ease",
        "&:hover": {
          background: record.active
            ? "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)"
            : "linear-gradient(135deg, #059669 0%, #047857 100%)",
          transform: "translateY(-2px)",
          boxShadow: "0 8px 16px rgba(59, 130, 246, 0.2)",
        },
        "&:disabled": {
          opacity: 0.6,
        }
      }}
    >
      {record.active ? "Désactiver" : "Activer"}
    </Button>
  );
};
