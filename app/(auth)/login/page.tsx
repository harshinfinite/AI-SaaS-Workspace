'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useReducer } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye } from 'lucide-react';
import { EyeOff } from 'lucide-react';

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
  const [showPassword, setShowPassword] = useState(false);

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
        return;
      }
      router.push('/dashboard');
    } catch (_) {
      dispatch({
        type: 'SET_ERROR',
        payload: { value: 'Something Went Wrong!' },
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { value: false } });
    }
  };
  return (
    <div className="w-full max-w-md p-8 rounded-xl bg-background shadow-md">
      <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
      <p className="text-muted-foreground text-sm mb-6">
        Sign in to Your Account
      </p>
      {state.error && (
        <p className="text-destructive text-sm mb-4">{state.error}</p>
      )}
      <div className="mb-4">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={state.email}
          placeholder="Enter Email"
          onChange={(e) =>
            dispatch({
              type: 'SET_FIELD',
              payload: { field: 'email', value: e.target.value },
            })
          }
        />
      </div>
      <div className="mb-4">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            className="pr-10"
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={state.password}
            placeholder="Enter Password"
            onChange={(e) =>
              dispatch({
                type: 'SET_FIELD',
                payload: { field: 'password', value: e.target.value },
              })
            }
          />
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
            onClick={() => {
              setShowPassword(!showPassword);
            }}
            type="button"
          >
            {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        </div>
      </div>
      <Button
        className="w-full"
        onClick={handleSubmit}
        disabled={state.loading}
      >
        {state.loading ? 'Submitting details...' : 'Login'}
      </Button>
      <p className="text-sm text-center mt-4">
        Don&apos;t have an Account?
        <a href="/register" className="text-primary  hover:underline">
          Register
        </a>
      </p>
    </div>
  );
};

export default Login;
