
export class Settings {
    id: number;
    openHelpNav: boolean;
    openSideNav: boolean;
    openSubSideNav: boolean;

    constructor(s: {
        id: number;
        openHelpNav: boolean;
        openSideNav: boolean;
        openSubSideNav: boolean;
    }) {
        this.id = s.id;
        this.openHelpNav = s.openHelpNav;
        this.openSideNav = s.openSideNav;
        this.openSubSideNav = s.openSubSideNav;
    }
}


