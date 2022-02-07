import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, ErrorHandler, NgModule, Provider} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LoginPageComponent} from './page/login-page/login.page';
import {ThemeService} from './service/theme-service/theme.service';
import {LoginLayoutComponent} from './layout/login-layout/login.layout';
import {AppMaterialsModule} from './app-materials.module';
import {BackgroundImageService} from './service/background-image-service/background-image.service';
import {RegisterPageComponent} from './page/register-page/register.page';
import {SettingsLayoutComponent} from './layout/settings-layout/settings.layout';
import {BulkEditPageComponent} from './page/bulk-edit-page/bulk-edit.page';
import {ProfilePageComponent} from './page/profile-page/profile.page';
import {SettingsPageComponent} from './page/settings-page/settings.page';
import {FileNotFoundPageComponent} from './page/file-not-found-page/file-not-found.page';
import {BulkEditHelpPageComponent} from './page/bulk-edit-help-page/bulk-edit-help.page';
import {ProfileHelpPageComponent} from './page/profile-help-page/profile-help.page';
import {SettingsHelpPageComponent} from './page/settings-help-page/settings-help.page';
import {UserHelpPageComponent} from './page/user-help-page/user-help.page';
import {ViewHelpPageComponent} from './page/view-help-page/view-help.page';
import {ImportPageComponent} from './page/import-page/import.page';
import {ImportHelpPageComponent} from './page/import-help-page/import-help.page';
import {ExportPageComponent} from './page/export-page/export.page';
import {ExportHelpPageComponent} from './page/export-help-page/export-help.page';
import {AvatarService} from './service/avatar-service/avatar.service';
import {NotificationAnimationType, Options, SimpleNotificationsModule} from 'angular2-notifications';
import {UserRolePageComponent} from './page/user-role-page/user-role.page';
import {UserGroupPageComponent} from './page/user-group-page/user-group.page';
import {UserPeoplePageComponent} from './page/user-people-page/user-people.page';
import {ProcessLayoutComponent} from './layout/process-layout/process.layout';
import {ViewLayoutComponent} from './layout/view-layout/view.layout';
import {PricingHelpPageComponent} from './page/pricing-help-page/pricing-help.page';
import {PricingStructurePageComponent} from './page/pricing-structure-page/pricing-structure.page';
import {DashboardLayoutComponent} from './layout/dashboard-layout/dashboard.layout';
import {DashboardPageComponent} from './page/dashboard-page/dashboard.page';
import {UserManagementService} from './service/user-management-service/user-management.service';
import {ViewAttributesPageComponent} from './page/view-attributes-page/view-attributes.page';
import {ViewDataTabularPageComponent} from './page/view-data-tabular-page/view-data-tabular.page';
import {ViewDataThumbnailPageComponent} from './page/view-data-thumbnail-page/view-data-thumbnail.page';
import {ViewDataListPageComponent} from './page/view-data-list-page/view-data-list.page';
import {ViewRulesPageComponent} from './page/view-rules-page/view-rules.page';
import {ViewViewsPageComponent} from './page/view-views-page/view-views.page';
import {ViewService} from './service/view-service/view.service';
import {AuthService} from './service/auth-service/auth.service';
import {AuthGuard} from './guard/auth-guard/auth.guard';
import {AppNotificationService} from './service/app-notification-service/app-notification.service';
import {AddAttributePageComponent} from './page/view-attributes-page/add-attribute.page';
import {AttributeService} from './service/attribute-service/attribute.service';
import {AttributeTableModule} from './component/attribute-table-component/attribute-table.module';
import {DataTableModule} from './component/data-table-component/data-table.module';
import {ItemService} from './service/item-service/item.service';
import {DataEditorModule} from './component/data-editor-component/data-editor.module';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {ItemSearchModule} from './component/item-search-component/item-search.module';
import {RuleService} from './service/rule-service/rule.service';
import {RulesModule} from './component/rules-component/rules.module';
import {CounterService} from './service/counter-service/counter.service';
import {DataThumbnailModule} from './component/data-thumbnail-component/data-thumbnail.module';
import {DataListModule} from './component/data-list-component/data-list.module';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {ProfilingInterceptor} from './interceptor/profiling.interceptor';
import {ErrorPageComponent} from './page/error-page/error.page';
import {GlobalErrorHandler} from './error-handler/global-error-handler.service';
import {CarouselModule} from './component/carousel-component/carousel.module';
import {ViewModule} from './component/view-component/view.module';
import {BulkEditWizardModule} from './component/bulk-edit-wizard-component/bulk-edit-wizard.module';
import {DATE_FORMAT, MAT_DATE_FORMAT} from '@fuyuko-common/model/item.model';
import {BulkEditService} from './service/bulk-edit-service/bulk-edit.service';
import {JobsPageComponent} from './page/jobs-page/jobs.page';
import {JobsHelpPageComponent} from './page/jobs-help-page/jobs-help.page';
import {JobsService} from './service/jobs-service/jobs.service';
import {JobsModule} from './component/jobs-component/jobs.module';
import {UtilsModule} from './utils/utils.module';
import {PricingModule} from './component/pricing-component/pricing.module';
import {PricingStructureService} from './service/pricing-structure-service/pricing-structure.service';
import {ImportDataModule} from './component/import-data-component/import-data.module';
import {ExportDataModule} from './component/export-data-component/export-data.module';
import {ImportDataService} from './service/import-data-service/import-data.service';
import {ExportDataService} from './service/export-data-service/export-data.service';
import {FlexLayoutModule} from '@angular/flex-layout';
import {SettingsService} from './service/settings-service/settings.service';
import {tap} from 'rxjs/operators';
import {User} from '@fuyuko-common/model/user.model';
import {SettingsModule} from './component/settings-component/settings.module';
import {DashboardModule} from './component/dashboard-component/dashboard.module';
import {DashboardService} from './service/dashboard-service/dashboard.service';
import {DashboardWidgetService} from './service/dashboard-service/dashboard-widget.service';
import {ActivatePageComponent} from './page/activate-page/activate.page';
import {UserInvitationPageComponent} from './page/user-invitation-page/user-invitation.page';
import {ActivationService} from './service/activation-service/activation.service';
import {UserActivationPageComponent} from './page/user-activation-page/user-activation.page';
import {InvitationService} from './service/invitation-service/invitation.service';
import { JwtInterceptor } from './interceptor/jwt.interceptor';
import {GlobalCommunicationService} from './service/global-communication-service/global-communication.service';
import {RegistrationService} from './service/registration-service/registration.service';
import {AvatarModule} from './component/avatar-component/avatar.module';
import {GroupTableModule} from './component/group-table-component/group-table.module';
import {NotificationModule} from './component/notification-component/notification.module';
import {PasswordModule} from './component/password-component/password.module';
import {ProfileModule} from './component/profile-info-component/profile.module';
import {SendInviteModule} from './component/send-invite-component/send-invite.module';
import {SideNavModule} from './component/side-nav-component/side-nav.module';
import {UserSearchModule} from './component/user-search-table-component/user-search.module';
import {UserTableModule} from './component/user-table-component/user-table.module';
import {PartnerLayoutComponent} from './layout/partner-layout/partner.layout';
import {PartnerDataThumbnailPageComponent} from './page/partner-data-thumbnail-page/partner-data-thumbnail.page';
import {PartnerDataListPageComponent} from './page/partner-data-list-page/partner-data-list.page';
import {PartnerDataTablePageComponent} from './page/partner-data-table-page/partner-data-table.page';
import {PartnerHelpPageComponent} from './page/partner-help-page/partner-help.page';
import {PartnerService} from './service/partner-service/partner.service';
import {PartnerViewModule} from './component/partner-view-component/partner-view.module';
import {BrowserLocationHistoryService} from './service/browser-location-history-service/browser-location-history.service';
import {DashboardHelpPageComponent} from './page/dashboard-help-page/dashboard-help.page';
import {EditRulePageComponent} from './page/view-rules-page/edit-rule.page';
import {ViewValidationPageComponent} from './page/view-validation-page/view-validation.page';
import {EditAttributePageComponent} from './page/view-attributes-page/edit-attribute.page';
import {ValidationService} from './service/validation-service/validation.service';
import {ValidationResultModule} from './component/validation-result-component/validation-result.module';
import { ViewValidationDetailsPageComponent } from './page/view-validation-details-page/view-validation-details.page';
import {CustomRuleService} from './service/custom-rule-service/custom-rule.service';
import {AddRulePageComponent} from './page/view-rules-page/add-rule.page';
import {ExportArtifactsPageComponent} from './page/export-artifacts-page/export-artifacts.page';
import {HelpService} from './service/help.service/help.service';
import {HelpModule} from './component/help-component/help.module';
import {CustomExportPageComponent} from './page/custom-export-page/custom-export.page';
import {CustomImportPageComponent} from './page/custom-import-page/custom-import.page';
import {CustomImportService} from './service/custom-import-service/custom-import.service';
import {CustomExportService} from './service/custom-export-service/custom-export.service';
import {ExportArtifactService} from './service/export-artifact-service/export-artifact.service';
import {PaginationModule} from './component/pagination-component/pagination.module';
import {SecurityModule} from './component/security-directive/security.module';
import {SharedComponentUtilsModule} from './component/shared-component-utils/shared-component-utils.module';
import {PriceLayoutComponent} from './layout/price-layout/price.layout';
import {PricingStructurePartnerAssociationPageComponent} from './page/pricing-structure-partner-association-page/pricing-structure-partner-association.page';
import {CategoryPageComponent} from './page/category-page/category.page';
import {CategoryHelpPageComponent} from './page/category-help-page/category-help.page';
import {CategoryModule} from './component/category-component/category.module';
import {CategoryService} from './service/category-service/category.service';
import {CategoryManagementPageComponent} from './page/category-management-page/category-management.page';
import {reload} from './utils/config.util';
import {ForgotPasswordPageComponent} from './page/forgot-password-page/forgot-password.page';
import {ResetPasswordPageComponent} from './page/reset-password-page/reset-password.page';
import {AdministrationLayoutComponent} from './layout/administration-layout/administration.layout';
import {AuditLogPageComponent} from './page/audit-log-page/audit-log.page';
import {AdministrationHelpPageComponent} from './page/administration-help-page/administration-help.page';
import {AuditLogModule} from './component/audit-log-component/audit-log.module';
import {AuditLogService} from './service/audit-log-service/audit-log.service';
import {LoadingService} from './service/loading-service/loading.service';
import {CustomBulkEditPageComponent} from './page/custom-bulk-edit-page/custom-bulk-edit.page';
import {CustomBulkEditService} from './service/custom-bulk-edit-service/custom-bulk-edit.service';
import config from './utils/config.util';
import {WorkflowLayoutComponent} from './layout/workflow-layout/workflow.layout';
import {WorkflowDefinitionListingPageComponent} from './page/workflow-definition-listing-page/workflow-definition-listing.page';
import {WorkflowInstanceTasksPageComponent} from './page/workflow-instance-tasks-page/workflow-instance-tasks.page';
import {WorkflowInstanceTaskDetailsPageComponent} from './page/workflow-instance-task-details-page/workflow-instance-task-details.page';
import {WorkflowHelpPageComponent} from './page/workflow-help-page/workflow-help.page';
import {HotToastModule} from '@ngneat/hot-toast';
import {WorkflowListingPageComponent} from './page/workflow-listing-page/workflow-listing.page';
import {WorkflowModule} from './component/workflow-component/workflow.module';
import {WorkflowService} from './service/workflow-service/workflow.service';
import {GqlService} from "./service/gql.service";

