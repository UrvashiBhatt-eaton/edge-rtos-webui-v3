import * as meta from "./dciMeta";

export const overview = [
  {
    title: "Bucket 1",
    data: [
      "14",
      "15",
      "16",
      "24",
      "25",
    ]
  },
  {
    title: "Bucket 2",
    styleIf: [
      {
        src: meta.dciMetaData.ETH_ACD_CONFLICTED_STATE.id,
        targets: [meta.dciMetaData.ETH_ACD_CONFLICTED_STATE.id],
        values: ["1"],
        style: '{"backgroundColor": "Red", "color": "White"}'
      }
    ],
    data: [
      "26",
      "27",
      "28",
      "29",
    ]
  },
  {
    title: "Bucket 3",
    data: [
      "10014",
      "10015",
      "10016",
      "10017",
      "10024",
      "10025",
      "10139",
    ]
  },
  {
    title: "Epoch time",
    data: [
      "10045[0]",
      "10045[1]",
    ]
  }
];

export const preference = [
  {
    title: "Date and Time",
    icon: "clock",
    styleIf: [
      {
        src: meta.dciMetaData.SNTP_ACTIVE_SERVER.id,
        values: ["0"],
        targets: [meta.dciMetaData.SNTP_ACTIVE_SERVER.id],
        style: '{"backgroundColor": "Red", "color": "White"}'
      },
      {
        src: meta.dciMetaData.SNTP_ACTIVE_SERVER.id,
        values: ["1"],
        targets: [meta.dciMetaData.SNTP_SERVER_1.id],
        style: '{"borderStyle": "solid", "borderWidth":"2px", "borderColor": "Green", "borderRadius": "35px"}'
      },
      {
        src: meta.dciMetaData.SNTP_ACTIVE_SERVER.id,
        values: ["2"],
        targets: [meta.dciMetaData.SNTP_SERVER_2.id],
        style: '{"borderStyle": "solid", "borderWidth":"2px", "borderColor": "Green", "borderRadius": "35px"}'
      },
      {
        src: meta.dciMetaData.SNTP_ACTIVE_SERVER.id,
        values: ["3"],
        targets: [meta.dciMetaData.SNTP_SERVER_3.id],
        style: '{"borderStyle": "solid", "borderWidth":"2px", "borderColor": "Green", "borderRadius": "35px"}'
      }
    ],
    disabledIf: [
      {
        src: meta.dciMetaData.SNTP_SERVICE_ENABLE.id,
        notValues: ["0"],
        targets: [meta.dciMetaData.UNIX_EPOCH_TIME.id]
      },
      {
        src: meta.dciMetaData.SNTP_SERVICE_ENABLE.id,
        notValues: ["1"],
        targets: [
          meta.dciMetaData.SNTP_SERVER_1.id,
          meta.dciMetaData.SNTP_SERVER_2.id,
          meta.dciMetaData.SNTP_SERVER_3.id
        ]
      }
    ],
    hiddenIf: [
      {
        src: meta.dciMetaData.SNTP_SERVICE_ENABLE.id,
        notValues: ["9999"], // Always hide (we still need it as a src though)
        targets: [meta.dciMetaData.SNTP_ACTIVE_SERVER.id]
      },
      {
        src: meta.dciMetaData.SNTP_SERVICE_ENABLE.id,
        values: ["0"],
        targets: [
          meta.dciMetaData.SNTP_ACTIVE_SERVER.id,
          meta.dciMetaData.SNTP_SERVER_1.id,
          meta.dciMetaData.SNTP_SERVER_2.id,
          meta.dciMetaData.SNTP_SERVER_3.id
        ]
      }
    ],
    data: [
      "10032",
      "10038",
      "10044",
      "10039",
      "10040",
      "10041",
    ]
  },
  {
    title: "Locale",
    icon: "public",
    data: [
      "10033",
      "10034",
      "10035",
    ]
  },
  {
    title: "Device Actions",
    icon: "device",
    criticalIf: [
      {
        targets: [meta.dciMetaData.REST_RESET_COMMAND.id]
      }
    ],
    data: [
      "10036",
    ]
  },
  {
    title: "Web Session Settings",
    icon: "equalizer",
    data: [
      "10027",
      "10079",
      "10080",
      "10081",
      "10082",
    ]
  }
];

export const network = [
  {
    title: "Certificate",
    icon: "note",
    layout: "settings-certificate",
    data: [
    ]
  },
  {
    title: "IPv4",
    icon: "share",
    styleIf: [
      {
        src: meta.dciMetaData.ACTIVE_IP_ADDRESS.id,
        targets: [meta.dciMetaData.ACTIVE_IP_ADDRESS.id],
        values: ['""'],
        style: '{"backgroundColor": "Red", "color": "White"}'
      },
      {
        src: meta.dciMetaData.ACTIVE_SUBNET_MASK.id,
        targets: [meta.dciMetaData.ACTIVE_SUBNET_MASK.id],
        values: ['""'],
        style: '{"backgroundColor": "Red", "color": "White"}'
      },
      {
        src: meta.dciMetaData.ACTIVE_DEFAULT_GATEWAY.id,
        targets: [meta.dciMetaData.ACTIVE_DEFAULT_GATEWAY.id],
        values: ['""'],
        style: '{"backgroundColor": "Red", "color": "White"}'
      },
      {
        src: meta.dciMetaData.STATIC_IP_ADDRESS.id,
        targets: [meta.dciMetaData.STATIC_IP_ADDRESS.id],
        values: ['""'],
        style: '{"backgroundColor": "Red", "color": "White"}'
      },
      {
        src: meta.dciMetaData.STATIC_SUBNET_MASK.id,
        targets: [meta.dciMetaData.STATIC_SUBNET_MASK.id],
        values: ['""'],
        style: '{"backgroundColor": "Red", "color": "White"}'
      },
      {
        src: meta.dciMetaData.STATIC_DEFAULT_GATEWAY.id,
        targets: [meta.dciMetaData.STATIC_DEFAULT_GATEWAY.id],
        values: ['""'],
        style: '{"backgroundColor": "Red", "color": "White"}'
      }
    ],
    hiddenIf: [
      {
        src: "16",
        notValues: ["0", "1"],
        targets: [meta.dciMetaData.ACTIVE_IP_ADDRESS.id, meta.dciMetaData.ACTIVE_SUBNET_MASK.id, meta.dciMetaData.ACTIVE_DEFAULT_GATEWAY.id]
      },
      {
        src: "16",
        values: ["0", "1"],
        targets: [meta.dciMetaData.STATIC_IP_ADDRESS.id, meta.dciMetaData.STATIC_SUBNET_MASK.id, meta.dciMetaData.STATIC_DEFAULT_GATEWAY.id]
      }
    ],
    criticalIf: [
      {
        targets: [meta.dciMetaData.IP_ADDRESS_ALLOCATION_METHOD.id, meta.dciMetaData.STATIC_IP_ADDRESS.id, meta.dciMetaData.STATIC_SUBNET_MASK.id, meta.dciMetaData.STATIC_DEFAULT_GATEWAY.id]
      }
    ],
    data: [
      "16",
      "2030",
      "2031",
      "2032",
      "2033",
      "2034",
      "2035",
    ]
  },
  {
    title: "Modbus TCP",
    icon: "share",
    data: [
      "37",
    ]
  },
  {
    title: "IP Whitelist",
    icon: "key",
    criticalIf: [
      {
        targets: [meta.dciMetaData.TRUSTED_IP_WHITELIST.id]
      }
    ],
    data: [
      "10029",
    ]
  },
  {
    title: "Proxy Settings",
    icon: "importExport",
    styleIf: [
      {
        src: meta.dciMetaData.IOT_PROXY_SERVER.id,
        targets: [meta.dciMetaData.IOT_PROXY_SERVER.id],
        values: ['""'],
        style: '{"backgroundColor": "Red", "color":"White"}'
      },
      {
        src: meta.dciMetaData.IOT_PROXY_PORT.id,
        targets: [meta.dciMetaData.IOT_PROXY_PORT.id],
        values: ['""'],
        style: '{"backgroundColor": "Red", "color":"White"}'
      }
    ],
    hiddenIf: [
      {
        src: meta.dciMetaData.IOT_PROXY_ENABLE.id,
        values: ["0"],
        targets: [meta.dciMetaData.IOT_PROXY_SERVER.id, meta.dciMetaData.IOT_PROXY_PORT.id, meta.dciMetaData.IOT_PROXY_USERNAME.id, meta.dciMetaData.IOT_PROXY_PASSWORD.id]
      }
    ],
    criticalIf: [
      {
        targets: [meta.dciMetaData.IOT_PROXY_USERNAME.id, meta.dciMetaData.IOT_PROXY_PASSWORD.id]
      }
    ],
    data: [
      "10048",
      "10049",
      "10050",
      "10051",
      "10052",
    ]
  },
  {
    title: "Connect to Eaton Hosted Services",
    icon: "cloud",
    styleIf: [
      {
        src: meta.dciMetaData.IOT_STATUS.id,
        targets: [meta.dciMetaData.IOT_STATUS.id],
        values: ["0"],
        style: '{"backgroundColor": "Red", "color": "White"}'
      },
      {
        src: meta.dciMetaData.IOT_DEVICE_GUID.id,
        targets: [meta.dciMetaData.IOT_DEVICE_GUID.id],
        values: ['""'],
        style: '{"backgroundColor": "Red", "color": "White"}'
      },
      {
        src: meta.dciMetaData.IOT_CONN_STRING.id,
        targets: [meta.dciMetaData.IOT_CONN_STRING.id],
        values: ['""'],
        style: '{"backgroundColor": "Red", "color": "White"}'
      }
    ],
    hiddenIf: [
      {
        src: meta.dciMetaData.IOT_CONNECT.id,
        values: ["0"],
        targets: [meta.dciMetaData.IOT_DEVICE_GUID.id, meta.dciMetaData.IOT_CONN_STRING.id]
      },
      {
        src: meta.dciMetaData.IOT_CONNECT.id,
        values: ["0", "1"],
        targets: [meta.dciMetaData.IOT_CONN_STAT_REASON.id, meta.dciMetaData.IOT_STATUS.id]
      }
    ],
    criticalIf: [
      {
        targets: [meta.dciMetaData.IOT_CONN_STRING.id]
      }
    ],
    data: [
      "10053",
      "10046",
      "10047",
      "10055",
      "10130",
    ]
  },
  {
    title: "Access Control",
    icon: "key",
    criticalIf: [
      {
        targets: [meta.dciMetaData.MODBUS_TCP_ENABLE.id, meta.dciMetaData.BACNET_IP_ENABLE.id, meta.dciMetaData.HTTP_ENABLE.id, meta.dciMetaData.CORS_TYPE.id]
      }
    ],
    data: [
      "10076",
      "10077",
      "10028",
      "10083",
    ]
  }
];

export const firmware = [
  {
    title: "Firmware Upgrade",
    icon: "systemUpdate",
    layout: "settings-firmware",
    data: [
    ]
  },
  {
    title: "Firmware Information",
    icon: "public",
    criticalIf: [
      {
        targets: [meta.dciMetaData.FW_UPGRADE_MODE.id]
      }
    ],
    data: [
      "29",
      "31",
      "34",
      "35",
      "36",
      "10017",
    ]
  }
];

export const licenseinformation = [
  {
    title: "License Links",
    icon: "gavel",
    data: [
      "10091",
    ]
  }
];
