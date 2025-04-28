import BarChartMonthly from "../charts/BarChartMonthly";

const CaseDurationChart = (casos) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <h3 className="font-semibold text-blue-600 mb-2">
        Quantos casos criados por mês
      </h3>
      <BarChartMonthly casos={casos.casos} />
    </div>
  );
};

export default CaseDurationChart;
