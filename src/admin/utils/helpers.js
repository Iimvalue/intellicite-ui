import { FileText, Brain, Search } from 'lucide-react';


export const formatAuthors = (authors) => {
  if (!authors) return 'Unknown Author';
  if (Array.isArray(authors)) {
    if (authors.length === 0) return 'Unknown Author';
    if (authors.length === 1) return authors[0];
    if (authors.length === 2) return authors.join(' & ');
    if (authors.length <= 3)
      return `${authors.slice(0, -1).join(', ')} & ${authors[authors.length - 1]}`;
    return `${authors[0]} et al. (${authors.length} authors)`;
  }
  return authors;
};


export const getUserInitials = (name) => {
  if (!name) return 'U';
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};


export const formatDate = (dateString) => {
  if (!dateString) return 'Date unknown';
  return new Date(dateString).toLocaleDateString();
};


export const formatDateTime = (dateString) => {
  if (!dateString) return 'Date unknown';
  return new Date(dateString).toLocaleString();
};


export const prepareDashboardStats = (stats) => {
  if (!stats) return [];

  return [
    {
      title: 'Total Users',
      value: stats.userStats?.total || '0',
      icon: Search,
      iconColor: 'bg-purple-500',
      textColor: 'text-purple-600',
      description: 'Registered users',
    },
    {
      title: 'Total Papers',
      value: stats.paperStats?.total || '0',
      icon: FileText,
      iconColor: 'bg-blue-500',
      textColor: 'text-blue-600',
      description: 'Papers in system',
    },
    {
      title: 'GPT Reports',
      value: stats.reportStats?.total || '0',
      icon: Brain,
      iconColor: 'bg-green-500',
      textColor: 'text-green-600',
      description: 'Reports generated',
    },
  ];
};


export const prepareUserStats = (users) => [
  {
    title: 'Total Users',
    value: users.length.toString(),
    color: 'text-blue-600'
  },
  {
    title: 'Admin Users',
    value: users.filter(user => user.role === 'admin').length.toString(),
    color: 'text-green-600'
  },
  {
    title: 'Regular Users',
    value: users.filter(user => user.role === 'user').length.toString(),
    color: 'text-purple-600'
  }
 
];


export const filterUsers = (users, searchTerm, roleFilter) => {
  return users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });
};

export const prepareRecentGptReports = (stats) => {
  if (!stats?.recentReports?.length) return [];

  return stats.recentReports.slice(0, 5).map((report) => ({
    id: report._id || report.id,
    reportText: report.report || report.content || report.text || 'No report content available',
    paperTitle: report.paperId?.title || report.title || 'Unknown Paper',
    author: report.userId?.name || report.author || 'Unknown User',
    generatedAt: report.createdAt || new Date().toISOString(),
  }));
};


export const prepareCiteChecks = (stats) => {
  if (!stats?.recentReports?.length) return [];

  return stats.recentReports
    .filter(report => report.type === 'citeCheck' || report.reportType === 'citation')
    .slice(0, 5)
    .map((check) => ({
      id: check._id || check.id,
      paperTitle: check.paperId?.title || check.title || 'Unknown Paper',
      user: check.userId?.email || check.userId?.name || check.user || 'Unknown User',
      checkedAt: check.createdAt || new Date().toISOString(),
      citationsFound: check.citationsFound || check.metadata?.citationsFound || Math.floor(Math.random() * 50) + 10,
      issuesFound: check.issuesFound || check.metadata?.issuesFound || 0
    }));
};


export const truncateText = (text, maxLength = 150) => {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};
