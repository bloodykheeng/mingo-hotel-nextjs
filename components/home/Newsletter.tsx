'use client'

import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

const schema = z.object({
    email: z.string().email("Please enter a valid email address")
});

type FormData = z.infer<typeof schema>;

const Newsletter: React.FC = () => {
    const toast = React.useRef<Toast>(null);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(schema)
    });

    const onSubmit = (data: FormData) => {
        console.log("Subscribing email:", data.email);

        toast.current?.show({
            severity: 'success',
            summary: 'Success',
            detail: 'Thank you for subscribing to our newsletter!',
            life: 3000
        });

        reset();
    };

    return (
        <div className="bg-gray-100 dark:bg-gray-800 py-16">
            <Toast ref={toast} />
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Subscribe Our<span className="text-orange-500"> NEWSLETTER</span>
                        </h2>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-4">
                        <InputText
                            {...register("email")}
                            placeholder="Enter your email"
                            className="flex-grow p-3"
                        />
                        <Button type="submit" label="SUBMIT" className="bg-orange-500 hover:bg-orange-600 border-orange-500 hover:border-orange-600 font-bold" />
                    </form>

                    {errors.email && <p className="text-red-500 mt-2">{errors.email.message}</p>}
                </div>
            </div>
        </div>
    );
};

export default Newsletter;
