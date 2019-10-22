import {Injectable} from '@angular/core';
import * as numeral from 'numeral';

export interface BackgroundImage {
  name: string;
  file: string;
  location: string;
}

const total = 11;
const ALL: BackgroundImage[] = [
  { name: 'background-01', file: 'background-01.jpg', location: '/assets/images/login-background/background-01.jpg'} as BackgroundImage,
  { name: 'background-02', file: 'background-02.jpg', location: '/assets/images/login-background/background-02.jpg'} as BackgroundImage,
  { name: 'background-03', file: 'background-03.jpg', location: '/assets/images/login-background/background-03.jpg'} as BackgroundImage,
  { name: 'background-04', file: 'background-04.jpg', location: '/assets/images/login-background/background-04.jpg'} as BackgroundImage,
  { name: 'background-05', file: 'background-05.jpg', location: '/assets/images/login-background/background-05.jpg'} as BackgroundImage,
  { name: 'background-06', file: 'background-06.jpg', location: '/assets/images/login-background/background-06.jpg'} as BackgroundImage,
  { name: 'background-07', file: 'background-07.jpg', location: '/assets/images/login-background/background-07.jpg'} as BackgroundImage,
  { name: 'background-08', file: 'background-08.jpg', location: '/assets/images/login-background/background-08.jpg'} as BackgroundImage,
  { name: 'background-09', file: 'background-09.jpg', location: '/assets/images/login-background/background-09.jpg'} as BackgroundImage,
  { name: 'background-10', file: 'background-10.jpg', location: '/assets/images/login-background/background-10.jpg'} as BackgroundImage,
  { name: 'background-11', file: 'background-11.jpg', location: '/assets/images/login-background/background-11.jpg'} as BackgroundImage,
];

@Injectable()
export class BackgroundImageService {

  allBackgroundImages(): BackgroundImage[] {
    return ALL;
  }

  randomBackgroundImage(): BackgroundImage {
    return ALL[Math.floor(Math.random() * (total - 1))];
  }
}
