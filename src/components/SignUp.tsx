"use client";
import React, { useActionState } from "react";
import Form from "next/form";
import { Loader2 } from "lucide-react";

const initialState = {
  message: "",
};

type SignupProps = {
  action: (
    prevState: any,
    formData: FormData,
  ) => Promise<{ message: string } | undefined>;
};

const SignUp = ({ action }: SignupProps) => {
  const [state, formAction, isPending] = useActionState(action, initialState);
  return (
    <Form
      action={formAction}
      className={"max-w-md mx-auto my-16 p-8 bg-white shadow-md"}
    >
      <h1 className={"text-2xl font-bold text-center mb-2"}>
        join the DEAL REVOLUTION
      </h1>
      <p className={"text-center text-sm mb-2 text-red-600"}>
        ♨️ LIMITED TIME OFFER! ♨️
      </p>
      <p className={"text-center text-sm mb-2 text-gray-600"}>
        Sign up now and get 90% OFF your first order!
      </p>

      <div className={"space-y-6"}>
        {/*  Email  */}
        <div className={"space-y-2"}>
          <label
            htmlFor={"email"}
            className={"block text-sm font-medium text-gray-700"}
          >
            Email Address
          </label>
          <input
            type={"email"}
            id={"email"}
            name={"email"}
            autoComplete={"email"}
            required={true}
            className={
              "w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 shadow-sm focus:ring-blue " +
              "focus:border-transparent sm:text-sm transition-colors"
            }
            placeholder={"Enter your email address"}
          />
        </div>
        {/*  Password  */}
        <div className={"block text-sm font-medium text-gray-700"}>
          <label htmlFor={"password"}>Password</label>
          <input
            type={"password"}
            id={"password"}
            name={"password"}
            required={true}
            className={
              "w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 shadow-sm focus:ring-black " +
              "focus:border-transparent sm:text-sm transition-colors"
            }
            autoComplete={"current-password"}
            placeholder={"Create your password"}
          />
        </div>

        {/*  Copywriting  */}
        <div className={"text-center"}>
          <p className={"text-xs text-gray-500 mb-2"}>
            ⚡ Only 3 days left on sale!
          </p>
          <p className={"text-xs text-gray-500 mb-4"}>
            ⏰ Offer expires in: 14:00
          </p>
        </div>

        {/*  Submit  */}
        <button
          className={
            "w-full bg-rose-500 py-3 text-white rounded-md hover:bg-rose-700 transition-colors font-medium " +
            `flex items-center justify-center gap-2 ${isPending ? "opacity-50 cursor-not-allowed" : ""}`
          }
          type={"submit"}
          disabled={isPending}
        >
          {isPending ? (
            <React.Fragment>
              <Loader2 className={"h-4 w-4 animate-spin"} />
              CREATING ACCOUNT...
            </React.Fragment>
          ) : (
            "Create Account"
          )}
        </button>
      </div>
    </Form>
  );
};

export default SignUp;
