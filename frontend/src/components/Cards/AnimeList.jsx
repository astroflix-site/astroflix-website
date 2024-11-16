// src/components/AnimeList.js
import React from 'react';
import AnimeCard from './AnimeCard';

const AnimeList = () => {
  const animes = [
    {
      title: 'Attack on Titan',
      image: 'https://m.media-amazon.com/images/I/91Ku3tlF7JL._SY466_.jpg',
    },
    {
      title: 'My Hero Academia',
      image: 'https://m.media-amazon.com/images/S/pv-target-images/9d66851d058d34d496a877ea4b4a3d40ba2d48002f7d145b8bdfdf14655e0e5e._BR-6_AC_SX720_FMwebp_.jpg',
    },
    {
      title: 'Demon Slayer',
      image: 'https://assets-prd.ignimgs.com/2021/10/14/demonslayer-art-1634244394273.png?width=300&auto=webp',
    },
    {
      title: 'Jujutsu Kaisen',
      image: 'https://resizing.flixster.com/0gFSwzxQ_iBl9YVkK8OlOcb47sM=/206x305/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p19249827_b_v8_aa.jpg',
    },
    {
      title: 'Classroom Of the elite',
      image: 'https://upload.wikimedia.org/wikipedia/en/5/52/Y%C5%8Dkoso_Jitsuryoku_Shij%C5%8D_Shugi_no_Ky%C5%8Dshitsu_e%2C_Volume_1.jpg',
    },
    {
      title: 'Vinland Saga',
      image: 'https://resizing.flixster.com/gXsp6kkBBTrWGNgEqw29Cf_0kwg=/206x305/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p17127060_b_v8_aa.jpg',
    },
    {
      title: 'Deathnote',
      image: 'https://i0.wp.com/dmtalkies.com/wp-content/uploads/2021/01/Death-Note-Light-L-and-Ryuk-Cropped-compressed.jpg?resize=696%2C348&ssl=1',
    },
    {
      title: 'Shangri-La-Frontier',
      image: 'https://animetv-jp.net/wp-content/uploads/2024/03/IMG_8605-1-scaled-e1711873668751-696x391.jpg',
    },
    {
      title: 'Mushoku Tensei Reincarnation',
      image: 'https://m.media-amazon.com/images/I/91ygGK5PTfL._SY466_.jpg',
    },
    // Add more anime objects as needed
  ];

  return (
    <div className="flex  gap-2">
      {animes.map((anime, index) => (
        <AnimeCard
          key={index}
          title={anime.title}
          image={anime.image}
        />
      ))}
    </div>
  );
};

export default AnimeList;