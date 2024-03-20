"use client";
import { Photo } from "@/type";
import Image from "next/image";
import React, { useState } from "react";
import { TbCloudDownload } from "react-icons/tb";
import Loading from "./Loading";
import { Button } from "./ui/button";
import { saveAs } from "file-saver";

type Props = {
  photo: Photo;
};

export default function ImageCard({ photo }: Props) {
  return (
    <div className="relative mb-4 transition-all overflow-hidden break-inside-avoid group hover:brightness-95">
      <DownloadBtn photo={photo} />
      <Image
        width={500}
        height={500}
        src={photo?.urls?.regular}
        alt={photo?.description || "img"}
        className="w-auto h-auto max-w-full max-h-full object-contain"
      />
    </div>
  );
}

function DownloadBtn({ photo }: Props) {
  const [isDownloading, setIsDownloading] = useState(false);

  async function downloadImage(imageUrl: string, imageName: string) {
    try {
      setIsDownloading(true);
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      saveAs(blob, `${imageName}.png`);
    } catch {
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <Button
      onClick={() => downloadImage(photo?.urls?.regular, photo?.id)}
      className="bg-black/80  top-5 rounded-full hover:bg-black/50 right-5 absolute p-2 border"
    >
      {isDownloading ? (
        <Loading className="h-6 w-6" />
      ) : (
        <TbCloudDownload className="text-xl text-white " />
      )}
    </Button>
  );
}
