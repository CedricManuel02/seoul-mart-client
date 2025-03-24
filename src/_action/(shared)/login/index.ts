"use server";
import { API_ENDPOINT, EMAIL_REGEX } from "@/_constant/constant";
import { auth, signIn } from "@/auth";
import { getSessionNextAuth } from "@/lib/session";
import { AuthError } from "next-auth";
import { cookies } from "next/headers";

export async function SignupServerAction(values: any) {
  try {
    const response = await fetch(`${API_ENDPOINT}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const data = await response.json();

    if (!response.ok) return { error: data.message };

    return { success: data.message };
  } catch (error) {
    console.error("Something went wrong while registering your account", error);
    return { error: "Something went wrong while registering your account" };
  }
}

export async function SigninServerAction(values: any, rememberMe: boolean) {
  try {
    const cookieStore = await cookies();
    await signIn("credentials", { ...values, redirect: false });

    if(rememberMe) {
      cookieStore.set("email", values.email);
      cookieStore.set("remember-me", "true");
    } else {
      cookieStore.delete("email")
      cookieStore.delete("remember-me")
    }
  } catch (error) {
    if(error instanceof AuthError) {
      switch(error.type) {
        case "CredentialsSignin" :
          return {error: "Invalid Credentials"};
        default : 
          return {error: "Something went wrong please try again"};
      }
    }
    throw error;
  }
}

export async function SignoutServerAction() {
  try {
    const auth_token = await getSessionNextAuth();
    const response = await fetch(`${API_ENDPOINT}/auth/signout`, {
      method: "POST",
      headers: {
        Cookie: `auth__token=${auth_token}`,
      },
    });

    return { response };
  } catch (error) {
    console.error("Something went wrong while logging in to your account", error);
    return { error: "Something went wrong while logging in to your account" };
  }
}

export async function ForgotPasswordServerAction({ user_email }: { user_email: string }) {
  try {
    if (!user_email) return { error: "Email is required" };

    if (!EMAIL_REGEX.test(user_email)) return { error: "Email is invalid" };

    const response = await fetch(`${API_ENDPOINT}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_email }),
    });
    const data = await response.json();

    if (!response.ok) return { error: data.message };

    return { success: data.message };
  } catch (error) {
    console.error("Something went wrong while processing your forgot password:", error);
    return { error: "Failed to process your forgot password" };
  }
}

export async function ResetPasswordServerAction({
  new_password,
  confirm_password,
  reset_token,
}: {
  new_password: string;
  confirm_password: string;
  reset_token: string;
}) {
  try {
    if (!new_password || !confirm_password) return { error: new_password ? "Password is required" : "Confirm password is required" };

    if(!reset_token) return {error: "Token is required"}

    const response = await fetch(`${API_ENDPOINT}/auth/reset-password/${reset_token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ new_password, confirm_password }),
    });
    const data = await response.json();

    if (!response.ok) return { error: data.message };

    return { success: data.message };
  } catch (error) {
    console.error("Something went wrong while processing your forgot password:", error);
    return { error: "Failed to process your forgot password" };
  }
}

export async function ResetProfilePasswordServerAction({
  new_password,
  confirm_password,
  user_password,
}: {
  new_password: string;
  confirm_password: string;
  user_password: string;
}) {
  try {
    const auth_token = await getSessionNextAuth();

    if (!new_password || !confirm_password || !user_password) return { error: "All fields are required"};

    if(confirm_password !== new_password) return {error: "New password mismatch"};

    const response = await fetch(`${API_ENDPOINT}/auth/reset-profile-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `auth__token=${auth_token}`
      },
      body: JSON.stringify({user_password, new_password, confirm_password }),
    });
    const data = await response.json();

    if (!response.ok) return { error: data.message };

    return { success: data.message };
  } catch (error) {
    console.error("Something went wrong while processing your reset password:", error);
    return { error: "Failed to process your reset password" };
  }
}

export async function getVerificationTokenServerAction(token: string) {
  try {
    const response = await fetch(`${API_ENDPOINT}/auth/verification-token/${token}`);

    if (!response.ok) return false;

    return true;
  } catch (error) {
    console.error("Something went wrong while verifying the token:", error);
  }
}

// export async function getAccountServerAction() {
//   try {
//     const cookieStore = await cookies();
//     const auth_token = cookieStore.get("auth__token")?.value;

//     if(!auth_token) redirect("/login?error=unauthorized");

//     const response = await fetch(`${API_ENDPOINT}/auth/account`, {
//       method: "GET",
//       headers: {
//         Cookie: `auth__token=${auth_token}`
//       }
//     });

//     const data = await response.json();

//     if (!response.ok) return { error: data.message };

//     return { data: data.data };
//   } catch (error) {
//     console.error("Something went wrong while registering your account", error);
//     return { error: "Something went wrong while registering your account" };
//   }
// }
