'use client';
import { useReducer } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { registerSchema } from '@/lib/validations/auth';
import { Eye } from 'lucide-react';
import { EyeOff } from 'lucide-react';

interface FormState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  error: string;
  loading: boolean;
}
type FormActions =
  | { type: 'SET_FIELD'; payload: { field: keyof FormState; value: string } }
  | { type: 'SET_ERROR'; payload: { value: string } }
  | { type: 'SET_LOADING'; payload: { value: boolean } };

const initialState: FormState = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  error: '',
  loading: false,
};

function FormReducer(state: FormState, action: FormActions): FormState {
  switch (action.type) {
    case 'SET_ERROR':
      return { ...state, error: action.payload.value };
    case 'SET_LOADING':
      return { ...state, loading: action.payload.value };
    case 'SET_FIELD':
      return { ...state, [action.payload.field]: action.payload.value };
    default:
      return { ...state };
  }
}

const Register = () => {
  const router = useRouter();
  const [state, dispatch] = useReducer(FormReducer, initialState);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    dispatch({ type: 'SET_LOADING', payload: { value: true } });
    dispatch({ type: 'SET_ERROR', payload: { value: '' } });
    const result = registerSchema.safeParse({
      name: state.name,
      email: state.email,
      password: state.password,
    });
    if (!result.success) {
      dispatch({ type: 'SET_ERROR', payload: { value: 'Invalid Inputs!' } });
      dispatch({ type: 'SET_LOADING', payload: { value: false } });
      return;
    }
    if (state.confirmPassword !== state.password) {
      dispatch({
        type: 'SET_ERROR',
        payload: { value: 'Both Passwords are Different!' },
      });
      dispatch({ type: 'SET_LOADING', payload: { value: false } });
      return;
    }
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: state.name,
          email: state.email,
          password: state.password,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        dispatch({ type: 'SET_ERROR', payload: { value: data.message } });
        return;
      }
      router.push('/login');
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
      <h1 className="text-2xl font-bold mb-2">Create an Account</h1>
      <p className="text-muted-foreground text-sm mb-6">
        Enter Your Details to Get Started
      </p>
      {state.error && (
        <p className="text-destructive text-sm mb-4">{state.error}</p>
      )}
      <div className="mb-4">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          type="text"
          value={state.name}
          placeholder="Enter Name"
          onChange={(e) =>
            dispatch({
              type: 'SET_FIELD',
              payload: { field: 'name', value: e.target.value },
            })
          }
        />
      </div>
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
      <div className="mb-4 ">
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
      <div className="mb-4">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Input
            className="pr-10"
            id="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            value={state.confirmPassword}
            placeholder="Confirm Password"
            onChange={(e) =>
              dispatch({
                type: 'SET_FIELD',
                payload: { field: 'confirmPassword', value: e.target.value },
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
        {state.loading ? 'Creating account...' : 'Create account'}
      </Button>
      <p className="text-sm text-center mt-4">
        Already have an Account?
        <a href="/login" className="text-primary  hover:underline">
          Sign In
        </a>
      </p>
    </div>
  );
};

export default Register;
