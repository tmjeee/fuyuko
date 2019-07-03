import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule, Provider} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LoginPageComponent} from './page/login-page/login.page';
import {Theme, ThemeService} from './service/theme-service/theme.service';
import {LoginLayoutComponent} from './layout/login-layout/login.layout';
import {AppMaterialsModule} from './app-materials.module';
import {BackgroundImageService} from './service/background-image-service/background-image.service';
import {RegisterPageComponent} from './page/register-page/register.page';
import {GenLayoutComponent} from './layout/gen-layout/gen.layout';
import {BulkEditPageComponent} from './page/bulk-edit-page/bulk-edit.page';
import {ClonePageComponent} from './page/clone-page/clone.page';
import {HelpCenterPageComponent} from './page/help-center-page/help-center.page';
import {ProfilePageComponent} from './page/profile-page/profile.page';
import {SettingsPageComponent} from './page/settings-page/settings.page';
import {FileNotFoundPageComponent} from './page/file-not-found-page/file-not-found.page';
import {BulkEditHelpPageComponent} from './page/bulk-edit-help-page/bulk-edit-help.page';
import {CloneHelpPageComponent} from './page/clone-help-page/clone-help.page';
import {HelpCenterHelpPageComponent} from './page/help-center-help-page/help-center-help.page';
import {ProfileHelpPageComponent} from './page/profile-help-page/profile-help.page';
import {SettingsHelpPageComponent} from './page/settings-help-page/settings-help.page';
import {UserHelpPageComponent} from './page/user-help-page/user-help.page';
import {ViewHelpPageComponent} from './page/view-help-page/view-help.page';
import {ImportExportPageComponent} from './page/import-export-page/import-export.page';
import {ImportExportHelpPageComponent} from './page/import-export-help-page/import-export-help.page';
import {NotificationComponent} from './component/notification-component/notification.component';
import {NotificationDialogComponent} from './component/notification-component/notification-dialog.component';
import {OverlayContainer} from '@angular/cdk/overlay';
import {AvatarComponent} from './component/avatar-component/avatar.component';
import {AvatarDialogComponent} from './component/avatar-component/avatar-dialog.component';
import {AvatarService} from './service/avatar-service/avatar.service';
import {AngularFileUploaderModule} from 'angular-file-uploader';
import {NotificationAnimationType, SimpleNotificationsModule} from 'angular2-notifications';
import {ProfileInfoComponent} from './component/profile-info-component/profile-info.component';
import {PasswordComponent} from './component/password-component/password.component';
import {UserRolePageComponent} from './page/user-role-page/user-role.page';
import {UserGroupPageComponent} from './page/user-group-page/user-group.page';
import {UserPeoplePageComponent} from './page/user-people-page/user-people.page';
import {SideNavComponent} from './component/side-nav-component/side-nav.component';
import {UserLayoutComponent} from './layout/user-gen-layout/user-gen.layout';
import {HelpCenterLayoutComponent} from './layout/help-center-gen-layout/help-center-gen.layout';
import {ImportExportLayoutComponent} from './layout/import-export-gen-layout/import-export-gen.layout';
import {PricingLayoutComponent} from './layout/pricing-gen-layout/pricing-gen.layout';
import {ViewLayoutComponent} from './layout/view-gen-layout/view-gen.layout';
import {PricingHelpPageComponent} from './page/pricing-help-page/pricing-help.page';
import {PricingPageComponent} from './page/pricing-page/pricing.page';
import {DashboardLayoutComponent} from './layout/dashboard-layout/dashboard.layout';
import {DashboardPageComponent} from './page/dashboard-page/dashboard.page';
import {UserManagementService} from './service/user-management-service/user-management.service';
import {GroupTableComponent} from './component/group-table-component/group-table.component';
import {UserTableComponent} from './component/user-table-component/user-table.component';
import {SendInviteComponent} from './component/send-invite-component/send-invite.component';
import {UserSearchTableComponent} from './component/user-search-table-component/user-search-table.component';
import {ViewAttributesPageComponent} from './page/view-attributes-page/view-attributes.page';
import {ViewDataTabularPageComponent} from './page/view-data-tabular-page/view-data-tabular.page';
import {ViewDataThumbnailPageComponent} from './page/view-data-thumbnail-page/view-data-thumbnail.page';
import {ViewDataListPageComponent} from './page/view-data-list-page/view-data-list.page';
import {ViewRulesPageComponent} from './page/view-rules-page/view-rules.page';
import {ViewViewsPageComponent} from './page/view-views-page/view-views.page';
import {ViewService} from './service/view-service/view.service';
import {AuthService} from './service/auth-service/auth.service';
import {AuthGuard} from './guard/auth-guard/auth.guard';
import {AppNotification} from './model/notification.model';
import {AppNotificationService} from './service/app-notification-service/app-notification.service';
import {AttributeTableComponent} from './component/attribute-table-component/attribute-table.component';
import {EditAttributeDialogComponent} from './component/attribute-table-component/edit-attribute-dialog.component';
import {AttributeService} from './service/attribute-service/attribute.service';
import {AttributeTableModule} from './component/attribute-table-component/attribute-table.module';
import {DataTableModule} from './component/data-table-component/data-table.module';
import {ItemService} from './service/item-service/item.service';
import {DataEditorModule} from './component/data-editor-component/data-editor.module';
import {AmazingTimePickerModule} from 'amazing-time-picker';
import {DateAdapter} from '@angular/material';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {ItemSearchComponent} from './component/item-search-component/item-search.component';
import {ItemSearchModule} from './component/item-search-component/item-search.module';
import {RuleService} from './service/rule-service/rule.service';
import {RulesModule} from './component/rules-component/rules.module';
import {CounterService} from './service/counter-service/counter.service';
import {DataThumbnailModule} from './component/data-thumbnail-component/data-thumbnail.module';
import {DataListModule} from './component/data-list-component/data-list.module';
import {CarouselComponent} from './component/carousel-component/carousel.component';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {ProfilingInterceptor} from './interceptor/profiling.interceptor';

