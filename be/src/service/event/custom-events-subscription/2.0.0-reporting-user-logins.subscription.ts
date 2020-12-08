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
} from "../event.service";
import {doInDbConnection, QueryA, QueryI} from "../../../db";
import {Connection} from "mariadb";
import {NextFunction, Request, Response, Router} from "express";
import {Registry} from "../../../registry";
import {
    aFnAnyTrue,
    v,
    validateJwtMiddlewareFn,
    validateMiddlewareFn,
    vFnHasAnyUserRoles
} from "../../../route/v1/common-middleware";
import {ROLE_VIEW} from "../../../model/role.model";
import {JwtPayload} from "../../../model/jwt.model";
import * as jwt from "jsonwebtoken";
import moment from 'moment';
import {User} from "../../../model/user.model";
import {Reporting_ActiveUser, Reporting_MostActiveUsers} from "../../../model/reporting.model";
import {ApiResponse} from "../../../model/api-response.model";
import {Lock} from "../../../util";


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
    LoginEvent: async (evt: LoginEvent) => {
        // todo:
        await updateLoginInfos(evt.result.user);
    },
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
    CreateJwtTokenEvent: async (evt: CreateJwtTokenEvent) => {
       // todo:  when login
        const jwtPayload: JwtPayload = jwt.decode(evt.jwtToken) as JwtPayload;
        await updateLoginInfos(jwtPayload.user);
    },
    DecodeJwtTokenEvent: async (evt: DecodeJwtTokenEvent) => {
        // todo: when logout
        await updateLoginInfos(evt.jwtPayload.user);
    },
    VerifyJwtTokenEvent: async (evt: VerifyJwtTokenEvent) => {
        // todo: when intercepting request
        await updateLoginInfos(evt.jwtPayload.user);
    },
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

const s: EventSubscriptionRegistry = newEventSubscriptionRegistry(d, `audit-event-subscription`,
    async (v1AppRouter: Router, registry: Registry): Promise<void> => {
        await autoCreateTables();
        await mountRoutes_mostActiveUsers(v1AppRouter, registry);
        await mountRoutes_userVisitsInsignt(v1AppRouter, registry);
    });

export default s;

const lock = new Lock();

const updateLoginInfos = async (user: User) => {
    if (user) {
        await lock.doInLock(async () => {
            await doInDbConnection(async (conn: Connection) => {
                const m = moment();
                const d = moment(m).startOf('day');
                const q: QueryA = await conn.query(`SELECT COUNT(*) AS COUNT FROM TBL_REPORTING_USER_LOGINS WHERE \`DATE\`=? AND USER_ID=? `, [d.toDate(), user.id]);
                if (q[0].COUNT <= 0) { // this user access has not been logged yet
                    await conn.query(`INSERT INTO TBL_REPORTING_USER_LOGINS (\`DATE\`, \`DATETIME\`, USER_ID) VALUES (?, ?, ?)`, [d.toDate(), m.toDate(), user.id])
                }
            });
        });
    }
}

const autoCreateTables = async () => {
    await doInDbConnection(async (conn: Connection) => {
        await conn.query(`
                CREATE TABLE IF NOT EXISTS TBL_REPORTING_USER_LOGINS (
                    ID INT PRIMARY KEY AUTO_INCREMENT,
                    \`DATE\` DATE NOT NULL,
                    \`DATETIME\` TIMESTAMP NOT NULL,
                    USER_ID INT
                );
           `);
    });
}

