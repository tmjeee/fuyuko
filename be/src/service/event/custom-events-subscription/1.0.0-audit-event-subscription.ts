import {Observable} from "rxjs";
import {audit, auditTime, tap} from "rxjs/operators";
import {auditLog, auditLogInfo} from "../../audit.service";
import {
    AllEvents,
    EventType,
    EventSubscriptionRegistry,
    IncomingHttpEvent,
    newEventSubscriptionRegistry,
    BulkEditPreviewEvent,
    BulkEditJobEvent,
    ExportAttributePreviewEvent,
    ExportItemPreviewEvent,
    ExportPricePreviewEvent,
    ExportAttributeJobEvent,
    ExportItemJobEvent,
    ExportPriceJobEvent,
    ImportAttributePreviewEvent,
    ImportItemPreviewEvent,
    ImportPricePreviewEvent,
    ImportAttributeJobEvent,
    ImportItemJobEvent,
    ImportPriceJobEvent,
    ValidationEvent,
    UpdateAttributesEvent,
    ChangeAttributeStatusEvent,
    GetAttributeInViewByNameEvent,
    GetAttributeInViewEvent,
    GetAttributesInViewEvent,
    SaveAttributesEvent,
    SearchAttributesByViewEvent,
    IsValidForgottenPasswordCodeEvent,
    ResetForgottenPasswordEvent,
    ForgotPasswordEvent,
    LoginEvent,
    LogoutEvent,
    AddGlobalAvatarEvent,
    AddGlobalImageEvent,
    SaveUserAvatarEvent,
    GetGlobalAvatarContentByNameEvent,
    GetAllGlobalAvatarsEvent,
    CategorySimpleItemsNotInCategoryEvent,
    UpdateCategoryEvent,
    AddCategoryEvent,
    DeleteCategoryEvent,
    GetViewCategoryByNameEvent,
    GetViewCategoriesEvent,
    GetViewCategoriesWithItemsEvent,
    GetViewCategoryItemsEvent,
    AddItemToViewCategoryEvent,
    RemoveItemFromViewCategoryEvent,
    GetCustomBulkEditByIdEvent,
    GetAllCustomBulkEditsEvent,
    GetCustomExportByIdEvent,
    GetAllCustomExportsEvent,
    GetCustomImportByIdEvent,
    GetAllCustomImportsEvent,
    ChangeCustomRuleStatusEvent,
    AddCustomRuleToViewEvent,
    GetAllCustomRulesEvent,
    GetAllCustomRulesForViewEvent,
    DeleteCustomRulesEvent,
    SaveUserDashboardEvent,
    GetUserDashboardWidgetSerializedDataEvent,
    GetUserDashboardSerializedDataEvent,
    GetExportArtifactContentEvent,
    DeleteExportArtifactByIdEvent,
    GetAllExportArtifactsEvent,
    CreateInvitationEvent,
    ActivateInvitationEvent,
    GetInvitationByCodeEvent,
    DeleteGroupEvent,
    AddOrUpdateGroupEvent,
    SearchForGroupsWithNoSuchRoleEvent,
    SearchForGroupByNameEvent,
    GetGroupsWithRoleEvent,
    GetGroupByNameEvent,
    GetGroupByIdEvent,
    GetAllGroupsEvent,
    UpdateItemsStatusEvent,
    UpdateItemValueEvent,
    UpdateItemEvent,
    AddItemEvent,
    AddOrUpdateItemEvent,
    SearchForFavouriteItemsInViewEvent,
    SearchForItemsInViewEvent,
    AddFavouriteItemIdsEvent,
    RemoveFavouriteItemIdsEvent,
    GetAllFavouriteItemIdsInViewEvent,
    GetAllFavouritedItemsInViewEvent,
    GetAllItemsInViewEvent,
    GetItemsByIdsEvent,
    GetItemByIdEvent,
    GetItemByNameEvent,
    GetItemWithFilteringEvent,
    MarkItemImageAsPrimaryEvent,
    GetItemPrimaryImageEvent,
    GetItemImageContentEvent,
    AddItemImageEvent,
    DeleteItemImageEvent,
    GetJobDetailsByIdEvent,
    GetAllJobsEvent,
    GetJobByIdEvent,
    CreateJwtTokenEvent,
    DecodeJwtTokenEvent,
    VerifyJwtTokenEvent,
    AddUserNotificationEvent,
    GetUserNotificationsEvent,
    GetPricedItemsEvent,
    GetPricedItemsWithFilteringEvent,
    SearchGroupsNotAssociatedWithPricingStructureEvent,
    GetPricingStructureGroupAssociationsEvent,
    LinkPricingStructureWithGroupIdEvent,
    UnlinkPricingStructureWithGroupIdEvent,
    UpdatePricingStructureStatusEvent,
    AddOrUpdatePricingStructuresEvent,
    GetPricingStructuresByViewEvent,
    GetPartnerPricingStructuresEvent,
    GetAllPricingStructureItemsWithPriceEvent,
    GetAllPricingStructuresEvent,
    GetPricingStructureByNameEvent,
    GetPricingStructureByIdEvent,
    SetPricesEvent,
    AddItemToPricingStructureEvent,
    GetPricingStructureItemEvent,
    AddOrUpdateRoleEvent,
    AddRoleToGroupEvent,
    GetRoleByNameEvent,
    GetAllRolesEvent,
    RemoveRoleFromGroup,
    AddOrUpdateRuleEvent,
    UpdateRuleStatusEvent,
    GetRulesEvent,
    GetRuleEvent,
    SelfRegisterEvent,
    ApproveSelfRegistrationEvent,
    GetAllSelfRegistrationsEvent,
    SearchSelfRegistrationByUsernameEvent,
    DeleteSelfRegistrationEvent,
    AddUserEvent,
    UpdateUserEvent,
    ChangeUserStatusEvent,
    AddUserToGroupEvent,
    GetUsersInGroupEvent,
    GetUsersByStatusEvent,
    GetNoAvatarContentEvent,
    GetUserAvatarContentEvent,
    SearchForUserNotInGroupEvent,
    SearchUserByUsernameAndStatusEvent,
    DeleteUserFromGroupEvent,
    DeleteUserEvent,
    HasAllUserRolesEvent,
    HasAnyUserRolesEvent,
    HasNoneUserRolesEvent,
    GetUserByUsernameEvent,
    GetUserByIdEvent,
    UpdateUserSettingsEvent,
    GetSettingsEvent,
    DeleteViewEvent,
    GetAllViewsEvent,
    GetViewByIdEvent,
    GetViewByNameEvent,
    GetViewValidationResultEvent,
    GetAllViewValidationsEvent,
    DeleteValidationResultEvent,
    GetValidationsByViewIdEvent,
    GetValidationByViewIdAndValidationIdEvent,
    AddOrUpdateViewsEvent
} from '../event.service';
import {BulkEditItem, BulkEditPackage} from '@fuyuko-common/model/bulk-edit.model';
import {Router} from 'express';
import {Registry} from '../../../registry';


