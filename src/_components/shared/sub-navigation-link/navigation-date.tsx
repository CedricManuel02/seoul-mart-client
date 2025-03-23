"use client";
import { formatDateWithTime } from "@/_utils/helper";
import React, { useEffect, useState } from "react";

export default function NavigationDate() {
  const [date, setDate] = useState<string>("");
  useEffect(() => {
    const intervalId = setInterval(() => {
      const date = new Date();
      setDate(formatDateWithTime(date.toString()));
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);
  return <div>{date}</div>;
}
