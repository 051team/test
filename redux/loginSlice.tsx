import { createSlice,PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  balanceChange: boolean;
  balance: number | null;
  activeUserCount:number | null,
  searchBy:string;
  searchResultNo:number | null,
  universal_modal: boolean;
  universal_feedback: {
    message: string;
    color: string;
  };
  totalCasesOpened:number | null
}

const initialState:AppState = {
  balanceChange:false,
  balance:null,
  activeUserCount:null,
  searchBy:"",
  searchResultNo:null,
  universal_modal:false,
  universal_feedback:{message:"",color:"whitesmoke"},
  totalCasesOpened:null
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
    note_activeUserCount: (state, action) => {
      state.activeUserCount = action.payload;
    },
    note_searchBy: (state, action) => {
      state.searchBy = action.payload;
    },
    note_searchResultNo: (state, action) => {
      state.searchResultNo = action.payload;
    },
    note_universal_feedback: (state, action) => {
      state.universal_feedback = action.payload;
    },
    note_universal_modal: (state, action) => {
      state.universal_modal = action.payload;
    },
    note_TotalCasesOpened: (state, action) => {
      state.totalCasesOpened = action.payload;
    },
  },
});

export const { note_balanceChange,note_balance,note_universal_modal,note_TotalCasesOpened,note_searchBy,note_searchResultNo,note_activeUserCount} = loginSlice.actions

export default loginSlice.reducer