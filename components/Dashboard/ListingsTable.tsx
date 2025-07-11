'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Listing } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import StatusBadge from './StatusBadge';
import { Check, X, Edit, Eye, Car } from 'lucide-react';
import { toast } from 'sonner';

interface ListingsTableProps {
  listings: Listing[];
  onStatusUpdate: (id: string, status: 'approved' | 'rejected') => void;
}

export default function ListingsTable({ listings, onStatusUpdate }: ListingsTableProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected') => {
    setLoadingStates(prev => ({ ...prev, [id]: true }));
    
    try {
      const response = await fetch('/api/listings/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, adminId: user?.id, adminName: user?.name })
      });

      if (response.ok) {
        onStatusUpdate(id, status);
        toast.success(`Listing ${status} successfully`);
      } else {
        toast.error('Failed to update listing status');
      }
    } catch (error) {
      toast.error('An error occurred while updating the listing');
    } finally {
      setLoadingStates(prev => ({ ...prev, [id]: false }));
    }
  };

  const formatPrice = (price: number) => `$${price}/day`;
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();

  if (listings.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No listings found</h3>
        <p className="text-gray-500">No listings match your current filters.</p>
      </Card>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead>Vehicle</TableHead>
            <TableHead>Details</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {listings.map((listing) => (
            <TableRow key={listing.id} className="hover:bg-gray-50">
              <TableCell>
                <div className="flex items-center space-x-3">
                  <img
                    src={listing.imageUrl}
                    alt={listing.title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{listing.title}</p>
                    <p className="text-sm text-gray-500">
                      {listing.year} {listing.make} {listing.model}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="text-sm text-gray-900">{listing.location}</p>
                  <Badge variant="outline" className="mt-1 text-xs">
                    {listing.category}
                  </Badge>
                </div>
              </TableCell>
              <TableCell>
                <span className="font-medium">{formatPrice(listing.price)}</span>
              </TableCell>
              <TableCell>
                <StatusBadge status={listing.status} />
              </TableCell>
             
              <TableCell>
                <div className="flex items-center space-x-2">
                  {listing.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 border-green-600 hover:bg-green-50"
                        onClick={() => handleStatusUpdate(listing.id, 'approved')}
                        disabled={loadingStates[listing.id]}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                        onClick={() => handleStatusUpdate(listing.id, 'rejected')}
                        disabled={loadingStates[listing.id]}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push(`/dashboard/edit/${listing.id}`)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}