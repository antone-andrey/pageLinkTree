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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border p-4">
            <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Daily views bar chart */}
      {data?.dailyBreakdown && data.dailyBreakdown.length > 0 && (
        <div className="bg-white rounded-xl border p-6">
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
                    className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600"
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
        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Top Links
          </h3>
          {data?.topLinks && data.topLinks.length > 0 ? (
            <div className="space-y-3">
              {data.topLinks.map((link, index) => (
                <div key={link.id} className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 w-5 text-right">
                    {index + 1}.
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
        <div className="bg-white rounded-xl border p-6">
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
                          className="h-full bg-green-500 rounded-full"
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
        <div className="bg-white rounded-xl border p-6">
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
                        className="h-full bg-purple-500 rounded-full"
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
        <div className="bg-white rounded-xl border p-6">
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
                          className="h-full bg-orange-500 rounded-full"
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
