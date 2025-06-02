import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#00bcd4", "#ff69b4", "#a4de6c"];


const BarChartView = ({ dados, dataKeys }) => {
  return (
    <div >
      <div style={{ overflowX: 'scroll', height: '600px', padding: "5rem 0", overflowY: 'hidden' }}>

        <h3 style={{ textAlign: 'center', marginBottom: '3rem' }}>
          Casos por Dia 
        </h3>

        <ResponsiveContainer height={"100%"}  minWidth="850px" width="100%">
          <BarChart data={dados} margin={{ right: 20 }}>
            <XAxis
              dataKey="name"
              tickFormatter={(name, index) =>
                `${name}\n${dados[index]?.formattedDate || ""}`
              }
            />
            <YAxis />
            <Tooltip />
            <Legend />
            {dataKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={COLORS[index % COLORS.length]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChartView;
