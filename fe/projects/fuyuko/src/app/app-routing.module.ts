import {Routes, RouterModule, Route} from '@angular/router';
import {LoginPageComponent} from './page/login-page/login.page';
import {LoginLayoutComponent} from './layout/login-layout/login.layout';
import {RegisterPageComponent} from './page/register-page/register.page';
import {SettingsLayoutComponent} from './layout/settings-layout/settings.layout';
import {FileNotFoundPageComponent} from './page/file-not-found-page/file-not-found.page';
import {ProfilePageComponent} from './page/profile-page/profile.page';
import {SettingsPageComponent} from './page/settings-page/settings.page';
import {BulkEditPageComponent} from './page/bulk-edit-page/bulk-edit.page';
import {ProfileHelpPageComponent} from './page/profile-help-page/profile-help.page';
import {UserHelpPageComponent} from './page/user-help-page/user-help.page';
import {ViewHelpPageComponent} from './page/view-help-page/view-help.page';
import {SettingsHelpPageComponent} from './page/settings-help-page/settings-help.page';
import {BulkEditHelpPageComponent} from './page/bulk-edit-help-page/bulk-edit-help.page';
import {ImportHelpPageComponent} from './page/import-help-page/import-help.page';
import {ImportPageComponent} from './page/import-page/import.page';
import {UserRolePageComponent} from './page/user-role-page/user-role.page';
import {UserGroupPageComponent} from './page/user-group-page/user-group.page';
import {UserPeoplePageComponent} from './page/user-people-page/user-people.page';
import {ProcessLayoutComponent} from './layout/process-layout/process.layout';
import {ViewLayoutComponent} from './layout/view-layout/view.layout';
import {PricingStructurePageComponent} from './page/pricing-structure-page/pricing-structure.page';
import {PricingHelpPageComponent} from './page/pricing-help-page/pricing-help.page';
import {DashboardLayoutComponent} from './layout/dashboard-layout/dashboard.layout';
import {DashboardPageComponent} from './page/dashboard-page/dashboard.page';
import {ViewRulesPageComponent} from './page/view-rules-page/view-rules.page';
import {ViewAttributesPageComponent} from './page/view-attributes-page/view-attributes.page';
import {ViewDataTabularPageComponent} from './page/view-data-tabular-page/view-data-tabular.page';
import {ViewDataThumbnailPageComponent} from './page/view-data-thumbnail-page/view-data-thumbnail.page';
import {ViewDataListPageComponent} from './page/view-data-list-page/view-data-list.page';
import {ViewViewsPageComponent} from './page/view-views-page/view-views.page';
import {AuthGuard} from './guard/auth-guard/auth.guard';
import {ErrorPageComponent} from './page/error-page/error.page';
import {JobsPageComponent} from './page/jobs-page/jobs.page';
import {JobsHelpPageComponent} from './page/jobs-help-page/jobs-help.page';
import {ExportPageComponent} from './page/export-page/export.page';
import {ExportHelpPageComponent} from './page/export-help-page/export-help.page';
import {ActivatePageComponent} from './page/activate-page/activate.page';
import {UserInvitationPageComponent} from './page/user-invitation-page/user-invitation.page';
import {UserActivationPageComponent} from './page/user-activation-page/user-activation.page';
import {PartnerLayoutComponent} from './layout/partner-layout/partner.layout';
import {PartnerDataTablePageComponent} from './page/partner-data-table-page/partner-data-table.page';
import {PartnerDataListPageComponent} from './page/partner-data-list-page/partner-data-list.page';
import {PartnerDataThumbnailPageComponent} from './page/partner-data-thumbnail-page/partner-data-thumbnail.page';
import {PartnerHelpPageComponent} from './page/partner-help-page/partner-help.page';
import {DashboardHelpPageComponent} from './page/dashboard-help-page/dashboard-help.page';
import {EditRulePageComponent} from './page/view-rules-page/edit-rule.page';
import {ViewValidationPageComponent} from './page/view-validation-page/view-validation.page';
import {EditAttributePageComponent} from './page/view-attributes-page/edit-attribute.page';
import {ViewValidationDetailsPageComponent} from './page/view-validation-details-page/view-validation-details.page';
import {AddRulePageComponent} from './page/view-rules-page/add-rule.page';
import {AddAttributePageComponent} from './page/view-attributes-page/add-attribute.page';
import {ExportArtifactsPageComponent} from './page/export-artifacts-page/export-artifacts.page';
import {NgModule} from '@angular/core';
import {CustomImportPageComponent} from './page/custom-import-page/custom-import.page';
import {CustomExportPageComponent} from './page/custom-export-page/custom-export.page';
import {PriceLayoutComponent} from './layout/price-layout/price.layout';
import {PricingStructurePartnerAssociationPageComponent} from './page/pricing-structure-partner-association-page/pricing-structure-partner-association.page';
import {CategoryPageComponent} from './page/category-page/category.page';
import {CategoryHelpPageComponent} from './page/category-help-page/category-help.page';
import {CategoryManagementPageComponent} from './page/category-management-page/category-management.page';
import {ForgotPasswordPageComponent} from './page/forgot-password-page/forgot-password.page';
import {ResetPasswordPageComponent} from './page/reset-password-page/reset-password.page';
import {AdministrationLayoutComponent} from './layout/administration-layout/administration.layout';
import {AuditLogPageComponent} from './page/audit-log-page/audit-log.page';
import {AdministrationHelpPageComponent} from './page/administration-help-page/administration-help.page';
import {CustomBulkEditPageComponent} from './page/custom-bulk-edit-page/custom-bulk-edit.page';
import {WorkflowLayoutComponent} from './layout/workflow-layout/workflow.layout';
import {WorkflowDefinitionListingPageComponent} from './page/workflow-definition-listing-page/workflow-definition-listing.page';
import {WorkflowMappingPageComponent} from './page/workflow-mapping-page/workflow-mapping.page';
import {WorkflowTaskPageComponent} from './page/workflow-task-page/workflow-task.page';
import {WorkflowInstanceDetailsPageComponent} from './page/workflow-instance-details-page/workflow-instance-details.page';
import {WorkflowHelpPageComponent} from './page/workflow-help-page/workflow-help.page';

