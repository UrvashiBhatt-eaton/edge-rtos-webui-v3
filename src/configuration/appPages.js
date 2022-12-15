import * as config from "./pageConfig";
import * as paramMeta from "./dciMeta";

export const appPages = {
    config: config,
    meta: paramMeta,
    drawerNavGroup: [
        {
            id: 0,
            name: "Overview",
            layout: "card",
            icon: "equalizer",
            route: "/overview",
            data: config.overview
        },
        {
            id: 23,
            name: "Settings",
            icon: "settings",
            route: "/settings",
            subTabNavGroup: [
                {
                    id: 24,
                    name: "Preference",
                    layout: "settings-list",
                    route: "/settings/preference",
                    data: config.preference
                },
                {
                    id: 44,
                    name: "Network",
                    layout: "settings-list",
                    route: "/settings/network",
                    data: config.network
                },
                {
                    id: 75,
                    name: "Firmware",
                    layout: "settings-list",
                    route: "/settings/firmware",
                    data: config.firmware
                },
                {
                    id: 84,
                    name: "User Management",
                    layout: "user-management",
                    route: "/settings/userManagement",
                }
            ]
        },
        {
            id: 85,
            name: "Logs",
            layout: "settings-log",
            icon: "viewList",
            route: "/logs",
        },
        {
            id: 86,
            name: "License Information",
            layout: "settings-list",
            icon: "gavel",
            route: "/licenseInformation",
            data: config.licenseinformation
        },
    ],
}
