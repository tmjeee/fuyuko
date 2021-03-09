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
import {param} from 'express-validator';
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from '../../../route/v1/common-middleware';
import {ROLE_VIEW} from '@fuyuko-common/model/role.model';
import {doInDbConnection, QueryA, QueryI} from '../../../db';
import {Connection} from 'mariadb';
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
    UpdateAttributesEvent: (evt: UpdateAttributesEvent) => {},
    ChangeAttributeStatusEvent: (evt: ChangeAttributeStatusEvent) => {},
    GetAttributeInViewByNameEvent: (evt: GetAttributeInViewByNameEvent) => {},
    GetAttributeInViewEvent: (evt: GetAttributeInViewEvent) => {},
    GetAttributesInViewEvent: (evt: GetAttributesInViewEvent) => {},
    SaveAttributesEvent: (evt: SaveAttributesEvent) => {},
    SearchAttributesByViewEvent: (evt: SearchAttributesByViewEvent) => {},
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
    UpdateItemValueEvent: (evt: UpdateItemValueEvent) => {},
    UpdateItemEvent: (evt: UpdateItemEvent) => {},
    AddItemEvent: (evt: AddItemEvent) => {},
    AddOrUpdateItemEvent: (evt: AddOrUpdateItemEvent) => {},
    SearchForFavouriteItemsInViewEvent: (evt: SearchForFavouriteItemsInViewEvent) => {},
    SearchForItemsInViewEvent: (evt: SearchForItemsInViewEvent) => {},
    AddFavouriteItemIdsEvent: (evt: AddFavouriteItemIdsEvent) => {},
    RemoveFavouriteItemIdsEvent: (evt: RemoveFavouriteItemIdsEvent) => {},
    GetAllFavouriteItemIdsInViewEvent: (evt: GetAllFavouriteItemIdsInViewEvent) => {},
    GetAllFavouritedItemsInViewEvent: (evt: GetAllFavouritedItemsInViewEvent) => {},
    GetAllItemsInViewEvent: (evt: GetAllItemsInViewEvent) => {},
    GetItemsByIdsEvent: (evt: GetItemsByIdsEvent) => {},
    GetItemByIdEvent: (evt: GetItemByIdEvent) => {},
    GetItemByNameEvent: (evt: GetItemByNameEvent) => {},
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

const httpAction: any[] = [
    [
        param('viewId').exists().isNumeric()
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const viewId: number = Number(req.params.viewId);
        const r: {
            viewId: number;
            viewName: string;
            validationId: number;
            validationName: string;
            attributes: {
                attributeId: number,
                attributeName: string,
                errors: number,
                warnings: number
            }[]
        } = await doInDbConnection(async(conn: Connection) => {
            const q1: QueryA = await conn.query(`
                SELECT 
                    VAL.ID AS VAL_ID, 
                    VAL.VIEW_ID AS VAL_VIEW_ID,
                    VAL.NAME AS VAL_NAME,
                    VAL.DESCRIPTION AS VAL_DESCRIPTION,
                    VAL.PROGRESS AS VAL_PROGRESS,
                    VAL.CREATION_DATE AS VAL_CREATION_DATE,
                    VAL.LAST_UPDATE AS VAL_LAST_UPDATE,
                    VAL.TOTAL_ITEMS AS VAL_TOTAL_ITEMS,
                    V.ID AS V_ID,
                    V.NAME AS V_NAME,
                    V.DESCRIPTION AS V_DESCRIPTION,
                    V.STATUS AS V_STATUS,
                    V.CREATION_DATE AS V_CREATION_DATE,
                    V.LAST_UPDATE AS V_LAST_UPDATE
                FROM TBL_VIEW_VALIDATION AS VAL
                INNER JOIN TBL_VIEW AS V ON V.ID = VAL.VIEW_ID 
                WHERE VAL.VIEW_ID = ?
                ORDER BY VAL.CREATION_DATE DESC 
                LIMIT 1 OFFSET 0;
            `, [viewId]);

            if (q1 && q1.length) {
                const validationId: number = q1[0].VAL_ID;
                const validationName: string = q1[0].VAL_NAME;
                const totalItems: number = q1[0].VAL_TOTAL_ITEMS;
                const viewId: number = q1[0].VAL_VIEW_ID;
                const viewName: string = q1[0].V_NAME;

                const q2: QueryA = await conn.query(`
                    SELECT 
                        E.VIEW_VALIDATION_ID AS VALIDATION_ID,
                        E.VIEW_ATTRIBUTE_ID AS ATTRIBUTE_ID,
                        A.NAME AS ATTRIBUTE_NAME,
                        E.LEVEL AS LEVEL,
                        COUNT(*) AS COUNT
                    FROM TBL_VIEW_VALIDATION_ERROR AS E
                    LEFT JOIN TBL_VIEW_ATTRIBUTE AS A ON A.ID = E.VIEW_ATTRIBUTE_ID
                    WHERE E.VIEW_VALIDATION_ID = ?
                    GROUP BY E.VIEW_VALIDATION_ID, E.VIEW_ATTRIBUTE_ID, E.LEVEL
                `, [validationId]);
                
                const attributesMap: Map<number, {
                   attributeId: number, attributeName: string, errors: number, warnings: number
                }> = q2.reduce((acc: Map<number, {attributeId: number, attributeName: string, errors: number, warnings: number}>, i: QueryI) => {
                    const attributeId: number = i.ATTRIBUTE_ID;
                    if (!acc.has(attributeId)) {
                        acc.set(attributeId, {
                            attributeId: i.ATTRIBUTE_ID,
                            attributeName: i.ATTRIBUTE_NAME,
                        } as any);
                    }
                    if (i.LEVEL == 'WARN') {
                        acc.get(attributeId).warnings = i.COUNT;
                    }
                    if (i.LEVEL == 'ERROR') {
                        acc.get(attributeId).errors = i.COUNT;
                    }
                    return acc;
                }, new Map());

                return {
                    viewId,
                    viewName,
                    validationId,
                    validationName,
                    attributes: [...attributesMap.values()]
                };
            }
            return null;
        });
        
        res.status(200).json({
            status: 'SUCCESS',
            message: 'success',
            payload: r
        } as ApiResponse<{
            viewId: number;
            viewName: string;
            validationId: number;
            validationName: string;
            attributes: {
                attributeId: number,
                attributeName: string,
                errors: number,
                warnings: number
            }[]
        }>);
    }
];

const mountRoute = (v1AppRouter: Router, registry: Registry) => {
    const p = `/reporting/view-attributes-validation-summary/view/:viewId`;
    registry.addItem('GET', p);
    v1AppRouter.get(p, ...httpAction);
};

const s: EventSubscriptionRegistry = newEventSubscriptionRegistry(d, `attributes-validation-summary-subscription`,
    (v1AppRouter: Router, registry: Registry): Promise<void> => {
        // perform db and router related setup
        mountRoute(v1AppRouter, registry);
        return null;
    }
);

export default s;

