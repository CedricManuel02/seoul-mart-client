"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Wifi, WifiHigh, WifiLow } from "lucide-react";

export default function NavigationSearch() {
  const router = useRouter();
  const [search, setSearch] = useState<string>("");
  const searchOptions = ["Samyang Buldak...", "Peppero...", "Soju..."];
  const [placeholder, setPlaceholder] = useState<string>("Search for Noodles...");

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let optionIndex = 0;
    let charIndex = 0;
    let typingForward = true;

    intervalRef.current = setInterval(() => {
      if (typingForward) {
        if (charIndex < searchOptions[optionIndex].length) {
          setPlaceholder(`Search for ${searchOptions[optionIndex].slice(0, charIndex + 1)}`);
          charIndex++;
        } else {
          typingForward = false;
          setTimeout(() => {}, 1000);
        }
      } else {
        if (charIndex > 0) {
          setPlaceholder(`Search for ${searchOptions[optionIndex].slice(0, charIndex - 1)}`);
          charIndex--;
        } else {
          typingForward = true;
          optionIndex = (optionIndex + 1) % searchOptions.length;
        }
      }
    }, 100);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleOnKeyChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (event.target.value !== "") {
      setSearch(event.target.value);
    }
  }, []);

  const handleOnKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter" && search !== "") {
        router.push(`/search/${search}`);
      }
    },
    [search]
  );

  const searchProduct = useCallback(() => {
    if (search !== "") {
      router.push(`/search/${search}`);
    }
  }, [search]);


  useEffect(() => {
    const handleOnline = () => {
      toast({
        variant: "default",
        description: (<div className="flex items-center gap-2"><Wifi style={{ color: "green" }}/> <p>Your internet connection was restored</p></div>)
      });
    };

    const handleOffline = () => {
      toast({
        variant: "default",
        description: (<div className="flex items-center gap-2"><WifiHigh style={{ color: "red" }}/> <p>You're offline, Please check your internet connection</p></div>)
      });
    };

    // Add event listeners to detect when the user goes online or offline
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Cleanup the event listeners when the component is unmounted
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []); 
  return (
    <div className="hidden md:block w-5/12">
      <div className="flex items-center gap-2 w-full">
        <Input type="text" placeholder={placeholder} value={search} onChange={handleOnKeyChange} onKeyDown={handleOnKeyDown} required />
        <Button onClick={searchProduct} className="bg-green-500 hover:bg-green-600">
          Search
        </Button>
      </div>
    </div>
  );
}
