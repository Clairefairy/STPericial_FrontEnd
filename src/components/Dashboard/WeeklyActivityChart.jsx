import BarChartWeekly from "../charts/BarChartWeekly";

const WeeklyActivityChart = (casos) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-4">Casos criados na semana</h3>
      <BarChartWeekly casos={casos.casos}/>
    </div>
  );
};

export default WeeklyActivityChart;
