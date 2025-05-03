import React from 'react';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

function Graphcard({
  chartData,
  startSimulation,
  stopSimulation,
  chartType = "line",
  xAxisKey = "time",
  yAxisKey = "airQuality",
  selectedRange,
  onSelectedRange,
  heading
}) {

  const displayData = chartData;

  return (
    <div className="flex flex-col items-start justify-between w-[60em] h-[30em] bg-white p-8 rounded-2xl shadow-2xl border border-gray-100">
      <div className="mb-6 w-full flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-gray-800"> {heading}</h2>
          <p className="text-gray-500 text-sm mt-1">Live carbon emission sensor metrics (mocked)</p>
        </div>

        <div className="flex items-center space-x-4">
          <select
            value={selectedRange}
            onChange={onSelectedRange}
            className="border border-gray-300 rounded-lg p-2 text-sm text-gray-700"
          >
            <option value="real-time">Real-time</option>
            <option value="last-week">Last Week</option>
            <option value="last-month">Last Month</option>
          </select>

          <button
            onClick={startSimulation}
            className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
          >
            Start
          </button>
          <button
            onClick={stopSimulation}
            className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
          >
            Stop
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="80%">
        {chartType === "line" && (
          <AreaChart data={displayData}>
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1B59F8" stopOpacity={0.9} />
                <stop offset="95%" stopColor="#1B59F8" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey={xAxisKey} stroke="#6B7280" tick={{ fill: '#4B5563', fontSize: 12 }} dy={10} />
            <YAxis dataKey={yAxisKey} stroke="#6B7280" tick={{ fill: '#4B5563', fontSize: 12 }} tickCount={6} dx={-10} />
            <Tooltip
              contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #E5E7EB' }}
              labelStyle={{ color: '#374151', fontSize: '14px' }}
              itemStyle={{ color: '#1B59F8' }}
              cursor={{ fill: 'rgba(0,0,0,0.03)' }}
            />
            <Area
              type="monotone"
              dataKey={yAxisKey}
              stroke="#1B59F8"
              strokeWidth={3}
              fillOpacity={0.4}
              fill="url(#colorUv)"
              dot={true}
              isAnimationActive={true}
            />
          </AreaChart>
        )}

        {chartType === "bar" && (
          <BarChart data={displayData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey={xAxisKey} stroke="#6B7280" tick={{ fill: '#4B5563', fontSize: 12 }} dy={10} />
            <YAxis dataKey={yAxisKey} stroke="#6B7280" tick={{ fill: '#4B5563', fontSize: 12 }} tickCount={6} dx={-10} />
            <Tooltip
              contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #E5E7EB' }}
              labelStyle={{ color: '#374151', fontSize: '14px' }}
              itemStyle={{ color: '#1B59F8' }}
              cursor={{ fill: 'rgba(0,0,0,0.03)' }}
            />
            <Bar dataKey={yAxisKey} fill="#1B59F8" barSize={30} radius={[10, 10, 0, 0]} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

export default Graphcard;
