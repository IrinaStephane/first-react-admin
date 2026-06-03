import { useRecordContext, useGetList } from "react-admin";
import { Box, Typography, Chip } from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";

export const DepartmentStats = () => {
  const record = useRecordContext();

  const { total, isPending } = useGetList("employees", {
    filter: {
      department: record?.department,
      active: true,
    },
    pagination: { page: 1, perPage: 1 },
  });

  if (!record) return null;
  const colleagues = isPending ? "…" : Math.max(0, (total ?? 0) - 1);

  return (
    <Box display="flex" alignItems="center" gap={1} mt={1}>
      <GroupIcon color="action" fontSize="small" />
      <Typography variant="body2">
        Collègues actifs dans{" "}
        <strong>{record.department}</strong> :
      </Typography>
      <Chip label={colleagues} size="small" color="primary" variant="outlined" />
    </Box>
  );
};