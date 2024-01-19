import { createSlice,PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  balanceChange: boolean;
  balance: number | null;
  universal_modal: boolean;
  universal_feedback: {
    message: string;
    color: string;
  };
}

const initialState:AppState = {
  balanceChange:false,
  balance:null,
  universal_modal:false,
  universal_feedback:{message:"",color:"whitesmoke"}
}


export const loginSlice = createSlice({
  name: 'loginSlice',
  initialState,
  reducers: {
    note_balanceChange: (state, action) => {
      state.balanceChange = action.payload;
    },
    note_balance: (state, action) => {
      state.balance = action.payload;
    },
    note_universal_feedback: (state, action) => {
      state.universal_feedback = action.payload;
    },
    note_universal_modal: (state, action) => {
      state.universal_modal = action.payload;
    },
  },
});

export const { note_balanceChange,note_balance,note_universal_modal} = loginSlice.actions

export default loginSlice.reducer