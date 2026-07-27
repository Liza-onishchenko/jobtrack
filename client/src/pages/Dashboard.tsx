import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { PieLabelRenderProps, TooltipContentProps } from 'recharts';
import { useAppSelector } from '../app/hooks';
import { fetchStatsRequest } from '../api/applicationsApi';
import { PLATFORMS, STATUSES } from '../types/jobApplication';
import type { ApplicationStats } from '../types/jobApplication';

const PLATFORM_COLORS = ['var(--series-1)', 'var(--series-2)', 'var(--series-3)', 'var(--series-4)'];
const STATUS_COLORS = [
  'var(--series-1)',
  'var(--series-2)',
  'var(--series-3)',
  'var(--series-4)',
  'var(--series-5)',
];

function ChartTooltip({ active, payload }: TooltipContentProps) {
  if (!active || !payload || !payload.length) return null;
  const point = payload[0];

  return (
    <div className="chart-tooltip">
      <span className="chart-tooltip-value">{String(point.value)}</span>
      <span className="chart-tooltip-label">{String(point.name)}</span>
    </div>
  );
}

function renderPieLabel(props: PieLabelRenderProps): string {
  const value = typeof props.value === 'number' ? props.value : 0;
  if (!value) return '';
  return `${props.name}: ${value}`;
}

export default function Dashboard() {
  const user = useAppSelector((state) => state.auth.user);
  const [stats, setStats] = useState<ApplicationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    fetchStatsRequest()
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load statistics');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const platformData = stats
    ? PLATFORMS.map((platform) => ({ name: platform, value: stats.byPlatform[platform] }))
    : [];
  const statusData = stats
    ? STATUSES.map((status) => ({ name: status, value: stats.byStatus[status] }))
    : [];

  return (
    <div className="page">
      <h1>Welcome back{user ? `, ${user.name}` : ''}</h1>

      {loading && <p>Loading...</p>}
      {!loading && error && <p className="form-error">{error}</p>}

      {!loading && !error && stats && stats.total === 0 && (
        <div className="empty-state">
          <p>No applications yet — add your first one!</p>
          <Link to="/applications" className="button-link">
            Add application
          </Link>
        </div>
      )}

      {!loading && !error && stats && stats.total > 0 && (
        <>
          <div className="stat-tiles">
            <div className="stat-tile">
              <span className="stat-label">Total applications</span>
              <span className="stat-value">{stats.total}</span>
            </div>
            <div className="stat-tile">
              <span className="stat-label">In interview</span>
              <span className="stat-value">{stats.byStatus.Interview}</span>
            </div>
            <div className="stat-tile">
              <span className="stat-label">Conversion rate</span>
              <span className="stat-value">{stats.conversionRate}%</span>
            </div>
          </div>

          <div className="charts-grid">
            <div className="chart-card">
              <h2>By platform</h2>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={platformData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label={renderPieLabel}
                  >
                    {platformData.map((entry, index) => (
                      <Cell key={entry.name} fill={PLATFORM_COLORS[index % PLATFORM_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={ChartTooltip} />
                  <Legend formatter={(value: string) => <span className="chart-legend-label">{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <h2>By status</h2>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={statusData}>
                  <CartesianGrid stroke="var(--border)" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: 'var(--text)', fontSize: 12 }}
                    axisLine={{ stroke: 'var(--border)' }}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fill: 'var(--text)', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={ChartTooltip} cursor={{ fill: 'var(--accent-bg)' }} />
                  <Bar dataKey="value" barSize={32} radius={[4, 4, 0, 0]}>
                    {statusData.map((entry, index) => (
                      <Cell key={entry.name} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
