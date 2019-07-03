import {Component, OnInit} from '@angular/core';
import {BackgroundImage, BackgroundImageService} from '../../service/background-image-service/background-image.service';

@Component({
  templateUrl: './login.layout.html',
  styleUrls: ['./login.layout.scss']
})
export class LoginLayoutComponent implements OnInit {

  backgroundImage: BackgroundImage;

  constructor(private backgroundImageService: BackgroundImageService) {}

  ngOnInit(): void {
    this.backgroundImage = this.backgroundImageService.randomBackgroundImage();
  }

}
