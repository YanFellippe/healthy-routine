export default function HealthCard({ title, value, unit, icon, color = "emerald" }) {
  const colorClasses = {
    emerald: "bg-emerald-50 text-emerald-600",
    blue: "bg-blue-50 text-blue-600",
    red: "bg-red-50 text-red-600",
    purple: "bg-purple-50 text-purple-600"
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex-1 min-w-[240px]">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
      <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">
        {value}
        <span className="text-lg font-normal text-gray-500 ml-2">{unit}</span>
      </p>
    </div>
  );
}