const httpAction_mostActiveUsers: any[] = [
    [
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const mostActiveUsersReport: Reporting_MostActiveUsers = await doInDbConnection(async (conn: Connection) => {
            const q: QueryA = await conn.query(`
                SELECT
                    U.ID AS USER_ID,
                    U.USERNAME AS USERNAME,
                    U.EMAIL AS EMAIL,
                    COUNT(*) AS COUNT
                FROM TBL_REPORTING_USER_LOGINS AS R
                LEFT JOIN TBL_USER AS U ON U.ID = R.USER_ID
                GROUP BY U.ID, U.USERNAME, U.EMAIL
                ORDER BY COUNT DESC
                LIMIT 10
                OFFSET 0
            `);
            
            const activeUsers: Reporting_ActiveUser[] = q.reduce((acc: Reporting_ActiveUser[], i: QueryI) => {
                acc.push({
                    count: i.COUNT,
                    userId: i.USER_ID,
                    username: i.USERNAME,
                    email: i.EMAIL
                });
                return acc;
            }, []);
            
            return {
                activeUsers,
            } as Reporting_MostActiveUsers
        });
        res.status(200).json({
           status: "SUCCESS",
           message: 'success',
           payload: mostActiveUsersReport
        } as ApiResponse<Reporting_MostActiveUsers>);
    }
];
const httpAction_userVisitsInsignt: any[] = [
    [
    ],
    validateMiddlewareFn,
    validateJwtMiddlewareFn,
    v([vFnHasAnyUserRoles([ROLE_VIEW])], aFnAnyTrue),
    async (req: Request, res: Response, next: NextFunction) => {
        const m = moment();

        // daily
        const daily: { date: string, count: number }[] = [];
        {
            const dailyMap: Map<string, { date: string, count: number }> = await doInDbConnection(async (conn: Connection) => {
                const q: QueryA = await conn.query(`
              SELECT   
                 CONCAT(DAY(R.\`DATE\`), '-', MONTH(R.\`DATE\`), '-', YEAR(R.\`DATE\`)) AS DATE_RANGE,
                 COUNT(R.USER_ID) AS COUNT
              FROM TBL_REPORTING_USER_LOGINS AS R
              GROUP BY CONCAT(DAY(R.\`DATE\`), '-', MONTH(R.\`DATE\`), '-', YEAR(R.\`DATE\`))
              ORDER BY CONCAT(DAY(R.\`DATE\`), '-', MONTH(R.\`DATE\`), '-', YEAR(R.\`DATE\`)) DESC
              LIMIT 10
              OFFSET 0
           `);
                return q.reduce((acc: Map<string, { date: string, count: number }>, i: QueryI) => {
                    acc.set(i.DATE_RANGE, {
                        date: i.DATE_RANGE,
                        count: i.COUNT
                    })
                    return acc;
                }, new Map());
            });

            let _m = moment(m);
            for (let i = 0; i < 10; i++) {
                const d = `${_m.date()}-${_m.month() + 1}-${_m.year()}`;
                if (dailyMap.has(d)) {
                    daily.push(dailyMap.get(d));
                } else {
                    daily.push({date: d, count: 0});
                }
                _m = _m.subtract(1, 'day');
            }
        }
        daily.reverse();




        // weekly
        const weekly: {date: string, count: number}[] = [];
        {
            const weeklyMap: Map<string, { date: string, count: number }> = await doInDbConnection(async (conn: Connection) => {
                const q: QueryA = await conn.query(`
              SELECT   
                 CONCAT(WEEK(R.\`DATE\`), '-', YEAR(R.\`DATE\`)) AS DATE_RANGE,
                 COUNT(R.USER_ID) AS COUNT
              FROM TBL_REPORTING_USER_LOGINS AS R
              GROUP BY CONCAT(WEEK(R.\`DATE\`), '-', YEAR(R.\`DATE\`))
              ORDER BY CONCAT(WEEK(R.\`DATE\`), '-', YEAR(R.\`DATE\`)) DESC
              LIMIT 10
              OFFSET 0
           `);
                return q.reduce((acc: Map<string, { date: string, count: number }>, i: QueryI) => {
                    acc.set(i.DATE_RANGE, {
                        date: i.DATE_RANGE,
                        count: i.COUNT
                    })
                    return acc;
                }, new Map);
            });

            let _m = moment(m);
            for (let i = 0; i < 10; i++) {
                const d = `${_m.weeks()}-${_m.year()}`;
                if (weeklyMap.has(d)) {
                    weekly.push(weeklyMap.get(d));
                } else {
                    weekly.push({date: d, count: 0});
                }
                _m = _m.subtract(1, 'week');
            }
        }
        weekly.reverse();


        // monthly
        const monthly: {date: string, count: number}[] = [];
        {
            const monthlyMap: Map<string, { date: string, count: number }> = await doInDbConnection(async (conn: Connection) => {
                const q: QueryA = await conn.query(`
              SELECT   
                 CONCAT(MONTH(R.\`DATE\`), '-', YEAR(R.\`DATE\`)) AS DATE_RANGE,
                 COUNT(R.USER_ID) AS COUNT
              FROM TBL_REPORTING_USER_LOGINS AS R
              GROUP BY CONCAT(MONTH(R.\`DATE\`), '-', YEAR(R.\`DATE\`))
              ORDER BY CONCAT(MONTH(R.\`DATE\`), '-', YEAR(R.\`DATE\`)) DESC
              LIMIT 10
              OFFSET 0
           `);
                return q.reduce((acc: Map<string, { date: string, count: number }>, i: QueryI) => {
                    acc.set(i.DATE_RANGE, {
                        date: i.DATE_RANGE,
                        count: i.COUNT
                    });
                    return acc;
                }, new Map());
            });

            let _m = moment(m);
            for (let i = 0; i < 10; i++) {
                const d = `${_m.month() + 1}-${_m.year()}`;
                if (monthlyMap.has(d)) {
                    monthly.push(monthlyMap.get(d));
                } else {
                    monthly.push({date: d, count: 0});
                }
                _m = _m.subtract(1, 'month');
            }
        }
        monthly.reverse();


        // yearly
        const yearly: {date: string, count: number}[] = [];
        {
            const yearlyMap: Map<string, { date: string, count: number }> = await doInDbConnection(async (conn: Connection) => {
                const q: QueryA = await conn.query(`
              SELECT   
                 CONCAT(YEAR(R.\`DATE\`)) AS DATE_RANGE,
                 COUNT(R.USER_ID) AS COUNT
              FROM TBL_REPORTING_USER_LOGINS AS R
              GROUP BY CONCAT(YEAR(R.\`DATE\`))
              ORDER BY CONCAT(YEAR(R.\`DATE\`)) DESC
              LIMIT 10
              OFFSET 0
           `);
                return q.reduce((acc: Map<string, { date: string, count: number }>, i: QueryI) => {
                    acc.set(i.DATE_RANGE, {
                        date: i.DATE_RANGE,
                        count: i.COUNT
                    })
                    return acc;
                }, new Map());
            });

            let _m = moment(m);
            for (let i = 0; i < 10; i++) {
                const d = `${_m.year()}`;
                if (yearlyMap.has(d)) {
                    yearly.push(yearlyMap.get(d));
                } else {
                    yearly.push({date: d, count: 0});
                }
                _m = _m.subtract(1, 'year');
            }
        }
        yearly.reverse();

        res.status(200).json({
            status: "SUCCESS",
            message: 'success',
            payload: {
                daily, weekly, monthly, yearly
            }
        } as ApiResponse<{
            daily: {date: string, count: number}[],
            weekly: {date: string, count: number}[],
            monthly: {date: string, count: number}[],
            yearly: {date: string, count: number}[]
        }>);
    }
];
const mountRoutes_mostActiveUsers = async (v1AppRouter: Router, registry: Registry) => {
    const p = `/reporting/most-active-users`;
    registry.addItem('GET', p);
    v1AppRouter.get(p, ...httpAction_mostActiveUsers);
};
const mountRoutes_userVisitsInsignt = async (v1AppRouter: Router, registry: Registry) => {
    const p = `/reporting/user-visits-insight`;
    registry.addItem('GET', p);
    v1AppRouter.get(p, ...httpAction_userVisitsInsignt);
};

