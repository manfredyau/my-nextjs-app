import React, {use} from 'react';
import {getCurrentSession} from "@/actions/auth";
import {redirect} from "next/navigation";
import SignUp from "@/components/SignUp";

const SignInPage = () => {
    return (
        <div>
            <h1>Sign-in</h1>
        </div>
    );
};

export default SignInPage;
