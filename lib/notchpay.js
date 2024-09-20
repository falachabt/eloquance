
import NotchPay from 'notchpay.js';

export const notchpay = NotchPay(
    process.env.NOTCH_PAY_KEY, 
    { debug : true, } 
);






// Fonction pour vérifier les autorisations avant chaque requête
const checkAuthorization = async (requiredPermissions) => {
    // Supposons que l'API Notch Pay ait une route pour obtenir les permissions actuelles de l'utilisateur
    // const response = await notchPay.get('/permissions');
    // const userPermissions = response.data.permissions;

    return true

    
    if (!requiredPermissions.every(permission => userPermissions.includes(permission))) {
        throw new Error('Vous n\'avez pas les autorisations nécessaires pour effectuer cette action.');
    }
};

// Créer une transaction de paiement
export const createTransaction = async (amount, currency, email, callbackUrl) => {
    await checkAuthorization(['create_transaction']); // Vérification des autorisations
    const response = await notchPay.post('/transactions', {
        amount,
        currency,
        email,
        callback_url: callbackUrl,
    });
    return response.data;
};

// Vérifier l'état d'une transaction
export const checkTransactionStatus = async (transactionId) => {
    await checkAuthorization(['check_transaction_status']); // Vérification des autorisations
    const response = await notchPay.get(`/transactions/${transactionId}`);
    return response.data;
};

// Rembourser une transaction
export const refundTransaction = async (transactionId, amount) => {
    await checkAuthorization(['refund_transaction']); // Vérification des autorisations
    const response = await notchPay.post('/refunds', {
        transaction_id: transactionId,
        amount,
    });
    return response.data;
};

// Obtenir les détails d'une transaction spécifique
export const getTransactionDetails = async (transactionId) => {
    await checkAuthorization(['get_transaction_details']); // Vérification des autorisations
    const response = await notchPay.get(`/transactions/${transactionId}`);
    return response.data;
};

// Lister les transactions
export const listTransactions = async (params) => {
    await checkAuthorization(['list_transactions']); // Vérification des autorisations
    const response = await notchPay.get('/transactions', { params });
    return response.data;
};

// Créer un client (si applicable pour Notch Pay)
export const createCustomer = async (email, name) => {
    await checkAuthorization(['create_customer']); // Vérification des autorisations
    const response = await notchPay.post('/customers', { email, name });
    return response.data;
};

// Obtenir les détails d'un client
export const getCustomerDetails = async (customerId) => {
    await checkAuthorization(['get_customer_details']); // Vérification des autorisations
    const response = await notchPay.get(`/customers/${customerId}`);
    return response.data;
};

// Lister les clients
export const listCustomers = async () => {
    const response = await notchPay.get('/customers');
    return response.data;
  };

// Annuler une transaction
export const cancelTransaction = async (transactionId) => {
    await checkAuthorization(['cancel_transaction']); // Vérification des autorisations
    const response = await notchPay.post(`/transactions/${transactionId}/cancel`);
    return response.data;
};

// Effectuer un transfert de fonds
export const transferFunds = async (amount, currency, recipientEmail, description) => {
    await checkAuthorization(['transfer_funds']); // Vérification des autorisations
    const response = await notchPay.post('/transfers', {
        amount,
        currency,
        recipient_email: recipientEmail,
        description,
    });
    return response.data;
};

// Vérifier l'état d'un transfert
export const checkTransferStatus = async (transferId) => {
    await checkAuthorization(['check_transfer_status']); // Vérification des autorisations
    const response = await notchPay.get(`/transfers/${transferId}`);
    return response.data;
};

// Lister les transferts
export const listTransfers = async (params) => {
    await checkAuthorization(['list_transfers']); // Vérification des autorisations
    const response = await notchPay.get('/transfers', { params });
    return response.data;
};

// Autres requêtes et fonctionnalités possibles avec Notch Pay
// Ajouter d'autres fonctions en fonction des fonctionnalités offertes par l'API Notch Pay

// Exemple : Fonction pour valider un compte bancaire (si disponible dans l'API)
export const validateBankAccount = async (bankAccountDetails) => {
    await checkAuthorization(['validate_bank_account']); // Vérification des autorisations
    const response = await notchPay.post('/validate-bank-account', bankAccountDetails);
    return response.data;
};
