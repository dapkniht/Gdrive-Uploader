import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { Loader2Icon } from "lucide-react";
import api from "@/lib/axios";
import type { AxiosError } from "axios";

const Uploader = () => {
  const [url, setUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async () => {
    if (!url) {
      toast.error("URL cannot be empty");
      return;
    }

    setIsUploading(true);

    try {
      await api.post("/upload", { url });

      toast.success("Upload started! Check the jobs menu to see the progress.");
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;

      const errorMessage =
        err.response?.data?.message || err.message || "Upload failed";
      console.log(errorMessage);

      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="py-20 px-4 text-center space-y-6">
      <h1 className="text-4xl font-bold">Upload Files to Google Drive</h1>
      <p className="max-w-xl mx-auto">
        Enter the file URL and upload it directly to your Google Drive account.
        The process is fast, easy, and secure.
      </p>

      <div className="flex justify-center items-center gap-2 max-w-md mx-auto">
        <Input
          placeholder="Paste file URL here..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <Button
          onClick={handleSubmit}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold cursor-pointer"
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <Loader2Icon className="animate-spin mr-2" />
              Uploading...
            </>
          ) : (
            "Upload"
          )}
        </Button>
      </div>
    </div>
  );
};

export default Uploader;
