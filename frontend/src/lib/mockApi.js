import poster1 from "../attached_assets/generated_images/cyberpunk_anime_poster.png";
import poster2 from "../attached_assets/generated_images/dark_fantasy_anime_poster.png";
import poster3 from "../attached_assets/generated_images/mecha_anime_poster.png";
import heroImg from "../attached_assets/generated_images/epic_anime_hero_banner.png";

// Mock Data
const MOCK_USER = {
  id: "user-1",
  username: "OtakuKing",
  email: "demo@aniflex.com",
  isAdmin: true,
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  bookmarks: ["1", "3"],
};

export const MOCK_ANIME = [
  {
    id: "1",
    title: "Neon Genesis: Cyber City",
    description: "In a world where humanity has merged with machines, a young hacker discovers a conspiracy that threatens to rewrite reality itself.",
    image: poster1,
    backdrop: heroImg,
    rating: 9.2,
    genre: ["Cyberpunk", "Sci-Fi", "Action"],
    year: 2024,
    status: "Ongoing",
    episodes: Array.from({ length: 12 }).map((_, i) => ({
      id: `ep-1-${i}`,
      number: i + 1,
      title: `Protocol ${i + 1}: Awakening`,
      duration: "24:00",
    })),
  },
  {
    id: "2",
    title: "Blade of the Mist",
    description: "A lone swordsman wanders through a cursed forest, seeking redemption for a sin he cannot remember.",
    image: poster2,
    backdrop: heroImg, // Reusing hero for now
    rating: 8.8,
    genre: ["Fantasy", "Action", "Supernatural"],
    year: 2023,
    status: "Completed",
    episodes: Array.from({ length: 24 }).map((_, i) => ({
      id: `ep-2-${i}`,
      number: i + 1,
      title: `Chapter ${i + 1}: The Fog`,
      duration: "23:45",
    })),
  },
  {
    id: "3",
    title: "Star Mecha: Horizon",
    description: "As the galaxy teeters on the brink of war, three pilots from different worlds must unite to pilot the legendary Horizon mecha.",
    image: poster3,
    backdrop: heroImg,
    rating: 9.5,
    genre: ["Mecha", "Space", "Sci-Fi"],
    year: 2025,
    status: "Ongoing",
    episodes: Array.from({ length: 5 }).map((_, i) => ({
      id: `ep-3-${i}`,
      number: i + 1,
      title: `Launch Sequence ${i + 1}`,
      duration: "24:10",
    })),
  },
  {
    id: "4",
    title: "Shadows of Tokyo",
    description: "Tokyo's underworld is ruled by spirits visible only to a select few. A detective must navigate this hidden world to solve his partner's murder.",
    image: poster1, // Reusing for filler
    backdrop: heroImg,
    rating: 8.5,
    genre: ["Mystery", "Supernatural", "Thriller"],
    year: 2022,
    status: "Completed",
    episodes: Array.from({ length: 13 }).map((_, i) => ({
      id: `ep-4-${i}`,
      number: i + 1,
      title: `Case File ${i + 1}`,
      duration: "22:50",
    })),
  },
];

// Mock API Functions (Simulating delays)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function login(email, pass) {
  await delay(800);
  if (email === "demo@aniflex.com" && pass === "password") {
    localStorage.setItem("aniflex_token", "mock-token");
    return true;
  }
  throw new Error("Invalid credentials");
}

export async function register(username, email, pass) {
  await delay(800);
  localStorage.setItem("aniflex_token", "mock-token");
  return true;
}

export async function logout() {
  await delay(200);
  localStorage.removeItem("aniflex_token");
}

export async function checkCookie() {
  await delay(200);
  return !!localStorage.getItem("aniflex_token");
}

export async function getUserDetails() {
  await delay(400);
  return MOCK_USER;
}

export async function getTrendingAnime() {
  await delay(500);
  return MOCK_ANIME;
}

export async function getLatestUploads() {
  await delay(500);
  return [...MOCK_ANIME].reverse();
}

export async function searchPlaylists(query) {
  await delay(300);
  if (!query) return [];
  return MOCK_ANIME.filter((a) =>
    a.title.toLowerCase().includes(query.toLowerCase())
  );
}

export async function getAnimeById(id) {
  await delay(400);
  return MOCK_ANIME.find((a) => a.id === id);
}

export async function getBookmarks(userId) {
  await delay(500);
  return MOCK_ANIME.filter((a) => MOCK_USER.bookmarks.includes(a.id));
}

// Admin API
export async function getAllUsers() {
  await delay(500);
  return [
    MOCK_USER,
    { id: "u2", username: "AnimeFan2024", email: "fan@test.com", isAdmin: false, avatar: "", bookmarks: [] },
    { id: "u3", username: "Viewer99", email: "view@test.com", isAdmin: false, avatar: "", bookmarks: [] }
  ]
}
