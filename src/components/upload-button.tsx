"use client";

import { Button } from "./ui/button";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { getToken } from "../actions/cookies";
import { env } from "../env";
import { MultiDialog } from "./multi-dialog";
import { Dropzone } from "./ui/dropzone";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const formSchema = z.object({
  file_name: z.string().min(1),
  description: z.string().optional(),
  file_type: z.enum(["QUERY", "MASTER"]),
});

type FileInfo = {
  url: string;
  filename: string;
};

export default function UploadButton() {
  const [file, setFile] = useState<FileInfo>({ filename: "", url: "" });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  type Modals = "drop_file" | "info";

  useEffect(() => {
    form.setValue("file_name", file.filename);
  }, [file]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const token = await getToken();
    const body = new FormData();

    body.append("file_name", values.file_name);
    body.append("file_type", values.file_type);
    body.append("description", values.description);

    const data = await axios
      .post(env.NEXT_PUBLIC_API + "/files", body, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => response.data)
      .catch((error) => {
        console.log(error);
      });

    const fileData = await axios
      .get(file.url)
      .then((response) => response.data);

    const fileBody = new FormData();
    fileBody.append("key", data.upload_detail.fields.key);
    fileBody.append("AWSAccessKeyId", data.upload_detail.fields.AWSAccessKeyId);
    fileBody.append("policy", data.upload_detail.fields.policy);
    fileBody.append("signature", data.upload_detail.fields.signature);
    fileBody.append("file", fileData);

    await axios
      .post(data.upload_detail.url, fileBody, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => response.data)
      .catch((error) => toast(error));

    await axios
      .patch(
        env.NEXT_PUBLIC_API + "/files/" + data.file_id,
        {},
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        },
      )
      .then((response) => toast("Uploaded successfully"))
      .catch((error) => toast(error));
  }

  return (
    <MultiDialog<Modals>>
      {(mdb) => (
        <>
          <mdb.Trigger value="drop_file">
            <Button size="sm" className="ml-2 px-4">
              Upload
            </Button>
          </mdb.Trigger>
          <mdb.Container value="drop_file">
            <Dialog>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Upload</DialogTitle>
                  <DialogDescription>
                    Upload file into the system.
                  </DialogDescription>
                </DialogHeader>
                <Dropzone
                  onChange={setFile}
                  fileExtension={["txt", "csv"]}
                  className="h-32"
                />
                <DialogFooter className="sm:justify-between">
                  <DialogClose asChild>
                    <Button type="button" variant="link">
                      Close
                    </Button>
                  </DialogClose>
                  <mdb.Trigger value="info">
                    <Button type="button" disabled={file.filename == ""}>
                      Next
                    </Button>
                  </mdb.Trigger>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </mdb.Container>
          <mdb.Container value="info">
            <Dialog>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Upload</DialogTitle>
                  <DialogDescription>
                    Upload file into the system.
                  </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid gap-4 py-4">
                      <FormField
                        control={form.control}
                        name="file_name"
                        defaultValue={file.filename}
                        render={({ field }) => (
                          <FormItem className="grid grid-cols-4 items-center gap-4">
                            <FormLabel
                              htmlFor="file_name"
                              className="text-right"
                            >
                              Filename
                            </FormLabel>
                            <div className="col-span-3">
                              <FormControl>
                                <Input
                                  id="file_name"
                                  onChange={(e) =>
                                    setFile({
                                      filename: e.target.value,
                                      url: file.url,
                                    })
                                  }
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="file_type"
                        render={({ field }) => (
                          <FormItem className="grid grid-cols-4 items-center gap-4">
                            <FormLabel className="text-right">
                              Data Type
                            </FormLabel>
                            <div className="col-span-3">
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="col-span-3 w-full">
                                    <SelectValue placeholder="Select data type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="col-span-3">
                                  <SelectItem value="QUERY">
                                    Query Data
                                  </SelectItem>
                                  <SelectItem value="MASTER">
                                    Master Data
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem className="grid grid-cols-4 items-center gap-4">
                            <FormLabel
                              htmlFor="description"
                              className="text-right"
                            >
                              Description
                            </FormLabel>
                            <FormControl>
                              <div className="col-span-3">
                                <Input
                                  placeholder="Type your file description here."
                                  id="description"
                                  className="col-span-3"
                                  {...field}
                                />
                                <FormMessage />
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <DialogFooter className="sm:justify-between">
                      <mdb.Trigger value="info">
                        <Button
                          type="button"
                          variant="link"
                          onClick={() => setFile({ filename: "", url: "" })}
                        >
                          Back
                        </Button>
                      </mdb.Trigger>
                      <DialogClose asChild>
                        <Button type="submit">Submit</Button>
                      </DialogClose>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </mdb.Container>
        </>
      )}
    </MultiDialog>
  );
}
