import { createSlice,PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  balanceChange: boolean;
  balance: number | null;
  activeUserCount:number | null,
  searchBy:string;
  allCases:null | any[],
  searchResults:any[] | null,
  notification:string | null;
  universal_modal: boolean;
  universal_feedback: {
    message: string;
    color: string;
  };
}

const initialState:AppState = {
  balanceChange:false,
  balance:null,
  activeUserCount:null,
  searchBy:"",
  searchResults:null,
  allCases:null,
  notification:null,
  universal_modal:false,
  universal_feedback:{message:"",color:"whitesmoke"},
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
    note_searchResults: (state, action) => {
      state.searchResults = action.payload;
    },
    note_allCases: (state, action) => {
      state.allCases = action.payload;
    },
    note_notification: (state, action) => {
      state.notification = action.payload;
    },
    note_universal_feedback: (state, action) => {
      state.universal_feedback = action.payload;
    },
    note_universal_modal: (state, action) => {
      state.universal_modal = action.payload;
    },
  },
});

export const { note_balanceChange,note_balance,note_universal_modal,
  note_searchBy,note_activeUserCount,note_notification,note_searchResults,note_allCases} = loginSlice.actions

export default loginSlice.reducer