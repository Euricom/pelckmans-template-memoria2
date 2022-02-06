import React from 'react';
import Image from 'next/image';
import { ImageArticleProps } from './types';
import { imageLoader } from '@utils';
import { IInteractiveImagePoints } from '../../../utils/service/types';
import styleClasses from './style.module.scss';

const InteractiveImageArticle = (image: ImageArticleProps): JSX.Element | null => {
  if (!image.isInteractiveImage || !image.hasOwnProperty('interactiveImage')) {
    return null;
  }
  const points: IInteractiveImagePoints | undefined = image.interactiveImage?.points;

  return (
    <section className='p-6'>
      <div className={'image-container'} style={{ position: 'relative' }}>
        <Image
          unoptimized
          alt={image.alt}
          className='image-item'
          layout={'fill'}
          loader={() => imageLoader(image.src)}
          src={image.src}
        />
        {!!points &&
          Object.keys(points).map(key => {
            const metadata = points[key].metaData;
            return (
              <div
                key={`${key}`}
                className={styleClasses['iimg-point']}
                style={{
                  top: points[key].yPercentage,
                  left: points[key].xPercentage
                }}
                title={!!metadata ? metadata.tooltip : ''}>
                {''}
              </div>
            );
          })}
      </div>
    </section>
  );
};

export default InteractiveImageArticle;
