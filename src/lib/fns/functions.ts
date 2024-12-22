import axios from "axios";

const SUPABASE_URL = "https://hvisuhdcecrnkvvyyukf.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2aXN1aGRjZWNybmt2dnl5dWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0MzQyNTksImV4cCI6MjA1MDAxMDI1OX0.OwBD8xuk5xjPEOmaObWD6ENtHcEOCU29FlYluBL8Dfk";

// Spending
export const fetchdebit = async (userid: number) => {
  try {
    const response = await axios.get(
      `${SUPABASE_URL}/rest/v1/transaction?user_id=eq.${userid}&transaction_type=eq.debit`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          "Accept-Profile": "public",
        },
      }
    );

    if (response.status === 200) {
      const totalSpent = response.data.reduce(
        (total: number, transaction: { amount: number }) =>
          total + transaction.amount,
        0
      );
      return response.data; // Return total spending for last month
    } else {
      return("Error fetching spending data.");
    }
  } catch (error) {
    console.error("Error fetching spending last month:", error);
    return {error};
  }
};

export const fetchcredit = async (userid: number) => {
  try {
    const response = await axios.get(
      `${SUPABASE_URL}/rest/v1/transaction?user_id=eq.${userid}&transaction_type=eq.credit`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          "Accept-Profile": "public",
        },
      }
    );

    if (response.status === 200) {
      const totalSpent = response.data.reduce(
        (total: number, transaction: { amount: number }) =>
          total + transaction.amount,
        0
      );
      return response.data; // Return total spending for last month
    } else {
      return("Error fetching spending data.");
    }
  } catch (error) {
    console.error("Error fetching spending last month:", error);
    return {error};
  }
};