@NgModule({
  declarations: [
    AppComponent,

    // layouts
    LoginLayoutComponent,
    DashboardLayoutComponent,
    GenLayoutComponent,
    UserLayoutComponent,
    HelpCenterLayoutComponent,
    ImportExportLayoutComponent,
    PricingLayoutComponent,
    ViewLayoutComponent,

    // pages
    LoginPageComponent,
    DashboardPageComponent,
    RegisterPageComponent,
    BulkEditPageComponent,
    BulkEditHelpPageComponent,
    ClonePageComponent,
    CloneHelpPageComponent,
    HelpCenterPageComponent,
    HelpCenterHelpPageComponent,
    ProfilePageComponent,
    ProfileHelpPageComponent,
    SettingsPageComponent,
    SettingsHelpPageComponent,
    UserRolePageComponent,
    UserGroupPageComponent,
    UserPeoplePageComponent,
    UserHelpPageComponent,
    ViewHelpPageComponent,
    ImportExportPageComponent,
    ImportExportHelpPageComponent,
    PricingPageComponent,
    PricingHelpPageComponent,
    FileNotFoundPageComponent,
    ViewAttributesPageComponent,
    ViewDataTabularPageComponent,
    ViewDataThumbnailPageComponent,
    ViewDataListPageComponent,
    ViewRulesPageComponent,
    ViewViewsPageComponent,

    // components
    NotificationComponent,
    NotificationDialogComponent,
    AvatarComponent,
    AvatarDialogComponent,
    ProfileInfoComponent,
    PasswordComponent,
    SideNavComponent,
    GroupTableComponent,
    UserTableComponent,
    UserSearchTableComponent,
    SendInviteComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    AppMaterialsModule,
    AngularFileUploaderModule,
    SimpleNotificationsModule.forRoot({
      position: ['bottom', 'center'],
      timeOut: 2000,
      showProgressBar: true,
      pauseOnHover: true,
      lastOnBottom: true,
      clickToClose: true,
      clickIconToClose: true,
      maxLength: 0,
      theClass: 'message-toast',
      animate: NotificationAnimationType.Fade
    }),

    AttributeTableModule,
    DataTableModule,
    DataEditorModule,
    ItemSearchModule,
    RulesModule,
    DataThumbnailModule,
    DataListModule,
  ],
  providers: [
    {provide: ThemeService, useClass: ThemeService} as Provider,
    {provide: BackgroundImageService, useClass: BackgroundImageService} as Provider,
    {provide: AppNotificationService, useClass: AppNotificationService} as Provider,
    {provide: AvatarService, useClass: AvatarService} as Provider,
    {provide: UserManagementService, useClass: UserManagementService} as Provider,
    {provide: ViewService, useClass: ViewService} as Provider,
    {provide: AuthService, useClass: AuthService} as Provider,
    {provide: AuthGuard, useClass: AuthGuard} as Provider,
    {provide: AttributeService, useClass: AttributeService} as Provider,
    {provide: ItemService, useClass: ItemService} as Provider,
    {provide: RuleService, useClass: RuleService} as Provider,
    {provide: CounterService, useClass: CounterService} as Provider,
    {provide: DateAdapter, useClass: MomentDateAdapter} as Provider,
    {provide: HTTP_INTERCEPTORS, useClass: ProfilingInterceptor, multi: true} as Provider,
  ],
  entryComponents: [
    NotificationDialogComponent,
    AvatarDialogComponent,
    EditAttributeDialogComponent,
  ],
  exports: [
    CarouselComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

