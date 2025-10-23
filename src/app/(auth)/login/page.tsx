"use client";

import React from "react";
import { ArrowRight, Ban, UserCheck } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import ShowAuthError from "@/components/showAuthError";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Spinner } from "keep-react";

export default function LoginPage() {
  const params = useSearchParams();
  const [Auth, setAuth] = React.useState(
    {
      email: "",
      password: "",
    }
  );
  const [loading, setLoading] = React.useState<boolean>(false);
  const [testUserLoading, setTestUserLoading] = React.useState<boolean>(false);
  const [validateError, setValidateError] = React.useState({
    email: "",
    password: "",
  });
  const [AuthError, setAuthError] = React.useState("");
  const [greenbox, setGreenbox] = React.useState(params.get("msg"));
  const param = useSearchParams();
  const callback = param.get("callbackUrl");

  async function PostLoginData() {
    setLoading(true);
    await axios
      .post("/api/auth/login", Auth)
      .then((res) => {
        setLoading(false);
        const data = res.data;
        if (data.status == 200) {
          setGreenbox(data.msg);
          signIn("credentials", {
            email: Auth.email,
            password: Auth.password,
            callbackUrl: callback || "/dashboard",
            redirect: true,
          });
        } else {
          if (typeof data.msg == "string") {
            setAuthError(data.msg);
          } else {
            setValidateError(data.msg);
          }
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log("PostLoginData error-------->", err);
      });
  }

  async function loginAsTestUser() {
    setTestUserLoading(true);
    const testCredentials = {
      email: "test@gmail.com",
      password: "123456789",
    };

    await axios
      .post("/api/auth/login", testCredentials)
      .then((res) => {
        setTestUserLoading(false);
        const data = res.data;
        if (data.status == 200) {
          setGreenbox(data.msg);
          signIn("credentials", {
            email: testCredentials.email,
            password: testCredentials.password,
            callbackUrl: callback || "/dashboard",
            redirect: true,
          });
        } else {
          if (typeof data.msg == "string") {
            setAuthError(data.msg);
          } else {
            setValidateError(data.msg);
          }
        }
      })
      .catch((err) => {
        setTestUserLoading(false);
        console.log("loginAsTestUser error-------->", err);
      });
  }

  return (
    <section>
      <div className="flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
        <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
          <h2 className="text-center text-2xl font-bold leading-tight text-black">
            Log in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 ">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              title=""
              className="font-semibold text-black transition-all duration-200 hover:underline"
            >
              Create a free account
            </Link>
          </p>
          {AuthError ? (
            <div className=" mt-4 transition flex items-center justify-center rounded-md w-full h-full p-1 bg-red-400 text-black font-bold">
              <Ban size={16} />
              <span className="ml-1">{AuthError}</span>
            </div>
          ) : greenbox ? (
            <div className=" mt-4 transition flex items-center justify-center rounded-md w-full h-full p-1 bg-green-400 text-black font-bold">
              <span className="ml-1">{greenbox}</span>
            </div>
          ) : null}
          <form action="#" method="POST" className="mt-8">
            <div className="space-y-5">
              <div>
                <label
                  htmlFor=""
                  className="text-base font-medium text-gray-900"
                >
                  {" "}
                  Email address{" "}
                </label>
                <div className="mt-2">
                  <input
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                    type="email"
                    placeholder="Email"
                    onChange={(e) =>
                      setAuth({ ...Auth, email: e.target.value })
                    }
                  ></input>
                </div>
              </div>
              {validateError?.email ? (
                <ShowAuthError msg={validateError.email} />
              ) : null}
              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor=""
                    className="text-base font-medium text-gray-900"
                  >
                    {" "}
                    Password{" "}
                  </label>
                  <Link
                    href="#"
                    title=""
                    className="text-sm font-semibold text-black hover:underline"
                  >
                    {" "}
                    Forgot password?{" "}
                  </Link>
                </div>
                <div className="mt-2">
                  <input
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                    type="password"
                    placeholder="Password"
                    onChange={(e) =>
                      setAuth({ ...Auth, password: e.target.value })
                    }
                  ></input>
                </div>
              </div>
              {validateError?.password ? (
                <ShowAuthError msg={validateError.password} />
              ) : (
                " "
              )}
              <div>
                <button
                  type="button"
                  onClick={PostLoginData}
                  className="inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80"
                >
                  Get started&nbsp;
                  {loading ? (
                    <Spinner color="info" size="sm" />
                  ) : (
                    <ArrowRight className="ml-2" size={16} />
                  )}
                </button>
              </div>
            </div>
          </form>
          <div className="mt-3 space-y-3">
            <button
              type="button"
              onClick={loginAsTestUser}
              disabled={testUserLoading}
              className="relative inline-flex w-full items-center justify-center rounded-md border border-gray-400 bg-white px-3.5 py-2.5 font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-100 hover:text-black focus:bg-gray-100 focus:text-black focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {testUserLoading ? (
                <>
                  <Spinner color="info" size="sm" />
                  <span className="ml-2">Loading...</span>
                </>
              ) : (
                <>
                  <UserCheck className="mr-2 h-5 w-5 text-blue-600" />
                  Explore as Test User
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}