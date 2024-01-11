import { createSlice,PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  balanceChange:false,
  universal_feedback:{message:"",color:"whitesmoke"}
}


export const loginSlice = createSlice({
  name: 'loginSlice',
  initialState,
  reducers: {
    note_balanceChange: (state, action) => {
      state.balanceChange = action.payload;
    },
    note_universal_feedback: (state, action) => {
      state.universal_feedback = action.payload;
    },
  },
});

export const { note_balanceChange,note_universal_feedback} = loginSlice.actions

export default loginSlice.reducer