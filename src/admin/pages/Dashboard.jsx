import React from 'react';
import AdminLayout from '../layout/AdminLayout';
import { Button } from '../../components/ui/button';
import { FileText, Brain, Search, Download } from 'lucide-react';
import { LoadingState, ErrorState, StatsGrid } from '../components/shared/SharedComponents';
import { useDashboardStats } from '../hooks/getData';
import { 
  formatAuthors, 
  formatDateTime, 
  prepareDashboardStats,
  prepareRecentGptReports,
  prepareCiteChecks,
  truncateText
} from '../utils/helpers';

const Header = () => (
  <div className='flex items-center justify-between'>
    <div>
      <h1 className='text-2xl font-bold text-gray-900'>
        Papers & Reports Dashboard
      </h1>
      <p className='text-gray-600 mt-1'>
        Monitor papers, GPT reports, and citation checks
      </p>
    </div>
    <div className='flex items-center space-x-3'>
      <Button size='sm'>
        <Download className='w-4 h-4 mr-2' />
        Export Report
      </Button>
    </div>
  </div>
);

const PapersSection = ({ papers }) => (
  <div className='bg-white rounded-xl border border-gray-200 shadow-sm'>
    <div className='p-6 border-b border-gray-200'>
      <h3 className='text-lg font-semibold text-gray-900 flex items-center'>
        <FileText className='w-5 h-5 mr-2' />
        Recent Papers
      </h3>
    </div>
    <div className='p-6'>
      <div className='space-y-4'>
        {papers?.length > 0 ? (
          papers.slice(0, 5).map((paper) => (
            <div key={paper._id || paper.id} className='p-4 bg-gray-50 rounded-lg'>
              <h4 className='text-sm font-medium text-gray-900 truncate'>
                {paper.title || 'Unknown Paper'}
              </h4>
              <p className='text-xs text-gray-500 mt-1'>
                by {formatAuthors(paper.authors || paper.author)}
              </p>
              <p className='text-xs text-gray-400 mt-1'>
                {formatDateTime(paper.createdAt || paper.publishedDate)}
              </p>
            </div>
          ))
        ) : (
          <div className='text-center py-8'>
            <p className='text-gray-500'>No recent papers found</p>
          </div>
        )}
      </div>
    </div>
  </div>
);

const ReportsSection = ({ reports }) => (
  <div className='bg-white rounded-xl border border-gray-200 shadow-sm'>
    <div className='p-6 border-b border-gray-200'>
      <h3 className='text-lg font-semibold text-gray-900 flex items-center'>
        <Brain className='w-5 h-5 mr-2' />
        Recent GPT Reports
      </h3>
    </div>
    <div className='p-6'>
      <div className='space-y-4'>
        {reports.length > 0 ? (
          reports.map((report) => (
            <div key={report.id} className='p-4 bg-gray-50 rounded-lg'>
              <h4 className='text-sm font-medium text-gray-900 mb-2'>
                Report on: {report.paperTitle}
              </h4>
              <div className='text-xs text-gray-700 mb-2 bg-white p-2 rounded border max-h-20 overflow-y-auto'>
                {truncateText(report.reportText)}
              </div>
              <p className='text-xs text-gray-500'>by {report.author}</p>
              <p className='text-xs text-gray-400 mt-1'>
                {formatDateTime(report.generatedAt)}
              </p>
            </div>
          ))
        ) : (
          <div className='text-center py-8'>
            <p className='text-gray-500'>No GPT reports found</p>
          </div>
        )}
      </div>
    </div>
  </div>
);

const CitationsSection = ({ checks }) => (
  <div className='bg-white rounded-xl border border-gray-200 shadow-sm'>
    <div className='p-6 border-b border-gray-200'>
      <h3 className='text-lg font-semibold text-gray-900 flex items-center'>
        <Search className='w-5 h-5 mr-2' />
        Recent Citation Checks
      </h3>
    </div>
    <div className='p-6'>
      <div className='space-y-4'>
        {checks.length > 0 ? (
          checks.map((check) => (
            <div key={check.id} className='p-4 bg-gray-50 rounded-lg'>
              <h4 className='text-sm font-medium text-gray-900 truncate'>
                {check.paperTitle}
              </h4>
              <p className='text-xs text-gray-500 mt-1'>
                Checked by {check.user}
              </p>
              <div className='flex items-center space-x-4 mt-2'>
                <span className='text-xs text-gray-500'>{check.citationsFound} citations</span>
                {check.issuesFound > 0 && (
                  <span className='text-xs text-red-600'>
                    {check.issuesFound} issues
                  </span>
                )}
              </div>
              <p className='text-xs text-gray-400 mt-1'>
                {formatDateTime(check.checkedAt)}
              </p>
            </div>
          ))
        ) : (
          <div className='text-center py-8'>
            <p className='text-gray-500'>No citation checks found</p>
          </div>
        )}
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const { stats, loading, error, fetchData } = useDashboardStats();

  if (loading) return <LoadingState message="Loading dashboard..." />;
  if (error) return <ErrorState error={error} onRetry={fetchData} />;

  const dashboardStats = prepareDashboardStats(stats);
  const reports = prepareRecentGptReports(stats);
  const citations = prepareCiteChecks(stats);

  return (
    <AdminLayout>
      <div className='space-y-6'>
        <Header />

        <StatsGrid stats={dashboardStats} />

        <div className='grid grid-row-1 lg:grid-row-3 gap-6'>
          <PapersSection papers={stats?.recentPapers} />
          <ReportsSection reports={reports} />
          <CitationsSection checks={citations} />
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
