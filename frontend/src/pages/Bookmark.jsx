import React from 'react';
import { useSelector } from 'react-redux';
import BookmarkButton from '../components/Buttons/BookmarkButton';
import AnimeCard from '../components/Cards/AnimeCard';

const Bookmark = () => {
  // Mock list of anime content with title and image
  const animeList = [
    { 
      id: '1',
      title: 'Attack on Titan',
      image: 'https://m.media-amazon.com/images/I/91Ku3tlF7JL._SY466_.jpg',
    },
    { 
      id: '2',
      title: 'My Hero Academia',
      image: 'https://m.media-amazon.com/images/S/pv-target-images/9d66851d058d34d496a877ea4b4a3d40ba2d48002f7d145b8bdfdf14655e0e5e._BR-6_AC_SX720_FMwebp_.jpg',
    },
    {
      id: '3',
      title: 'Demon Slayer',
      image: 'https://assets-prd.ignimgs.com/2021/10/14/demonslayer-art-1634244394273.png?width=300&auto=webp',
    },
    {
      id: '4',
      title: 'Jujutsu Kaisen',
      image: 'https://resizing.flixster.com/0gFSwzxQ_iBl9YVkK8OlOcb47sM=/206x305/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p19249827_b_v8_aa.jpg',
    },
    {
      id: '5',
      title: 'Classroom Of the elite',
      image: 'https://upload.wikimedia.org/wikipedia/en/5/52/Y%C5%8Dkoso_Jitsuryoku_Shij%C5%8D_Shugi_no_Ky%C5%8Dshitsu_e%2C_Volume_1.jpg',
    },
    // Add more anime objects as needed
  ];

  // Get bookmarked anime from Redux store
  const bookmarks = useSelector(state => state.bookmarks.bookmarks);

  return (
    <div className="pt-28 min-h-screen bg-neutral-800 text-gray-300 py-12 px-6">
      <h1 className="text-2xl font-bold mb-8">Your Bookmarks</h1>
      <div className="flex  gap-6">
        {animeList.map((anime) => (
          <div
            key={anime.id}
            className="relative bg-neutral-700 rounded-lg shadow-lg p-4"
          >
            <AnimeCard title={anime.title} image={anime.image} />
            <div className="">
              <BookmarkButton contentId={anime.id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bookmark;
