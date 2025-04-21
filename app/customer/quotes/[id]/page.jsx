'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { customerAPI } from '@/lib/api';
import { toast } from 'react-hot-toast';

interface QuoteRequest {
  id: number;
  vehicleId: number;
  vehicleName: string;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export default function QuoteRequestPage() {
  const params = useParams();
  const router = useRouter();
  const [quoteRequest, setQuoteRequest] = useState<QuoteRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchQuoteRequest();
  }, [params.id]);

  const fetchQuoteRequest = async () => {
    try {
      setLoading(true);
      const response = await customerAPI.getQuoteRequestById(Number(params.id));
      setQuoteRequest(response);
      setNotes(response.notes || '');
    } catch (error) {
      console.error('Error fetching quote request:', error);
      toast.error('Failed to fetch quote request details');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateNotes = async () => {
    if (!quoteRequest) return;

    try {
      await customerAPI.updateQuoteRequest(quoteRequest.id, { notes });
      toast.success('Notes updated successfully');
      setIsEditing(false);
      fetchQuoteRequest();
    } catch (error) {
      console.error('Error updating notes:', error);
      toast.error('Failed to update notes');
    }
  };

  const handleCancelRequest = async () => {
    if (!quoteRequest) return;
    if (!confirm('Are you sure you want to cancel this quote request?')) return;

    try {
      await customerAPI.cancelQuoteRequest(quoteRequest.id);
      toast.success('Quote request cancelled successfully');
      router.push('/customer/quotes');
    } catch (error) {
      console.error('Error cancelling quote request:', error);
      toast.error('Failed to cancel quote request');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!quoteRequest) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Quote request not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Quote Request Details</h1>
          <button
            onClick={() => router.push('/customer/quotes')}
            className="text-blue-600 hover:text-blue-800"
          >
            Back to Quote Requests
          </button>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {quoteRequest.vehicleName}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Request #{quoteRequest.id}
            </p>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {quoteRequest.status}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Created</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {new Date(quoteRequest.createdAt).toLocaleString()}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {new Date(quoteRequest.updatedAt).toLocaleString()}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Notes</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {isEditing ? (
                    <div className="space-y-2">
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        rows={4}
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={handleUpdateNotes}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setIsEditing(false);
                            setNotes(quoteRequest.notes || '');
                          }}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="whitespace-pre-wrap">
                        {quoteRequest.notes || 'No notes provided'}
                      </p>
                      {quoteRequest.status === 'PENDING' && (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit Notes
                        </button>
                      )}
                    </div>
                  )}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {quoteRequest.status === 'PENDING' && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleCancelRequest}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Cancel Request
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 