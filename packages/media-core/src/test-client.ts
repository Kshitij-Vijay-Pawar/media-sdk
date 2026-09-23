import { createMediaClient } from "./client";

const client = createMediaClient({
  apiKey: process.env.PEXELS_API_KEY || "",
});

console.log("1. Searching Photos...");
const photos = await client.searchPhotos("nature", { page: 1, perPage: 2 });
console.log(`Photos found: ${photos.data.length}, total: ${photos.totalResults}, first photo: ${photos.data[0]?.photographer}`);

console.log("2. Searching Videos...");
const videos = await client.searchVideos("nature", { page: 1, perPage: 2 });
console.log(`Videos found: ${videos.data.length}, total: ${videos.totalResults}, first video: ${videos.data[0]?.user.name}`);

console.log("3. Getting Curated Photos...");
const curated = await client.getCuratedPhotos({ page: 1, perPage: 2 });
console.log(`Curated photos: ${curated.data.length}`);

console.log("4. Getting Popular Videos...");
const popular = await client.getPopularVideos({ page: 1, perPage: 2 });
console.log(`Popular videos: ${popular.data.length}`);

if (photos.data[0]?.id) {
  console.log(`5. Getting Photo ${photos.data[0].id}...`);
  const photo = await client.getPhoto(photos.data[0].id);
  console.log(`Photo detail: ${photo.alt} by ${photo.photographer}`);
}

if (videos.data[0]?.id) {
  console.log(`6. Getting Video ${videos.data[0].id}...`);
  const video = await client.getVideo(videos.data[0].id);
  console.log(`Video detail: ${video.duration}s by ${video.user.name}`);
}

console.log("7. Emitting events...");
client.emit("view", { mediaType: "photo", id: photos.data[0]?.id ?? 1, timestamp: Date.now() });
client.emit("download", { mediaType: "photo", id: photos.data[0]?.id ?? 1, url: photos.data[0]?.url ?? "", timestamp: Date.now() });

console.log("All manual verification checks passed!");