"use client";
import { getVerificationTokenEmailServerAction } from "@/_action/(shared)/login";
import Custom404 from "@/app/not-found";
import { Card, CardHeader } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

export default function ConfirmAccount() {
  const search = useSearchParams();
  const token = search.get("token");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [status, setStatus] = useState<boolean>(false);

  const getToken = useCallback(async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      const response = await getVerificationTokenEmailServerAction(token);
      if (response?.status === 200) setStatus(true);
    } catch (error) {
      console.error("Something went wrong while verifying the token:", error);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    getToken();
  }, [token]);

  if (isLoading) {
    return <div className="w-11/12 xl:w-9/12 min-h-screen h-auto m-auto py-10 flex items-center justify-center">Loading...</div>;
  }

  if(!status) {
    return <Custom404/>
  }
  return (
    <div className="w-11/12 xl:w-9/12 min-h-screen h-auto m-auto py-10 flex items-center justify-center">
      <Card className="border-none shadow-none md:shadow-md w-full sm:max-w-[450px]">
        <CardHeader className="font-medium flex items-center justify-center">
          <CheckCircle2 className="text-green-500" size={40} />
          <p>Successfully Confirmed Account</p>
        </CardHeader>
      </Card>
    </div>
  );
}
