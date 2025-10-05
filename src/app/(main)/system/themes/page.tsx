
'use client';
import { themes } from '@/lib/data';

export default function ThemesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Themes & Packages</h1>
          <p className="text-gray-500 mt-1">Manage event packages and pricing</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          + Create Theme
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {themes.slice(0, 12).map((theme) => (
          <div key={theme.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-32 bg-gradient-to-br from-blue-500 to-purple-600"></div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-gray-900">{theme.name}</h3>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  theme.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {theme.status}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-4">{theme.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Base Price</span>
                  <span className="font-bold text-gray-900">${theme.basePrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Bookings</span>
                  <span className="font-bold text-gray-900">{theme.bookings}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Revenue</span>
                  <span className="font-bold text-emerald-600">${theme.revenue.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {theme.features.slice(0, 3).map((feature, i) => (
                  <span key={i} className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">
                    {feature}
                  </span>
                ))}
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600">Popularity</span>
                  <span className="font-medium">{Math.round(theme.popularity)}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600" style={{ width: `${theme.popularity}%` }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
