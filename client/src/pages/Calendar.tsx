import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchApplicationsRequest, fetchCalendarRequest } from '../api/applicationsApi';
import type { JobApplication } from '../types/jobApplication';
import { buildHeatmapWeeks, dateToKey } from '../utils/heatmap';
import type { HeatmapDay } from '../utils/heatmap';
import StatusBadge from '../components/StatusBadge';

const LEVEL_CLASS = ['level-0', 'level-1', 'level-2', 'level-3', 'level-4'];

function localeTag(language: string): string {
  return language === 'ua' ? 'uk-UA' : 'en-US';
}

export default function Calendar() {
  const { t, i18n } = useTranslation();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    Promise.all([fetchCalendarRequest(), fetchApplicationsRequest({})])
      .then(([calendarData, applicationsData]) => {
        if (!cancelled) {
          setCounts(calendarData);
          setApplications(applicationsData);
        }
      })
      .catch(() => {
        if (!cancelled) setError(t('calendar.error'));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [t]);

  const weeks = useMemo(() => buildHeatmapWeeks(counts), [counts]);

  const monthLabels = useMemo(() => {
    let lastMonth = -1;
    return weeks.map((week) => {
      const firstDay = new Date(week[0].date);
      const month = firstDay.getUTCMonth();
      if (month === lastMonth) return '';
      lastMonth = month;
      return firstDay.toLocaleDateString(localeTag(i18n.language), { month: 'short', timeZone: 'UTC' });
    });
  }, [weeks, i18n.language]);

  const selectedApplications = selectedDate
    ? applications.filter((application) => dateToKey(new Date(application.appliedDate)) === selectedDate)
    : [];

  function handleCellClick(day: HeatmapDay) {
    if (day.count === 0) return;
    setSelectedDate(day.date === selectedDate ? null : day.date);
  }

  function formatDate(dateKey: string): string {
    return new Date(dateKey).toLocaleDateString(localeTag(i18n.language), { timeZone: 'UTC' });
  }

  function cellTooltip(day: HeatmapDay): string {
    if (day.count === 0) return t('calendar.cellTooltipZero', { date: formatDate(day.date) });
    return t('calendar.cellTooltip', { count: day.count, date: formatDate(day.date) });
  }

  return (
    <div className="page">
      <h1>{t('calendar.title')}</h1>

      {loading && <p>{t('calendar.loading')}</p>}
      {!loading && error && <p className="form-error">{error}</p>}

      {!loading && !error && (
        <>
          <div className="heatmap-wrapper">
            <div className="heatmap-months">
              {monthLabels.map((label, index) => (
                <span key={index} className="heatmap-month-label">
                  {label}
                </span>
              ))}
            </div>
            <div className="heatmap-grid">
              {weeks.map((week) => (
                <div className="heatmap-column" key={week[0].date}>
                  {week.map((day) => (
                    <div
                      key={day.date}
                      className={`heatmap-cell ${LEVEL_CLASS[day.level]} ${day.count > 0 ? 'has-data' : ''} ${
                        day.date === selectedDate ? 'selected' : ''
                      }`}
                      title={cellTooltip(day)}
                      onClick={() => handleCellClick(day)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="heatmap-legend">
            <span>{t('calendar.legendLess')}</span>
            {LEVEL_CLASS.map((cls) => (
              <span key={cls} className={`heatmap-cell ${cls}`} />
            ))}
            <span>{t('calendar.legendMore')}</span>
          </div>

          <div className="day-details">
            {selectedDate ? (
              <>
                <h2>{t('calendar.dayDetailsHeading', { date: formatDate(selectedDate) })}</h2>
                <ul className="day-details-list">
                  {selectedApplications.map((application) => (
                    <li key={application._id}>
                      <div>
                        <span className="day-details-title">{application.title}</span>
                        <span className="day-details-meta">
                          {application.company} · {application.platform}
                        </span>
                      </div>
                      <StatusBadge status={application.status} />
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="day-details-hint">{t('calendar.noSelection')}</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
