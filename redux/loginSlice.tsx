import { createSlice,PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  balanceChange: boolean;
  balance: number | null;
  activeUserCount:number | null,
  searchBy:string;
  searchResultNo:number | null,
  ownDrop:any,
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
  searchResultNo:null,
  ownDrop:null,
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
    note_searchResultNo: (state, action) => {
      state.searchResultNo = action.payload;
    },
    note_ownDrop: (state, action) => {
      state.ownDrop = action.payload;
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
  note_searchBy,note_searchResultNo,note_activeUserCount,note_ownDrop} = loginSlice.actions

export default loginSlice.reducer