const appInitializer = (settingsService: SettingsService,
                        authService: AuthService,
                        themeService: ThemeService,
                        viewService: ViewService,
                        httpClient: HttpClient) => {
  return (): Promise<any> => {
    return new Promise((res, rej) => {
      reload(httpClient, () => {
        authService.asObservable()
            .pipe(
                tap((u: User | undefined) => {
                  if (!u) {  // logout
                    viewService.destroy();
                    settingsService.destroy();
                  } else {          // login
                    themeService.setTheme(u.theme);
                    settingsService.init(u);
                    viewService.init();
                  }
                })
            ).subscribe();
        res(undefined);
        console.log(`
         ______                 _
        |  ____|               | |
        | |__ _   _ _   _ _   _| | _____
        |  __| | | | | | | | | | |/ / _ \\
 _ _ _  | |  | |_| | |_| | |_| |   < (_) |  _ _ _
(_|_|_) |_|   \\__,_|\\__, |\\__,_|_|\\_\\___/  (_|_|_)
                     __/ |
                    |___/     ${config().version}

    `);
        console.log(`*** Fuyuko App initialize ***`);
      });
    });
  };
};

@NgModule({
    declarations: [
        AppComponent,
        // layouts
        LoginLayoutComponent,
        DashboardLayoutComponent,
        SettingsLayoutComponent,
        ProcessLayoutComponent,
        ViewLayoutComponent,
        PartnerLayoutComponent,
        PriceLayoutComponent,
        AdministrationLayoutComponent,
        WorkflowLayoutComponent,
        // pages
        LoginPageComponent,
        DashboardPageComponent,
        DashboardHelpPageComponent,
        RegisterPageComponent,
        ActivatePageComponent,
        BulkEditPageComponent,
        BulkEditHelpPageComponent,
        ProfilePageComponent,
        ProfileHelpPageComponent,
        SettingsPageComponent,
        SettingsHelpPageComponent,
        UserRolePageComponent,
        UserGroupPageComponent,
        UserPeoplePageComponent,
        UserInvitationPageComponent,
        UserActivationPageComponent,
        UserHelpPageComponent,
        ViewHelpPageComponent,
        ImportPageComponent,
        ImportHelpPageComponent,
        ExportHelpPageComponent,
        ExportPageComponent,
        PricingStructurePageComponent,
        PricingHelpPageComponent,
        FileNotFoundPageComponent,
        ViewAttributesPageComponent,
        EditAttributePageComponent,
        AddAttributePageComponent,
        ViewValidationPageComponent,
        ViewValidationDetailsPageComponent,
        ViewDataTabularPageComponent,
        ViewDataThumbnailPageComponent,
        ViewDataListPageComponent,
        ViewRulesPageComponent,
        EditRulePageComponent,
        AddRulePageComponent,
        ViewViewsPageComponent,
        JobsPageComponent,
        JobsHelpPageComponent,
        ErrorPageComponent,
        PartnerDataThumbnailPageComponent,
        PartnerDataListPageComponent,
        PartnerDataTablePageComponent,
        PartnerHelpPageComponent,
        ExportArtifactsPageComponent,
        CustomExportPageComponent,
        CustomImportPageComponent,
        PricingStructurePartnerAssociationPageComponent,
        CategoryPageComponent,
        CategoryHelpPageComponent,
        CategoryManagementPageComponent,
        ForgotPasswordPageComponent,
        ResetPasswordPageComponent,
        AuditLogPageComponent,
        AdministrationHelpPageComponent,
        CustomBulkEditPageComponent,
        WorkflowDefinitionListingPageComponent,
        WorkflowListingPageComponent,
        WorkflowInstanceTasksPageComponent,
        WorkflowInstanceTaskDetailsPageComponent,
        WorkflowHelpPageComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        AppMaterialsModule,
        FlexLayoutModule,
        HttpClientModule,
        HotToastModule.forRoot({
            dismissible: true,
            autoClose: false,
        }),
        SimpleNotificationsModule.forRoot({
            position: ['bottom', 'center'],
            timeOut: 0,
            showProgressBar: true,
            pauseOnHover: true,
            lastOnBottom: true,
            clickToClose: true,
            clickIconToClose: true,
            maxLength: 0,
            maxStack: 10,
            theClass: 'message-toast',
            animate: NotificationAnimationType.Fade
        } as Options),
        // custom modules
        AttributeTableModule,
        DataTableModule,
        DataEditorModule,
        ItemSearchModule,
        RulesModule,
        DataThumbnailModule,
        DataListModule,
        CarouselModule,
        ViewModule,
        BulkEditWizardModule,
        JobsModule,
        UtilsModule,
        PricingModule,
        ImportDataModule,
        ExportDataModule,
        SettingsModule,
        DashboardModule,
        AvatarModule,
        GroupTableModule,
        NotificationModule,
        PasswordModule,
        ProfileModule,
        SendInviteModule,
        SideNavModule,
        UserSearchModule,
        UserTableModule,
        PartnerViewModule,
        ValidationResultModule,
        HelpModule,
        PaginationModule,
        SecurityModule,
        SharedComponentUtilsModule,
        CategoryModule,
        AuditLogModule,
        WorkflowModule,
    ],
    providers: [
        { provide: ThemeService, useClass: ThemeService } as Provider,
        { provide: BackgroundImageService, useClass: BackgroundImageService } as Provider,
        { provide: AppNotificationService, useClass: AppNotificationService } as Provider,
        { provide: AvatarService, useClass: AvatarService } as Provider,
        { provide: UserManagementService, useClass: UserManagementService } as Provider,
        { provide: ViewService, useClass: ViewService } as Provider,
        { provide: AuthService, useClass: AuthService } as Provider,
        { provide: AuthGuard, useClass: AuthGuard } as Provider,
        { provide: AttributeService, useClass: AttributeService } as Provider,
        { provide: ItemService, useClass: ItemService } as Provider,
        { provide: RuleService, useClass: RuleService } as Provider,
        { provide: CounterService, useClass: CounterService } as Provider,
        { provide: BulkEditService, useClass: BulkEditService } as Provider,
        { provide: JobsService, useClass: JobsService } as Provider,
        { provide: PricingStructureService, useClass: PricingStructureService } as Provider,
        { provide: ImportDataService, useClass: ImportDataService } as Provider,
        { provide: ExportDataService, useClass: ExportDataService } as Provider,
        { provide: SettingsService, useClass: SettingsService } as Provider,
        { provide: DashboardService, useClass: DashboardService } as Provider,
        { provide: DashboardWidgetService, useClass: DashboardWidgetService } as Provider,
        { provide: ActivationService, useClass: ActivationService } as Provider,
        { provide: InvitationService, useClass: InvitationService } as Provider,
        { provide: RegistrationService, useClass: RegistrationService } as Provider,
        { provide: GlobalCommunicationService, useClass: GlobalCommunicationService } as Provider,
        { provide: PartnerService, useClass: PartnerService } as Provider,
        { provide: BrowserLocationHistoryService, useClass: BrowserLocationHistoryService } as Provider,
        { provide: ValidationService, useClass: ValidationService } as Provider,
        { provide: CustomRuleService, useClass: CustomRuleService } as Provider,
        { provide: HelpService, useClass: HelpService } as Provider,
        { provide: CustomImportService, useClass: CustomImportService } as Provider,
        { provide: CustomExportService, useClass: CustomExportService } as Provider,
        { provide: ExportArtifactService, useClass: ExportArtifactService } as Provider,
        { provide: CategoryService, useClass: CategoryService } as Provider,
        { provide: AuditLogService, useClass: AuditLogService } as Provider,
        { provide: LoadingService, useClass: LoadingService } as Provider,
        { provide: CustomBulkEditService, useClass: CustomBulkEditService } as Provider,
        { provide: WorkflowService, useClass: WorkflowService } as Provider,
        { provide: GqlService, useClass: GqlService } as Provider,
        { provide: APP_INITIALIZER, useFactory: appInitializer, multi: true,
            deps: [SettingsService, AuthService, ThemeService, ViewService, HttpClient] } as Provider,
        { provide: DateAdapter, useClass: MomentDateAdapter } as Provider,
        { provide: MAT_DATE_FORMATS, useValue: MAT_DATE_FORMAT },
        { provide: HTTP_INTERCEPTORS, useClass: ProfilingInterceptor, multi: true } as Provider,
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true } as Provider,
        { provide: ErrorHandler, useClass: GlobalErrorHandler } as Provider,
    ],
    exports: [
        BrowserModule,
        BrowserAnimationsModule,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}

