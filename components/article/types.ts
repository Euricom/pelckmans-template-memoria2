import { ReactNode } from 'react';

export interface ArticleProps {
  children: ReactNode;
  icon?: 'watch';
  size?: '1/4' | '2/4' | '3/4' | '4/4';
  title?: ReactNode;
}