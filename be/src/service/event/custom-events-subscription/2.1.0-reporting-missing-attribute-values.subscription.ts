import {
    ActivateInvitationEvent,
    AddCategoryEvent,
    AddCustomRuleToViewEvent,
    AddFavouriteItemIdsEvent,
    AddGlobalAvatarEvent,
    AddGlobalImageEvent,
    AddItemEvent,
    AddItemImageEvent,
    AddItemToPricingStructureEvent,
    AddItemToViewCategoryEvent,
    AddOrUpdateGroupEvent,
    AddOrUpdateItemEvent,
    AddOrUpdatePricingStructuresEvent,
    AddOrUpdateRoleEvent,
    AddOrUpdateRuleEvent,
    AddOrUpdateViewsEvent,
    AddRoleToGroupEvent,
    AddUserEvent,
    AddUserNotificationEvent,
    AddUserToGroupEvent,
    ApproveSelfRegistrationEvent,
    BulkEditJobEvent,
    BulkEditPreviewEvent,
    CategorySimpleItemsInCategoryEvent,
    CategorySimpleItemsNotInCategoryEvent,
    ChangeAttributeStatusEvent,
    ChangeCustomRuleStatusEvent,
    ChangeUserStatusEvent,
    CreateInvitationEvent,
    CreateJwtTokenEvent,
    DecodeJwtTokenEvent,
    DeleteCategoryEvent,
    DeleteCustomRulesEvent,
    DeleteExportArtifactByIdEvent,
    DeleteGroupEvent,
    DeleteItemImageEvent,
    DeleteSelfRegistrationEvent,
    DeleteUserEvent,
    DeleteUserFromGroupEvent, DeleteValidationResultEvent,
    DeleteViewEvent,
    EventSubscriptionRegistry,
    ExportAttributeJobEvent,
    ExportAttributePreviewEvent,
    ExportItemJobEvent,
    ExportItemPreviewEvent,
    ExportPriceJobEvent,
    ExportPricePreviewEvent,
    ForgotPasswordEvent,
    GetAllCustomBulkEditsEvent,
    GetAllCustomExportsEvent,
    GetAllCustomImportsEvent,
    GetAllCustomRulesEvent,
    GetAllCustomRulesForViewEvent,
    GetAllExportArtifactsEvent,
    GetAllFavouritedItemsInViewEvent,
    GetAllFavouriteItemIdsInViewEvent,
    GetAllGlobalAvatarsEvent,
    GetAllGroupsEvent,
    GetAllItemsInViewEvent,
    GetAllJobsEvent,
    GetAllPricingStructureItemsWithPriceEvent,
    GetAllPricingStructuresEvent,
    GetAllRolesEvent,
    GetAllSelfRegistrationsEvent,
    GetAllViewsEvent, GetAllViewValidationsEvent,
    GetAttributeInViewByNameEvent,
    GetAttributeInViewEvent,
    GetAttributesInViewEvent,
    GetCustomBulkEditByIdEvent,
    GetCustomExportByIdEvent,
    GetCustomImportByIdEvent,
    GetExportArtifactContentEvent,
    GetGlobalAvatarContentByNameEvent,
    GetGroupByIdEvent,
    GetGroupByNameEvent,
    GetGroupsWithRoleEvent,
    GetInvitationByCodeEvent,
    GetItemByIdEvent,
    GetItemByNameEvent,
    GetItemImageContentEvent,
    GetItemPrimaryImageEvent,
    GetItemsByIdsEvent,
    GetItemWithFilteringEvent,
    GetJobByIdEvent,
    GetJobDetailsByIdEvent,
    GetNoAvatarContentEvent,
    GetPartnerPricingStructuresEvent,
    GetPricedItemsEvent,
    GetPricedItemsWithFilteringEvent,
    GetPricingStructureByIdEvent,
    GetPricingStructureByNameEvent,
    GetPricingStructureGroupAssociationsEvent,
    GetPricingStructureItemEvent,
    GetPricingStructuresByViewEvent,
    GetRoleByNameEvent,
    GetRuleEvent,
    GetRulesEvent,
    GetSettingsEvent,
    GetUserAvatarContentEvent,
    GetUserByIdEvent,
    GetUserByUsernameEvent,
    GetUserDashboardSerializedDataEvent,
    GetUserDashboardWidgetSerializedDataEvent,
    GetUserNotificationsEvent,
    GetUsersByStatusEvent,
    GetUsersInGroupEvent, GetValidationByViewIdAndValidationIdEvent, GetValidationsByViewIdEvent,
    GetViewByIdEvent,
    GetViewByNameEvent,
    GetViewCategoriesEvent,
    GetViewCategoriesWithItemsEvent,
    GetViewCategoryByNameEvent,
    GetViewCategoryItemsEvent,
    GetViewValidationResultEvent,
    HasAllUserRolesEvent,
    HasAnyUserRolesEvent,
    HasNoneUserRolesEvent,
    ImportAttributeJobEvent,
    ImportAttributePreviewEvent,
    ImportItemJobEvent,
    ImportItemPreviewEvent,
    ImportPriceJobEvent,
    ImportPricePreviewEvent,
    IncomingHttpEvent,
    IsValidForgottenPasswordCodeEvent,
    LinkPricingStructureWithGroupIdEvent,
    LoginEvent,
    LogoutEvent,
    MarkItemImageAsPrimaryEvent,
    newEventSubscriptionRegistry,
    RemoveFavouriteItemIdsEvent,
    RemoveItemFromViewCategoryEvent,
    RemoveRoleFromGroup,
    ResetForgottenPasswordEvent,
    SaveAttributesEvent,
    SaveUserAvatarEvent,
    SaveUserDashboardEvent,
    SaveUserDashboardWidgetDataEvent,
    SearchAttributesByViewEvent,
    SearchForFavouriteItemsInViewEvent,
    SearchForGroupByNameEvent,
    SearchForGroupsWithNoSuchRoleEvent,
    SearchForItemsInViewEvent,
    SearchForUserNotInGroupEvent,
    SearchGroupsAssociatedWithPricingStructureEvent,
    SearchGroupsNotAssociatedWithPricingStructureEvent,
    SearchSelfRegistrationByUsernameEvent,
    SearchUserByUsernameAndStatusEvent,
    SelfRegisterEvent,
    SetPricesEvent,
    UnlinkPricingStructureWithGroupIdEvent,
    UpdateAttributesEvent,
    UpdateCategoryEvent,
    UpdateItemEvent,
    UpdateItemsStatusEvent,
    UpdateItemValueEvent,
    UpdatePricingStructureStatusEvent,
    UpdateRuleStatusEvent,
    UpdateUserEvent,
    UpdateUserSettingsEvent,
    ValidationEvent,
    VerifyJwtTokenEvent
} from '../event.service';
import {NextFunction, Request, Response, Router} from 'express';
import {Registry} from '../../../registry';
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from '../../../route/v1/common-middleware';
import {ROLE_VIEW} from '@fuyuko-common/model/role.model';
import {doInDbConnection, QueryA, QueryI} from '../../../db';
import { Connection } from 'mariadb';
import {
    Reporting_ItemsWithMissingAttributeInfo,
    Reporting_ItemWithMissingAttribute, Reporting_MissingAttribute, Reporting_ViewWithMissingAttribute
} from '@fuyuko-common/model/reporting.model';
import {ENABLED} from '@fuyuko-common/model/status.model';
import {ApiResponse} from '@fuyuko-common/model/api-response.model';


