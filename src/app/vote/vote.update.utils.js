import { supabase } from "@/lib/supabase";
import { notchpay } from "@/lib/notchpay";

export async function updateVotePayments() {
  try {
    // Fetch votes that need to be checked
    const { data: votesToCheck, error } = await supabase
      .from('votes')
      .select('*')
      .eq('is_paid_vote', true)
      .eq('vote_ok', false)
      .not('paiement_status', 'in', '("complete","failed")');


      console.log(votesToCheck)

    if (error) throw error;

    // Process each vote
    const updatePromises = votesToCheck.map(async (vote) => {
      try {
        const paymentDetails = await notchpay.payments.verifyAndFetchPayment(vote.trx_id);
        let newStatus = 'pending';
        let voteOk = false;

        if (paymentDetails?.transaction?.status === "complete") {
          newStatus = 'complete';
          voteOk = true;
        } else if (paymentDetails?.transaction?.status === "failed" || paymentDetails?.transaction?.status === "expired") {
          newStatus = 'failed';
        }

        console.log(paymentDetails?.transaction?.status)

        // Update the vote in the database
        const { error: updateError } = await supabase
          .from('votes')
          .update({ 
            paiement_status: newStatus, 
            vote_ok: voteOk,
            paiement_done: newStatus === 'complete',
            paiement_failed: newStatus === 'failed'
          })
          .eq('id', vote.id);

        if (updateError) throw updateError;

        return { id: vote.id, status: newStatus };
      } catch (error) {
        console.error(`Error processing vote ${vote.id}:`, error);
        return { id: vote.id, status: 'error' };
      }
    });

    const results = await Promise.all(updatePromises);
    console.log('Vote payment updates completed:', results);
    return results;
  } catch (error) {
    console.error('Error in updateVotePayments:', error);
    throw error;
  }
}
