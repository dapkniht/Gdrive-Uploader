import type { Job } from "@/types/job";
import { useEffect, useState } from "react";

const useEventSource = (url: string) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const sse = new EventSource(url);

    sse.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        setJobs(data);
      } catch {
        setError(true);
      }
    };

    sse.onerror = (err) => {
      console.error("SSE connection error:", err);
    };

    return () => {
      sse.close();
    };
  }, [url]);

  return { jobs, error };
};

export default useEventSource;
