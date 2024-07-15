import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { type Item } from "@/server/db/schemas";
import { useEffect, useState } from "react";

import { TrashIcon } from "@radix-ui/react-icons";

const API_URL = "http://localhost:3000/api";

type UploadFileProps = {
  form: UseFormReturn<Item>;
};

export default function UploadFile({ form }: UploadFileProps) {
  const [file, setFile] = useState<File | null>(null);
  const [filename, setFileName] = useState("");
  useEffect(() => {
    if (form.formState.isSubmitSuccessful && file) {
      setFile(null);
    }
  }, [form.formState.isSubmitSuccessful]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      if (!selectedFile) return;
      setFile(selectedFile);
      const formData = new FormData();
      formData.append("file", selectedFile);

      fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.filename) {
            setFileName(data.filename);
            form.setValue("imageUrl", `${API_URL}/public/${data.filename}`);
          }
          console.log("Response from server: ", data);
        });

      console.log(file);
    }
  };

  const handleImageDelete = () => {
    console.log("deleting file, ", filename);
    fetch(`${API_URL}/upload/${filename}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          form.setValue("imageUrl", "");
          setFile(null);
        }
      });
  };

  if (file) {
    return (
      <div className="relative">
        <div className="absolute right-1 top-0">
          <TrashIcon
            className="size-10 text-red-400"
            onClick={handleImageDelete}
          />
        </div>
        <img src={URL.createObjectURL(file)} />
      </div>
    );
  }
  return (
    <div>
      <FormField
        control={form.control}
        name="imageUrl"
        render={() => (
          <FormItem>
            <FormLabel>Image</FormLabel>
            <FormControl>
              <Input
                accept="image/gif, image/jpeg, image/png"
                type="file"
                placeholder="type here..."
                onChange={handleFileUpload}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
