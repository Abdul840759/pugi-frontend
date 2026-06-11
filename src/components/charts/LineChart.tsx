import {
  LineChart as RechartsLine,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface LineChartProps {
  data: { name: string; value: number }[];
  dataKey?: string;
  color?: string;
  height?: number;
}

export function LineChart({ data, dataKey = 'value', color = '#6366f1', height = 300 }: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLine data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
        <XAxis dataKey="name" className="text-xs" tick={{ fill: '#94a3b8' }} />
        <YAxis className="text-xs" tick={{ fill: '#94a3b8' }} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--tooltip-bg, #1e293b)',
            border: 'none',
            borderRadius: '8px',
            color: '#f1f5f9',
          }}
        />
        <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
      </RechartsLine>
    </ResponsiveContainer>
  );
}
