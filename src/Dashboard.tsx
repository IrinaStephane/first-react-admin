import { useGetList } from "react-admin";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Box,
  CardActionArea,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SchoolIcon from "@mui/icons-material/School";
import EuroIcon from "@mui/icons-material/Euro";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const StatCard = ({
  title,
  value,
  icon,
  color,
  onClick,
}: {
  title: string;
  value: number | undefined;
  icon: React.ReactNode;
  color: string;
  onClick?: () => void;
}) => (
  <Card sx={{ height: "100%" }}>
    <CardActionArea
      onClick={onClick}
      sx={{ height: "100%", textAlign: "left" }}
      disableRipple={!onClick}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle2" color="text.secondary">
            {title}
          </Typography>
          <Box sx={{ color }}>{icon}</Box>
        </Box>
        <Typography variant="h3" fontWeight="bold" mt={1} sx={{ color }}>
          {value === undefined ? <CircularProgress size={32} /> : value}
        </Typography>
      </CardContent>
    </CardActionArea>
  </Card>
);

export const Dashboard = () => {
  const navigate = useNavigate();
  const { total: totalEmployees, data: allEmployees } = useGetList("employees", {
    pagination: { page: 1, perPage: 100 },
  });

  const { total: activeEmployees } = useGetList("employees", {
    filter: { active: true },
    pagination: { page: 1, perPage: 1 },
  });

  const { total: totalInterns, data: allInterns } = useGetList("interns", {
    pagination: { page: 1, perPage: 100 },
  });

  const { total: remuneratedInterns } = useGetList("interns", {
    filter: { isRemunerate: true },
    pagination: { page: 1, perPage: 1 },
  });

  // Préparer les données pour le graphique des employés par département
  const departmentData = React.useMemo(() => {
    if (!allEmployees || !Array.isArray(allEmployees)) return [];
    
    const deptMap: { [key: string]: number } = {};
    allEmployees.forEach((emp: any) => {
      const dept = emp.department || "Non assigné";
      deptMap[dept] = (deptMap[dept] || 0) + 1;
    });
    
    return Object.entries(deptMap).map(([name, value]) => ({
      name,
      value,
    }));
  }, [allEmployees]);

  // Préparer les données pour le graphique des stagiaires
  const internData = React.useMemo(() => {
    if (!allInterns || !Array.isArray(allInterns)) return [];
    
    const remunerated = allInterns.filter((int: any) => int.isRemunerate).length;
    const notRemunerated = allInterns.length - remunerated;
    
    return [
      { name: "Rémunérés", value: remunerated },
      { name: "Non rémunérés", value: notRemunerated },
    ];
  }, [allInterns]);

  const internColors = ["#10b981", "#f59e0b"];

  const goTo = (path: string) => () => navigate(path);

  return (
    <Box sx={{ p: 3, background: "linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)" }}>
      <Typography variant="h5" fontWeight="bold" mb={4} sx={{ color: "#f8fafc" }}>
        Tableau de bord RH
      </Typography>
      
      {/* Cartes de statistiques */}
      <Grid container spacing={3} mb={4}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total employés"
            value={totalEmployees}
            icon={<PeopleIcon />}
            color="#3b82f6"
            onClick={goTo("/employees")}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Employés actifs"
            value={activeEmployees}
            icon={<CheckCircleIcon />}
            color="#10b981"
            onClick={goTo("/employees")}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total stagiaires"
            value={totalInterns}
            icon={<SchoolIcon />}
            color="#0ea5e9"
            onClick={goTo("/interns")}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Stagiaires rémunérés"
            value={remuneratedInterns}
            icon={<EuroIcon />}
            color="#f59e0b"
            onClick={goTo("/interns")}
          />
        </Grid>
      </Grid>

      {/* Graphiques */}
      <Grid container spacing={3}>
        {/* Graphique en barres - Employés par département */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ border: "1px solid #334155" }}>
            <CardContent>
              <Typography
                variant="h6"
                fontWeight="bold"
                mb={2}
                sx={{ color: "#f8fafc" }}
              >
                Employés par département
              </Typography>
              {departmentData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={departmentData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" stroke="#cbd5e1" />
                    <YAxis stroke="#cbd5e1" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1a1f3a",
                        border: "1px solid #334155",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Box display="flex" justifyContent="center" alignItems="center" height={300}>
                  <CircularProgress />
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Graphique en secteurs - Stagiaires */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ border: "1px solid #334155" }}>
            <CardContent>
              <Typography
                variant="h6"
                fontWeight="bold"
                mb={2}
                sx={{ color: "#f8fafc" }}
              >
                Répartition des stagiaires
              </Typography>
              {internData.length > 0 && internData.some(d => d.value > 0) ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={internData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {internData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={internColors[index]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1a1f3a",
                        border: "1px solid #334155",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Box display="flex" justifyContent="center" alignItems="center" height={300}>
                  <CircularProgress />
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

import React from "react";
