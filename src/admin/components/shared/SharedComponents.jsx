import { Button } from '../../../components/ui/button';

export const LoadingState = ({ message = "Loading..." }) => (
  <div className="flex items-center justify-center min-h-96">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-2 text-gray-600">{message}</p>
    </div>
  </div>
);

export const ErrorState = ({ error, onRetry }) => (
  <div className="flex items-center justify-center min-h-96">
    <div className="text-center max-w-md">
      <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
      <p className="text-gray-600 mb-4">{error}</p>
      <Button onClick={onRetry}>Retry</Button>
    </div>
  </div>
);

export const StatsCard = ({ stat }) => (
  <div className="bg-white rounded-lg border p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600">{stat.title}</p>
        <p className={`text-2xl font-bold ${stat.color || 'text-gray-900'}`}>{stat.value}</p>
      </div>
      {stat.icon && (
        <div className={`w-12 h-12 rounded-lg ${stat.iconColor} flex items-center justify-center`}>
          <stat.icon className="w-6 h-6 text-white" />
        </div>
      )}
    </div>
  </div>
);

export const StatsGrid = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {stats.map((stat, index) => (
      <StatsCard key={index} stat={stat} />
    ))}
  </div>
);
