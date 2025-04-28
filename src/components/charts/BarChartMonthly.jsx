import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, subMonths, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

const BarChartMonthly = ({ casos = [] }) => { 
  const getLast6Months = () => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      months.push(subMonths(new Date(), i));
    }
    return months;
  };

  const prepareChartData = () => {
    const months = getLast6Months();

    return months.map(month => {
      const monthYear = format(month, "MM/yyyy");
      const monthName = format(month, "MMM", { locale: ptBR });

      const monthCases = Array.isArray(casos) ? casos.filter(caso => {
        try {
          const caseDate = parseISO(caso?.openingDate);
          return (
            caseDate.getMonth() === month.getMonth() &&
            caseDate.getFullYear() === month.getFullYear()
          );
        } catch {
          return false;
        }
      }) : [];

      return {
        name: monthName.charAt(0).toUpperCase() + monthName.slice(1, 3),
        fullMonth: format(month, "MMMM yyyy", { locale: ptBR }),
        cases: monthCases.length,
      };
    });
  };

  const chartData = prepareChartData();

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={chartData}>
        <XAxis dataKey="name" />
        <YAxis hide />
        <Tooltip
          formatter={(value) => [value, "Casos"]}
          labelFormatter={(label) => {
            const index = chartData.findIndex(item => item.name === label);
            return chartData[index]?.fullMonth || label;
          }}
        />
        <Bar
          dataKey="cases"
          fill="#06b6d4"
          radius={[8, 8, 0, 0]}
          name="Casos"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartMonthly;