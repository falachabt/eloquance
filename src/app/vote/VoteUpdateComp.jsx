"use client"
import React, { useEffect, useCallback } from 'react';
import useSWR from 'swr';
import { supabase } from "@/lib/supabase";
import { updateVotePayments } from './vote.update.utils';


const REVALIDATE_INTERVAL = 4 * 60 * 1000; // 4 minutes in milliseconds

const fetcher = () => updateVotePayments();

export  function VotePaymentUpdater() {
  const {  error, mutate } = useSWR('/api/update-payments', fetcher, {
    refreshInterval: REVALIDATE_INTERVAL,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  });

  const handleVoteChange = useCallback(() => {
    console.log('Vote change detected, updating payments...');
    mutate();
  }, [mutate]);

  useEffect(() => {
    const votesSubscription = supabase
      .channel('votes_changes')
      .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'votes' }, 
          handleVoteChange
      )
      .subscribe();

    return () => {
      supabase.removeChannel(votesSubscription);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleVoteChange]);

  if (error) {
    console.error('Error updating vote payments:', error);
  }

  return (
    <div>
      
    </div>
  );
}