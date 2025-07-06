import AdminLayout from '../layout/AdminLayout';
import { Button } from '../../components/ui/button';
import { 
  FileText, 
  Brain, 
  Search,
  CheckCircle,
  Clock,
  Activity,
  Download
} from 'lucide-react';

const Dashboard = () => {
  const paperStats = [
    {
      title: 'Total Papers Retrieved',
      value: '2,847',
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      title: 'GPT Reports Generated',
      value: '1,923',
      icon: Brain,
      color: 'bg-green-500'
    },
    {
      title: 'Citation Checks Performed',
      value: '567',
      icon: Search,
      color: 'bg-purple-500'
    }
  ];

  const recentGptReports = [
    {
      id: 1,
      paperTitle: 'Deep Learning Approaches for Medical Image Analysis',
      author: 'Dr. Sarah Wilson',
      generatedAt: '2024-01-15T10:30:00Z',
    },
    {
      id: 2,
      paperTitle: 'Quantum Computing Applications in Cryptography',
      author: 'Prof. Michael Chen',
      generatedAt: '2024-01-15T09:15:00Z',   
    }
  ];

  const citeChecks = [
    {
      id: 1,
      paperTitle: 'AI Ethics Framework',
      user: 'student@university.edu',
      checkedAt: '2024-01-15T11:00:00Z',   
    },
    {
      id: 2,
      paperTitle: 'Recent Advances in Neural Networks',
      user: 'researcher@lab.org',
      checkedAt: '2024-01-15T10:45:00Z',
      status: 'completed',
      citationsFound: 45,
      issuesFound: 0
    },
    {
      id: 3,
      paperTitle: 'study on Quantum Mechanics',
      user: 'prof@university.edu',
      checkedAt: '2024-01-15T10:30:00Z',
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Papers & Reports Dashboard</h1>
            <p className="text-gray-600 mt-1">Monitor papers, GPT reports, and citation checks</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Activity className="w-4 h-4 mr-2" />
              Real-time View
            </Button>
            <Button size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paperStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-green-600">{stat.change}</span>
                <span className="text-sm text-gray-500 ml-1">vs last month</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Brain className="w-5 h-5 mr-2" />
                Recent GPT Reports
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentGptReports.map((report) => (
                  <div key={report.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {report.paperTitle}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">by {report.author}</p>
                    
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(report.generatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Search className="w-5 h-5 mr-2" />
                Recent Citation Checks
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {citeChecks.map((check) => (
                  <div key={check.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className={`w-3 h-3 rounded-full mt-1.5 ${
                      check.status === 'completed' ? 'bg-green-500' :
                      check.status === 'processing' ? 'bg-yellow-500' : 'bg-gray-400'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {check.paperTitle}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">Checked by {check.user}</p>
                      <div className="flex items-center space-x-4 mt-2">
                      
                        <span className="text-xs text-gray-500">{check.citationsFound} citations</span>
                        {check.issuesFound > 0 && (
                          <span className="text-xs text-red-600">
                            {check.issuesFound} issues
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(check.checkedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Today's Summary</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900">24</h4>
                <p className="text-sm text-gray-600">Papers processed today</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900">18</h4>
                <p className="text-sm text-gray-600">Reports completed today</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900">12</h4>
                <p className="text-sm text-gray-600">Citation checks today</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard; 