import {TestBed, async, ComponentFixture} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import {AppMaterialsModule} from './app-materials.module';
import {NotificationsService, SimpleNotificationsModule} from 'angular2-notifications';
import {ThemeService} from './service/theme-service/theme.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

describe('AppComoponent', () => {

  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,

        AppMaterialsModule,

        SimpleNotificationsModule.forRoot({}),
      ],
      declarations: [
        AppComponent
      ],
      providers: [
          ThemeService,
          NotificationsService,
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeDefined();
  });
});
