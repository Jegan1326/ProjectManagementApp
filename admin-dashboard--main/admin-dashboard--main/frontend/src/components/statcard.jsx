export default function StatCard({ title, value, color = 'blue' }) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-800',
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
      <p className={`text-2xl font-bold mt-2 ${colorClasses[color]?.split(' ')[1] || 'text-gray-900'}`}>
        {value}
      </p>
    </div>
  )
}
