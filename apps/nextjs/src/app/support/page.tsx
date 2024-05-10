'use client';

import React from 'react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  email: z.string().email('Invalid email'),
  message: z.string().min(2, 'Message is required'),
});

const SupportPage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  const isLoading = form.formState.isSubmitting;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Send email using Nodemailer
      await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      // Reset the form
      form.reset();
      toast.success('Event has been created');
    } catch (error) {
      // Handle error
      toast.error('Failed to send email');
    }
  }

  return (
    <main className="min-h-screen bg-gray-200 items-center justify-center flex">
      <div className="flex flex-col text-center">
        <div className="mx-auto w-full  px-4 ">
          <h1 className="mb-4 text-center text-4xl font-bold">
            CONTACT
            <hr className="mx-auto my-2 h-1 w-6 rounded border-0 bg-green-600"></hr>
          </h1>

          <p className="mb-6 text-xl text-gray-600">
            Have a question feedback about RecipeBudd? You can send a message to
            the support team.
          </p>

          <div className="flex w-full flex-col space-y-10 md:flex-row ">
            <div className="flex flex-col w-full">
              <p className="mb-2 text-2xl font-semibold">Get in Touch</p>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Name*" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="items-start justify-start flex flex-col">
                          <FormControl>
                            <Input placeholder="Email*" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea placeholder="Message*" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={isLoading} size="lg">
                    <span className="font-bold text-lg">
                      {isLoading ? 'Submitting...' : 'Submit'}
                    </span>
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SupportPage;