const d: any = {
    subscription: null,
    IncomingHttpEvent: (evt: IncomingHttpEvent) => {},
    BulkEditPreviewEvent: (evt: BulkEditPreviewEvent) => {},
    BulkEditJobEvent: (evt: BulkEditJobEvent) => {},
    ExportAttributePreviewEvent: (evt: ExportAttributePreviewEvent) => {},
    ExportItemPreviewEvent: (evt: ExportItemPreviewEvent) => {},
    ExportPricePreviewEvent: (evt: ExportPricePreviewEvent) => {},
    ExportAttributeJobEvent: (evt: ExportAttributeJobEvent) => {},
    ExportItemJobEvent: (evt: ExportItemJobEvent) => {},
    ExportPriceJobEvent: (evt: ExportPriceJobEvent) => {},
    ImportAttributePreviewEvent: (evt: ImportAttributePreviewEvent) => {},
    ImportItemPreviewEvent: (evt: ImportItemPreviewEvent) => {},
    ImportPricePreviewEvent: (evt: ImportPricePreviewEvent) => {},
    ImportAttributeJobEvent: (evt: ImportAttributeJobEvent) => {},
    ImportItemJobEvent: (evt: ImportItemJobEvent) => {},
    ImportPriceJobEvent: (evt: ImportPriceJobEvent) => {},
    ValidationEvent: (evt: ValidationEvent) => {},
    UpdateAttributesEvent: (evt: UpdateAttributesEvent) => {

    },
    ChangeAttributeStatusEvent: (evt: ChangeAttributeStatusEvent) => {

    },
    GetAttributeInViewByNameEvent: (evt: GetAttributeInViewByNameEvent) => {

    },
    GetAttributeInViewEvent: (evt: GetAttributeInViewEvent) => {

    },
    GetAttributesInViewEvent: (evt: GetAttributesInViewEvent) => {

    },
    SaveAttributesEvent: (evt: SaveAttributesEvent) => {

    },
    SearchAttributesByViewEvent: (evt: SearchAttributesByViewEvent) => {

    },
    IsValidForgottenPasswordCodeEvent: (evt: IsValidForgottenPasswordCodeEvent) => {},
    ResetForgottenPasswordEvent: (evt: ResetForgottenPasswordEvent) => {},
    ForgotPasswordEvent: (evt: ForgotPasswordEvent) => {},
    LoginEvent: (evt: LoginEvent) => {},
    LogoutEvent: (evt: LogoutEvent) => {},
    AddGlobalAvatarEvent: (evt: AddGlobalAvatarEvent) => {},
    AddGlobalImageEvent: (evt: AddGlobalImageEvent) => {},
    SaveUserAvatarEvent: (evt: SaveUserAvatarEvent) => {},
    GetGlobalAvatarContentByNameEvent: (evt: GetGlobalAvatarContentByNameEvent) => {},
    GetAllGlobalAvatarsEvent: (evt: GetAllGlobalAvatarsEvent) => {},
    CategorySimpleItemsInCategoryEvent: (evt: CategorySimpleItemsNotInCategoryEvent) => {},
    CategorySimpleItemsNotInCategoryEvent: (evt: CategorySimpleItemsNotInCategoryEvent) => {},
    UpdateCategoryEvent: (evt: UpdateCategoryEvent) => {},
    AddCategoryEvent: (evt: AddCategoryEvent) => {},
    DeleteCategoryEvent: (evt: DeleteCategoryEvent) => {},
    GetViewCategoryByNameEvent: (evt: GetViewCategoryByNameEvent) => {},
    GetViewCategoriesEvent: (evt: GetViewCategoriesEvent) => {},
    GetViewCategoriesWithItemsEvent: (evt: GetViewCategoriesWithItemsEvent) => {},
    GetViewCategoryItemsEvent: (evt: GetViewCategoryItemsEvent) => {},
    AddItemToViewCategoryEvent: (evt: AddItemToViewCategoryEvent) => {},
    RemoveItemFromViewCategoryEvent: (evt: RemoveItemFromViewCategoryEvent) => {},
    GetCustomBulkEditByIdEvent: (evt: GetCustomBulkEditByIdEvent) => {},
    GetAllCustomBulkEditsEvent: (evt: GetAllCustomBulkEditsEvent) => {},
    GetCustomExportByIdEvent: (evt: GetCustomExportByIdEvent) => {},
    GetAllCustomExportsEvent: (evt: GetAllCustomExportsEvent) => {},
    GetCustomImportByIdEvent: (evt: GetCustomImportByIdEvent) => {},
    GetAllCustomImportsEvent: (evt: GetAllCustomImportsEvent) => {},
    ChangeCustomRuleStatusEvent: (evt: ChangeCustomRuleStatusEvent) => {},
    AddCustomRuleToViewEvent: (evt: AddCustomRuleToViewEvent) => {},
    GetAllCustomRulesEvent: (evt: GetAllCustomRulesEvent) => {},
    GetAllCustomRulesForViewEvent: (evt: GetAllCustomRulesForViewEvent) => {},
    DeleteCustomRulesEvent: (evt: DeleteCustomRulesEvent) => {},
    SaveUserDashboardWidgetDataEvent: (evt: SaveUserDashboardEvent) => {},
    SaveUserDashboardEvent: (evt: SaveUserDashboardEvent) => {},
    GetUserDashboardWidgetSerializedDataEvent: (evt: GetUserDashboardWidgetSerializedDataEvent) => {},
    GetUserDashboardSerializedDataEvent: (evt: GetUserDashboardSerializedDataEvent) => {},
    GetExportArtifactContentEvent: (evt: GetExportArtifactContentEvent) => {},
    DeleteExportArtifactByIdEvent: (evt: DeleteExportArtifactByIdEvent) => {},
    GetAllExportArtifactsEvent: (evt: GetAllExportArtifactsEvent) => {},
    CreateInvitationEvent: (evt: CreateInvitationEvent) => {},
    ActivateInvitationEvent: (evt: ActivateInvitationEvent) => {},
    GetInvitationByCodeEvent: (evt: GetInvitationByCodeEvent) => {},
    DeleteGroupEvent: (evt: DeleteGroupEvent) => {},
    AddOrUpdateGroupEvent: (evt: AddOrUpdateGroupEvent) => {},
    SearchForGroupsWithNoSuchRoleEvent: (evt: SearchForGroupsWithNoSuchRoleEvent) => {},
    SearchForGroupByNameEvent: (evt: SearchForGroupByNameEvent) => {},
    GetGroupsWithRoleEvent: (evt: GetGroupsWithRoleEvent) => {},
    GetGroupByNameEvent: (evt: GetGroupByNameEvent) => {},
    GetGroupByIdEvent: (evt: GetGroupByIdEvent) => {},
    GetAllGroupsEvent: (evt: GetAllGroupsEvent) => {},
    UpdateItemsStatusEvent: (evt: UpdateItemsStatusEvent) => {},
    UpdateItemValueEvent: (evt: UpdateItemValueEvent) => {

    },
    UpdateItemEvent: (evt: UpdateItemEvent) => {

    },
    AddItemEvent: (evt: AddItemEvent) => {

    },
    AddOrUpdateItemEvent: (evt: AddOrUpdateItemEvent) => {

    },
    SearchForFavouriteItemsInViewEvent: (evt: SearchForFavouriteItemsInViewEvent) => {},
    SearchForItemsInViewEvent: (evt: SearchForItemsInViewEvent) => {},
    AddFavouriteItemIdsEvent: (evt: AddFavouriteItemIdsEvent) => {},
    RemoveFavouriteItemIdsEvent: (evt: RemoveFavouriteItemIdsEvent) => {},
    GetAllFavouriteItemIdsInViewEvent: (evt: GetAllFavouriteItemIdsInViewEvent) => {},
    GetAllFavouritedItemsInViewEvent: (evt: GetAllFavouritedItemsInViewEvent) => {},
    GetAllItemsInViewEvent: (evt: GetAllItemsInViewEvent) => {},
    GetItemsByIdsEvent: (evt: GetItemsByIdsEvent) => {

    },
    GetItemByIdEvent: (evt: GetItemByIdEvent) => {

    },
    GetItemByNameEvent: (evt: GetItemByNameEvent) => {

    },
    GetItemWithFilteringEvent: (evt: GetItemWithFilteringEvent) => {},
    MarkItemImageAsPrimaryEvent: (evt: MarkItemImageAsPrimaryEvent) => {},
    GetItemPrimaryImageEvent: (evt: GetItemPrimaryImageEvent) => {},
    GetItemImageContentEvent: (evt: GetItemImageContentEvent) => {},
    AddItemImageEvent: (evt: AddItemImageEvent) => {},
    DeleteItemImageEvent: (evt: DeleteItemImageEvent) => {},
    GetJobDetailsByIdEvent: (evt: GetJobDetailsByIdEvent) => {},
    GetAllJobsEvent: (evt: GetAllJobsEvent) => {},
    GetJobByIdEvent: (evt: GetJobByIdEvent) => {},
    CreateJwtTokenEvent: (evt: CreateJwtTokenEvent) => {},
    DecodeJwtTokenEvent: (evt: DecodeJwtTokenEvent) => {},
    VerifyJwtTokenEvent: (evt: VerifyJwtTokenEvent) => {},
    AddUserNotificationEvent: (evt: AddUserNotificationEvent) => {},
    GetUserNotificationsEvent: (evt: GetUserNotificationsEvent) => {},
    GetPricedItemsEvent: (evt: GetPricedItemsEvent) => {},
    GetPricedItemsWithFilteringEvent: (evt: GetPricedItemsWithFilteringEvent) => {},
    SearchGroupsAssociatedWithPricingStructureEvent: (evt: SearchGroupsNotAssociatedWithPricingStructureEvent) => {},
    SearchGroupsNotAssociatedWithPricingStructureEvent: (evt: SearchGroupsNotAssociatedWithPricingStructureEvent) => {},
    GetPricingStructureGroupAssociationsEvent: (evt: GetPricingStructureGroupAssociationsEvent) => {},
    LinkPricingStructureWithGroupIdEvent: (evt: LinkPricingStructureWithGroupIdEvent) => {},
    UnlinkPricingStructureWithGroupIdEvent: (evt: UnlinkPricingStructureWithGroupIdEvent) => {},
    UpdatePricingStructureStatusEvent: (evt: UpdatePricingStructureStatusEvent) => {},
    AddOrUpdatePricingStructuresEvent: (evt: AddOrUpdatePricingStructuresEvent) => {},
    GetPricingStructuresByViewEvent: (evt: GetPricingStructuresByViewEvent) => {},
    GetPartnerPricingStructuresEvent: (evt: GetPartnerPricingStructuresEvent) => {},
    GetAllPricingStructureItemsWithPriceEvent: (evt: GetAllPricingStructureItemsWithPriceEvent) => {},
    GetAllPricingStructuresEvent: (evt: GetAllPricingStructuresEvent) => {},
    GetPricingStructureByNameEvent: (evt: GetPricingStructureByNameEvent) => {},
    GetPricingStructureByIdEvent: (evt: GetPricingStructureByIdEvent) => {},
    SetPricesEvent: (evt: SetPricesEvent) => {},
    AddItemToPricingStructureEvent: (evt: AddItemToPricingStructureEvent) => {},
    GetPricingStructureItemEvent: (evt: GetPricingStructureItemEvent) => {},
    AddOrUpdateRoleEvent: (evt: AddOrUpdateRoleEvent) => {},
    AddRoleToGroupEvent: (evt: AddRoleToGroupEvent) => {},
    GetRoleByNameEvent: (evt: GetRoleByNameEvent) => {},
    GetAllRolesEvent: (evt: GetAllRolesEvent) => {},
    RemoveRoleFromGroup: (evt: RemoveRoleFromGroup) => {},
    AddOrUpdateRuleEvent: (evt: AddOrUpdateRuleEvent) => {},
    UpdateRuleStatusEvent: (evt: UpdateRuleStatusEvent) => {},
    GetRulesEvent: (evt: GetRulesEvent) => {},
    GetRuleEvent: (evt: GetRuleEvent) => {},
    SelfRegisterEvent: (evt: SelfRegisterEvent) => {},
    ApproveSelfRegistrationEvent: (evt: ApproveSelfRegistrationEvent) => {},
    GetAllSelfRegistrationsEvent: (evt: GetAllSelfRegistrationsEvent) => {},
    SearchSelfRegistrationByUsernameEvent: (evt: SearchSelfRegistrationByUsernameEvent) => {},
    DeleteSelfRegistrationEvent: (evt: DeleteSelfRegistrationEvent) => {},
    AddUserEvent: (evt: AddUserEvent) => {},
    UpdateUserEvent: (evt: UpdateUserEvent) => {},
    ChangeUserStatusEvent: (evt: ChangeUserStatusEvent) => {},
    AddUserToGroupEvent: (evt: AddUserToGroupEvent) => {},
    GetUsersInGroupEvent: (evt: GetUsersInGroupEvent) => {},
    GetUsersByStatusEvent: (evt: GetUsersByStatusEvent) => {},
    GetNoAvatarContentEvent: (evt: GetNoAvatarContentEvent) => {},
    GetUserAvatarContentEvent: (evt: GetUserAvatarContentEvent) => {},
    SearchForUserNotInGroupEvent: (evt: SearchForUserNotInGroupEvent) => {},
    SearchUserByUsernameAndStatusEvent: (evt: SearchUserByUsernameAndStatusEvent) => {},
    DeleteUserFromGroupEvent: (evt: DeleteUserFromGroupEvent) => {},
    DeleteUserEvent: (evt: DeleteUserEvent) => {},
    HasAllUserRolesEvent: (evt: HasAllUserRolesEvent) => {},
    HasAnyUserRolesEvent: (evt: HasAnyUserRolesEvent) => {},
    HasNoneUserRolesEvent: (evt: HasNoneUserRolesEvent) => {},
    GetUserByUsernameEvent: (evt: GetUserByUsernameEvent) => {},
    GetUserByIdEvent: (evt: GetUserByIdEvent) => {},
    UpdateUserSettingsEvent: (evt: UpdateUserSettingsEvent) => {},
    GetSettingsEvent: (evt: GetSettingsEvent) => {},
    DeleteViewEvent: (evt: DeleteViewEvent) => {},
    AddOrUpdateViewsEvent: (evt: AddOrUpdateRuleEvent) => {},
    GetAllViewsEvent: (evt: GetAllViewsEvent) => {},
    GetViewByIdEvent: (evt: GetViewByIdEvent) => {},
    GetViewByNameEvent: (evt: GetViewByNameEvent) => {},
    GetViewValidationResultEvent: (evt: GetViewValidationResultEvent) => {},
    GetAllViewValidationsEvent: (evt: GetAllViewValidationsEvent) => {},
    DeleteValidationResultEvent: (evt: DeleteValidationResultEvent) => {},
    GetValidationsByViewIdEvent: (evt: GetValidationsByViewIdEvent) => {},
    GetValidationByViewIdAndValidationIdEvent: (evt: GetValidationByViewIdAndValidationIdEvent) => {}
};

