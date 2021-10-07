import {Component, Input, OnInit} from '@angular/core';

const weather = [
    '/assets/images/spaceholder/weather/001.svg',
    '/assets/images/spaceholder/weather/002.svg',
    '/assets/images/spaceholder/weather/003.svg',
    '/assets/images/spaceholder/weather/004.svg',
    '/assets/images/spaceholder/weather/005.svg',
    '/assets/images/spaceholder/weather/006.svg',
    '/assets/images/spaceholder/weather/007.svg',
    '/assets/images/spaceholder/weather/008.svg',
    '/assets/images/spaceholder/weather/009.svg',
    '/assets/images/spaceholder/weather/010.svg',
    '/assets/images/spaceholder/weather/011.svg',
    '/assets/images/spaceholder/weather/012.svg',
    '/assets/images/spaceholder/weather/013.svg',
    '/assets/images/spaceholder/weather/014.svg',
    '/assets/images/spaceholder/weather/015.svg',
    '/assets/images/spaceholder/weather/016.svg',
    '/assets/images/spaceholder/weather/017.svg',
    '/assets/images/spaceholder/weather/018.svg',
    '/assets/images/spaceholder/weather/019.svg',
    '/assets/images/spaceholder/weather/020.svg',
    '/assets/images/spaceholder/weather/021.svg',
    '/assets/images/spaceholder/weather/022.svg',
    '/assets/images/spaceholder/weather/023.svg',
    '/assets/images/spaceholder/weather/024.svg',
    '/assets/images/spaceholder/weather/025.svg',
    '/assets/images/spaceholder/weather/026.svg',
    '/assets/images/spaceholder/weather/027.svg',
    '/assets/images/spaceholder/weather/028.svg',
    '/assets/images/spaceholder/weather/029.svg',
    '/assets/images/spaceholder/weather/030.svg',
    '/assets/images/spaceholder/weather/031.svg',
    '/assets/images/spaceholder/weather/032.svg',
    '/assets/images/spaceholder/weather/033.svg',
    '/assets/images/spaceholder/weather/034.svg',
    '/assets/images/spaceholder/weather/035.svg',
    '/assets/images/spaceholder/weather/036.svg',
    '/assets/images/spaceholder/weather/037.svg',
    '/assets/images/spaceholder/weather/038.svg',
    '/assets/images/spaceholder/weather/039.svg',
    '/assets/images/spaceholder/weather/040.svg',
    '/assets/images/spaceholder/weather/041.svg',
    '/assets/images/spaceholder/weather/042.svg',
    '/assets/images/spaceholder/weather/043.svg',
    '/assets/images/spaceholder/weather/044.svg',
    '/assets/images/spaceholder/weather/045.svg',
    '/assets/images/spaceholder/weather/046.svg',
    '/assets/images/spaceholder/weather/047.svg',
    '/assets/images/spaceholder/weather/048.svg',
    '/assets/images/spaceholder/weather/049.svg',
    '/assets/images/spaceholder/weather/050.svg',
];
const unicorn = [
    '/assets/images/spaceholder/unicorn/001.svg',
    '/assets/images/spaceholder/unicorn/002.svg',
    '/assets/images/spaceholder/unicorn/003.svg',
    '/assets/images/spaceholder/unicorn/004.svg',
    '/assets/images/spaceholder/unicorn/005.svg',
    '/assets/images/spaceholder/unicorn/006.svg',
    '/assets/images/spaceholder/unicorn/007.svg',
    '/assets/images/spaceholder/unicorn/008.svg',
    '/assets/images/spaceholder/unicorn/009.svg',
    '/assets/images/spaceholder/unicorn/010.svg',
    '/assets/images/spaceholder/unicorn/011.svg',
    '/assets/images/spaceholder/unicorn/012.svg',
    '/assets/images/spaceholder/unicorn/013.svg',
    '/assets/images/spaceholder/unicorn/014.svg',
    '/assets/images/spaceholder/unicorn/015.svg',
    '/assets/images/spaceholder/unicorn/016.svg',
    '/assets/images/spaceholder/unicorn/017.svg',
    '/assets/images/spaceholder/unicorn/018.svg',
    '/assets/images/spaceholder/unicorn/019.svg',
    '/assets/images/spaceholder/unicorn/020.svg',
    '/assets/images/spaceholder/unicorn/021.svg',
    '/assets/images/spaceholder/unicorn/022.svg',
    '/assets/images/spaceholder/unicorn/023.svg',
    '/assets/images/spaceholder/unicorn/024.svg',
    '/assets/images/spaceholder/unicorn/025.svg',
    '/assets/images/spaceholder/unicorn/026.svg',
    '/assets/images/spaceholder/unicorn/027.svg',
    '/assets/images/spaceholder/unicorn/028.svg',
    '/assets/images/spaceholder/unicorn/029.svg',
    '/assets/images/spaceholder/unicorn/030.svg',
    '/assets/images/spaceholder/unicorn/031.svg',
    '/assets/images/spaceholder/unicorn/032.svg',
    '/assets/images/spaceholder/unicorn/033.svg',
    '/assets/images/spaceholder/unicorn/034.svg',
    '/assets/images/spaceholder/unicorn/035.svg',
    '/assets/images/spaceholder/unicorn/036.svg',
    '/assets/images/spaceholder/unicorn/037.svg',
    '/assets/images/spaceholder/unicorn/038.svg',
    '/assets/images/spaceholder/unicorn/039.svg',
    '/assets/images/spaceholder/unicorn/040.svg',
    '/assets/images/spaceholder/unicorn/041.svg',
    '/assets/images/spaceholder/unicorn/042.svg',
    '/assets/images/spaceholder/unicorn/043.svg',
    '/assets/images/spaceholder/unicorn/044.svg',
    '/assets/images/spaceholder/unicorn/045.svg',
    '/assets/images/spaceholder/unicorn/046.svg',
    '/assets/images/spaceholder/unicorn/047.svg',
    '/assets/images/spaceholder/unicorn/048.svg',
    '/assets/images/spaceholder/unicorn/049.svg',
    '/assets/images/spaceholder/unicorn/050.svg',
];

const TYPES = {
    default: [...unicorn],
    unicorn,
    weather,
};

@Component({
    selector: 'app-spaceholder',
    templateUrl: './spaceholder.component.html',
    styleUrls: ['./spaceholder.component.scss']
})
export class SpaceholderComponent implements OnInit {

    @Input() type: keyof typeof TYPES = 'default';
    @Input() width = 'auto';
    @Input() height = '400px';

    imageSource!: string;

    ngOnInit(): void {
        const images = TYPES[this.type];
        const index = Math.floor(Math.random() * images.length);
        this.imageSource = images[index];
    }

}
