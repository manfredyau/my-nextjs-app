import React, { use } from "react";
import { getCurrentSession, loginUser, registerUser } from "@/actions/auth";
import { redirect } from "next/navigation";
import SignUp from "@/components/SignUp";
import z from "zod";

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const SignUpPage = () => {
  const { user } = use(getCurrentSession());
  if (user) {
    redirect("/");
  }

  const action = async (prevState: any, formData: FormData) => {
    "use server";
    const parsed = signupSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
      return {
        message: "Invalid form data",
      };
    }

    const { email, password } = parsed.data;
    const { user, error } = await registerUser(email, password);
    if (error) {
      return { message: error };
    } else if (user) {
      await loginUser(email, password);
      redirect("/login");
    }
  };
  return <SignUp action={action} />;
};

export default SignUpPage;
