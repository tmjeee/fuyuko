import {Subject, Subscription, Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {Request} from 'express';
import {auditLogInfo} from "../audit.service";
import {BulkEditPackage} from "../../model/bulk-edit.model";
import {Attribute} from "../../model/attribute.model";
import {PreviewResult as ItemPreviewResult} from "../export-csv/export-item.service";
import {PreviewResult as PricePreviewResult} from "../export-csv/export-price.service";
import {ImportAttributePreviewResult} from "../import-csv/import-attribute.service";
import {ImportItemPreviewResult} from "../import-csv/import-item.service";
import {ImportPricePreviewResult} from "../import-csv/import-price.service";
import {ScheduleValidationResult} from "../validation/run-validation.service";
import {UpdateAttributesResult} from "../attribute.service";
import {Status} from "../../model/status.model";
import {LimitOffset} from "../../model/limit-offset.model";
import {LoginResult} from "../auth.service";
import {User} from "../../model/user.model";
import {AvatarInput, SaveUserAvatarResult} from "../avatar.service";
import {BinaryContent} from "../../model/binary-content.model";
import {GlobalAvatar} from "../../model/avatar.model";
import {Category, CategorySimpleItem, CategoryWithItems} from "../../model/category.model";
import {AddCategoryInput, UpdateCategoryInput} from "../category.service";
import {Item, ItemSearchType, PricedItem, Value} from "../../model/item.model";
import {CustomBulkEdit} from "../../model/custom-bulk-edit.model";
import {CustomDataExport} from "../../model/custom-export.model";
import {CustomDataImport} from "../../model/custom-import.model";
import {CustomRule} from "../../model/custom-rule.model";
import {
    DataMap,
    SerializedDashboardFormat,
    SerializedDashboardWidgetInstanceDataFormat
} from "../../model/dashboard-serialzable.model";
import {DataExportArtifact} from "../../model/data-export.model";
import {AddOrUpdateGroupInput} from "../group.service";
import {Group} from "../../model/group.model";
import {ActivateInvitationResult} from "../invitation.service";
import { Invitation } from '../../model/invitation.model';
import {ItemWithFilteringResult} from "../item-filtering.service";
import {ItemValueOperatorAndAttribute} from "../../model/item-attribute.model";
import {Job, JobAndLogs} from "../../model/job.model";
import {JwtPayload} from "../../model/jwt.model";
import {AppNotification, NewNotification} from "../../model/notification.model";
import {PricedItemsWithFilteringResult} from "../priced-item-filtering.service";
import {
    PricingStructure,
    PricingStructureGroupAssociation,
    PricingStructureItemWithPrice
} from "../../model/pricing-structure.model";
import {CountryCurrencyUnits} from "../../model/unit.model";
import {Role} from "../../model/role.model";
import {Rule} from "../../model/rule.model";
import {ApproveSelfRegistrationResult, SelfRegisterResult} from "../self-registration.service";
import {SelfRegistration} from "../../model/self-registration.model";
import {AddUserInput, UpdateUserInput} from "../user.service";
import {UpdateUserSettingsInput} from "../user-settings.service";
import {Settings} from "../../model/settings.model";
import {AddOrUpdateViewsInput} from "../view.service";
import {View} from "../../model/view.model";
import {Validation, ValidationResult} from "../../model/validation.model";
import * as path from "path";
import * as fs from "fs";
import * as util from "util";
import {i, w} from "../../logger";

// ======= SYSTEM =================

export const newEventSubscriptionRegistry = (d: any, name: string) => {
    return {
        initEvent(observable: Observable<AllEvents>): void {
            d.subscription = observable.pipe(
                tap(async (e: AllEvents) => {
                    const fn: Function = d[e.type];
                    if (fn) {
                        try {
                            await fn(e);
                        } catch(e) {
                            e(`error handling event ${e.type} on ${name}`, e);
                        }
                    }
                })
            ).subscribe();
        },
        destroyEvent(): void {
            d.subscription && d.subscription.unsubscribe();
        }
    };
}




const regs: EventSubscriptionRegistry[] = [];
export const registerEventsSubscription = async () => {
    const dir: string = path.join(__dirname, 'custom-events-subscription');
    const dirEntries: string[] = await util.promisify(fs.readdir)(dir);
    for (const dirEntry of dirEntries) {
       const filePath = path.join(dir, dirEntry);
       const stats: fs.Stats = await util.promisify(fs.stat)(filePath);
       if (stats.isFile() && dirEntry.endsWith('.js')) {
           i(`importing event subscription registry file ${filePath}`);
           const reg: {default: EventSubscriptionRegistry} = await import(filePath);
           if (reg.default) {
               reg.default.initEvent(eventsAsObservable());
               regs.push(reg.default);
           } else {
               w(`Event subscription registratio in ${filePath} is missing a default export`);
           }
       }
    }
};

export const destroyEventsSubscription = () => {
    for (const reg of regs) {
        reg.destroyEvent();
    }
};

export interface EventSubscriptionRegistry {
    initEvent(observable: Observable<AllEvents>): void;
    destroyEvent(): void;
}

const events = new Subject<AllEvents>();

export const eventsAsObservable =  (): Observable<AllEvents> => {
    return events.asObservable();
};

export const fireEvent = (e: AllEvents) => {
    e && events.next(e);
};



// ======= EVENTS ===============

export type EventType =
    "IncomingHttpEvent" |
    "BulkEditPreviewEvent" |
    "BulkEditJobEvent" |
    "ExportAttributePreviewEvent" |
    "ExportItemPreviewEvent" |
    "ExportPricePreviewEvent" |
    "ExportAttributeJobEvent" |
    "ExportItemJobEvent" |
    "ExportPriceJobEvent" |
    "ImportAttributePreviewEvent" |
    "ImportItemPreviewEvent" |
    "ImportPricePreviewEvent" |
    "ImportAttributeJobEvent" |
    "ImportItemJobEvent" |
    "ImportPriceJobEvent" |
    "ValidationEvent" |
    "UpdateAttributesEvent" |
    "ChangeAttributeStatusEvent" |
    "GetAttributeInViewByNameEvent" |
    "GetAttributeInViewEvent" |
    "GetAttributesInViewEvent" |
    "SaveAttributesEvent" |
    "SearchAttributesByViewEvent" |
    "IsValidForgottenPasswordCodeEvent" |
    "ResetForgottenPasswordEvent" |
    "ForgotPasswordEvent" |
    "LoginEvent" |
    "LogoutEvent" |
    "AddGlobalAvatarEvent" |
    "AddGlobalImageEvent" |
    "SaveUserAvatarEvent" |
    "GetGlobalAvatarContentByNameEvent" |
    "GetAllGlobalAvatarsEvent" |
    "CategorySimpleItemsInCategoryEvent" |
    "CategorySimpleItemsNotInCategoryEvent" |
    "UpdateCategoryEvent" |
    "AddCategoryEvent" |
    "DeleteCategoryEvent" |
    "GetViewCategoryByNameEvent" |
    "GetViewCategoriesEvent" |
    "GetViewCategoriesWithItemsEvent" |
    "GetViewCategoryItemsEvent" |
    "AddItemToViewCategoryEvent" |
    "RemoveItemFromViewCategoryEvent" |
    "GetCustomBulkEditByIdEvent" |
    "GetAllCustomBulkEditsEvent" |
    "GetCustomExportByIdEvent" |
    "GetAllCustomExportsEvent" |
    "GetCustomImportByIdEvent" |
    "GetAllCustomImportsEvent" |
    "ChangeCustomRuleStatusEvent" |
    "AddCustomRuleToViewEvent" |
    "GetAllCustomRulesEvent" |
    "GetAllCustomRulesForViewEvent" |
    "DeleteCustomRulesEvent" |
    "SaveUserDashboardWidgetDataEvent" |
    "SaveUserDashboardEvent" |
    "GetUserDashboardWidgetSerializedDataEvent" |
    "GetUserDashboardSerializedDataEvent" |
    "GetExportArtifactContentEvent" |
    "DeleteExportArtifactByIdEvent" |
    "GetAllExportArtifactsEvent" |
    "CreateInvitationEvent" |
    "ActivateInvitationEvent" |
    "GetInvitationByCodeEvent" |
    "DeleteGroupEvent" |
    "AddOrUpdateGroup" |
    "SearchForGroupsWithNoSuchRoleEvent" |
    "SearchForGroupByNameEvent" |
    "GetGroupsWithRoleEvent" |
    "GetGroupByNameEvent" |
    "GetGroupByIdEvent" |
    "GetAllGroupsEvent" |
    "UpdateItemsStatusEvent" |
    "UpdateItemValueEvent" |
    "UpdateItemEvent" |
    "AddItemEvent" |
    "AddOrUpdateItemEvent" |
    "SearchForFavouriteItemsInViewEvent" |
    "SearchForItemsInViewEvent" |
    "AddFavouriteItemIdsEvent" |
    "RemoveFavouriteItemIdsEvent" |
    "GetAllFavouriteItemIdsInViewEvent" |
    "GetAllFavouritedItemsInViewEvent" |
    "GetAllItemsInViewEvent" |
    "GetItemsByIdsEvent" |
    "GetItemByIdEvent" |
    "GetItemByNameEvent" |
    "GetItemWithFilteringEvent" |
    "MarkItemImageAsPrimaryEvent" |
    "GetItemPrimaryImageEvent" |
    "GetItemImageContentEvent" |
    "AddItemImageEvent" |
    "DeleteItemImageEvent" |
    "GetJobDetailsByIdEvent" |
    "GetAllJobsEvent" |
    "GetJobByIdEvent" |
    "CreateJwtTokenEvent" |
    "DecodeJwtTokenEvent" |
    "VerifyJwtTokenEvent" |
    "AddUserNotificationEvent" |
    "GetUserNotificationsEvent" |
    "GetPricedItemsEvent" |
    "GetPricedItemsWithFilteringEvent" |
    "SearchGroupsAssociatedWithPricingStructureEvent" |
    "SearchGroupsNotAssociatedWithPricingStructureEvent" |
    "GetPricingStructureGroupAssociationsEvent" |
    "LinkPricingStructureWithGroupIdEvent" |
    "UnlinkPricingStructureWithGroupIdEvent" |
    "UpdatePricingStructureStatusEvent" |
    "AddOrUpdatePricingStructuresEvent" |
    "GetPricingStructuresByViewEvent" |
    "GetPartnerPricingStructuresEvent" |
    "GetAllPricingStructureItemsWithPriceEvent" |
    "GetAllPricingStructuresEvent" |
    "GetPricingStructureByNameEvent" |
    "GetPricingStructureByIdEvent" |
    "SetPricesEvent" |
    "AddItemToPricingStructureEvent" |
    "GetPricingStructureItemEvent" |
    "AddOrUpdateRoleEvent" |
    "AddRoleToGroupEvent" |
    "GetRoleByNameEvent" |
    "GetAllRolesEvent" |
    "RemoveRoleFromGroup" |
    "AddOrUpdateRuleEvent" |
    "UpdateRuleStatusEvent" |
    "GetRulesEvent" |
    "GetRuleEvent" |
    "SelfRegisterEvent" |
    "ApproveSelfRegistrationEvent" |
    "GetAllSelfRegistrationsEvent" |
    "SearchSelfRegistrationByUsernameEvent" |
    "DeleteSelfRegistrationEvent" |
    "AddUserEvent" |
    "UpdateUserEvent" |
    "ChangeUserStatusEvent" |
    "AddUserToGroupEvent" |
    "GetUsersInGroupEvent" |
    "GetUsersByStatusEvent" |
    "GetNoAvatarContentEvent" |
    "GetUserAvatarContentEvent" |
    "SearchForUserNotInGroupEvent" |
    "SearchUserByUsernameAndStatusEvent" |
    "DeleteUserFromGroupEvent" |
    "DeleteUserEvent" |
    "HasAllUserRolesEvent" |
    "HasAnyUserRolesEvent" |
    "HasNoneUserRolesEvent" |
    "GetUserByUsernameEvent" |
    "GetUserByIdEvent" |
    "UpdateUserSettingsEvent" |
    "GetSettingsEvent" |
    "DeleteViewEvent"  |
    "AddOrUpdateViewsEvent"  |
    "GetAllViewsEvent"  |
    "GetViewByIdEvent"  |
    "GetViewByNameEvent" |
    "GetViewValidationResultEvent" |
    "GetAllViewValidationsEvent" |
    "DeleteValidationResultEvent" |
    "GetValidationsByViewIdEvent" |
    "GetValidationByViewIdAndValidationIdEvent"
;
export type AllEvents =
    IncomingHttpEvent  |
    BulkEditPreviewEvent  |
    BulkEditJobEvent  |
    ExportAttributePreviewEvent  |
    ExportItemPreviewEvent  |
    ExportPricePreviewEvent  |
    ExportAttributeJobEvent  |
    ExportItemJobEvent  |
    ExportPriceJobEvent  |
    ImportAttributePreviewEvent  |
    ImportItemPreviewEvent  |
    ImportPricePreviewEvent  |
    ImportAttributeJobEvent  |
    ImportItemJobEvent  |
    ImportPriceJobEvent  |
    ValidationEvent  |
    UpdateAttributesEvent |
    ChangeAttributeStatusEvent   |
    GetAttributeInViewByNameEvent |
    GetAttributeInViewEvent  |
    GetAttributesInViewEvent  |
    SaveAttributesEvent  |
    SearchAttributesByViewEvent  |
    IsValidForgottenPasswordCodeEvent  |
    ResetForgottenPasswordEvent |
    ForgotPasswordEvent  |
    LoginEvent  |
    LogoutEvent  |
    AddGlobalAvatarEvent  |
    AddGlobalImageEvent  |
    SaveUserAvatarEvent  |
    GetGlobalAvatarContentByNameEvent  |
    GetAllGlobalAvatarsEvent |
    CategorySimpleItemsInCategoryEvent |
    CategorySimpleItemsNotInCategoryEvent |
    UpdateCategoryEvent  |
    AddCategoryEvent  |
    DeleteCategoryEvent  |
    GetViewCategoryByNameEvent  |
    GetViewCategoriesEvent  |
    GetViewCategoriesWithItemsEvent  |
    GetViewCategoryItemsEvent  |
    AddItemToViewCategoryEvent  |
    RemoveItemFromViewCategoryEvent  |
    GetCustomBulkEditByIdEvent |
    GetAllCustomBulkEditsEvent  |
    GetCustomExportByIdEvent  |
    GetAllCustomExportsEvent   |
    GetCustomImportByIdEvent  |
    GetAllCustomImportsEvent  |
    ChangeCustomRuleStatusEvent  |
    AddCustomRuleToViewEvent |
    GetAllCustomRulesEvent  |
    GetAllCustomRulesForViewEvent  |
    DeleteCustomRulesEvent  |
    SaveUserDashboardWidgetDataEvent  |
    SaveUserDashboardEvent  |
    GetUserDashboardWidgetSerializedDataEvent  |
    GetUserDashboardSerializedDataEvent  |
    GetExportArtifactContentEvent  |
    DeleteExportArtifactByIdEvent  |
    GetAllExportArtifactsEvent |
    CreateInvitationEvent  |
    ActivateInvitationEvent  |
    GetInvitationByCodeEvent |
    DeleteGroupEvent  |
    AddOrUpdateGroupEvent  |
    SearchForGroupsWithNoSuchRoleEvent  |
    SearchForGroupByNameEvent  |
    GetGroupsWithRoleEvent  |
    GetGroupByNameEvent  |
    GetGroupByIdEvent  |
    GetAllGroupsEvent |
    UpdateItemsStatusEvent  |
    UpdateItemValueEvent  |
    UpdateItemEvent  |
    AddItemEvent  |
    AddOrUpdateItemEvent  |
    SearchForFavouriteItemsInViewEvent  |
    SearchForItemsInViewEvent  |
    AddFavouriteItemIdsEvent  |
    RemoveFavouriteItemIdsEvent |
    GetAllFavouriteItemIdsInViewEvent  |
    GetAllFavouritedItemsInViewEvent  |
    GetAllItemsInViewEvent  |
    GetItemsByIdsEvent |
    GetItemByIdEvent  |
    GetItemByNameEvent  |
    GetItemWithFilteringEvent  |
    MarkItemImageAsPrimaryEvent  |
    GetItemPrimaryImageEvent  |
    GetItemImageContentEvent  |
    AddItemImageEvent |
    DeleteItemImageEvent |
    GetJobDetailsByIdEvent  |
    GetAllJobsEvent  |
    GetJobByIdEvent  |
    CreateJwtTokenEvent  |
    DecodeJwtTokenEvent  |
    VerifyJwtTokenEvent |
    AddUserNotificationEvent  |
    GetUserNotificationsEvent  |
    GetPricedItemsEvent  |
    GetPricedItemsWithFilteringEvent |
    SearchGroupsAssociatedWithPricingStructureEvent  |
    SearchGroupsNotAssociatedWithPricingStructureEvent  |
    GetPricingStructureGroupAssociationsEvent  |
    LinkPricingStructureWithGroupIdEvent  |
    UnlinkPricingStructureWithGroupIdEvent  |
    UpdatePricingStructureStatusEvent  |
    AddOrUpdatePricingStructuresEvent  |
    GetPricingStructuresByViewEvent  |
    GetPartnerPricingStructuresEvent  |
    GetAllPricingStructureItemsWithPriceEvent  |
    GetAllPricingStructuresEvent  |
    GetPricingStructureByNameEvent  |
    GetPricingStructureByIdEvent |
    SetPricesEvent  |
    AddItemToPricingStructureEvent  |
    GetPricingStructureItemEvent |
    AddOrUpdateRoleEvent  |
    AddRoleToGroupEvent  |
    GetRoleByNameEvent  |
    GetAllRolesEvent  |
    RemoveRoleFromGroup |
    AddOrUpdateRuleEvent  |
    UpdateRuleStatusEvent  |
    GetRulesEvent  |
    GetRuleEvent |
    SelfRegisterEvent  |
    ApproveSelfRegistrationEvent  |
    GetAllSelfRegistrationsEvent  |
    SearchSelfRegistrationByUsernameEvent  |
    DeleteSelfRegistrationEvent |
    AddUserEvent  |
    UpdateUserEvent  |
    ChangeUserStatusEvent  |
    AddUserToGroupEvent  |
    GetUsersInGroupEvent  |
    GetUsersByStatusEvent  |
    GetNoAvatarContentEvent  |
    GetUserAvatarContentEvent  |
    SearchForUserNotInGroupEvent  |
    SearchUserByUsernameAndStatusEvent  |
    DeleteUserFromGroupEvent  |
    DeleteUserEvent  |
    HasAllUserRolesEvent  |
    HasAnyUserRolesEvent  |
    HasNoneUserRolesEvent  |
    GetUserByUsernameEvent  |
    GetUserByIdEvent  |
    UpdateUserSettingsEvent  |
    GetSettingsEvent  |
    DeleteViewEvent  |
    AddOrUpdateViewsEvent  |
    GetAllViewsEvent  |
    GetViewByIdEvent  |
    GetViewByNameEvent |
    GetViewValidationResultEvent  |
    GetAllViewValidationsEvent  |
    DeleteValidationResultEvent  |
    GetValidationsByViewIdEvent  |
    GetValidationByViewIdAndValidationIdEvent
;

export interface Event {
    type: EventType
};

export interface IncomingHttpEvent extends Event {
    type: 'IncomingHttpEvent',
    req: Request
};

export interface BulkEditPreviewEvent extends Event {
    type: 'BulkEditPreviewEvent',
    bulkEditPackage: BulkEditPackage
};

export interface BulkEditJobEvent extends Event {
    type: 'BulkEditJobEvent',
    state: 'Scheduled' | 'Completed' | 'Failed',
    jobId: number;
};

export interface ExportAttributePreviewEvent extends Event {
    type: 'ExportAttributePreviewEvent'
    attributes: Attribute[];   
};

export interface ExportAttributeJobEvent extends Event {
    type: 'ExportAttributeJobEvent',
    state: 'Scheduled' | 'Completed' | 'Failed',
    jobId: number;
}

export interface ExportItemPreviewEvent extends Event {
    type: 'ExportItemPreviewEvent'
    previewResult: ItemPreviewResult
};

export interface ExportItemJobEvent extends Event {
    type: 'ExportItemJobEvent',
    state: 'Scheduled' | 'Completed' | 'Failed',
    jobId: number
}

export interface ExportPricePreviewEvent extends Event {
    type: 'ExportPricePreviewEvent',
    previewResult: PricePreviewResult
};

export interface ExportPriceJobEvent extends Event {
    type: 'ExportPriceJobEvent',
    state: 'Scheduled' | 'Completed' | 'Failed',
    jobId: number
}

export interface ImportAttributePreviewEvent extends Event {
    type: 'ImportAttributePreviewEvent',
    previewResult: ImportAttributePreviewResult
}

export interface ImportItemPreviewEvent extends Event {
    type: 'ImportItemPreviewEvent'
    previewResult: ImportItemPreviewResult
}

export interface ImportPricePreviewEvent extends Event {
    type: 'ImportPricePreviewEvent'
    previewResult: ImportPricePreviewResult
}

export interface ImportAttributeJobEvent extends Event {
    type: 'ImportAttributeJobEvent',
    state: 'Scheduled' | 'Completed' | 'Failed',
    jobId: number
}

export interface ImportItemJobEvent extends Event {
    type: 'ImportItemJobEvent',
    state: 'Scheduled' | 'Completed' | 'Failed',
    jobId: number
}

export interface ImportPriceJobEvent extends Event {
    type: 'ImportPriceJobEvent',
    state: 'Scheduled' | 'Completed' | 'Failed',
    jobId: number
};

export interface ValidationEvent extends Event {
    type: 'ValidationEvent',
    state: 'Schedule' | 'Completed' | 'Failed'
    scheduledValidationResult?: ScheduleValidationResult,  // only when state is 'Scheduled'
    validationId: number
};

export interface UpdateAttributesEvent extends Event {
    type: 'UpdateAttributesEvent',
    updateAttributesResult: UpdateAttributesResult
};

export interface ChangeAttributeStatusEvent extends Event {
    type: 'ChangeAttributeStatusEvent',
    success: boolean,
    attributeId: number, 
    attributeStatus: Status
}

export interface GetAttributeInViewByNameEvent extends Event {
    type: 'GetAttributeInViewByNameEvent',
    viewId: number,
    attribute: Attribute
};

export interface GetAttributeInViewEvent extends Event {
    type: 'GetAttributeInViewEvent',
    attribute: Attribute,
    viewId: number
};

export interface GetAttributesInViewEvent extends Event {
    type: 'GetAttributesInViewEvent',
    attributes: Attribute[],
    viewId: number,
    limitOffset?: LimitOffset
};

export interface SaveAttributesEvent extends Event {
    type: 'SaveAttributesEvent',
    attributes: Attribute[],
    viewId: number,
    errors: string[]
};

export interface SearchAttributesByViewEvent extends Event {
    type: "SearchAttributesByViewEvent",
    search?: string,
    viewId: number,
    attributes: Attribute[]
};

export interface IsValidForgottenPasswordCodeEvent  extends Event {
    type: "IsValidForgottenPasswordCodeEvent",
    code: string,
    result: boolean
}

export interface ResetForgottenPasswordEvent extends Event {
    type: "ResetForgottenPasswordEvent",
    code: string,
    hashedPassword: string,
    errors: string[]
}

export interface ForgotPasswordEvent extends Event {
    type: "ForgotPasswordEvent",
    username?: string,
    email?: string,
    errors: string[]
}

export interface LoginEvent extends Event {
    type: "LoginEvent",
    username: string,
    result: LoginResult
};

export interface LogoutEvent extends Event {
    type: "LogoutEvent"
    user: User
};

export interface AddGlobalAvatarEvent  extends Event {
    type: 'AddGlobalAvatarEvent',   
    fileName: string,
    buffer: Buffer,
    errors: string[]
};
export interface AddGlobalImageEvent extends Event {
    type: 'AddGlobalImageEvent',
    fileName: string,
    tag: string,
    buffer: Buffer,
    errors: string[]
};
export interface SaveUserAvatarEvent extends Event {
    type: 'SaveUserAvatarEvent',
    userId: number,
    avatar: AvatarInput,
    result: SaveUserAvatarResult
};
export interface GetGlobalAvatarContentByNameEvent extends Event {
    type: 'GetGlobalAvatarContentByNameEvent',
    avatarName: string,
    binaryContent: BinaryContent
};
export interface GetAllGlobalAvatarsEvent extends Event {
    type: 'GetAllGlobalAvatarsEvent',
    globalAvatars: GlobalAvatar[]
};

export interface CategorySimpleItemsInCategoryEvent extends Event {
    type: 'CategorySimpleItemsInCategoryEvent',
    viewId: number, 
    categoryId: number,
    limitOffset: LimitOffset,
    items: CategorySimpleItem[]
};

export interface CategorySimpleItemsNotInCategoryEvent extends Event {
    type: 'CategorySimpleItemsNotInCategoryEvent',
    viewId: number,
    categoryId: number,
    limitOffset: LimitOffset,
    items: CategorySimpleItem[]
};
export interface UpdateCategoryEvent extends Event {
    type: 'UpdateCategoryEvent',
    viewId: number,
    parentCategoryId: number,
    input: UpdateCategoryInput,
    errors: string[]
}; 
export interface AddCategoryEvent extends Event {
    type: 'AddCategoryEvent',
    viewId: number,
    parentCategoryId: number,
    input: AddCategoryInput,
    errors: string[]
};  
export interface DeleteCategoryEvent extends Event {
    type: 'DeleteCategoryEvent',
    viewId: number,
    categoryId: number, 
    errors: string[]
};  
export interface GetViewCategoryByNameEvent extends Event {
    type: 'GetViewCategoryByNameEvent',
    viewId: number,
    categoryName: string,
    category: Category,
};  
export interface GetViewCategoriesEvent extends Event {
    type: 'GetViewCategoriesEvent',
    viewId: number,
    parentCategoryId: number,
    categories: Category[],
};
export interface GetViewCategoriesWithItemsEvent extends Event {
    type: 'GetViewCategoriesWithItemsEvent',
    viewId: number, 
    parentCategoryId: number, 
    categories: CategoryWithItems[]
}; 
export interface GetViewCategoryItemsEvent extends Event {
    type: 'GetViewCategoryItemsEvent',
    viewId: number, 
    categoryId: number, 
    limitOffset: LimitOffset, 
    items: Item[]
}; 
export interface AddItemToViewCategoryEvent extends Event {
    type: 'AddItemToViewCategoryEvent',
    categoryId: number, 
    itemId: number, 
    errors: string[];
};
export interface RemoveItemFromViewCategoryEvent extends Event {
    type: 'RemoveItemFromViewCategoryEvent',
    categoryId: number, 
    itemId: number, 
    errors: string[]
};
export interface GetCustomBulkEditByIdEvent extends Event {
    type: 'GetCustomBulkEditByIdEvent',
    customBulkEditId: number,
    customDataExport: CustomDataExport,
};
export interface GetAllCustomBulkEditsEvent extends Event {
    type: 'GetAllCustomBulkEditsEvent',
    customBulkEdits: CustomBulkEdit[]
};
export interface GetCustomExportByIdEvent  extends Event {
    type: 'GetCustomExportByIdEvent',
    customExportId: number,
    customDataExport: CustomDataExport
};
export interface GetAllCustomExportsEvent extends Event {
    type: 'GetAllCustomExportsEvent',
    customDataExports: CustomDataExport[]
};
export interface GetCustomImportByIdEvent extends Event {
    type: 'GetCustomImportByIdEvent',
    customImportId: number,
    customDataImport: CustomDataImport
}; 
export interface GetAllCustomImportsEvent extends Event {
    type: 'GetAllCustomImportsEvent',
    customDataImports: CustomDataImport[]
};
export interface ChangeCustomRuleStatusEvent extends Event {
    type: 'ChangeCustomRuleStatusEvent',
    viewId: number, 
    customRuleId: number, 
    status: Status, 
    result: boolean
}; 
export interface AddCustomRuleToViewEvent extends Event {
    type: 'AddCustomRuleToViewEvent',
    viewId: number, 
    customRuleIds: number[], 
    errors: string[]
};
export interface GetAllCustomRulesEvent  extends Event {
    type: 'GetAllCustomRulesEvent',
    customRules: CustomRule[]
}
export interface GetAllCustomRulesForViewEvent extends Event {
    type: 'GetAllCustomRulesForViewEvent',
    viewId: number;
    customRules: CustomRule[]
};
export interface DeleteCustomRulesEvent extends Event {
    type: 'DeleteCustomRulesEvent',
    viewId: number, 
    customRuleIds: number[], 
    errors: string[]
};
export interface SaveUserDashboardWidgetDataEvent extends Event {
    type: "SaveUserDashboardWidgetDataEvent",
    data: SerializedDashboardWidgetInstanceDataFormat,
    errors: string[]
};  
export interface SaveUserDashboardEvent extends Event {
    type: "SaveUserDashboardEvent",
    userId: number,
    data: SerializedDashboardFormat,
    errors: string[]
};
export interface GetUserDashboardWidgetSerializedDataEvent  extends Event {
    type: "GetUserDashboardWidgetSerializedDataEvent",
    userId: number,
    data: DataMap
};
export interface GetUserDashboardSerializedDataEvent {
    type: "GetUserDashboardSerializedDataEvent",
    userId: number,
    data: string
};
export interface GetExportArtifactContentEvent extends Event {
    type: "GetExportArtifactContentEvent",
    dataExportId: number,
    content: BinaryContent
}; 
export interface DeleteExportArtifactByIdEvent extends Event {
    type: "DeleteExportArtifactByIdEvent",
    dataExportArtifactId: number,
    result: boolean
}; 
export interface GetAllExportArtifactsEvent extends Event {
    type: "GetAllExportArtifactsEvent",
    dataExportArtifacts: DataExportArtifact[]
};
export interface DeleteGroupEvent extends Event {
    type: "DeleteGroupEvent",
    groupIds: number[]
} 
export interface AddOrUpdateGroupEvent extends Event {
    type: "AddOrUpdateGroup",
    input: AddOrUpdateGroupInput,
    errors: string[]
}  
export interface SearchForGroupsWithNoSuchRoleEvent extends Event {
    type: "SearchForGroupsWithNoSuchRoleEvent",
    roleName: string,
    groupName: string,
    groups: Group[]
}  
export interface SearchForGroupByNameEvent extends Event {
    type: "SearchForGroupByNameEvent",
    groupName: string, 
    groups: Group[]
};  
export interface GetGroupsWithRoleEvent extends Event {
    type: "GetGroupsWithRoleEvent",
    roleName: string,
    groups: Group[]
};
export interface GetGroupByNameEvent extends Event {
    type: "GetGroupByNameEvent",
    groupName: string,
    group: Group
}  
export interface GetGroupByIdEvent extends Event {
    type: "GetGroupByIdEvent",
    groupId: number,
    group: Group
}
export interface GetAllGroupsEvent extends Event {
    type: "GetAllGroupsEvent"
    groups: Group[]
}
export interface CreateInvitationEvent extends Event {
    type: "CreateInvitationEvent",
    email: string, 
    groupIds: number[], 
    sendMail: boolean, 
    invitationCode: string, 
    errors: string[]
}
export interface ActivateInvitationEvent extends Event {
    type: "ActivateInvitationEvent",
    code: string, 
    username: string, 
    email: string, 
    firstName: string, 
    lastName: string, 
    password: string, 
    result: ActivateInvitationResult,
}
export interface GetInvitationByCodeEvent extends Event {
    type: "GetInvitationByCodeEvent",
    code: string,
    invitation: Invitation
};

export interface UpdateItemsStatusEvent  extends Event {
    type: 'UpdateItemsStatusEvent',
    itemIds: number[],
    status: Status,
    errors: string[],
} 
export interface UpdateItemValueEvent extends Event {
    type: 'UpdateItemValueEvent',
    viewId: number, 
    itemId: number, 
    value: Value
} 
export interface UpdateItemEvent extends Event {
    type: 'UpdateItemEvent',
    viewId: number, 
    item: Item, 
    errors: string[]
}
export interface AddItemEvent extends Event {
    type: 'AddItemEvent',
    viewId: number, 
    item: Item, 
    errors: string[],
}
export interface AddOrUpdateItemEvent extends Event {
    type: 'AddOrUpdateItemEvent',
    viewId: number,
    item: Item,
    errors: string[]
} 
export interface SearchForFavouriteItemsInViewEvent extends Event {
    type: 'SearchForFavouriteItemsInViewEvent',
    viewId: number, 
    userId: number, 
    searchType: ItemSearchType, 
    search: string, 
    limitOffset: LimitOffset, 
    items: Item[]
};
export interface SearchForItemsInViewEvent extends Event {
    type: 'SearchForItemsInViewEvent',
    viewId: number, 
    searchType: ItemSearchType, 
    search: string, 
    limitOffset: LimitOffset, 
    items: Item[]
};
export interface AddFavouriteItemIdsEvent extends Event {
    type: 'AddFavouriteItemIdsEvent',
    userId: number, 
    itemIds: number[], 
    errors: string[]
}
export interface RemoveFavouriteItemIdsEvent extends Event {
    type: 'RemoveFavouriteItemIdsEvent',
    userId: number, 
    itemIds: number[], 
    errors: string[]
};
export interface GetAllFavouriteItemIdsInViewEvent extends Event {
    type: 'GetAllFavouriteItemIdsInViewEvent',
    viewId: number, 
    userId: number, 
    itemIds: number[]
}
export interface GetAllFavouritedItemsInViewEvent extends Event {
    type: 'GetAllFavouritedItemsInViewEvent',
    viewId: number, 
    userId: number, 
    limitOffset: LimitOffset, 
    items: Item[],
}
export interface GetAllItemsInViewEvent extends Event {
    type: 'GetAllItemsInViewEvent',
    viewId: number, 
    parentOnly: boolean, 
    limitOffset: LimitOffset, 
    items: Item[]
};
export interface GetItemsByIdsEvent extends Event {
    type: 'GetItemsByIdsEvent',
    viewId: number, 
    itemIds: number[], 
    parentOnly: boolean, 
    limitOffset: LimitOffset, 
    items: Item[]
}
export interface GetItemByIdEvent extends Event {
    type: 'GetItemByIdEvent',
    viewId: number, 
    itemId: number, 
    item: Item
}
export interface GetItemByNameEvent extends Event {
    type: 'GetItemByNameEvent',
    viewId: number, 
    itemName: string, 
    item: Item
}
export interface GetItemWithFilteringEvent extends Event {
    type: 'GetItemWithFilteringEvent',
    viewId: number, 
    parentItemId: number, 
    whenClauses: ItemValueOperatorAndAttribute[], 
    itemWithFilteringResult: ItemWithFilteringResult
};

export interface MarkItemImageAsPrimaryEvent extends Event {
    type: 'MarkItemImageAsPrimaryEvent',
    itemId: number,
    itemImageId: number,
    errors: string[]
};
export interface GetItemPrimaryImageEvent extends Event {
    type: 'GetItemPrimaryImageEvent',
    itemId: number,
    binaryContent: BinaryContent
};
export interface GetItemImageContentEvent extends Event {
    type: 'GetItemImageContentEvent',
    itemImageId: number,
    binaryContent: BinaryContent
};
export interface AddItemImageEvent extends Event {
    type: 'AddItemImageEvent',
    itemId: number,
    fileName: string,
    image: Buffer,
    primaryImage: boolean,
    result: boolean
};

export interface DeleteItemImageEvent extends Event {
    type: 'DeleteItemImageEvent',
    itemId: number,
    itemImageId: number,
    result: boolean
}

export interface GetJobDetailsByIdEvent extends Event {
    type: 'GetJobDetailsByIdEvent',
    jobId: number,
    lastLogId: number,
    jobAndLogs: JobAndLogs
};
export interface GetAllJobsEvent extends Event {
    type: 'GetAllJobsEvent',
    jobs: Job[]
};
export interface GetJobByIdEvent extends Event {
    type: 'GetJobByIdEvent',
    jobId: number,
    job: Job
};
export interface CreateJwtTokenEvent extends Event {
    type: "CreateJwtTokenEvent",
    user: User,
    jwtToken: string
}
export interface DecodeJwtTokenEvent extends Event {
    type: "DecodeJwtTokenEvent",
    jwtPayload: JwtPayload
}
export interface VerifyJwtTokenEvent extends Event {
    type: "VerifyJwtTokenEvent",
    jwtPayload: JwtPayload
};

export interface AddUserNotificationEvent extends Event {
    type: 'AddUserNotificationEvent',
    userId: number,
    newNotification: NewNotification,
    result: boolean
};
export interface GetUserNotificationsEvent extends Event {
    type: "GetUserNotificationsEvent",
    userId: number,
    notifications: AppNotification[]
};

export interface GetPricedItemsEvent extends Event {
    type: 'GetPricedItemsEvent',
    pricingStructureId: number,
    pricedItems: PricedItem[]
};

export interface GetPricedItemsWithFilteringEvent extends Event {
    type: 'GetPricedItemsWithFilteringEvent',
    viewId: number,
    pricingStructureId: number,
    parentItemId: number,
    whenClauses: ItemValueOperatorAndAttribute[],
    result: PricedItemsWithFilteringResult
};

export interface SearchGroupsAssociatedWithPricingStructureEvent extends Event {
    type: 'SearchGroupsAssociatedWithPricingStructureEvent',
    pricingStructureId: number,
    groupName: string,
    groups: Group[]
}
export interface SearchGroupsNotAssociatedWithPricingStructureEvent extends Event {
    type: 'SearchGroupsNotAssociatedWithPricingStructureEvent',
    pricingStructureId: number,
    groupName: string,
    groups: Group[]
}
export interface GetPricingStructureGroupAssociationsEvent extends Event {
    type: 'GetPricingStructureGroupAssociationsEvent',
    pricingStructureGroupAssociations: PricingStructureGroupAssociation[]
}
export interface LinkPricingStructureWithGroupIdEvent extends Event {
    type: 'LinkPricingStructureWithGroupIdEvent',
    pricingStructureId: number,
    groupId: number,
    errors: string[]
}
export interface UnlinkPricingStructureWithGroupIdEvent extends Event {
    type: 'UnlinkPricingStructureWithGroupIdEvent',
    pricingStructureId: number,
    groupId: number,
    errors: string[]
}
export interface UpdatePricingStructureStatusEvent  extends Event {
    type: 'UpdatePricingStructureStatusEvent',
    pricingStructureId: number,
    status: Status,
    result: boolean
}
export interface AddOrUpdatePricingStructuresEvent extends Event {
    type: 'AddOrUpdatePricingStructuresEvent',
    pricingStructures: PricingStructure[],
    errors: string[]
}
export interface GetPricingStructuresByViewEvent extends Event {
    type: 'GetPricingStructuresByViewEvent',
    viewId: number,
    pricingStructures: PricingStructure[]
}
export interface GetPartnerPricingStructuresEvent  extends Event {
    type: 'GetPartnerPricingStructuresEvent',
    userId: number,
    pricingStructures: PricingStructure[]
}
export interface GetAllPricingStructureItemsWithPriceEvent extends Event {
    type: 'GetAllPricingStructureItemsWithPriceEvent',
    pricingStructureId: number,
    limitOffset: LimitOffset,
    pricingStructureItemWithPrices: PricingStructureItemWithPrice[]
}
export interface GetAllPricingStructuresEvent extends Event {
    type: 'GetAllPricingStructuresEvent',
    pricingStructures: PricingStructure[]
}
export interface GetPricingStructureByNameEvent extends Event {
    type: 'GetPricingStructureByNameEvent',
    pricingStructureName: string,
    pricingStructure: PricingStructure
}
export interface GetPricingStructureByIdEvent extends Event {
    type: 'GetPricingStructureByIdEvent',
    pricingStructureId: number,
    pricingStructure: PricingStructure
}

export interface SetPricesEvent extends Event {
    type: "SetPricesEvent",
    priceDataItems: {
        pricingStructureId: number,
        item: {
            itemId: number,
            price: number,
            country: CountryCurrencyUnits
        }
    }[]
}
export interface AddItemToPricingStructureEvent extends Event {
    type: "AddItemToPricingStructureEvent",
    viewId: number,
    pricingStructureId: number,
    itemId: number,
    result: boolean
}
export interface GetPricingStructureItemEvent extends Event {
    type: "GetPricingStructureItemEvent",
    viewId: number,
    pricingStructureId: number,
    itemId: number,
    pricingStructureItemWithPrice: PricingStructureItemWithPrice
}

export interface AddOrUpdateRoleEvent extends Event {
    type: "AddOrUpdateRoleEvent",
    role: Role,
    errors: string[]
};
export interface AddRoleToGroupEvent extends Event {
    type: "AddRoleToGroupEvent",
    groupId: number,
    roleName: string,
    errors: string[]
}
export interface GetRoleByNameEvent extends Event {
    type: "GetRoleByNameEvent",
    roleName: string,
    role: Role
}
export interface GetAllRolesEvent extends Event {
    type: "GetAllRolesEvent",
    roles: Role[]
}
export interface RemoveRoleFromGroup extends Event {
    type: "RemoveRoleFromGroup",
    roleName: string,
    groupId: number,
    errors: string[]
}

export interface AddOrUpdateRuleEvent extends Event {
    type: 'AddOrUpdateRuleEvent',
    rules: Rule[],
    errors: string[]
}
export interface UpdateRuleStatusEvent extends Event {
    type: 'UpdateRuleStatusEvent',
    ruleId: number,
    status: Status,
    result: boolean
}
export interface GetRulesEvent extends Event {
    type: 'GetRulesEvent',
    viewId: number,
    rules: Rule[]
}
export interface GetRuleEvent extends Event {
    type: 'GetRuleEvent',
    viewId: number,
    ruleId: number,
    rule: Rule
}
export interface SelfRegisterEvent extends Event  {
    type: 'SelfRegisterEvent',
    username: string,
    email: string,
    firstName: string,
    lastName: string,
    password: string,
    result: SelfRegisterResult
}
export interface ApproveSelfRegistrationEvent extends Event {
    type: 'ApproveSelfRegistrationEvent',
    selfRegistrationId: number,
    approveSelfRegistrationResult: ApproveSelfRegistrationResult
}
export interface GetAllSelfRegistrationsEvent extends Event {
    type: 'GetAllSelfRegistrationsEvent',
    selfRegistrations: SelfRegistration[]
}
export interface SearchSelfRegistrationByUsernameEvent extends Event {
    type: 'SearchSelfRegistrationByUsernameEvent',
    username: string,
    selfRegistrations: SelfRegistration[]
}
export interface DeleteSelfRegistrationEvent extends Event {
    type: 'DeleteSelfRegistrationEvent',
    selfRegistrationId: number,
    result: boolean
}
export interface AddUserEvent extends Event {
    type: 'AddUserEvent',
    input: AddUserInput,
    errors: string[]
}
export interface UpdateUserEvent extends Event {
    type: "UpdateUserEvent",
    input: UpdateUserInput,
    errors: string[]
}
export interface ChangeUserStatusEvent extends Event {
    type: "ChangeUserStatusEvent",
    userId: number,
    status: Status,
    result: boolean
}
export interface AddUserToGroupEvent extends Event {
    type: "AddUserToGroupEvent",
    userId: number,
    groupId: number,
    errors: string[]
}
export interface GetUsersInGroupEvent extends Event {
    type: "GetUsersInGroupEvent",
    groupId: number,
    users: User[]
}
export interface GetUsersByStatusEvent extends Event {
    type: "GetUsersByStatusEvent",
    status: Status,
    users: User[],
}
export interface GetNoAvatarContentEvent extends Event {
    type: "GetNoAvatarContentEvent",
    binaryContent: BinaryContent
}
export interface GetUserAvatarContentEvent  extends Event {
    type: "GetUserAvatarContentEvent",
    userId: number,
    binaryContent: BinaryContent
}
export interface SearchForUserNotInGroupEvent extends Event {
    type: "SearchForUserNotInGroupEvent",
    groupId: number,
    username: string,
    users: User[]
}
export interface SearchUserByUsernameAndStatusEvent extends Event {
    type: "SearchUserByUsernameAndStatusEvent",
    username: string,
    status: Status,
    users: User[]
}
export interface DeleteUserFromGroupEvent extends Event {
    type: "DeleteUserFromGroupEvent",
    userId: number,
    groupId: number,
    errors: string[]
}
export interface DeleteUserEvent extends Event {
    type: "DeleteUserEvent",
    userId: number,
    result: boolean
}
export interface HasAllUserRolesEvent extends Event {
    type: "HasAllUserRolesEvent",
    userId: number,
    roleNames: string[],
    result: boolean
}
export interface HasAnyUserRolesEvent extends Event {
    type: "HasAnyUserRolesEvent",
    userId: number,
    roleNames: string[],
    result: boolean
}
export interface HasNoneUserRolesEvent extends Event {
    type: "HasNoneUserRolesEvent",
    userId: number,
    roleNames: string[],
    result: boolean
}
export interface GetUserByUsernameEvent extends Event {
    type: "GetUserByUsernameEvent",
    username: string,
    user: User
}
export interface GetUserByIdEvent extends Event {
    type: "GetUserByIdEvent",
    userId: number,
    user: User,
}

export interface UpdateUserSettingsEvent extends Event {
    type: 'UpdateUserSettingsEvent',
    userId: number,
    settings: UpdateUserSettingsInput,
    errors: string[]
}
export interface GetSettingsEvent extends Event {
    type: 'GetSettingsEvent',
    userId: number,
    settings: Settings
}
export interface DeleteViewEvent extends Event {
    type: 'DeleteViewEvent',
    viewId: number,
    result: boolean
}
export interface AddOrUpdateViewsEvent extends Event {
    type: 'AddOrUpdateViewsEvent',
    input: AddOrUpdateViewsInput,
    errors: string[]
}
export interface GetAllViewsEvent extends Event {
    type: 'GetAllViewsEvent',
    views: View[]
}
export interface GetViewByIdEvent extends Event {
    type: 'GetViewByIdEvent',
    viewId: number,
    view: View
}
export interface GetViewByNameEvent extends Event {
    type: 'GetViewByNameEvent',
    viewName: string,
    view: View
}
export interface GetViewValidationResultEvent extends Event {
    type: 'GetViewValidationResultEvent',
    viewId: number,
    validationId: number,
    result: ValidationResult
}
export interface GetAllViewValidationsEvent extends Event {
    type: 'GetAllViewValidationsEvent',
    viewId: number,
    result: Validation[]
}
export interface DeleteValidationResultEvent extends Event {
    type: 'DeleteValidationResultEvent',
    viewId: number,
    validationId: number,
    result: boolean
}
export interface GetValidationsByViewIdEvent extends Event {
    type: 'GetValidationsByViewIdEvent',
    viewId: number,
    result: Validation[],
}
export interface GetValidationByViewIdAndValidationIdEvent extends Event {
    type: 'GetValidationByViewIdAndValidationIdEvent',
    viewId: number,
    validationId: number,
    result: Validation
}

