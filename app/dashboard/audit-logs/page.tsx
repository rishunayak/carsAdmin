'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuditLog } from '@/types';
import ProtectedRoute from '@/components/ProtectedRoute';
import Header from '@/components/Dashboard/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Search, Filter, FileText, User, CheckCircle, XCircle, Edit, Plus, Download } from 'lucide-react';
import { toast } from 'sonner';

interface AuditLogsResponse {
  logs: AuditLog[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export default function AuditLogsPage() {
  const router = useRouter();
  const [data, setData] = useState<AuditLogsResponse>({
    logs: [],
    total: 0,
    totalPages: 0,
    currentPage: 1
  });

  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    action: 'all',
    admin: 'all',
    search: '',
    page: 1
  });

  const fetchAuditLogs = async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams({
        page: filters.page.toString(),
        limit: '20',
        ...(filters.action !== 'all' && { action: filters.action }),
        ...(filters.admin !== 'all' && { admin: filters.admin }),
        ...(filters.search && { search: filters.search })
      });

      const response = await fetch(`/api/audit-logs?${params}`);
      if (response.ok) {
        const result = await response.json();
        setData(result);
      } else {
        toast.error('Failed to fetch audit logs');
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong while fetching logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, [filters]);

  const handleApplyFilters = () => {
    setFilters(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'approve':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'reject':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'edit':
        return <Edit className="h-4 w-4 text-blue-600" />;
      case 'create':
        return <Plus className="h-4 w-4 text-purple-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActionBadge = (action: string) => {
    const config = {
      approve: { label: 'Approved', className: 'bg-green-100 text-green-800' },
      reject: { label: 'Rejected', className: 'bg-red-100 text-red-800' },
      edit: { label: 'Edited', className: 'bg-blue-100 text-blue-800' },
      create: { label: 'Created', className: 'bg-purple-100 text-purple-800' }
    };

    const actionConfig = config[action as keyof typeof config] || {
      label: action,
      className: 'bg-gray-100 text-gray-800'
    };

    return (
      <Badge className={actionConfig.className}>
        {getActionIcon(action)}
        <span className="ml-1">{actionConfig.label}</span>
      </Badge>
    );
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const exportLogs = () => {
    toast.success('Export logic goes here');
  };

  const uniqueAdmins = Array.from(new Set(data.logs.map(log => log.adminName)));

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Button variant="outline" onClick={() => router.back()} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Audit Trail</h1>
                <p className="text-gray-500">View actions performed by admins</p>
              </div>
              <Button onClick={exportLogs} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Logs
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Actions</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.total}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approvals</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {data.logs.filter(log => log.action === 'approve').length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rejections</CardTitle>
                <XCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {data.logs.filter(log => log.action === 'reject').length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Edits</CardTitle>
                <Edit className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {data.logs.filter(log => log.action === 'edit').length}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by listing ID, admin name, or details..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="pl-10"
                  />
                </div>

                <div className="sm:w-48">
                  <Select value={filters.action} onValueChange={(action) => setFilters(prev => ({ ...prev, action }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Actions</SelectItem>
                      <SelectItem value="approve">Approvals</SelectItem>
                      <SelectItem value="reject">Rejections</SelectItem>
                      <SelectItem value="edit">Edits</SelectItem>
                      <SelectItem value="create">Creates</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="sm:w-48">
                  <Select value={filters.admin} onValueChange={(admin) => setFilters(prev => ({ ...prev, admin }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Admin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Admins</SelectItem>
                      {uniqueAdmins.map(admin => (
                        <SelectItem key={admin} value={admin}>{admin}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleApplyFilters} className="sm:w-auto">
                  <Filter className="h-4 w-4 mr-2" />
                  Apply Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {loading ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-500">Loading audit logs...</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Admin</TableHead>
                      <TableHead>Listing ID</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.logs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No audit logs found</h3>
                          <p className="text-gray-500">Try adjusting your filters.</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      data.logs.map((log) => {
                        const { date, time } = formatTimestamp(log.timestamp);
                        return (
                          <TableRow key={log.id} className="hover:bg-gray-50">
                            <TableCell>
                              <div className="text-sm">
                                <div className="font-medium text-gray-900">{date}</div>
                                <div className="text-gray-500">{time}</div>
                              </div>
                            </TableCell>
                            <TableCell>{getActionBadge(log.action)}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                  <User className="h-4 w-4 text-blue-600" />
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">{log.adminName}</div>
                                  <div className="text-xs text-gray-500">ID: {log.adminId}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="font-mono text-xs">{log.entityId}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="max-w-md">
                                <p className="text-sm text-gray-900">{log.details}</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {data.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-6 rounded-lg">
              <div className="flex flex-1 justify-between sm:hidden">
                <Button variant="outline" onClick={() => handlePageChange(data.currentPage - 1)} disabled={data.currentPage === 1}>
                  Previous
                </Button>
                <Button variant="outline" onClick={() => handlePageChange(data.currentPage + 1)} disabled={data.currentPage === data.totalPages}>
                  Next
                </Button>
              </div>

              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <p className="text-sm text-gray-700">
                  Page <span className="font-medium">{data.currentPage}</span> of <span className="font-medium">{data.totalPages}</span>
                </p>

                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(data.currentPage - 1)} disabled={data.currentPage === 1}>
                    Previous
                  </Button>
                  {Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        variant={data.currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    );
                  })}
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(data.currentPage + 1)} disabled={data.currentPage === data.totalPages}>
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
