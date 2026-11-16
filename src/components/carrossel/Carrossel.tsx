import { register } from 'swiper/element/bundle';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade } from 'swiper/modules';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { isMobile } from 'react-device-detect'; // Verifica dispositivo mobile
import Image from 'next/image';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

register();

const dataDesktop = [
    { id: '1', image: 'https://i.imgur.com/JvCUg14.png' },
    { id: '2', image: 'https://i.imgur.com/7XYmoly.png' },
    { id: '3', image: 'https://i.imgur.com/JY1W4kL.png' },
];

const dataMobile = [
    { id: '1', image: 'https://i.imgur.com/E2D9Qgp.png' },
    { id: '2', image: 'https://i.imgur.com/wLRumG5.png' },
    { id: '3', image: 'https://i.imgur.com/5YRiKlW.png' },
];

export default function Carrossel() {
    const router = useRouter();
    const [isMobileDevice, setIsMobileDevice] = useState(false);

    useEffect(() => {
      // Verifica se o dispositivo é mobile
      setIsMobileDevice(isMobile);
    }, []);

    const handleSlideClick = () => {
        // Redireciona para a tela dos planos de assinatura
        router.push('/clube/home');
    };

    return (
        <div className=''>
            <Swiper
                modules={[EffectFade]}
                effect={'fade'}
                loop={true}
                slidesPerView={1}
                pagination={{ clickable: true }}
                navigation={true}
            >
                {isMobileDevice ? dataMobile.map((item) => (
                    <SwiperSlide 
                        className='px-0' 
                        key={item.id}
                        onClick={handleSlideClick} // Adiciona o clique para redirecionar
                    >
                        <div className="">
                            <Image
                                src={item.image}
                                alt='Slider'
                                width={1920}
                                height={600}
                                priority={item.id === '1'}
                                sizes="100vw"
                                className='w-full h-auto object-contain cursor-pointer'
                            />
                        </div>
                    </SwiperSlide>
                )) : dataDesktop.map((item) => (
                    <SwiperSlide 
                        className='px-0' 
                        key={item.id}
                        onClick={handleSlideClick} // Adiciona o clique para redirecionar
                    >
                        <div className="">
                            <Image
                                src={item.image}
                                alt='Slider'
                                width={1920}
                                height={600}
                                priority={item.id === '1'}
                                sizes="100vw"
                                className='w-full h-auto object-contain cursor-pointer'
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
