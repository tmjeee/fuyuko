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
import {Reporting_ViewValidationRangeSummary, Reporting_ViewValidationSummary} from '@fuyuko-common/model/reporting.model';
import {doInDbConnection, QueryA, QueryI} from '../../../db';
import {Connection} from 'mariadb';
import {RuleLevel} from '@fuyuko-common/model/rule.model';
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
        const ranges: Reporting_ViewValidationSummary[] = await doInDbConnection(async (conn: Connection) => {

            const ranges: Reporting_ViewValidationSummary[] = [];

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
                LIMIT 10 OFFSET 0;
            `, [viewId]);

            if (q1 && q1.length) {
                let viewId: number;
                let viewName: string;
                for (const qi of q1) {
                    const validationId: number = qi.VAL_ID;
                    const validationName: string = qi.VAL_NAME;
                    const totalItems: number = qi.VAL_TOTAL_ITEMS;
                    viewId = qi.VAL_VIEW_ID;
                    viewName = qi.V_NAME;
                    
                    const q2: QueryA = await conn.query(`
                    SELECT 
                         LEVEL, COUNT(*) AS COUNT
                    FROM TBL_VIEW_VALIDATION_ERROR AS E
                    INNER JOIN TBL_VIEW_VALIDATION AS V ON V.ID = E.VIEW_VALIDATION_ID
                    WHERE E.VIEW_VALIDATION_ID = ? 
                    GROUP BY E.LEVEL
                `, [validationId]);

                    const r: { totalWithErrors: number, totalWithWarnings: number } = q2.reduce((acc: { totalWithErrors: number, totalWithWarnings: number }, i: QueryI) => {
                        if ((i.LEVEL as RuleLevel) == 'WARN') {
                            acc.totalWithWarnings = i.COUNT;
                        } else if ((i.LEVEL as RuleLevel) == 'ERROR') {
                            acc.totalWithErrors = i.COUNT;
                        }
                        return acc;
                    }, {totalWithErrors: 0, totalWithWarnings: 0});

                    const rs: Reporting_ViewValidationSummary = {
                        validationId,
                        validationName,
                        viewId,
                        viewName,
                        totalItems,
                        totalWithErrors: r.totalWithErrors,
                        totalWithWarnings: r.totalWithWarnings
                    } as Reporting_ViewValidationSummary;

                    ranges.push(rs);
                }

                /*
                while (ranges.length < 10) {
                    ranges.push({
                        validationId: null,
                        validationName: '',
                        viewId,
                        viewName,
                        totalItems: 0,
                        totalWithErrors: 0,
                        totalWithWarnings: 0
                    });
                }
                */
            }
            return ranges.reverse();
        });

        res.status(200).json({
            status: 'SUCCESS',
            message: 'success',
            payload: {
               range: ranges
            } as Reporting_ViewValidationRangeSummary
        } as ApiResponse<Reporting_ViewValidationRangeSummary>);
    }
];

const mountRoute = (v1AppRegistry: Router, registry: Registry) => {
   const p = `/reporting/view-validation-range-summary/view/:viewId`; 
   registry.addItem('GET', p);
   v1AppRegistry.get(p, ...httpAction);
}

const s: EventSubscriptionRegistry = newEventSubscriptionRegistry(d, `reporting-view-validation-range-summary-subscription`,
    (v1AppRouter: Router, registry: Registry): Promise<void> => {
        // perform db and router related setup
        mountRoute(v1AppRouter, registry);
        return null;
    }
);

export default s;

