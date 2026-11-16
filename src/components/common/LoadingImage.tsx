import { useState } from 'react';
import Image, { type ImageProps } from 'next/image';

type Props = Omit<ImageProps, 'onLoad' | 'onError' | 'placeholder'> & {
  containerClassName?: string;
};

export default function LoadingImage({ containerClassName = '', className = '', alt, ...imageProps }: Props) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={`relative overflow-hidden ${containerClassName}`}
      style={!imageProps.fill ? { width: imageProps.width, height: imageProps.height } : undefined}
    >
      {!loaded && !failed && <div className="absolute inset-0 animate-pulse bg-gray-200" />}
      {failed && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-center text-xs text-gray-500">
          Imagem indisponível
        </div>
      )}
      <Image
        {...imageProps}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={`${className} transition-opacity duration-300 ${loaded && !failed ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
}
