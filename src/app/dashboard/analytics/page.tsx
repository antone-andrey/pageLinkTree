"use client";

import { useEffect, useState, useCallback } from "react";
import { formatCurrency } from "@/lib/utils";

interface TopLink {
  id: string;
  title: string;
  url: string;
  clicks: number;
}

interface DailyData {
  date: string;
  views: number;
}

interface ReferrerData {
  referrer: string;
  count: number;
}

interface DeviceData {
  device: string;
  count: number;
}

interface CountryData {
  country: string;
  count: number;
}

interface Summary {
  totalViews: number;
  recentViews: number;
  totalClicks: number;
  totalBookings: number;
  totalRevenue: number;
  topLinks: TopLink[];
  dailyBreakdown: DailyData[];
  topReferrers: ReferrerData[];
  deviceBreakdown: DeviceData[];
  countryBreakdown: CountryData[];
  uniqueDays: number;
}

type DateRange = 7 | 30 | 90;

export default function AnalyticsPage() {
  const [data, setData] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>(30);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/analytics/summary?days=${dateRange}`);
      const json = await res.json();
      setData(json);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const maxDailyViews = data?.dailyBreakdown
    ? Math.max(...data.dailyBreakdown.map((d) => d.views), 1)
    : 1;

  const stats = [
    { label: `Views (${dateRange}d)`, value: data?.recentViews ?? 0 },
    { label: "Total views", value: data?.totalViews ?? 0 },
    { label: "Link clicks", value: data?.totalClicks ?? 0 },
    { label: "Bookings", value: data?.totalBookings ?? 0 },
    {
      label: "Revenue",
      value: formatCurrency(data?.totalRevenue ?? 0),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Analytics</h2>
          <p className="text-sm text-gray-500">
            See how your page is performing.
          </p>
        </div>

        {/* Date range selector */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {([7, 30, 90] as DateRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                dateRange === range
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {range}d
            </button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {loading && !data && (
        <div className="bg-white rounded-xl border p-12 text-center">
          <p className="text-sm text-gray-400">Loading analytics...</p>
        </div>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 stagger-children">
        {stats.map((stat, i) => {
          const icons = [
            "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
            "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
            "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1",
            "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
            "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
          ];
          return (
            <div key={stat.label} className="bg-white rounded-xl border shadow-sm card-accent-top card-lift p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icons[i]} />
                  </svg>
                </div>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Daily views bar chart */}
      {data?.dailyBreakdown && data.dailyBreakdown.length > 0 && (
        <div className="bg-white rounded-xl border shadow-sm card-accent-top p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Daily Views
          </h3>
          <div className="flex items-end gap-[2px] h-40">
            {data.dailyBreakdown.map((day) => {
              const heightPercent = (day.views / maxDailyViews) * 100;
              const formattedDate = new Date(day.date).toLocaleDateString(
                "en-US",
                { month: "short", day: "numeric" }
              );
              return (
                <div
                  key={day.date}
                  className="flex-1 flex flex-col items-center justify-end h-full group relative"
                >
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                    {formattedDate}: {day.views} view
                    {day.views !== 1 ? "s" : ""}
                  </div>
                  <div
                    className="w-full bg-gradient-to-t from-indigo-500 to-violet-400 rounded-t transition-all hover:from-indigo-600 hover:to-violet-500"
                    style={{
                      height: `${Math.max(heightPercent, day.views > 0 ? 4 : 1)}%`,
                      minHeight: day.views > 0 ? "4px" : "1px",
                    }}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-gray-400">
            <span>
              {data.dailyBreakdown.length > 0
                ? new Date(data.dailyBreakdown[0].date).toLocaleDateString(
                    "en-US",
                    { month: "short", day: "numeric" }
                  )
                : ""}
            </span>
            <span>
              {data.dailyBreakdown.length > 0
                ? new Date(
                    data.dailyBreakdown[data.dailyBreakdown.length - 1].date
                  ).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                : ""}
            </span>
          </div>
        </div>
      )}

      {/* Two-column layout for top links and referrers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Links */}
        <div className="bg-white rounded-xl border shadow-sm card-accent-top p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Top Links
          </h3>
          {data?.topLinks && data.topLinks.length > 0 ? (
            <div className="space-y-3">
              {data.topLinks.map((link, index) => (
                <div key={link.id} className="flex items-center gap-3">
                  <span className={`text-[11px] font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    index < 3 ? "bg-gradient-to-br from-indigo-500 to-violet-600 text-white" : "bg-gray-100 text-gray-500"
                  }`}>
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {link.title}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{link.url}</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    {link.clicks}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No link clicks yet</p>
          )}
        </div>

        {/* Top Referrers */}
        <div className="bg-white rounded-xl border shadow-sm card-accent-top p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Top Referrers
          </h3>
          {data?.topReferrers && data.topReferrers.length > 0 ? (
            <div className="space-y-3">
              {data.topReferrers.map((ref, index) => {
                const maxRefCount = data.topReferrers[0].count;
                const widthPercent = (ref.count / maxRefCount) * 100;
                return (
                  <div key={ref.referrer} className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 w-5 text-right">
                      {index + 1}.
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {ref.referrer}
                        </p>
                        <span className="text-xs text-gray-500 ml-2">
                          {ref.count}
                        </span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"
                          style={{ width: `${widthPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No referrer data yet</p>
          )}
        </div>
      </div>

      {/* Device and Country breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device breakdown */}
        <div className="bg-white rounded-xl border shadow-sm card-accent-top p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Devices</h3>
          {data?.deviceBreakdown && data.deviceBreakdown.length > 0 ? (
            <div className="space-y-3">
              {data.deviceBreakdown.map((d) => {
                const total = data.deviceBreakdown.reduce(
                  (sum, x) => sum + x.count,
                  0
                );
                const percent =
                  total > 0 ? Math.round((d.count / total) * 100) : 0;
                return (
                  <div key={d.device} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="capitalize text-gray-700">
                        {d.device}
                      </span>
                      <span className="text-gray-500">
                        {percent}% ({d.count})
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-violet-400 to-purple-500 rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No device data yet</p>
          )}
        </div>

        {/* Country breakdown */}
        <div className="bg-white rounded-xl border shadow-sm card-accent-top p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Top Countries
          </h3>
          {data?.countryBreakdown && data.countryBreakdown.length > 0 ? (
            <div className="space-y-3">
              {data.countryBreakdown.map((c, index) => {
                const maxCount = data.countryBreakdown[0].count;
                const widthPercent = (c.count / maxCount) * 100;
                return (
                  <div key={c.country} className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 w-5 text-right">
                      {index + 1}.
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-gray-900">
                          {c.country}
                        </p>
                        <span className="text-xs text-gray-500 ml-2">
                          {c.count}
                        </span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                          style={{ width: `${widthPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-400">
              Country data available on Vercel deployment
            </p>
          )}
        </div>
      </div>

      {/* Empty state */}
      {!loading && data && !data.recentViews && (
        <div className="bg-white rounded-xl border p-12 text-center">
          <p className="text-sm text-gray-400">
            Share your page to start seeing visitors
          </p>
        </div>
      )}
    </div>
  );
}
