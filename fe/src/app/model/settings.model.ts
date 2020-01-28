

export class Settings {
    id: number;

    defaultOpenHelpNav: boolean;
    defaultOpenSideNav: boolean;
    defaultOpenSubSideNav: boolean;
}


export interface RuntimeSettings {
    settingsId: number;
    openHelpNav: boolean;
    openSideNav: boolean;
    openSubSideNav: boolean;
}


