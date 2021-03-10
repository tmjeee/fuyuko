
export type GlobalAvatarName = 'avatar-01.png' | 'avatar-02.png' | 'avatar-03.png' | 'avatar-04.png' | 'avatar-05,png' |
    'avatar-06.png' | 'avatar-07.png' | 'avatar-08.png' | 'avatar-09.png' | string;

export interface GlobalAvatar {
  id: number;
  name: GlobalAvatarName;
  mimeType: string;
  size: number;
}


export interface UserAvatar {
    global: boolean;
    name: string;
    mimeType: string;
    size: number;
    id: number
}
