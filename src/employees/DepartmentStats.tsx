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
    <Box 
      display="flex" 
      alignItems="center" 
      gap={2} 
      mt={3}
      p={2}
      sx={{
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderLeft: "4px solid #3b82f6",
        borderRadius: "4px",
      }}
    >
      <GroupIcon sx={{ color: "#3b82f6", fontSize: 28 }} />
      <Box flex={1}>
        <Typography variant="body2" sx={{ color: "#cbd5e1" }}>
          Collègues actifs dans <Box sx={{ color: "#f8fafc" }}>{record.department}</Box>
        </Typography>
      </Box>
      <Chip 
        label={colleagues} 
        size="small" 
        sx={{
          backgroundColor: "#3b82f6",
          color: "#f8fafc",
          fontWeight: 600,
        }}
      />
    </Box>
  );
};