const d: any = {
    subscription: null,
    IncomingHttpEvent: async (evt: IncomingHttpEvent) => {
        await auditLogInfo(`${evt.req.method}-${evt.req.originalUrl}`, 'HTTP');
    },
    BulkEditPreviewEvent: async (evt: BulkEditPreviewEvent) => {
        const bulkEditPackage: BulkEditPackage = evt.bulkEditPackage;
        const bulkEditItems: BulkEditItem[] = bulkEditPackage.bulkEditItems;
        const s = JSON.stringify(bulkEditItems);
        await auditLogInfo(`Preview on bulk edit items - ${s}`, 'USER')
    },
    BulkEditJobEvent: async (evt: BulkEditJobEvent) => {
        const msg = `Run bulk edit job id ${evt.jobId} state ${evt.state}`;
        await auditLogInfo(`${msg}`, 'SYSTEM');
    },
    ExportAttributePreviewEvent: async (evt: ExportAttributePreviewEvent) => {
        const s = JSON.stringify(evt.attributes);
        const msg = `attribute export preview - ${s}`;
        await auditLogInfo(`${msg}`, 'USER');
    },
    ExportItemPreviewEvent: async (evt: ExportItemPreviewEvent) => {
        const s = JSON.stringify(evt.previewResult.i);
        const msg = `item export preview - ${s}`;
        await auditLogInfo(`${msg}`, 'USER');
    },
    ExportPricePreviewEvent: async (evt: ExportPricePreviewEvent) => {
        const s = JSON.stringify(evt.previewResult.i);
        const msg = `price export preview - ${s}`;
        await auditLogInfo(`${msg}`, 'USER');
    },
    ExportAttributeJobEvent: async (evt: ExportAttributeJobEvent) => {
        const msg = `Run attribute export job id ${evt.jobId} state ${evt.state}`;
        await auditLogInfo(`${msg}`, 'SYSTEM');
    },
    ExportItemJobEvent: async (evt: ExportItemJobEvent) => {
        const msg = `Run item export job id ${evt.jobId} state ${evt.state}`;
        await auditLogInfo(`${msg}`, 'SYSTEM');
    },
    ExportPriceJobEvent: async (evt: ExportPriceJobEvent) => {
        const msg = `Run price export job id ${evt.jobId} state ${evt.state}`;
        await auditLogInfo(`${msg}`, 'SYSTEM');
    },
    ImportAttributePreviewEvent: async (evt: ImportAttributePreviewEvent) => {
        const s = JSON.stringify(evt.previewResult);
        const msg = `attribute import preview - ${s}`;
        await auditLogInfo(`${msg}`, 'SYSTEM');
    },
    ImportItemPreviewEvent: async (evt: ImportItemPreviewEvent) => {
        const s = JSON.stringify(evt.previewResult);
        const msg = `item import preview - ${s}`;
        await auditLogInfo(`${msg}`, 'USER');
    },
    ImportPricePreviewEvent: async (evt: ImportPricePreviewEvent) => {
        const s = JSON.stringify(evt.previewResult);
        const msg = `price import previw - ${s}`;
        await auditLogInfo(`${msg}`, 'USER');
    },
    ImportAttributeJobEvent: async (evt: ImportAttributeJobEvent) => {
        const msg = `Run attribute import job id ${evt.jobId} state ${evt.state}`;
        await auditLogInfo(`${msg}`, 'SYSTEM');
    },
    ImportItemJobEvent: async (evt: ImportItemJobEvent) => {
        const msg = `Run item import job id ${evt.jobId} state ${evt.state}`;
        await auditLogInfo(`${msg}`, 'SYSTEM');
    },
    ImportPriceJobEvent: async (evt: ImportPriceJobEvent) => {
        const msg = `Run price import job id ${evt.jobId} state ${evt.state}`;
        await auditLogInfo(`${msg}`, 'SYSTEM');
    },
    ValidationEvent: async (evt: ValidationEvent) => {
        const s = JSON.stringify(evt.scheduledValidationResult);
        const msg = `Run validation ${evt.validationId} ${evt.state} - ${s}`;
        await auditLogInfo(`${msg}`, 'USER');
    },
    UpdateAttributesEvent: async (evt: UpdateAttributesEvent) => {
        const s = JSON.stringify(evt.updateAttributesResult);
        const msg = `Update attribute - ${s}`;
        await auditLogInfo(`${msg}`, 'USER');
    },
    ChangeAttributeStatusEvent: async (evt: ChangeAttributeStatusEvent) => {
        const msg = `Change attribute status - attributeId ${evt.attributeId} - status ${evt.attributeStatus} - result ${evt.success}`;
        await auditLogInfo(`${msg}`, 'USER');
    },
    GetAttributeInViewByNameEvent: async (evt: GetAttributeInViewByNameEvent) => {
        const msg = `Get attribute in view ${evt.viewId} ${JSON.stringify(evt.attribute)}`;
        await auditLogInfo(`${msg}`, 'USER');
    },
    GetAttributeInViewEvent: async (evt: GetAttributeInViewEvent) => {
        const msg = `Get attribute in view ${evt.viewId} - ${JSON.stringify(evt.attribute)}`;
        await auditLogInfo(`${msg}`, 'USER');
    },
    GetAttributesInViewEvent: async (evt: GetAttributesInViewEvent) => {
        const msg = `Get attributes in view ${evt.viewId} limitoffset ${JSON.stringify(evt.limitOffset)} - ${JSON.stringify(evt.attributes)}`;
        await auditLogInfo(`${msg}`, 'USER');
    },
    SaveAttributesEvent: async (evt: SaveAttributesEvent) => {
        const msg = `Save attributes in view ${evt.viewId} errors - ${evt.errors} - attributes ${JSON.stringify(evt.attributes)}`;
        await auditLogInfo(`${msg}`, 'USER');
    },
    SearchAttributesByViewEvent: async (evt: SearchAttributesByViewEvent) => {
        const msg = `search attributes in view ${evt.viewId}, search - ${evt.search}, type - ${evt.type}, ${JSON.stringify(evt.attributes)}`;
        await auditLogInfo(`${msg}`, 'USER');
    },
    IsValidForgottenPasswordCodeEvent: async (evt: IsValidForgottenPasswordCodeEvent) => {
        const msg = `is valid forgotten password, code - ${evt.code}, result - ${evt.result}`;
        await auditLogInfo(`${msg}`, 'USER');
    },
    ResetForgottenPasswordEvent: async (evt: ResetForgottenPasswordEvent) => {
        const msg = `Reset forgotten password, code - ${evt.code}, pwd - ${evt.hashedPassword}, errors - ${JSON.stringify(evt.errors)}`;
        await auditLogInfo(`${msg}`, 'USER');
    },
    ForgotPasswordEvent: async (evt: ForgotPasswordEvent) => {
        const msg = `Forgotten password, email - ${evt.email}, username - ${evt.username}, errors - ${JSON.stringify(evt.errors)}`;
        await auditLogInfo(`${msg}`, 'USER');
    },
    LoginEvent: async (evt: LoginEvent) => {
        const msg = `Login, username - ${evt.username}, result - ${evt.result}`;
        await auditLogInfo(`${msg}`, 'USER');
    },
    LogoutEvent: async (evt: LogoutEvent) => {
        const msg = `Logout, ${evt.user.username}`;
        await auditLogInfo(`${msg}`, 'USER');
    },
    AddGlobalAvatarEvent: async (evt: AddGlobalAvatarEvent) => {
        const msg = `add global avatar, filename - ${evt.fileName}, errors - ${JSON.stringify(evt.errors)}`;
        await auditLogInfo(`${msg}`, 'USER');
    },
    AddGlobalImageEvent: async (evt: AddGlobalImageEvent) => {
        const msg = `add global image, filename - ${evt.fileName}, errors - ${JSON.stringify(evt.errors)}`;
        await auditLogInfo(`${msg}`, 'USER');
    },
    SaveUserAvatarEvent: async (evt: SaveUserAvatarEvent) => {
        const msg = `save user avatar, userId - ${evt.userId}, globalAvatarName - ${evt.avatar.globalAvatarName}, filename - ${evt.avatar.customAvatarFile?.name}, result - ${evt.result}`;
        await auditLogInfo(`${msg}`, 'USER');
    },
    GetGlobalAvatarContentByNameEvent: async (evt: GetGlobalAvatarContentByNameEvent) => {
        const msg = `get global avatar by name ${evt.avatarName}`;
        await auditLogInfo(`${msg}`, 'USER');
    },
    GetAllGlobalAvatarsEvent: async (evt: GetAllGlobalAvatarsEvent) => {
        const msg = `get all global avatars ${JSON.stringify(evt.globalAvatars)}`;
        await auditLogInfo(`${msg}`, 'USER');
    },
    CategorySimpleItemsInCategoryEvent: async (evt: CategorySimpleItemsNotInCategoryEvent) => {
        const msg = `get categoryId ${evt.categoryId} items in view ${evt.viewId}, limitOffset - ${JSON.stringify(evt.limitOffset)}, items - ${JSON.stringify(evt.items)}`;
        await auditLogInfo(`${msg}`, 'USER');
    },
    CategorySimpleItemsNotInCategoryEvent: async (evt: CategorySimpleItemsNotInCategoryEvent) => {
        const msg = `get categoryId ${evt.categoryId} items not in view ${evt.viewId}, limitOffset - ${JSON.stringify(evt.limitOffset)}, items - ${JSON.stringify(evt.items)}`;
        await auditLogInfo(`${msg}`, 'USER');
    },
    UpdateCategoryEvent: async (evt: UpdateCategoryEvent) => {
        const msg = `update category viewId - ${evt.viewId}, parentCategoryId - ${evt.parentCategoryId}, input - ${JSON.stringify(evt.input)}, errors - ${JSON.stringify(evt.errors)} `;
        await auditLogInfo(`${msg}`, 'USER');
    },
    AddCategoryEvent: async (evt: AddCategoryEvent) => {
        const msg = `add category viewId - ${evt.viewId}, parentCategoryId - ${evt.parentCategoryId}, input ${JSON.stringify(evt.input)}, errors - ${JSON.stringify(evt.errors)}`;
        await auditLog(`${msg}`, 'USER');
    },
    DeleteCategoryEvent: async (evt: DeleteCategoryEvent) => {
        const msg = `delete category viewId - ${evt.viewId}, categoryId - ${evt.categoryId}, errors - ${JSON.stringify(evt.errors)}`;
        await auditLog(`${msg}`, 'USER');
    },
    GetViewCategoryByNameEvent: async (evt: GetViewCategoryByNameEvent) => {
        const msg = `get category by name ${evt.categoryName}, viewId - ${evt.viewId}, result - ${JSON.stringify(evt.category)}`;
        await auditLog(`${msg}`, 'USER');
    },
    GetViewCategoriesEvent: async (evt: GetViewCategoriesEvent) => {
        const msg = `get view categories viewId - ${evt.viewId}, parentCategoryId - ${(evt.parentCategoryId)}, categories ${JSON.stringify(evt.categories)}`;
        await auditLog(`${msg}`, 'USER');
    },
    GetViewCategoriesWithItemsEvent: async (evt: GetViewCategoriesWithItemsEvent) => {
        const msg = `get view categories with items, viewId - ${evt.viewId}, parentCategoryId - ${evt.parentCategoryId}, result - ${JSON.stringify(evt.categories)}`;
        await auditLog(`${msg}`, 'USER');
    },
    GetViewCategoryItemsEvent: async (evt: GetViewCategoryItemsEvent) => {
        const msg = `get view category item, viewId - ${evt.viewId}, categoryId - ${evt.categoryId}, limitOffset - ${JSON.stringify(evt.limitOffset)}, result ${JSON.stringify(evt.items)}`;
        await auditLog(`${msg}`, 'USER');
    },
    AddItemToViewCategoryEvent: async (evt: AddItemToViewCategoryEvent) => {
        const msg = `add item to category, categoryId - ${evt.categoryId}, itemId - ${evt.itemId}, errors - ${JSON.stringify(evt.errors)}`;
        await auditLog(`${msg}`, 'USER');
    },
    RemoveItemFromViewCategoryEvent: async (evt: RemoveItemFromViewCategoryEvent) => {
        const msg = `remove item from category, categoryId - ${evt.categoryId}, itemId - ${evt.itemId}, errors - ${JSON.stringify(evt.errors)}`;
        await auditLog(`${msg}`, 'USER');
    },
    GetCustomBulkEditByIdEvent: async (evt: GetCustomBulkEditByIdEvent) => {
        const msg = `get custom builk edit by id ${evt.customBulkEditId}, result - ${JSON.stringify(evt.customDataExport)}`;
        await auditLog(`${msg}`, 'USER');
    },
    GetAllCustomBulkEditsEvent: async (evt: GetAllCustomBulkEditsEvent) => {
        const msg = `get all custom bulk edits result - ${JSON.stringify(evt.customBulkEdits)}`;
        await auditLog(`${msg}`, 'USER');
    },
    GetCustomExportByIdEvent: async (evt: GetCustomExportByIdEvent) => {
        const msg = `get custom export by id ${evt.customExportId}, result - ${JSON.stringify(evt.customDataExport)}`;
        await auditLog(`${msg}`, 'USER');
    },
    GetAllCustomExportsEvent: async (evt: GetAllCustomExportsEvent) => {
        const msg = `get all custom exports result - ${JSON.stringify(evt.customDataExports)} `;
        await auditLog(`${msg}`, 'USER');
    },
    GetCustomImportByIdEvent: async (evt: GetCustomImportByIdEvent) => {
        const msg = `get custom import by id ${evt.customImportId}, result - ${JSON.stringify(evt.customDataImport)}`;
        await auditLog(`${msg}`, 'USER');
    },
    GetAllCustomImportsEvent: async (evt: GetAllCustomImportsEvent) => {
        const msg = `get all custom imports ${JSON.stringify(evt.customDataImports)}`;
        await auditLog(`${msg}`, 'USER');
    },
    ChangeCustomRuleStatusEvent: async (evt: ChangeCustomRuleStatusEvent) => {
        const msg = `change custom rule status viewId - ${evt.viewId}, customRuleId - ${evt.customRuleId}, status - ${evt.status}, result - ${evt.result} `;
        await auditLog(`${msg}`, 'USER');
    },
    AddCustomRuleToViewEvent: async (evt: AddCustomRuleToViewEvent) => {
        const msg = `add custom rule viewId - ${evt.viewId}, customRuleIds - ${JSON.stringify(evt.customRuleIds)} - errors - ${JSON.stringify(evt.errors)}`;
        await auditLog(`${msg}`, 'USER');
    },
    GetAllCustomRulesEvent: async (evt: GetAllCustomRulesEvent) => {
        const msg = `get all custom rules - ${JSON.stringify(evt.customRules)}`;
        await auditLog(`${msg}`, 'USER');
    },
    GetAllCustomRulesForViewEvent: async (evt: GetAllCustomRulesForViewEvent) => {
        const msg = `get all custom rules for view ${evt.viewId}, result - ${evt.customRules}`;
        await auditLog(`${msg}`, 'USER');
    },
    DeleteCustomRulesEvent: async (evt: DeleteCustomRulesEvent) => {
        const msg = `delete custom rules viewId - ${evt.viewId}, customRuleIds - ${JSON.stringify(evt.customRuleIds)}, errors - ${evt.errors}`;
        await auditLog(`${msg}`, 'USER');
    },
    SaveUserDashboardWidgetDataEvent: async (evt: SaveUserDashboardEvent) => {
        const msg = `save user dashboard widget data, userId - ${evt.userId}, data - ${JSON.stringify(evt.data)}, errors - ${JSON.stringify(evt.errors)}`
        await auditLog(`${msg}`, 'USER');
    },
    SaveUserDashboardEvent: async (evt: SaveUserDashboardEvent) => {
        const msg = `save user dashboard, userId - ${evt.userId}, data - ${JSON.stringify(evt.data)}, errors - ${JSON.stringify(evt.errors)}`;
        await auditLog(`${msg}`, 'USER');
    },
    GetUserDashboardWidgetSerializedDataEvent: async (evt: GetUserDashboardWidgetSerializedDataEvent) => {
        const msg = `Get user dashboard widget serialized data, userId - ${evt.userId}, data - ${evt.data}`
        await auditLog(`${msg}`, 'USER');
    },
    GetUserDashboardSerializedDataEvent: async (evt: GetUserDashboardSerializedDataEvent) => {
        const msg = `get user dashboard serialized data, userId ${evt.userId}, data - ${evt.data}`;
        await auditLog(`${msg}`, 'USER');
    },
    GetExportArtifactContentEvent: async (evt: GetExportArtifactContentEvent) => {
        const msg = `get export artifact content dataExportId - ${evt.dataExportId} }`;
        await auditLog(`${msg}`, 'USER');
    },
    DeleteExportArtifactByIdEvent: async (evt: DeleteExportArtifactByIdEvent) => {
        const msg = `delete export artifact, dataExportId - ${evt.dataExportArtifactId}, result - ${evt.result}`;
        await auditLog(`${msg}`, 'USER');
    },
    GetAllExportArtifactsEvent: async (evt: GetAllExportArtifactsEvent) => {
        const msg = `get all export artifacts, result - ${JSON.stringify(evt.dataExportArtifacts)}`;
        await auditLog(`${msg}`, 'USER');
    },
    CreateInvitationEvent: async (evt: CreateInvitationEvent) => {
        const msg = `create invitation email - ${evt.email}, invitationCode - ${evt.invitationCode}, sendMail - ${evt.sendMail}, groupIds - ${JSON.stringify(evt.groupIds)}, errors - ${JSON.stringify(evt.errors)}`;
        await auditLog(`${msg}`, 'USER');
    },
    ActivateInvitationEvent: async (evt: ActivateInvitationEvent) => {
        const msg = `activate invitation, code - ${evt.code}, email - ${evt.email}, firstName - ${evt.firstName}, lastName - ${evt.lastName}, username - ${evt.username}, result - ${evt.result}`;
        await auditLog(`${msg}`, 'USER');
    },
    GetInvitationByCodeEvent: async (evt: GetInvitationByCodeEvent) => {
        const msg = `get invitation by code, code - ${evt.code}, invitation - ${JSON.stringify(evt.invitation)}`;
        await auditLog(`${msg}`, 'USER');
    },
    DeleteGroupEvent: async (evt: DeleteGroupEvent) => {
        const msg = `Delete group ids ${JSON.stringify(evt.groupIds)}`;
        await auditLog(`${msg}`, 'USER');
    },
    AddOrUpdateGroupEvent: async (evt: AddOrUpdateGroupEvent) => {
        const msg = `Add or update group, input - ${JSON.stringify(evt.input)}, errors - ${JSON.stringify(evt.errors)}`;
        await auditLog(`${msg}`, 'USER');
    },
    SearchForGroupsWithNoSuchRoleEvent: async (evt: SearchForGroupsWithNoSuchRoleEvent) => {
        const msg = `Search for group with no such role ${evt.roleName} and group ${evt.groupName}, result - ${JSON.stringify(evt.groups)}`;
        await auditLog(`${msg}`, 'USER');
    },
    SearchForGroupByNameEvent: async (evt: SearchForGroupByNameEvent) => {
        const msg = `search for group by name ${evt.groupName}, result - ${JSON.stringify(evt.groups)}`;
        await auditLog(`${msg}`, 'USER');
    },
    GetGroupsWithRoleEvent: async (evt: GetGroupsWithRoleEvent) => {
        const msg = `get groups with role ${evt.roleName}, result - ${JSON.stringify(evt.groups)}`;
        await auditLog(`${msg}`, 'USER');
    },
    GetGroupByNameEvent: async (evt: GetGroupByNameEvent) => {
        const msg = `get group by name ${evt.groupName}, result - ${JSON.stringify(evt.group)}`;
        await auditLog(`${msg}`, 'USER');
    },
    GetGroupByIdEvent: async (evt: GetGroupByIdEvent) => {
        const msg = `get group by id ${evt.groupId}, result - ${JSON.stringify(evt.group)}`;
        await auditLog(`${msg}`, 'USER');
    },
    GetAllGroupsEvent: async (evt: GetAllGroupsEvent) => {
        const msg = `get all groups result - ${JSON.stringify(evt.groups)}`;
        await auditLog(`${msg}`, 'USER');
    },
    UpdateItemsStatusEvent: async (evt: UpdateItemsStatusEvent) => {
        const msg = `update item status, itemIds - ${JSON.stringify(evt.itemIds)}, status - ${evt.status}, errors - ${JSON.stringify(evt.errors)}`;
        await auditLog(`${msg}`, 'USER');
    },
    UpdateItemValueEvent: async (evt: UpdateItemValueEvent) => {
        const msg = `update item value, viewId - ${evt.viewId}, itemId - ${evt.itemId}, value - ${JSON.stringify(evt.value)}`;
        await auditLog(`${msg}`, 'USER');
    },
    UpdateItemEvent: async (evt: UpdateItemEvent) => {
        const msg = `update item viewId - ${evt.viewId}, item - ${JSON.stringify(evt.item)}, errors - ${JSON.stringify(evt.errors)}`
        await auditLog(`${msg}`, 'USER');
    },
    AddItemEvent: async (evt: AddItemEvent) => {
        const msg = `add item, viewId - ${evt.viewId}, item - ${JSON.stringify(evt.item)}, errors - ${JSON.stringify(evt.errors)}`;
        await auditLog(`${msg}`, 'USER');
    },
    AddOrUpdateItemEvent: async (evt: AddOrUpdateItemEvent) => {
        const msg = `add or update item, viewId - ${evt.viewId}, item - ${JSON.stringify(evt.item)}, errors - ${JSON.stringify(evt.errors)}`;
        await auditLog(`${msg}`, 'USER');
    },
    SearchForFavouriteItemsInViewEvent: async (evt: SearchForFavouriteItemsInViewEvent) => {
        const msg = `search for favourite items in viewId ${evt.viewId}, userId - ${evt.userId}, search - ${evt.search}, searchType - ${evt.searchType}, limitOffset - ${evt.limitOffset}, items - ${JSON.stringify(evt.items)}`;
        await auditLog(`${msg}`, 'USER');
    },
    SearchForItemsInViewEvent: async (evt: SearchForItemsInViewEvent) => {
        const msg = `search for items in viewId ${evt.viewId}, search - ${evt.search}, searchType - ${evt.searchType}, limitOffset - ${JSON.stringify(evt.limitOffset)}, items - ${JSON.stringify(evt.items)}`;
        await auditLog(`${msg}`, 'USER');
    },
    AddFavouriteItemIdsEvent: async (evt: AddFavouriteItemIdsEvent) => {
        const msg = `Add favourite items,  userIds - ${evt.userId}, itemIds - ${JSON.stringify(evt.itemIds)}`;
        await auditLog(`${msg}`, 'USER');
    },
    RemoveFavouriteItemIdsEvent: async (evt: RemoveFavouriteItemIdsEvent) => {
        const msg = `Remove favurite items, userIds - ${evt.userId}, itemIds = ${JSON.stringify(evt.itemIds)}`;
        await auditLog(`${msg}`, 'USER');
    },
    GetAllFavouriteItemIdsInViewEvent: async (evt: GetAllFavouriteItemIdsInViewEvent) => {
       const msg = `get all favourite item in view ${evt.viewId}, userIds - ${evt.userId}, itemIds - ${JSON.stringify(evt.itemIds)}`;
       await auditLog(`${msg}`, 'USER');
    },
    GetAllFavouritedItemsInViewEvent: async (evt: GetAllFavouritedItemsInViewEvent) => {
        const msg = `get all favourited items in view ${evt.viewId}, userId - ${evt.userId}, limtiOffset - ${JSON.stringify(evt.limitOffset)}, result - ${JSON.stringify(evt.items)}`;
        await auditLog(`${msg}`, 'USER');
    },
    GetAllItemsInViewEvent: async (evt: GetAllItemsInViewEvent) => {
        const msg = `get all items in view ${evt.viewId}, parentOnly - ${evt.parentOnly}, limitOffset - ${JSON.stringify(evt.limitOffset)}, result - ${JSON.stringify(evt.items)}`;
        await auditLog(`${msg}`, 'USER');
    },
    GetItemsByIdsEvent: async (evt: GetItemsByIdsEvent) => {
        const msg = `get items by, itemIds - ${JSON.stringify(evt.itemIds)}, parentOnly - ${evt.parentOnly}, limitOffset - ${JSON.stringify(evt.limitOffset)}, result - ${JSON.stringify(evt.items)}`;
        await auditLog(`${msg}`, 'USER');
    },
    GetItemByIdEvent: async (evt: GetItemByIdEvent) => {
        const msg = `get item by, itemId - ${evt.itemId}, viewId - ${evt.viewId}, result - ${JSON.stringify(evt.itemId)}`;
        await auditLog(`${msg}`, 'USER');
    },
    GetItemByNameEvent: async (evt: GetItemByNameEvent) => {
        const msg = `get item by itemName - ${evt.itemName}, result - ${JSON.stringify(evt.item)}`;
        await auditLog(`${msg}`, 'USER');
    },
    GetItemWithFilteringEvent: async (evt: GetItemWithFilteringEvent) => {
        const msg = `get item with filtering, viewId - ${evt.viewId}, parentId - ${evt.parentItemId}, whenClauses - ${JSON.stringify(evt.whenClauses)}, result - ${JSON.stringify(evt.itemWithFilteringResult)}`;
        await auditLog(`${msg}`, 'USER');
    },
    MarkItemImageAsPrimaryEvent: async (evt: MarkItemImageAsPrimaryEvent) => {
        const msg = `mark item image as primary, itemId - ${evt.itemId}, itemImageId - ${evt.itemImageId}, errors - ${JSON.stringify(evt.errors)}`;
        await auditLog(`${msg}`, 'USER');
    },
    GetItemPrimaryImageEvent: async (evt: GetItemPrimaryImageEvent) => {
        const msg = `get item primary image, itemId - ${evt.itemId}`;
        await auditLog(`${msg}`, 'USER');
    },
    GetItemImageContentEvent: async (evt: GetItemImageContentEvent) => {
        const msg = `get item image content, itemImageId - ${evt.itemImageId}`;
        await auditLog(`${msg}`, 'USER');
    },
    AddItemImageEvent: async (evt: AddItemImageEvent) => {
        const msg = `add item image, itemId - ${evt.itemId}, primaryImage - ${evt.primaryImage}, fileName - ${evt.fileName}, result - ${evt.result}`;
        await auditLog(`${msg}`, 'USER');
    },
    DeleteItemImageEvent: async (evt: DeleteItemImageEvent) => {
        const msg = `delete item image, itemId - ${evt.itemId}, itemImageId - ${evt.itemImageId}, result - ${evt.result}`;
        await auditLog(`${msg}`, 'USER');
    },
    GetJobDetailsByIdEvent: async (evt: GetJobDetailsByIdEvent) => {
        const msg = `get job details jobId - ${evt.jobId}, lastLogId - ${evt.lastLogId}`;
        await auditLog(`${msg}`, 'USER');
    },
    GetAllJobsEvent: async (evt: GetAllJobsEvent) => {
        const msg = `get all jobs, result - ${JSON.stringify(evt.jobs)}`;
        await auditLog(`${msg}`, 'USER');
    },
    GetJobByIdEvent: async (evt: GetJobByIdEvent) => {
        const msg = `get job by id ${evt.jobId}, result - ${JSON.stringify(evt.job)}`;
        await auditLog(`${msg}`, 'USER');
    },
    CreateJwtTokenEvent: async (evt: CreateJwtTokenEvent) => {
        const msg = `create jwt token, userId - ${evt.user.id}, jwt - ${evt.jwtToken}`;
        await auditLog(`${msg}`, 'USER');
    },
    DecodeJwtTokenEvent: async (evt: DecodeJwtTokenEvent) => {
        const msg = `decode jwt token, payload - ${JSON.stringify(evt.jwtPayload)}`;
        await auditLog(`${msg}`, 'USER');
    },
    VerifyJwtTokenEvent: async (evt: VerifyJwtTokenEvent) => {
        const msg = `verify jwt token, payload - ${JSON.stringify(evt.jwtPayload)}`;
        await auditLog(`${msg}`, 'USER');
    },
    AddUserNotificationEvent: async (evt: AddUserNotificationEvent) => {
        const msg = `add user notification, userId - ${evt.userId}, newNotification - ${JSON.stringify(evt.newNotification)},  result - ${evt.result}`;
        await auditLog(`${msg}`, 'USER');
    },
    GetUserNotificationsEvent: async (evt: GetUserNotificationsEvent) => {
        const msg = `get user notifications, userId - ${evt.userId}, notifications - ${JSON.stringify(evt.notifications)}`;
        await auditLog(`${msg}`, 'USER');
    },
    GetPricedItemsEvent: async (evt: GetPricedItemsEvent) => {
        const msg = `get priced items, pricingStructureId - ${evt.pricingStructureId}, result - ${evt.pricedItems}`;
        await auditLog(`${msg}`, 'USER');
    },
    GetPricedItemsWithFilteringEvent: async (evt: GetPricedItemsWithFilteringEvent) => {
        const msg = `get priced items with filtering, viewId - ${evt.viewId}, parentItemId - ${evt.parentItemId}, pricingStructureId - ${evt.pricingStructureId}, result - ${JSON.stringify(evt.result)}`;
        await auditLog(`${msg}`, 'USER');
    },
    SearchGroupsAssociatedWithPricingStructureEvent: async (evt: SearchGroupsNotAssociatedWithPricingStructureEvent) => {
        const msg = `search groups associated with pricing structure, groupName - ${evt.groupName}, pricingStructureId - ${evt.pricingStructureId}, result - ${JSON.stringify(evt.groups)}`;
        await auditLog(`${msg}`, 'USER');
    },
    SearchGroupsNotAssociatedWithPricingStructureEvent: async (evt: SearchGroupsNotAssociatedWithPricingStructureEvent) => {
        const msg = `search groups not associated with pricing structure, groupName - ${evt.groupName}, pricingStructureId - ${evt.pricingStructureId}, result - ${JSON.stringify(evt.groupName)}`;
        await auditLog(`${msg}`, 'USER');
    },
    GetPricingStructureGroupAssociationsEvent: async (evt: GetPricingStructureGroupAssociationsEvent) => {
        const msg = `get pricing structure group association, result - ${JSON.stringify(evt.pricingStructureGroupAssociations)}`;
        await auditLog(`${msg}`, 'USER');
    },
    LinkPricingStructureWithGroupIdEvent: async (evt: LinkPricingStructureWithGroupIdEvent) => {
        const msg = `link pricing structure with group, pricingStructureId - ${evt.pricingStructureId}, groupId - ${evt.groupId}, errprs - ${JSON.stringify(evt.errors)}`;
        await auditLog(`${msg}`, 'USER');
    },
    UnlinkPricingStructureWithGroupIdEvent: async (evt: UnlinkPricingStructureWithGroupIdEvent) => {
        const msg = `unlink pricing structure with group, pricingStructureId - ${evt.pricingStructureId}, groupId - ${evt.groupId}, errprs - ${JSON.stringify(evt.errors)}`;
        await auditLog(`${msg}`, 'USER');
    },
    UpdatePricingStructureStatusEvent: async (evt: UpdatePricingStructureStatusEvent) => {
        const msg = `update pricing structure status, pricingStructureId - ${evt.pricingStructureId}, status - ${evt.status}, result - ${evt.result}`;
        await auditLog(`${msg}`, 'USER');
    },
    AddOrUpdatePricingStructuresEvent: async (evt: AddOrUpdatePricingStructuresEvent) => {
        const msg = `add or update pricing structure, input - ${JSON.stringify(evt.pricingStructures)}, errors - ${JSON.stringify(evt.errors)}`;
        await auditLog(`${msg}`, 'USER');
    },
    GetPricingStructuresByViewEvent: async (evt: GetPricingStructuresByViewEvent) => {
        const msg = `get pricing structures by view, viewId - ${evt.viewId}, pricingStructures - ${JSON.stringify(evt.pricingStructures)}`;
        await auditLog(`${msg}`, 'USER');
    },
    GetPartnerPricingStructuresEvent: async (evt: GetPartnerPricingStructuresEvent) => {
        const msg = `get partner pricing structures, userId - ${evt.userId}, result - ${JSON.stringify(evt.pricingStructures)}`;
        await auditLog(`${msg}`, 'USER');
    },
    GetAllPricingStructureItemsWithPriceEvent: async (evt: GetAllPricingStructureItemsWithPriceEvent) => {
        const msg = `get all pricing structure items with price, pricingStructureId - ${evt.pricingStructureId}, limitOffset - ${JSON.stringify(evt.limitOffset)}, result - ${JSON.stringify(evt.pricingStructureItemWithPrices)}`
        await auditLog(`${msg}`, 'USER');
    },
    GetAllPricingStructuresEvent: async (evt: GetAllPricingStructuresEvent) => {
        const msg = `get all pricing structures, result - ${JSON.stringify(evt.pricingStructures)}`;
        await auditLog(`${msg}`, 'USER');
    },
    GetPricingStructureByNameEvent: async (evt: GetPricingStructureByNameEvent) => {
        const msg = `get pricing structure by name ${evt.pricingStructureName}, result - ${JSON.stringify(evt.pricingStructure)}`;
        await auditLog(`${msg}`, 'USER');
    },
    GetPricingStructureByIdEvent: async (evt: GetPricingStructureByIdEvent) => {
        const msg = `get pricing structure by id ${evt.pricingStructureId}, result - ${JSON.stringify(evt.pricingStructure)}`;
        await auditLog(`${msg}`, 'USER');
    },
    SetPricesEvent: async (evt: SetPricesEvent) => {
        const msg = `set price, input - ${JSON.stringify(evt.priceDataItems)}`;
        await auditLog(`${msg}`, 'USER');
    },
    AddItemToPricingStructureEvent: async (evt: AddItemToPricingStructureEvent) => {
        const msg = `add item to pricing structure, viewId - ${evt.viewId}, itemId - ${evt.itemId}, pricingStructureId - ${evt.pricingStructureId}, result - ${evt.result}`;
        await auditLog(`${msg}`, 'USER');
    },
    GetPricingStructureItemEvent: async (evt: GetPricingStructureItemEvent) => {
        const msg = `get pricign structure item, viewId - ${evt.viewId}, itemId - ${evt.itemId}, pricingStructureId - ${evt.pricingStructureId}, result - ${JSON.stringify(evt.pricingStructureItemWithPrice)} `
        await auditLog(`${msg}`, 'USER');
    },
    AddOrUpdateRoleEvent: async (evt: AddOrUpdateRoleEvent) => {
        const msg = `add or update role, input - ${JSON.stringify(evt.role)}, errors - ${JSON.stringify(evt.errors)}`;
        await auditLog(`${msg}`, 'USER');
    },
    AddRoleToGroupEvent: async (evt: AddRoleToGroupEvent) => {
        const msg = `add role to group, roleName - ${evt.roleName}, groupId - ${evt.groupId}, errors - ${JSON.stringify(evt.errors)}`;
        await auditLog(`${msg}`, 'USER');
    },
    GetRoleByNameEvent: async (evt: GetRoleByNameEvent) => {
        const msg = `get role by name, roleName - ${evt.roleName}, result - ${JSON.stringify(evt.role)}`;
        await auditLog(`${msg}`, 'USER');
    },
    GetAllRolesEvent: async (evt: GetAllRolesEvent) => {
        const msg = `get all roles, result - ${JSON.stringify(evt.roles)}`;
        await auditLog(`${msg}`, 'USER');
    },
    RemoveRoleFromGroup: async (evt: RemoveRoleFromGroup) => {
        const msg = `remove role from group, roleName - ${evt.roleName}, groupId - ${evt.groupId}, errors - ${JSON.stringify(evt.errors)}`;
        await auditLog(`${msg}`, 'USER');
    },
    AddOrUpdateRuleEvent: async (evt: AddOrUpdateRuleEvent) => {
        const msg = `add or update rule, input - ${JSON.stringify(evt.rules)}, errors - ${JSON.stringify(evt.errors)}`;
        await auditLog(`${msg}`, 'USER');
    },
    UpdateRuleStatusEvent: async (evt: UpdateRuleStatusEvent) => {
        const msg = `update rule status, ruleId - ${evt.ruleId}, status ${evt.status}, result - ${evt.result}`;
        await auditLog(`${msg}`, 'USER');
    },
    GetRulesEvent: async (evt: GetRulesEvent) => {
        const msg = `get rules, viewId - ${evt.viewId}, result - ${JSON.stringify(evt.rules)}`;
        await auditLog(`${msg}`, 'USER');
    },
    GetRuleEvent: async (evt: GetRuleEvent) => {
        const msg = `get rules, viewId - ${evt.viewId}, ruleId - ${evt.ruleId}, result - ${JSON.stringify(evt.rule)}`;
        await auditLog(`${msg}`, 'USER');
    },
    SelfRegisterEvent: async (evt: SelfRegisterEvent) => {
        const msg = `self register, email - ${evt.email}, firstName - ${evt.firstName}, lastName - ${evt.lastName}, username - ${evt.username}, result - ${JSON.stringify(evt.result)}`;
        await auditLog(`${msg}`, 'USER');
    },
    ApproveSelfRegistrationEvent: async (evt: ApproveSelfRegistrationEvent) => {
        const msg = `approve self registration, selfRegistrationId - ${evt.selfRegistrationId}, result - ${JSON.stringify(evt.approveSelfRegistrationResult)}`;
        await auditLog(`${msg}`, 'USER');
    },
    GetAllSelfRegistrationsEvent: async (evt: GetAllSelfRegistrationsEvent) => {
        const msg = `get all self registrations, result - ${JSON.stringify(evt.selfRegistrations)}`;
        await auditLog(`${msg}`, 'USER');
    },
    SearchSelfRegistrationByUsernameEvent: async (evt: SearchSelfRegistrationByUsernameEvent) => {
        const msg = `search self registration by username, ${evt.username}, result - ${JSON.stringify(evt.selfRegistrations)}`;
        await auditLog(`${msg}`, 'USER');
    },
    DeleteSelfRegistrationEvent: async (evt: DeleteSelfRegistrationEvent) => {
        const msg = `delete self registration, selfRegistrationId - ${evt.selfRegistrationId}, result - ${evt.result}`
        await auditLog(`${msg}`, 'USER');
    },
    AddUserEvent: async (evt: AddUserEvent) => {
        const msg = `add user, input - ${JSON.stringify(evt.input)}, errors - ${JSON.stringify(evt.errors)}`;
        await auditLog(`${msg}`, 'USER');
    },
    UpdateUserEvent: async (evt: UpdateUserEvent) => {
        const msg = `update user, input - ${JSON.stringify(evt.input)}, errors - ${JSON.stringify(evt.errors)}`;
        await auditLog(`${msg}`, 'USER');
    },
    ChangeUserStatusEvent: async (evt: ChangeUserStatusEvent) => {
        const msg = `change user status, userId - ${evt.userId}, status - ${evt.status}, result ${evt.result}`;
        await auditLog(`${msg}`, 'USER');
    },
    AddUserToGroupEvent: async (evt: AddUserToGroupEvent) => {
        const msg = `add user to group, userId - ${evt.userId}, groupId - ${evt.groupId}, errors - ${JSON.stringify(evt.errors)}`;
        await auditLog(`${msg}`, 'USER');
    },
    GetUsersInGroupEvent: async (evt: GetUsersInGroupEvent) => {
        const msg = `get users in group, groupId - ${evt.groupId}, result - ${JSON.stringify(evt.users)}`;
        await auditLog(`${msg}`, 'USER');
    },
    GetUsersByStatusEvent: async (evt: GetUsersByStatusEvent) => {
        const msg = `get users by status, status - ${evt.status}, result - ${JSON.stringify(evt.users)}`;
        await auditLog(`${msg}`, 'USER');
    },
    GetNoAvatarContentEvent: async (evt: GetNoAvatarContentEvent) => {
        const msg = `get no avatar content`;
        await auditLog(`${msg}`, 'USER');
    },
    GetUserAvatarContentEvent: async (evt: GetUserAvatarContentEvent) => {
        const msg = `get user avatar, userId - ${evt.userId}`;
        await auditLog(`${msg}`, 'USER');
    },
    SearchForUserNotInGroupEvent: async (evt: SearchForUserNotInGroupEvent) => {
        const msg = `search for user not in group, groupId - ${evt.groupId}, username - ${evt.username}, result - ${JSON.stringify(evt.users)}`;
        await auditLog(`${msg}`, 'USER');
    },
    SearchUserByUsernameAndStatusEvent: async (evt: SearchUserByUsernameAndStatusEvent) => {
        const msg = `search user by username and status, username - ${evt.username}, status - ${evt.status}, result - ${JSON.stringify(evt.users)}`;
        await auditLog(`${msg}`, 'USER');
    },
    DeleteUserFromGroupEvent: async (evt: DeleteUserFromGroupEvent) => {
        const msg = `delete user from group, userId - ${evt.userId}, groupId - ${evt.groupId}, errors - ${JSON.stringify(evt.errors)}`;
        await auditLog(`${msg}`, 'USER');
    },
    DeleteUserEvent: async (evt: DeleteUserEvent) => {
        const msg = `delete user, userId - ${evt.userId}, result - ${evt.result}`;
        await auditLog(`${msg}`, 'USER');
    },
    HasAllUserRolesEvent: async (evt: HasAllUserRolesEvent) => {
        const msg = `has all user roles, userId - ${evt.userId}, roleNames - ${JSON.stringify(evt.roleNames)}, result - ${evt.result}`;
        await auditLog(`${msg}`, 'USER');
    },
    HasAnyUserRolesEvent: async (evt: HasAnyUserRolesEvent) => {
        const msg = `has any user roles, userId - ${evt.userId}, roleNames - ${JSON.stringify(evt.roleNames)}, result - ${evt.result}`;
        await auditLog(`${msg}`, 'USER');
    },
    HasNoneUserRolesEvent: async (evt: HasNoneUserRolesEvent) => {
        const msg = `has none user roles, userId - ${evt.userId}, roleNames - ${JSON.stringify(evt.roleNames)}, result - ${evt.result}`;
        await auditLog(`${msg}`, 'USER');
    },
    GetUserByUsernameEvent: async (evt: GetUserByUsernameEvent) => {
        const msg = `get user by username, username - ${evt.username}, result - ${JSON.stringify(evt.user)}`;
        await auditLog(`${msg}`, 'USER');
    },
    GetUserByIdEvent: async (evt: GetUserByIdEvent) => {
        const msg = `get user by id, userId - ${evt.userId}, result - ${JSON.stringify(evt.user)}`;
        await auditLog(`${msg}`, 'USER');
    },
    UpdateUserSettingsEvent: async (evt: UpdateUserSettingsEvent) => {
        const msg = `update user settings, userId - ${evt.userId}, settings - ${JSON.stringify(evt.settings)}, errors - ${JSON.stringify(evt.errors)}`;
        await auditLog(`${msg}`, 'USER');
    },
    GetSettingsEvent: async (evt: GetSettingsEvent) => {
        const msg = `get settings, userId - ${evt.userId}, ${JSON.stringify(evt.settings)}`;
        await auditLog(`${msg}`, 'USER');
    },
    DeleteViewEvent: async (evt: DeleteViewEvent) => {
        const msg = `delete view viewId - ${evt.viewId}, result - ${evt.result}`;
        await auditLog(`${msg}`, 'USER');
    },
    AddOrUpdateViewsEvent: async (evt: AddOrUpdateViewsEvent) => {
        const msg = `add or update views, input - ${JSON.stringify(evt.input)}, errors - ${evt.errors}`;
        await auditLog(`${msg}`, 'USER');
    },
    GetAllViewsEvent: async (evt: GetAllViewsEvent) => {
        const msg = `get all views, result - ${JSON.stringify(evt.views)}`;
        await auditLog(`${msg}`, 'USER');
    },
    GetViewByIdEvent: async (evt: GetViewByIdEvent) => {
        const msg = `get view by id, viewId - ${evt.viewId}, result - ${JSON.stringify(evt.view)}`;
        await auditLog(`${msg}`, 'USER');
    },
    GetViewByNameEvent: async (evt: GetViewByNameEvent) => {
        const msg =  `get view by name, viewName - ${evt.viewName}, result ${JSON.stringify(evt.view)}`;
        await auditLog(`${msg}`, 'USER');
    },
    GetViewValidationResultEvent: async (evt: GetViewValidationResultEvent) => {
        const msg = `get view validation result, viewId - ${evt.viewId}, validationId - ${evt.validationId}, result - ${JSON.stringify(evt.result)}`;
        await auditLog(`${msg}`, 'USER');
    },
    GetAllViewValidationsEvent: async (evt: GetAllViewValidationsEvent) => {
        const msg = `get all view validations,  viewId - ${evt.viewId}, result - ${JSON.stringify(evt.result)}`;
        await auditLog(`${msg}`, 'USER');
    },
    DeleteValidationResultEvent: async (evt: DeleteValidationResultEvent) => {
        const msg = `delete validation, viewId - ${evt.viewId}, validationId - ${evt.validationId}, result - ${evt.result}`;
        await auditLog(`${msg}`, 'USER');
    },
    GetValidationsByViewIdEvent: async (evt: GetValidationsByViewIdEvent) => {
        const msg = `get validations by view, viewId - ${evt.viewId}, result - ${JSON.stringify(evt.result)}`;
        await auditLog(`${msg}`, 'USER');
    },
    GetValidationByViewIdAndValidationIdEvent: async (evt: GetValidationByViewIdAndValidationIdEvent) => {
        const msg = `get validation by view, viewId - ${evt.viewId}, result - ${JSON.stringify(evt.result)}`;
        await auditLog(`${msg}`, 'USER');
    }
};

const s: EventSubscriptionRegistry = newEventSubscriptionRegistry(d, `sample-event-subscription`, 
    async (v1AppRouter: Router, registry: Registry): Promise<void> => {
        return undefined;
    }
);
export default s;

