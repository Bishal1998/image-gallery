"use client";

import { ModeToggle } from "@/components/DarkMode";
import ImageCard from "@/components/ImageCard";
import Loading from "@/components/Loading";
import SearchBar from "@/components/SearchBar";
import fetchImages from "@/server";
import { Photo } from "@/type";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";

interface PhotoType {
  total: number;
  total_pages: number;
  results: Photo[];
}

const Home = () => {
  const [search, setSearch] = useState("");
  const [value] = useDebounce(search, 300);
  const sentinelRef = useRef(null);

  const { isLoading, data, hasNextPage, fetchNextPage } = useInfiniteQuery<
    PhotoType,
    Error
  >({
    queryKey: ["photos", value],
    queryFn: ({ pageParam = 1 }) => fetchImages(pageParam as number, value),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return nextPage <= lastPage.total_pages ? nextPage : undefined;
    },
  });

  useEffect(() => {
    if (!hasNextPage) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        fetchNextPage();
      }
    });

    const currentSentinelRef = sentinelRef.current;

    if (currentSentinelRef) {
      observer.observe(currentSentinelRef);
    }

    return () => {
      if (currentSentinelRef) {
        observer.unobserve(currentSentinelRef);
      }
    };
  }, [hasNextPage, fetchNextPage]);

  const photos = data?.pages.flatMap((page) => page.results);

  return (
    <main className="flex text-black flex-col gap-3 relative bg-white dark:bg-black dark:text-white min-h-screen">
      <nav className="px-5 bg-white z-10 dark:bg-black py-4 flex gap-3 justify-between items-center sticky top-0">
        <h2 className="text-transparent bg-clip-text font-bold text-3xl whitespace-nowrap bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          Image Gallery
        </h2>
        <SearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="hidden md:flex"
        />
        <ModeToggle />
      </nav>
      <div className="px-5 md:hidden">
        <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {isLoading ? (
        <Loading />
      ) : photos && photos.length < 1 ? (
        <p className="mx-auto text-center text-gray-400 text-sm">
          No Image Found
        </p>
      ) : (
        <div className="columns-1 md:columns-2 xl:columns-4 gap-4 p-3">
          {photos?.map((photo) => {
            return <ImageCard key={photo.id} photo={photo} />;
          })}
        </div>
      )}

      {hasNextPage && (
        <div ref={sentinelRef} className="mx-auto">
          <Loading />
        </div>
      )}
    </main>
  );
};

export default Home;
