"use client";
import React, { useEffect, useState } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { supabaseClient } from "@/lib/supabaseClient";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { LoginTabs } from "./LoginTabs";
import { useAtom } from "jotai";
import { globalStateAtom } from "@/context/atoms";

type Props = {
  setShowLoginModal: (showLoginModal: boolean) => void;
};

const LoginModal = (props: Props) => {
  const supabase = supabaseClient();
  const [signUp, setSignUp] = useState(false);
  const [state, setState] = useAtom(globalStateAtom);

  // const updatePassword = async () => {
  //   const { data: user, error } = await supabase.auth.admin.updateUserById(
  //     '25f4f821-04f7-4774-810b-9ba202fa52c3',
  //     { password: 'password', email_confirm: true }
  //   );
  //   if (error) console.log(error);
  //   else console.log(user);
  // };
  // updatePassword();

  useEffect(() => {
    const { data: authListener } =
      supabase.auth.onAuthStateChange(handleAuthChange);

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleAuthChange = async (event: any, session: any) => {
    if (
      (event === "SIGNED_IN" || event === "PASSWORD_RECOVERY") &&
      session !== null
    ) {
      if (session != null) {
        console.log("session", session);
        setState((prev) => ({
          ...prev,
          user: session.user,
          session: session,
        }));
        props.setShowLoginModal(false);
      }
    }
  };

  return (
    <div className="m-auto h-full flex fixed top-0 bottom-0 left-0 right-0  ">
      <div
        onClick={() => props.setShowLoginModal(false)}
        className="fixed top-0 left-0 right-0 bottom-0 bg-black opacity-60 z-10 w-full h-full"></div>
      <div className="h-fit w-1/3 m-auto z-20 bg-neutral-800 p-8 rounded-xl">
        <LoginTabs setSignUp={setSignUp} />
        <Auth
          supabaseClient={supabase}
          socialLayout="horizontal"
          redirectTo={
            process.env.NODE_ENV === "production"
              ? "rekomix.vercel.app/set-up"
              : "http://localhost:3000/set-up"
          }
          theme="dark"
          appearance={{
            theme: ThemeSupa,
            style: {
              divider: {
                border: "1px solid #F7F1EE",
                margin: "1rem 0",
              },
              button: {
                width: "fit-content",
                margin: "0 auto",
                maxWidth: "100%",
                textTransform: "uppercase",
                // background: '#fff',
                padding: "0.5rem 2rem",
                borderRadius: "0.375rem",
                fontFamily: "sans-serif",
              },
              label: {
                color: "#F7F1EE",
                fontSize: "16px",
                margin: "0 0 0.5rem 0",
              },
              anchor: {
                color: "#F7F1EE",
                fontSize: "16px",
                margin: "0 0 0.5rem 0",
              },
              input: {
                letterSpacing: "0.25rem",
                borderRadius: "0.375rem",
                padding: "1rem 0.75rem",
              },
              message: {
                fontSize: "18px",
                color: "#fff",
                margin: "0 0 20px 0",
              },
            },
          }}
          localization={{
            variables: signUp
              ? {
                  sign_up: {
                    button_label: "Sign up",
                  },
                }
              : {
                  sign_in: {
                    button_label: "Sign in",
                  },
                },
          }}
          providers={[]}
          view={signUp ? "sign_up" : "sign_in"}
        />
      </div>
    </div>
  );
};

export default LoginModal;
