import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#00bcd4", "#ff69b4", "#a4de6c"];

const PieChartView = ({ dados }) => {
    return (
        <ResponsiveContainer width="100%" height={400}>
            <h3 style={{ textAlign: 'center', marginBottom: '0rem' }}>
                Variáveis dos Casos
            </h3>
            <PieChart>
                <Pie
                    data={dados}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    label
                >
                    {dados.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                        />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default PieChartView;
