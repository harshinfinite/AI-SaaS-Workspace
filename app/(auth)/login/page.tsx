'use client';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useReducer } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LoginState {
  email: string;
  password: string;
  error: string;
  loading: boolean;
}
type LoginAction =
  | { type: 'SET_FIELD'; payload: { field: keyof LoginState; value: string } }
  | { type: 'SET_ERROR'; payload: { value: string } }
  | { type: 'SET_LOADING'; payload: { value: boolean } };

const initialState: LoginState = {
  email: '',
  password: '',
  error: '',
  loading: false,
};

function LoginReducer(state: LoginState, action: LoginAction): LoginState {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.payload.field]: action.payload.value };
    case 'SET_ERROR':
      return { ...state, error: action.payload.value };
    case 'SET_LOADING':
      return { ...state, loading: action.payload.value };
    default:
      return { ...state };
  }
}

const Login = () => {
  const router = useRouter();
  const [state, dispatch] = useReducer(LoginReducer, initialState);

  const handleSubmit = async () => {
    dispatch({ type: 'SET_LOADING', payload: { value: true } });
    dispatch({ type: 'SET_ERROR', payload: { value: '' } });
    try {
      const result = await signIn('credentials', {
        email: state.email,
        password: state.password,
        redirect: false,
      });
      if (result?.error) {
        dispatch({
          type: 'SET_ERROR',
          payload: { value: 'Invalid email or password' },
        });
      }
      router.push('/dashboard');
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: { value: 'Something Went Wrong!' },
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { value: false } });
    }
  };
  return <div></div>;
};

export default Login;