const routes: Routes = [

  // default
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/dashboard-layout/(dashboard//help:dashboard-help)',
  },
  {
    path: 'login',
    pathMatch: 'full',
    redirectTo: '/login-layout/login'
  },
  {
    path: 'register',
    pathMatch: 'full',
    redirectTo: '/login-layout/register'
  },
  {
    path: 'forgot-password',
    pathMatch: 'full',
    redirectTo: '/login-layout/forgot-password'
  },
  {
    path: 'activate/:code',
    pathMatch: 'full',
    redirectTo: '/login-layout/activate/:code'
  },
  {
    path: 'reset-password/:code',
    pathMatch: 'full',
    redirectTo: '/login-layout/reset-password/:code'
  },


  // login-layout
 {
   path: 'login-layout',
   component: LoginLayoutComponent,
   children: [
     {
       path: 'login',
       component: LoginPageComponent,
     } as Route,
     {
       path: 'register',
       component: RegisterPageComponent,
     } as Route,
     {
       path: 'forgot-password',
       component: ForgotPasswordPageComponent,
     } as Route,
     {
       path: 'activate/:code',
       component: ActivatePageComponent,
     } as Route,
     {
       path: 'reset-password/:code',
       component: ResetPasswordPageComponent,
     } as Route,
     {
       path: '',
       pathMatch: 'full',
       redirectTo: '/login-layout/login',
     } as Route,
   ]
 } as Route,

  // partner-layout
  {
    path: 'partner-layout',
    canActivate: [AuthGuard],
    component: PartnerLayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/partner-layout/(table//help:partner-help)'
      },
      {
        path: 'table',
        canActivate: [AuthGuard],
        component: PartnerDataTablePageComponent,
        data: {
          sideNav: 'partnerDataTable'
        }
      } as Route,
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: PartnerDataListPageComponent,
        data: {
          sideNav: 'partnerDataList'
        }
      } as Route,
      {
        path: 'thumbnail',
        canActivate: [AuthGuard],
        component: PartnerDataThumbnailPageComponent,
        data: {
          sideNav: 'partnerDataThumbnail'
        }
      } as Route,
      {
        path: 'partner-help',
        canActivate: [AuthGuard],
        component: PartnerHelpPageComponent,
        outlet: 'help'
      } as Route,
    ]
  } as Route,


  // dashboard-layout
  {
    path: 'dashboard-layout',
    canActivate: [AuthGuard],
    component: DashboardLayoutComponent,
    data: {
      sideNav: 'dashboard'
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/dashboard-layout/(dashboard//help:dashboard-help)',
      } as Route,
      {
        path: 'dashboard',
        canActivate: [AuthGuard],
        component: DashboardPageComponent,
      } as Route,
      {
        path: 'dashboard-help',
        canActivate: [AuthGuard],
        component: DashboardHelpPageComponent,
        outlet: 'help'
      }
    ]
  } as Route,


  // workflow-layout
  {
    path: 'workflow-layout',
    canActivate: [AuthGuard],
    component: WorkflowLayoutComponent,
    data: {
      sideNav: 'workflow'
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/workflow-layout/(workflow-definition-listing//help:workflow-help)'
      },
      {
        path: 'workflow-definition-listing',
        canActivate: [AuthGuard],
        component: WorkflowDefinitionListingPageComponent,
        data: {
          subSideNav: 'workflowListing'
        }
      } as Route,
      {
        path: 'workflow-mapping',
        canActivate: [AuthGuard],
        component: WorkflowMappingPageComponent,
        data: {
          subSideNav: 'workflowMapping'
        }
      } as Route,
      {
        path: 'workflow-task',
        canActivate: [AuthGuard],
        component: WorkflowTaskPageComponent,
        data: {
          subSideNav: 'workflowTask'
        }
      },
      {
        path: 'workflow-instance-details' ,
        canActivate: [AuthGuard],
        component: WorkflowInstanceDetailsPageComponent,
        data: {
          subSideNav: 'workflowInstanceDetails'
        }
      },
      {
        path: 'workflow-help' ,
        canActivate: [AuthGuard],
        component: WorkflowHelpPageComponent,
        outlet: 'help'
      }
    ]
  },



  // administration-layout
  {
    path: `administration-layout`,
    component: AdministrationLayoutComponent,
    canActivate: [AuthGuard],
    data: {
      sideNav: 'administration'
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/administration-layout/(role//help:user-help)',
      } as Route,
      {
        path: 'role',
        canActivate: [AuthGuard],
        component: UserRolePageComponent,
        data: {
          subSideNav: 'role'
        }
      } as Route,
      {
        path: 'group',
        canActivate: [AuthGuard],
        component: UserGroupPageComponent,
        data: {
          subSideNav: 'group'
        }
      } as Route,
      {
        path: 'people',
        canActivate: [AuthGuard],
        component: UserPeoplePageComponent,
        data: {
          subSideNav: 'people'
        }
      } as Route,
      {
        path: 'invitation',
        canActivate: [AuthGuard],
        component: UserInvitationPageComponent,
        data: {
          subSideNav: 'invitation'
        }
      } as Route,
      {
        path: 'activation',
        canActivate: [AuthGuard],
        component: UserActivationPageComponent,
        data: {
          subSideNav: 'activation'
        }
      } as Route,
      {
        path: 'user-help',
        canActivate: [AuthGuard],
        component: UserHelpPageComponent,
        outlet: 'help'
      } as Route,
      {
        path: 'audit-log',
        canActivate: [AuthGuard],
        component: AuditLogPageComponent,
        data: {
          subSideNav: 'audit-log'
        }
      } as Route,
      {
        path: 'administration-help',
        canActivate: [AuthGuard],
        component: AdministrationHelpPageComponent,
        outlet: 'help'
      } as Route,
    ]
  } as Route,



  // import-export layout
  {
    path: 'process-layout',
    canActivate: [AuthGuard],
    component: ProcessLayoutComponent,
    data: {
      sideNav: 'process'
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/process-layout/(import//help:import-help)',
      } as Route,
      {
        path: 'import',
        canActivate: [AuthGuard],
        component: ImportPageComponent,
        data: {
          subSideNav: 'import'
        }
      } as Route,
      {
        path: 'custom-import',
        canActivate: [AuthGuard],
        component: CustomImportPageComponent,
        data: {
          subSideNav: 'custom-import'
        }
      },
      {
        path: 'import-help',
        canActivate: [AuthGuard],
        component: ImportHelpPageComponent,
        outlet: 'help'
      } as Route,
      {
        path: 'export',
        canActivate: [AuthGuard],
        component: ExportPageComponent,
        data: {
          subSideNav: 'export'
        }
      } as Route,
      {
        path: 'custom-export',
        canActivate: [AuthGuard],
        component: CustomExportPageComponent,
        data: {
          subSideNav: 'custom-export'
        }
      },
      {
        path: 'export-artifacts',
        canActivate: [AuthGuard],
        component: ExportArtifactsPageComponent,
        data: {
          subSideNav: 'export-artifacts'
        }
      } as Route,
      {
        path: 'export-help',
        canActivate: [AuthGuard],
        component: ExportHelpPageComponent,
        outlet: 'help'
      } as Route,
      {
        path: 'bulk-edit',
        canActivate: [AuthGuard],
        component: BulkEditPageComponent,
        data: {
          subSideNav: 'bulk-edit'
        }
      } as Route,
      {
        path: 'custom-bulk-edit',
        canActivate: [AuthGuard],
        component: CustomBulkEditPageComponent,
        data: {
          subSideNav: 'custom-bulk-edit'
        }
      } as Route,
      {
        path: 'bulk-edit-help',
        canActivate: [AuthGuard],
        component: BulkEditHelpPageComponent,
        outlet: 'help'
      } as Route,
      {
        path: 'jobs',
        canActivate: [AuthGuard],
        component: JobsPageComponent,
        data: {
          subSideNav: 'jobs',
        } as Route
      },
      {
        path: 'jobs-help',
        canActivate: [AuthGuard],
        component: JobsHelpPageComponent,
        outlet: 'help',
      } as Route,
    ]
  } as Route,


  // view-layout
  {
    path: 'view-layout',
    canActivate: [AuthGuard],
    component: ViewLayoutComponent,
    data: {
      sideNav: 'view'
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/view-layout/(rules//help:view-help)',
      } as Route,
      {
        path: 'rules',
        canActivate: [AuthGuard],
        component: ViewRulesPageComponent,
        data: {
          subSideNav: 'rules'
        }
      } as Route,
      {
        path: 'edit-rule/:ruleId',
        canActivate: [AuthGuard],
        component: EditRulePageComponent,
        data: {
          subSideNav: 'rules'
        }
      } as Route,
      {
        path: 'add-rule',
        canActivate: [AuthGuard],
        component: AddRulePageComponent,
        data: {
          subSideNav: 'rules'
        }
      } as Route,
      {
        path: 'attributes',
        canActivate: [AuthGuard],
        component: ViewAttributesPageComponent,
        data: {
          subSideNav: 'attributes'
        }
      } as Route,
      {
        path: 'add-attribute',
        canActivate: [AuthGuard],
        component: AddAttributePageComponent,
        data: {
          subSideNav: 'attributes'
        }
      } as Route,
      {
        path: 'edit-attribute/:attributeId',
        canActivate: [AuthGuard],
        component: EditAttributePageComponent,
        data: {
          subSideNav: 'attributes'
        }
      } as Route,
      {
        path: 'data-tabular',
        canActivate: [AuthGuard],
        component: ViewDataTabularPageComponent,
        data: {
          subSideNav: 'data-tabular'
        }
      } as Route,
      {
        path: 'data-thumbnail',
        canActivate: [AuthGuard],
        component: ViewDataThumbnailPageComponent,
        data: {
          subSideNav: 'data-thumbnail'
        }
      } as Route,
      {
        path: 'data-list',
        canActivate: [AuthGuard],
        component: ViewDataListPageComponent,
        data: {
          subSideNav: 'data-list'
        }
      } as Route,
      {
        path: 'views',
        canActivate: [AuthGuard],
        component: ViewViewsPageComponent,
        data: {
          subSideNav: 'views'
        }
      } as Route,
      {
        path: 'validation',
        canActivate: [AuthGuard],
        component: ViewValidationPageComponent,
        data: {
          subSideNav: 'validation'
        }
      } as Route,
      {
        path: 'validation-details/view/:viewId/validation/:validationId',
        canActivate: [AuthGuard],
        component: ViewValidationDetailsPageComponent,
        data: {
          subSideNav: 'validation'
        }
      } as Route,
      {
        path: 'category',
        canActivate: [AuthGuard],
        component: CategoryPageComponent,
        data: {
          subSideNav: 'category'
        }
      } as Route,
      {
        path: 'category-management',
        canActivate: [AuthGuard],
        component: CategoryManagementPageComponent,
        data: {
          subSideNav: 'category-management'
        }
      } as Route,
      {
        path: 'category-help',
        canActivate: [AuthGuard],
        component: CategoryHelpPageComponent,
        outlet: 'help'
      } as Route,
      {
        path: 'view-help',
        canActivate: [AuthGuard],
        component: ViewHelpPageComponent,
        outlet: 'help'
      } as Route,
    ]
  } as Route,


  // price-layout
  {
    path: 'price-layout',
    canActivate: [AuthGuard],
    component: PriceLayoutComponent,
    data: {
      sideNav: 'pricing'
    },
    children: [
      // pricing structure
      {
        path: 'pricing-structure',
        canActivate: [AuthGuard],
        component: PricingStructurePageComponent,
        data: {
          subSideNav: 'pricing-structure'
        }
      } as Route,

      // pricing-structure-partner-association
      {
        path: 'pricing-structure-partner-association',
        canActivate: [AuthGuard],
        component: PricingStructurePartnerAssociationPageComponent,
        data: {
          subSideNav: 'pricing-structure-partner-association'
        }
      } as Route,

      // help
      {
        path: 'pricing-help',
        canActivate: [AuthGuard],
        component: PricingHelpPageComponent,
        outlet: 'help'
      } as Route,
    ]
  } as Route,

  // settings-layout
  {
    path: 'settings-layout',
    canActivate: [AuthGuard],
    component: SettingsLayoutComponent,
    data: {
      sideNav: 'settings'
    },
    children: [
     // profile
     {
       path: '',
       pathMatch: 'full',
       redirectTo: '/settings-layout/(profile//help:profile-help)'
     } as Route,
     {
       path: 'profile',
       canActivate: [AuthGuard],
       component: ProfilePageComponent,
       data: {
         subSideNav: 'profile'
       }
     } as Route,
     {
       path: 'profile-help',
       canActivate: [AuthGuard],
       component: ProfileHelpPageComponent,
       outlet: 'help'
     } as Route,

     // settings
     {
       path: 'settings',
       canActivate: [AuthGuard],
       component: SettingsPageComponent,
       data: {
         subSideNav: 'settings'
       }
     } as Route,
     {
       path: 'settings-help',
       canActivate: [AuthGuard],
       component: SettingsHelpPageComponent,
       outlet: 'help'
     } as Route,
   ]
 } as Route,
 {
   path: 'error',
   component: ErrorPageComponent
 } as Route,
 {
   path: '**',
   component: FileNotFoundPageComponent
 } as Route
];

@NgModule({
  imports: [RouterModule.forRoot(routes,
      { enableTracing: false, scrollPositionRestoration: 'enabled', relativeLinkResolution: 'corrected' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
