import React from "react";
import { getCurrentSession, loginUser } from "@/actions/auth";
import { redirect } from "next/navigation";
import z from "zod";
import SignIn from "@/components/auth/SignIn";

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const SignInPage = async () => {
  const { user } = await getCurrentSession();
  if (user) {
    redirect("/");
  }

  const action = async (prevState: any, formData: FormData) => {
    "use server";
    const parsed = signInSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
      return {
        message: "Invalid form data",
      };
    }

    const { email, password } = parsed.data;
    const { user, error } = await loginUser(email, password);
    if (error) {
      return { message: error };
    } else if (user) {
      redirect("/");
    }
  };
  return <SignIn action={action} />;
};

export default SignInPage;