const httpActions: any[] = [
    [
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {

        const views: {viewId: number, viewName: string}[] = await doInDbConnection(async (conn: Connection) => {
            const q: QueryA = await conn.query(`SELECT ID, NAME, DESCRIPTION, STATUS, CREATION_DATE, LAST_UPDATE FROM TBL_VIEW WHERE STATUS = ? `, [ENABLED]);
            return q.reduce((acc: {viewId: number, viewName: string}[], i: QueryI) => {
                acc.push({ viewId: i.ID, viewName: i.NAME});
                return acc;
            }, []);
        });

        const itemsInfo: Reporting_ItemsWithMissingAttributeInfo = {
            views: []
        };

        for (const view of views) {
            const viewInfo: Reporting_ViewWithMissingAttribute = await doInDbConnection(async (conn: Connection) => {

                const viewId: number = view.viewId;
                const viewName: string = view.viewName;


                // count total items with missing attributes
                const totalItemsWithMissingAttributesInView: number = (await conn.query(`
                    SELECT
                        COUNT(I.ID) AS COUNT 
                    FROM TBL_ITEM AS I
                    LEFT JOIN TBL_VIEW AS V ON V.ID = I.VIEW_ID
                    WHERE I.ID NOT IN (
                        SELECT ITEM_ID FROM TBL_ITEM_VALUE 
                    ) AND I.STATUS = ? AND I.VIEW_ID = ?
            `, [ENABLED, viewId]) as QueryA)[0].COUNT;

                // count total attributes that are missing value
                let totalMissingAttributesInView: number = 0;
                const q1: QueryA = (await conn.query(`SELECT ID FROM TBL_ITEM WHERE STATUS = ? AND VIEW_ID = ?`, [ENABLED, viewId]));
                for (const qi of q1) {
                    const itemId: number = qi.ID;
                    const count: number = (await conn.query(`
                        SELECT COUNT(*) AS COUNT FROM TBL_VIEW_ATTRIBUTE WHERE ID NOT IN (SELECT VIEW_ATTRIBUTE_ID FROM TBL_ITEM_VALUE WHERE ITEM_ID IN (SELECT ITEM_ID FROM TBL_VIEW WHERE ID=?));
                    `, [itemId]))[0].COUNT;
                    totalMissingAttributesInView += count;
                }

                const viewInfo: Reporting_ViewWithMissingAttribute = {
                    viewId,
                    viewName,
                    totalItemsWithMissingAttributes: totalItemsWithMissingAttributesInView,
                    totalMissingAttributes: totalMissingAttributesInView,
                    items: []
                };

                // get all items with missing attribute values
                const q: QueryA = await conn.query(`
                    SELECT
                       I.ID AS I_ID, 
                       I.PARENT_ID AS I_PARENT_ID, 
                       I.VIEW_ID AS I_VIEW_ID, 
                       I.NAME AS I_NAME, 
                       I.DESCRIPTION AS I_DESCRIPTION, 
                       I.STATUS AS I_STATUS, 
                       I.CREATION_DATE AS I_CREATION_DATE, 
                       I.LAST_UPDATE AS I_LAST_UPDATE,
                       V.ID AS V_ID, 
                       V.NAME AS V_NAME, 
                       V.DESCRIPTION AS V_DESCRIPTION, 
                       V.STATUS AS V_STATUS, 
                       V.CREATION_DATE AS V_CREATION_DATE, 
                       V.LAST_UPDATE AS V_LAST_UPDATE
                    FROM TBL_ITEM AS I
                    LEFT JOIN TBL_VIEW AS V ON V.ID = I.VIEW_ID
                    WHERE I.ID NOT IN (
                        SELECT ITEM_ID FROM TBL_ITEM_VALUE 
                    ) AND I.STATUS = ? AND I.VIEW_ID = ?
                `, [ENABLED, viewId]);

                for (let i of q) {

                    const itemId: number = i.I_ID;
                    const itemName: string = i.I_NAME;
                    const totalMissingAttributesInItem: number = (await conn.query(`
                        SELECT COUNT(*) AS COUNT FROM TBL_VIEW_ATTRIBUTE WHERE ID NOT IN (SELECT VIEW_ATTRIBUTE_ID FROM TBL_ITEM_VALUE WHERE ITEM_ID IN (SELECT ITEM_ID FROM TBL_VIEW WHERE ID=?));
                    `, [itemId]))[0].COUNT;

                    // get missing attributes in an item
                    const qq: QueryA = await conn.query(`
                    SELECT 
                        A.ID AS A_ID,
                        A.VIEW_ID AS A_VIEW_ID,
                        A.TYPE AS A_TYPE,
                        A.NAME AS A_NAME,
                        A.STATUS AS A_STATUS,
                        A.DESCRIPTION AS A_DESCRIPTION,
                        A.CREATION_DATE AS A_CREATION_DATE,
                        A.LAST_UPDATE AS A_LAST_UPDATE 
                    FROM TBL_VIEW_ATTRIBUTE AS A
                    WHERE A.ID NOT IN (
                        SELECT VIEW_ATTRIBUTE_ID FROM TBL_ITEM_VALUE WHERE ITEM_ID = ?
                    ) AND A.STATUS = ?
                `, [itemId, ENABLED]);

                    const a: Reporting_MissingAttribute[] = qq.reduce((acc: Reporting_MissingAttribute[], i: QueryI) => {
                        const a = {
                            attributeId: i.A_ID,
                            attributeName: i.A_NAME,
                            attributeType: i.A_TYPE
                        } as Reporting_MissingAttribute;
                        acc.push(a);
                        return acc;
                    }, []);

                    const itemInfo: Reporting_ItemWithMissingAttribute = {
                        totalMissingAttributes: totalMissingAttributesInItem,
                        itemId,
                        itemName,
                        viewId,
                        viewName,
                        attributes: a
                    }
                    viewInfo.items.push(itemInfo);
                }
                return viewInfo;
            });
            itemsInfo.views.push(viewInfo);
        }

        res.status(200).json({
           status: "SUCCESS",
           message: 'success',
           payload: itemsInfo
        } as ApiResponse<Reporting_ItemsWithMissingAttributeInfo>);
    }
];

const mountRoute = (v1AppRouter: Router, registry: Registry) => {
    const p = `/reporting/missing-attribute-values`;
    registry.addItem('GET', p);
    v1AppRouter.get(p, ...httpActions);
};

const s: EventSubscriptionRegistry = newEventSubscriptionRegistry(d, `missing-attribute-values-subscription`,
    (v1AppRouter: Router, registry: Registry): Promise<void> => {
        // perform db and router related setup
        mountRoute(v1AppRouter, registry);
        return null;
    }
);

export default s;