export const fetchBankdetails = async (userid: number) => {
  try {
    const response = await axios.get(
      `${SUPABASE_URL}/rest/v1/user?user_id=eq.${userid}`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          "Accept-Profile": "public",
        },
      }
    );

    if (response.status === 200) {
      return response.data; // User data
    } else {
      return(`Error fetching user data: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    return {error}; // Rethrow the error for further handling
  }
};

export const getLastTransaction = async (userid: number) => {
  try {
    const response = await axios.get(
      `${SUPABASE_URL}/rest/v1/transaction?user_id=eq.${userid}&order=transaction_date.desc&limit=1`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          "Accept-Profile": "public",
        },
      }
    );

    if (response.status === 200 && response.data.length > 0) {
      return response.data[0]; // Return the last transaction
    } else {
      return("No transactions found.");
    }
  } catch (error) {
    console.error("Error fetching last transaction:", error);
    return {error};
  }
};

export const fetchUserBalance = async (userid: number) => {
  try {
    const response = await axios.get(
      `${SUPABASE_URL}/rest/v1/account?user_id=eq.${userid}`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          "Accept-Profile": "public",
        },
      }
    );

    if (response.status === 200) {
      // Check if any account data is returned
      if (response.data.length > 0) {
        const balance = response.data[0].balance; // Get the balance of the first account
        return balance; // Return the user's bank balance
      } else {
        return("No account found for this user ID.");
      }
    } else {
      return("Error fetching user balance data.");
    }
  } catch (error) {
    console.error("Error fetching user balance:", error);
    return {error}; // Rethrow the error for further handling
  }
};

export async function fetchAvailableSchemes(balance: number) {
  try {
    // Fetch available schemes based on the minimum investment criteria
    const response = await axios.get(
      `${SUPABASE_URL}/rest/v1/scheme?min_investment=lte.${balance}`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          "Accept-Profile": "public",
        },
      }
    );

    if (response.status === 200 && response.data.length > 0) {
      return response.data.slice(3);
    } else {
      return("No transactions found.");
    }
  } catch (error) {
    console.error("Error fetching available schemes:", error);
    return { error: "An error occurred while fetching available schemes" };
  }
}

export const fetchAvailableLoanSchemes = async (userBalance: number) => {
  try {
    if (userBalance <= 0) {
      return("User balance must be greater than zero.");
    }

    const response = await axios.get(
      `${SUPABASE_URL}/rest/v1/loan?min_amount=lte.${userBalance}`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          "Accept-Profile": "public",
        },
      }
    );

    if (response.status === 200) {
      return response.data;
    } else {
      return("Error fetching available loan schemes.");
    }
  } catch (error) {
    console.error("Error fetching available loan schemes:", error);
    return {error};
  }
};

export const fetchAvailableLoanType = async (
  userBalance: number,
  loanType: string
) => {
  try {
    if (userBalance <= 0) {
      return("User  balance must be greater than zero.");
    }

    const response = await axios.get(
      `${SUPABASE_URL}/rest/v1/loan?loan_type=eq.${loanType}&min_amount<=lte.${userBalance}`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          "Accept-Profile": "public",
        },
      }
    );

    if (response.status === 200) {
      return response.data;
    } else {
      return("Error fetching available personal loans.");
    }
  } catch (error) {
    console.error("Error fetching available personal loans:", error);
    return {error};
  }
};



interface AccountResponse {
  account_id: number;
  user_id: number;
  account_type: string;
  balance: number;
}
//comnbine perdorm transaction for p2p transfer
async function performtransaction(user_id: number, amount: number, type: 'credit' | 'debit') {
  try {
    const response = await axios.get(`${SUPABASE_URL}/rest/v1/account?user_id=eq.${user_id}`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        "Accept-Profile": "public",
      },
    });

    if (response.status === 200) {
      if (!response.data || response.data.length === 0) {
        return { error: 'Account not found' };
      }

      const account = response.data[0] as AccountResponse;
      const newBalance = type === 'credit'
        ? account.balance + amount
        : account.balance - amount;

      if (type === 'debit' && newBalance < 0) {
        return { error: 'Insufficient funds' };
      }

      const updateResponse = await axios.put(
        `${SUPABASE_URL}/rest/v1/account?account_id=eq.${account.account_id}`,
        {
          account_id: account.account_id,
          user_id: account.user_id,
          account_type: account.account_type,
          balance: newBalance,
        },
        {
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Content-Type': 'application/json',
            'Content-Profile': 'public',
          },
        }
      );

      if (updateResponse.status === 204) {
        return { ...account, balance: newBalance };
      }

      return { error: `Error updating balance: ${updateResponse.statusText}` };
    } else {
      return { error: `Error fetching user data: ${response.statusText}` };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return { error: errorMessage };
  }
}

export async function addTransaction(userid: number, amount: number, type: 'credit' | 'debit', description?: string) {
  try {
    const account = await performtransaction(userid, amount, type);
    if (!('account_id' in account)) {
      return { error: account.error || 'Account not found' };
    }

    const wy = {
      account_id: account.account_id,
      amount,
      transaction_type: type,
      description,
      user_id: userid,
    };
    console.log({hi:wy});
    const response = await axios.post(
      `${SUPABASE_URL}/rest/v1/transaction`,
      {
        account_id: account.account_id,
        amount,
        transaction_type: type,
        description,
        user_id: userid,
      },
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Content-Profile': 'public',
        },
      }
    );
    if (response.status !== 201) {
      return { error: 'Error adding transaction' };
    }

    else return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return { error: errorMessage };
  }
}

export async function p2ptransfer(sender: number, receiver: number, amount: number, description:string) {
  const debitResponse = await addTransaction(sender, amount, 'debit', description);
  if ('error' in debitResponse) {
    return debitResponse;
  }


  const creditResponse = await addTransaction(receiver, amount, 'credit', description);
  if ('error' in creditResponse) {
    return creditResponse;
  }

  return { success: true };
}


export async function issuefianancial(userid: string, provider_name: string, type: string, amount: number, category: string, tenure: string) {
  try {
    const response = await axios.post(
      `${SUPABASE_URL}/rest/v1/issued_financials`,
      {
        user_id: userid,
        provider_name: provider_name,
        type: type,
        amount: amount,
        category: category,
        tenure: tenure
      },
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Content-Profile': 'public',
        }
      }
    );
    return response.status;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return { error: errorMessage };
  }
};

export const fetchIssuedLoanSchemes = async (userId: number): Promise<any> => {
  try {
    const response = await axios.get(`${SUPABASE_URL}/rest/v1/issued_financials?user_id=eq.${userId}`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Content-Profile': 'public',
      },
    });

    if (response.status === 200) {
      return response.data; 
    } else {
      return("Error fetching issued loan and schemes data.");
    }
  } catch (error: any) {
    console.error('Error fetching financial records:', error.message || error);
    return {error};
  }
};

export const addComplaint = async (userId: number, complaintText: string): Promise<any> => {
  try {
    const complaintData = {
      user_id: userId,
      complaints: complaintText,
    };

    const response = await axios.post(`${SUPABASE_URL}/rest/v1/complaint`, complaintData, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Accept-Profile': 'public',
      },
    });

    if (response.status === 201) {
      return response.status;
    } else {
      return {error:"error adding complaint"};
    }
  } catch (error) {
    console.error('Error adding complaint:', error);
    return {error:"error adding complaint"};  
  }
};

