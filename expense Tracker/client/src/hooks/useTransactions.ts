import { useState, useCallback } from 'react';
import { apiClient } from '../lib/api';
import { type Transaction } from '../lib/types'; 

export function useTransactions() {
  const [data, setData] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.api.transactions.$get();
      
      if (!response.ok) {
        throw new Error(`Server connection failed: ${response.status}`);
      }

      const result = await response.json();

      if (result.success === true && 'data' in result) {
        setData(result.data as unknown as Transaction[]);
      } else {
        throw new Error((result as any).error || 'Failed to retrieve records');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(message);
      console.error('[useTransactions fetch error]:', message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addTransaction = async (payload: Omit<Transaction, 'id'>) => {
    try {
      const response = await apiClient.api.transactions.$post({
        json: payload as any 
      });
      
      const result = await response.json();

      if (result.success === true) {
        setData(prev => [(result as any).data as unknown as Transaction, ...prev]);
        return true;
      } else {
        console.error('Server Validation Details:', (result as any).details);
        throw new Error((result as any).error || 'Validation failed');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add transaction';
      setError(message);
      return false;
    }
  };

  const editTransaction = async (id: string, payload: Omit<Transaction, 'id'>) => {
    try {
      const response = await apiClient.api.transactions[':id'].$put({
        param: { id },
        json: payload as any
      });

      const result = await response.json();

      if (result.success === true) {
        // Map the updated transaction into the existing data array efficiently
        setData(prev => prev.map(t => t.id === id ? ((result as any).data as unknown as Transaction) : t));
        return true;
      } else {
        console.error('Server Validation Details:', (result as any).details);
        throw new Error((result as any).error || 'Update failed');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update transaction';
      setError(message);
      return false;
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const response = await apiClient.api.transactions[':id'].$delete({
        param: { id }
      });
      
      const result = await response.json();

      if (result.success === true) {
        setData(prev => prev.filter(t => t.id !== id));
        return true;
      } else {
        throw new Error((result as any).error || 'Failed to delete record');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Delete operation failed';
      setError(message);
      return false;
    }
  };

  return {
    data,
    isLoading,
    error,
    fetchTransactions,
    addTransaction,
    editTransaction,
    deleteTransaction
  };
}