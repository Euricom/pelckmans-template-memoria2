export interface IInteractiveImage {
  points: IInteractiveImagePoints;
}
export type IInteractiveImagePoints = {
  [pointKey: string]: {
    x: string;
    y: string;
    xPercentage: string;
    yPercentage: string;
    metaData: { tooltip: string };
  };
};
export type ICollection = {
  body: string;
  filename: string;
  meta: IMeta;
};
export type IImage = {
  description: string;
  image: string;
  interactiveImage: IInteractiveImage;
};
export type IArticle = {
  title: string;
  body: string;
  images: IImage[];
  icon_type: IIconType;
};
export type IIconType = 'read' | 'watch';
export type IMeta = {
  [key: string]: string | null | boolean | IArticle[];
};
export type IFileName = { params: { slug: string } };
export type FileOrFolder = 'file' | 'folder';
export type AllowedFormats = 'md' | 'json';
