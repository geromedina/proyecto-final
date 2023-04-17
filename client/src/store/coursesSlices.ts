import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AppThunk } from "./store";
import axios from "axios";
import { getItem, setItem } from "../components/LocalStorage/LocalStorage";
interface Review {
  username: string;
  comment:string;
}

export interface ICourse {
  user_id: string;
  name: string;
  description: string;
  image: string;
  difficulty: string;
  duration: number;
  price: number;
  video: string;
  reviews: Review[];
  _id: string;
  created_at: Date;
  updated_at: Date;
}

export interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
}

// interface ShoppingCartItem {
//   product: Product;
//   quantity: number;
// }

interface CoursesState {
  courses: ICourse[];
  filteredCourses: ICourse[];
  cartItems: Product[];
}


const localStorageState = getItem("coursesState");

const initialState: CoursesState = localStorageState ? localStorageState : {
  courses: [],
  filteredCourses: [],
  cartItems: []
};

export const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    fetchCourses: (state, action: PayloadAction<ICourse[]>) => {
      const newState = {
        ...state,
        courses: action.payload,
        filteredCourses: action.payload,
      };
      // Guardar el estado actualizado en localStorage
      setItem("coursesState", newState);
      return newState;
    },
    updateFilteredCourses: (state, action: PayloadAction<ICourse[]>) => {
      const newState = {
        ...state,
        filteredCourses: action.payload,
      };
      // Guardar el estado actualizado en localStorage
      setItem("coursesState", newState);
      return newState;
    },
    addToCart: (state, action: PayloadAction<Product>) => {
      const newState = {
        ...state,
        cartItems: [...state.cartItems, action.payload]
      };
      // Guardar el estado actualizado en localStorage
      setItem("coursesState", newState);
      return newState;
    },
    removeFromCart: (state, action: PayloadAction<Product>) => {
      const newState = {
        ...state,
        cartItems: state.cartItems.filter(item => item.id !== action.payload.id)
      };
      // Guardar el estado actualizado en localStorage
      setItem("coursesState", newState);
      return newState;
    },
    clearCart: (state) => {
      const newState = {
        ...state,
        cartItems: []
      };
      // Guardar el estado actualizado en localStorage
      setItem("coursesState", newState);
      return newState;
    }
  },
});
export const getCourses = (): AppThunk => {
  return async (dispatch) => {
    const rawData = await axios.get("http://localhost:3001/courses");
    console.log(rawData);
    const response = rawData.data;

    dispatch(fetchCourses(response));
  };
};

export const getCoursesByName = (name: string): AppThunk => {
  return async (dispatch) => {
    const rawData = await axios.get(
      `http://localhost:3001/courses?name=${name}`
    );
    console.log(rawData);
    const response = rawData.data;

    dispatch(updateFilteredCourses(response));
  };
};

export const { fetchCourses, updateFilteredCourses, addToCart, removeFromCart, clearCart } = coursesSlice.actions;
export default coursesSlice.reducer;
