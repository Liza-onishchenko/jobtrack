import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchApplicationsRequest, fetchCalendarRequest } from '../api/applicationsApi';
import type { JobApplication } from '../types/jobApplication';
import { buildMonthGrid, dateToKey } from '../utils/calendarGrid';
import StatusBadge from '../components/StatusBadge';

function localeTag(language: string): string {
  return language === 'ua' ? 'uk-UA' : 'en-US';
}

export default function Calendar() {
  const { t, i18n } = useTranslation();
  const now = useMemo(() => new Date(), []);
  const [viewYear, setViewYear] = useState(now.getUTCFullYear());
  const [viewMonth, setViewMonth] = useState(now.getUTCMonth());
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    fetchApplicationsRequest({}).then(setApplications).catch(() => undefined);
  }, []);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    fetchCalendarRequest({ year: viewYear, month: viewMonth + 1 })
      .then((data) => {
        if (!cancelled) setCounts(data);
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
  }, [viewYear, viewMonth, t]);

  const weeks = useMemo(() => buildMonthGrid(viewYear, viewMonth, counts), [viewYear, viewMonth, counts]);
  const weekdays = t('calendar.weekdays', { returnObjects: true }) as string[];

  const monthLabel = new Date(Date.UTC(viewYear, viewMonth, 1)).toLocaleDateString(
    localeTag(i18n.language),
    { month: 'long', year: 'numeric', timeZone: 'UTC' },
  );

  function goToPrevMonth() {
    setSelectedDate(null);
    if (viewMonth === 0) {
      setViewYear(viewYear - 1);
      setViewMonth(11);
    } else {
      setViewMonth(viewMonth - 1);
    }
  }

  function goToNextMonth() {
    setSelectedDate(null);
    if (viewMonth === 11) {
      setViewYear(viewYear + 1);
      setViewMonth(0);
    } else {
      setViewMonth(viewMonth + 1);
    }
  }

  function formatDate(dateKey: string): string {
    return new Date(dateKey).toLocaleDateString(localeTag(i18n.language), { timeZone: 'UTC' });
  }

  function handleDayClick(dateKey: string, isCurrentMonth: boolean, count: number) {
    if (!isCurrentMonth || count === 0) return;
    setSelectedDate(dateKey === selectedDate ? null : dateKey);
  }

  const selectedApplications = selectedDate
    ? applications.filter((application) => dateToKey(new Date(application.appliedDate)) === selectedDate)
    : [];

  return (
    <div className="page">
      <h1>{t('calendar.title')}</h1>

      <div className="calendar-nav">
        <button type="button" onClick={goToPrevMonth} aria-label={t('calendar.prevMonth')}>
          ◀ {t('calendar.prevMonth')}
        </button>
        <span className="calendar-month-label">{monthLabel}</span>
        <button type="button" onClick={goToNextMonth} aria-label={t('calendar.nextMonth')}>
          {t('calendar.nextMonth')} ▶
        </button>
      </div>

      {loading && <p>{t('calendar.loading')}</p>}
      {!loading && error && <p className="form-error">{error}</p>}

      {!loading && !error && (
        <>
          <div className="month-grid">
            <div className="month-grid-header">
              {weekdays.map((label) => (
                <span key={label} className="month-weekday">
                  {label}
                </span>
              ))}
            </div>

            {weeks.map((week) => (
              <div className="month-grid-row" key={week[0].date}>
                {week.map((day) => {
                  const tooltip = day.count > 0
                    ? t('calendar.dayTooltip', { count: day.count, date: formatDate(day.date) })
                    : undefined;

                  return (
                    <div
                      key={day.date}
                      className={[
                        'month-day',
                        day.isCurrentMonth ? '' : 'other-month',
                        day.isToday ? 'today' : '',
                        day.isCurrentMonth && day.count > 0 ? 'has-data' : '',
                        day.date === selectedDate ? 'selected' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      title={tooltip}
                      onClick={() => handleDayClick(day.date, day.isCurrentMonth, day.count)}
                    >
                      <span className="month-day-number">{day.day}</span>
                      {day.isCurrentMonth && day.count > 0 && (
                        <span className="month-day-badge">{day.count}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
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
