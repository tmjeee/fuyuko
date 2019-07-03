import {Injectable} from '@angular/core';
import {Avatar} from '../../model/avatar.model';

const ALL_PREDEFINED_AVATARS: Avatar[] = [
  {
    url: '/assets/images/avatar/avatar-01.png',
    name: 'avatar-01.png',
    description: 'avatar-01'
  } as Avatar,
  {
    url: '/assets/images/avatar/avatar-02.png',
    name: 'avatar-02.png',
    description: 'avatar-02'
  } as Avatar,
  {
    url: '/assets/images/avatar/avatar-03.png',
    name: 'avatar-03.png',
    description: 'avatar-03'
  } as Avatar,
  {
    url: '/assets/images/avatar/avatar-04.png',
    name: 'avatar-04.png',
    description: 'avatar-04'
  } as Avatar,
  {
    url: '/assets/images/avatar/avatar-05.png',
    name: 'avatar-05.png',
    description: 'avatar-05'
  } as Avatar,
  {
    url: '/assets/images/avatar/avatar-06.png',
    name: 'avatar-06.png',
    description: 'avatar-06'
  } as Avatar,
  {
    url: '/assets/images/avatar/avatar-07.png',
    name: 'avatar-07.png',
    description: 'avatar-07'
  } as Avatar,
  {
    url: '/assets/images/avatar/avatar-08.png',
    name: 'avatar-08.png',
    description: 'avatar-08'
  } as Avatar,
  {
    url: '/assets/images/avatar/avatar-09.png',
    name: 'avatar-09.png',
    description: 'avatar-09'
  } as Avatar,
];


@Injectable()
export class AvatarService {

  allPredefinedAvatars(): Avatar[] {
    return ALL_PREDEFINED_AVATARS;
  }
}
