// src/components/AnimeList.js
import React from 'react';
import AnimeCard from './AnimeCard';
import './AnimeList.css'

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
    {
      title: 'Mushoku Tensei Reincarnation',
      image: 'https://m.media-amazon.com/images/I/91ygGK5PTfL._SY466_.jpg',
    },
    {
      title: 'Mushoku Tensei Reincarnation',
      image: 'https://m.media-amazon.com/images/I/91ygGK5PTfL._SY466_.jpg',
    },
    {
      title: 'Mushoku Tensei Reincarnation',
      image: 'https://m.media-amazon.com/images/I/91ygGK5PTfL._SY466_.jpg',
    },
    {
      title: 'Mushoku Tensei Reincarnation',
      image: 'https://m.media-amazon.com/images/I/91ygGK5PTfL._SY466_.jpg',
    }
    
  ];

  

  return (
    <div className="flex overflow-x-scroll scrollbar-hide gap-2" id="animeList">
      <button class="controls z-30 absolute top-24 left-8 w-[40px] h-[40px]" id="scrollLeft">
        <i class="prev bg-black text-white flex items-center justify-center rounded-full ri-arrow-left-line w-full h-full border-slate-500 border-2"></i>
      </button>
      
      <button class="controls z-30 absolute top-24 right-8 w-[40px] h-[40px] " id="scrollRight">
        <i class="next bg-black text-white flex items-center justify-center rounded-full ri-arrow-right-line w-full h-full border-slate-500 border-2"></i>
      </button>

      {animes.map((anime, index) => (
        <div
          className="flex-shrink-0 w-40 h-60 m-2 bg-gray-800 rounded-lg overflow-hidden border-b-4 border-blue-700"
          key={index}
        >
          <img
            src={anime.image}
            alt={anime.title}
            className="w-full h-3/4 object-cover"
          />
          <h3 className="text-white text-center mt-4 title m-2">{anime.title}</h3>
        </div>
        
      ))}
      <div className="side-shade"></div>
    </div>
  );
};

export default AnimeList;