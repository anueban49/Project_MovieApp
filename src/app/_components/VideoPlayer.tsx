"use client";
interface VideoPlayerprops {
  videoKey: string;
  title: string;
}

export function VideoPlayer({ videoKey, title }: VideoPlayerprops) {
  return (
    <div>
      <iframe
        width="90%"
        height="400px"
        src={`https://youtube.com/embed/${videoKey}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
