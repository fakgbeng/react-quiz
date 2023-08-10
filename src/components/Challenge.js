/*
INSTRUCTIONS / CONSIDERATIONS:

1. let's implement a simple bank account! It's similar to the example that I used as an analogy to explain how useReducer works, but it's simplified [we're not using account numbers here]

2. Use a reducer to model the following state transitions: openAccount, deposit, withdraw, requestLoan, payLoan, closeAccount. Use the 'initialState' below to get started

3. All operations (expect for opening account) can only be performed if isActive is true. If it's not, just return the original state object. You can check this right at the beginning of the reducer 

4. When the account is opened, isActive is set to true. There is also a minimum deposit amount of 500 to open an account (which means that the balance will start at 500)

5. Customer can only request a loan if there is no loan yet. If that condition is met, the requsted amount will be registered in the 'loan' state, and it will be added to the balance. If the condition is not met, just return the current state

6. When the customer pays the loan, the opposite happens: the money is taken from the balance, and the 'loan' will gwt baack to 0. This cam lead to negative balances, but that's no proble,, because the customer can't close their account  now (see next point)

7. Customer can only close an account if there is no loan, AND if the balance is zero. If this condition is not met, just return the state. If the condition is me, the account is deactivated and all money is withdrawn. The account basically gets back to the initial state

*/

import { useReducer } from "react";

const initialState = {
  balance: 0,
  loan: 0,
  isActive: false,
  canClose: true,
  loanIsActive: false,
};
const reducer = (state, action) => {
  if (!state.isActive && action.type !== "openAccount") return state;
  switch (action.type) {
    case "openAccount":
      return { ...state, isActive: true, balance: 500 };
    case "closeAccount":
      const confirmClose = state.balance === 0 && state.loan === 0;
      return { ...state, isActive: !confirmClose };
    case "deposit":
      return { ...state, balance: state.balance + action.payload };
    case "withdraw":
      const balance = state.balance - action.payload;
      const balanceDisplay = balance <= 0 ? 0 : balance;
      return { ...state, balance: balanceDisplay };
    case "loan":
      return {
        ...state,
        loan: !state.loan && action.payload !== 0 ? action.payload : state.loan,
        loanIsActive: true,
        balance: !state.loanIsActive
          ? action.payload + state.balance
          : state.balance,
      };
    case "payLoan":
      const loanPay = state.loan - action.payload;
      const loanDisplay = loanPay < 0 ? 0 : loanPay;
      console.log(state.loan);
      return {
        ...state,
        loan: +loanDisplay,
        loanIsActive: false,
        balance: state.loanIsActive
          ? state.balance - state.loan
          : state.balance,
      };
    default:
      throw new Error("Action unknown");
  }
};
function Challenge() {
  const [{ balance, loan, isActive }, dispatch] = useReducer(
    reducer,
    initialState
  );
  return (
    <div className="app challenge">
      <h1>useReducer Bank Account</h1>
      <p>Balance: {balance}</p>
      <p>Loan: {loan}</p>

      <p>
        <button
          onClick={() => {
            dispatch({ type: "openAccount" });
          }}
          disabled={isActive}
        >
          Open account
        </button>
      </p>
      <p>
        <button disabled={!isActive}>
          Deposit {""}
          <select
            onChange={(e) =>
              dispatch({ type: "deposit", payload: +e.target.value })
            }
          >
            <option>100</option>
            <option>200</option>
            <option>500</option>
            <option>1000</option>
            <option>2000</option>
            <option>5000</option>
          </select>
        </button>
      </p>
      <p>
        <button disabled={!isActive}>
          Withdraw {""}
          <select
            onChange={(e) =>
              dispatch({ type: "withdraw", payload: +e.target.value })
            }
          >
            <option>100</option>
            <option>200</option>
            <option>500</option>
            <option>1000</option>
            <option>2000</option>
            <option>5000</option>
          </select>
        </button>
      </p>

      <p>
        <button disabled={!isActive}>
          Request loan {""}
          <select
            onChange={(e) =>
              dispatch({ type: "loan", payload: +e.target.value })
            }
          >
            <option>100</option>
            <option>200</option>
            <option>500</option>
            <option>1000</option>
            <option>2000</option>
            <option>5000</option>
          </select>
        </button>
      </p>
      <p>
        <button
          onClick={() => {
            dispatch({ type: "payLoan", payload: 5000 });
          }}
          disabled={!isActive}
        >
          Pay loan
        </button>
      </p>
      <p>
        <button
          onClick={() => {
            dispatch({ type: "closeAccount" });
          }}
          disabled={!isActive}
        >
          Close account
        </button>
      </p>
    </div>
  );
}

export default Challenge;
