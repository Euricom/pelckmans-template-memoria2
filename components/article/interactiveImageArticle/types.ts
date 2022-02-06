import { IInteractiveImage } from '../../../utils/service/types';

export interface ImageArticleProps {
  alt: string;
  src: string;
  caption: string;
  id: string | number;
  isInteractiveImage: boolean;
  interactiveImage?: IInteractiveImage;
}
