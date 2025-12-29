"use client";

import { useState } from "react";
import Image from "next/image";
import type { Video } from "@/core/logic/getShorts";

interface ShortsGridProps {
  videos: Video[];
}

export function ShortsGrid({ videos }: ShortsGridProps) {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const openModal = (videoId: string) => {
    setSelectedVideo(videoId);
  };

  const closeModal = () => {
    setSelectedVideo(null);
  };

  return (
    <>
      <div className="shorts-grid">
        {videos.map((video) => (
          <div
            key={video.id}
            className="short-card cursor-pointer"
            onClick={() => openModal(video.id)}
          >
            <div className="short-video-wrapper">
              <Image
                src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                alt={video.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 420px"
              />
            </div>
            <p className="short-title">{video.title}</p>
          </div>
        ))}
      </div>

      {/* 모달 */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-[420px] aspect-[9/16] bg-black rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 flex items-center justify-center w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
              aria-label="닫기"
            >
              ✕
            </button>
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${selectedVideo}`}
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
      )}
    </>
  );
}

