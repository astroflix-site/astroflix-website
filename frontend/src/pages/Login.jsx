import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { authActions } from '../store/auth';


const Login = () => {
    const isLoggedIn = useSelector((state)=> state.auth.isLoggedIn);
    const dispatch = useDispatch();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    
    const checkIfLoggedIn = async()=>{
        if(isLoggedIn == true)
            navigate('/profile');
    }
    checkIfLoggedIn();
    
    const onSubmit = async (data) => {
        try {
            const response = await fetch('https://cbpsc3gn-3000.inc1.devtunnels.ms/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include', // Include cookies in the request and response
                body: JSON.stringify({
                    email: data.email,  // <-- Use 'email' here
                    password: data.password,
                })
            });
    
            const responseData = await response.json();
    
            if (response.ok) {
                console.log(responseData.message)
                
                dispatch(authActions.login());
                navigate("/profile")
            } else {
                toast.error(responseData.message);
            }
        } catch (error) {
            toast.error('An Error Occurred');
        }
    };
    

    return (
        <div>
            <ToastContainer/>
            <section className="h-full lg:h-screen bg-gray-900 flex justify-center items-center">
                <div className="container h-full p-10">
                    <div className="g-6 flex h-full flex-wrap items-center justify-center text-neutral-200 dark:text-neutral-200">
                        <div className="w-full">
                            <div className="block rounded-lg bg-neutral-900 shadow-lg dark:bg-neutral-800">
                                <div className="g-0 lg:flex lg:flex-wrap">
                                    <div className="px-4 md:px-0 lg:w-6/12">
                                        <div className="md:mx-6 md:p-12">
                                            <div className="text-center">
                                                <img className="mx-auto w-32" src="/logo.png" alt="logo" />
                                                <h4 className="mb-12 mt-1 pb-1 text-xl font-semibold">
                                                    Podcastify
                                                </h4>
                                            </div>

                                            <form onSubmit={handleSubmit(onSubmit)}>
                                                <p className="mb-4 opacity-80">Please login to your account</p>
                                                <div className="mb-4">
                                                    <label htmlFor="email" className="block text-sm font-medium text-white">Email</label>
                                                    <input
                                                        id="email"
                                                        type="email"
                                                        {...register('email', { required: 'Email is required' })}
                                                        className={`mt-1 block w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-violet-300 focus:border-violet-300 sm:text-sm`}
                                                    />
                                                    {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
                                                </div>

                                                <div className="mb-4">
                                                    <label htmlFor="password" className="block text-sm font-medium text-white">Password</label>
                                                    <input
                                                        id="password"
                                                        type="password"
                                                        {...register('password', { required: 'Password is required' })}
                                                        className={`mt-1 block w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-violet-300 focus:border-violet-300 sm:text-sm`}
                                                    />
                                                    {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
                                                </div>

                                                <div className="mb-12 pb-1 pt-1 text-center">
                                                    <button type="submit" className="mb-3 inline-block w-full rounded px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white bg-slate-800">
                                                        Log in
                                                    </button>
                                                    <a href="#!" className="text-blue-500 hover:underline">Forgot password?</a>
                                                </div>

                                                <div className="flex items-center justify-between pb-6">
                                                    <p className="mb-0 mr-2 text-white">Don't have an account?</p>
                                                    <Link className="inline-block rounded border-2 border-danger px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-danger transition duration-150 ease-in-out hover:border-danger-600 hover:bg-neutral-500 hover:bg-opacity-10 hover:text-danger-600 focus:border-danger-600 focus:text-danger-600 focus:outline-none focus:ring-0 active:border-danger-700 active:text-danger-700 dark:hover:bg-neutral-400 dark:hover:bg-opacity-10" to='/register'>
                                                        Register
                                                    </Link>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                    <div className="flex items-center rounded-b-lg lg:w-6/12 lg:rounded-r-lg lg:rounded-bl-none bg-purple-700">
                                        <div className="px-4 py-6 text-white md:mx-6 md:p-12">
                                            <h4 className="mb-6 text-xl font-semibold">
                                                Podcastify A Podcast Web App
                                            </h4>
                                            <p className="text-sm">
                                                Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                                                sed do eiusmod tempor incididunt ut labore et dolore magna
                                                aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                                                ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Login;