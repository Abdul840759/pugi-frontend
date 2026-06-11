import { PieChart as RechartsPie, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface PieChartProps {
  data: { name: string; value: number }[];
  height?: number;
}

const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];

export function PieChart({ data, height = 300 }: PieChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPie>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={4}
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </RechartsPie>
    </ResponsiveContainer>
  );
}
