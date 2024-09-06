"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);
  if (error.message === "UNAUTHORIZED") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
        <div className="rounded-lg bg-card p-8 text-card-foreground shadow-md">
          <h1>UNAUTHORIZED</h1>
          <p className="mb-4 text-sm text-muted-foreground">
            Please sign in to view the content
          </p>
          <a href="/login">
            <Button>Login</Button>
          </a>
        </div>
      </div>
    );
  }
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
      <div className="rounded-lg bg-card p-8 text-card-foreground shadow-md">
        <h1 className="mb-4 text-2xl font-bold">Something went wrong!</h1>
        <p className="mb-2">
          {error.message ?? "An unexpected error occurred."}
        </p>
        {error.digest && (
          <p className="mb-4 text-sm text-muted-foreground">
            Error Digest: {error.digest}
          </p>
        )}
        <Button onClick={() => reset()}>Try again</Button>
      </div>
    </div>
  );
}
