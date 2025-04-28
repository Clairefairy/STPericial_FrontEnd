import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format, subDays } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

const BarChartWeekly = ({ casos = [] }) => {
  const formatDate = (date) => {

    return format(new Date(date), "dd/MM", { locale: ptBR });

  };

  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      days.push(subDays(new Date(), i));
    }
    return days;
  };

  const prepareChartData = () => {
    const days = getLast7Days();
    return days.map(day => {
      const dayStr = format(day, "yyyy-MM-dd");
      const dayName = format(day, "EEE", { locale: ptBR });

      const dayCases = Array.isArray(casos) ? casos.filter(caso => {
        const caseDate = caso?.openingDate?.split('T')[0];
        return caseDate === dayStr;
      }) : [];

      return {
        name: dayName.charAt(0).toUpperCase() + dayName.slice(1, 3),
        date: formatDate(dayStr),
        em_andamento: dayCases.filter(c => c?.status === "em_andamento").length,
        finalizado: dayCases.filter(c => c?.status === "finalizado").length,
        arquivado: dayCases.filter(c => c?.status === "arquivado").length,
      };
    });
  };

  const chartData = prepareChartData();

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={chartData}>
        <XAxis dataKey="name" />
        <YAxis hide />
        <Tooltip
          formatter={(value, name) => {
            const names = {
              "em_andamento": "Em Andamento",
              "finalizado": "Finalizado",
              "arquivado": "Arquivado"
            };
            return [value, names[name]];
          }}
          labelFormatter={(label) => {
            const index = chartData.findIndex(item => item.name === label);
            return chartData[index]?.date || label;
          }}
        />
        <Legend
          formatter={(value) => {
            const names = {
              "em_andamento": "Em Andamento",
              "finalizado": "Finalizado",
              "arquivado": "Arquivado"
            };
            return names[value];
          }}
        />
        <Bar
          dataKey="em_andamento"
          fill="#facc15"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="finalizado"
          fill="#4ade80"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="arquivado"
          fill="#60a5fa"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartWeekly;