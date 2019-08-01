let mapUrl = 'http://10.15.51.42:8090/'
export default {
  /**
   * @description 配置显示在浏览器标签的title
   */
  apptitle: '内蒙古自治区河流湖泊遥感监测系统',
  serverUrl: 'http://10.15.51.42:8081/api/',
  resourceUrl: 'http://10.15.51.42:8090/speicmen/',
  measureService: mapUrl + 'iserver/services/map-NeiMeng/rest/maps/矢量',
  fullExtent: '99.6831, 37.6330,129.5730, 52.3074',
  homeNavList: [{
    name: '水土流失演变',
    path: 'https://www.baidu.com',
    iconClass: 'icon-shui'
  }, {
    name: '水保重点工程',
    path: 'https://www.jd.com',
    iconClass: 'icon-zhongdiangongcheng'
  }, {
    name: '河湖监测统计',
    path: '/',
    iconClass: 'icon-shuituliushidongtaijianceshuju'
  }, {
    name: '动态监测',
    path: '/dynamicMonitor',
    iconClass: 'icon-caishajilu'
  }, {
    name: '三维展示',
    path: '/threeDimensional',
    iconClass: 'icon-wushui'
  }],
  toolNavList:
    [
      '黄河',
      '黑河',
      '辽河',
      '嫩江',
      '额尔古纳河',
      '岱海',
      '达里湖',
      '黄旗海',
      '乌梁素海',
      '呼伦湖',
      '居延海'
    ],
  toolLegend: [
    {
      color: 'rgb(255,191,0)',
      name: '1988岸线'
    },
    {
      color: 'rgb(79,129,189)',
      name: '1998岸线'
    },
    {
      color: 'rgb(149,55,52)',
      name: '2008岸线'
    },
    {
      color: 'rgb(54,225,7)',
      name: '2018岸线'
    },
    {
      color: 'rgb(230,166,0)',
      name: '河道横切线'
    }
  ],
  waterObject: [
    {
      name: '额尔古纳河',
      id: 'eergunahe',
      bound: '115.530,48.060,117.794,49.519',
      type: 'river'
    },
    {
      name: '嫩江',
      id: 'nengjiang',
      bound: '123.477,46.811,125.330,50.139',
      type: 'river'
    },
    {
      name: '辽河',
      id: 'liaohe',
      bound: '117.153,42.539,123.632,43.825',
      type: 'river'
    },
    {
      name: '黄河',
      id: 'huanghe',
      bound: '106.712,39.090,111.456,40.873',
      type: 'river'
    },
    {
      name: '东黑河',
      id: 'dongheihe',
      bound: '100.146,40.9,101.203,42.261',
      type: 'river'
    },
    {
      name: '西黑河',
      id: 'xiheihe',
      bound: '100.146,40.9,101.203,42.261',
      type: 'river'
    },
    {
      name: '呼伦湖',
      id: 'huluhu',
      bound: '116.971,48.544,117.798,49.321',
      type: 'lake'
    },
    {
      name: '达里湖',
      id: 'dalihu',
      bound: '116.487,43.222,116.748,43.386',
      type: 'lake'
    },
    {
      name: '黄旗海',
      id: 'huangqihai',
      bound: '113.179,40.792,113.4,40.906',
      type: 'lake'
    },
    {
      name: '岱海',
      id: 'daihai',
      bound: '112.55,40.473,112.781,40.622',
      type: 'lake'
    },
    {
      name: '乌梁素海',
      id: 'wuliangsuhai',
      bound: '108.696,40.779,108.959,41.049',
      type: 'lake'
    },
    {
      name: '东居延海',
      id: 'dongjuyanhai',
      bound: '106.712,39.090,111.456,40.873',
      type: 'lake'
    },
    {
      name: '西居延海',
      id: 'xijuyanhai',
      bound: '100.496,42.331,100.996,42.486',
      type: 'lake'
    }
  ],
  thematicMonitoringTree: [{
    id: '1',
    label: '采砂场',
    url: mapUrl + 'iserver/services/map-ZhuanTiJianCe/restjsr/v1/vectortile/maps/采砂场',
    type: 'vectortile',
    mapName: '采砂场'
  }, {
    id: '2',
    label: '排污口',
    url: mapUrl + 'iserver/services/map-ZhuanTiJianCe/restjsr/v1/vectortile/maps/排污口',
    type: 'vectortile',
    mapName: '排污口'
  }, {
    id: '3',
    label: '进出水口',
    url: mapUrl + 'iserver/services/map-ZhuanTiJianCe/restjsr/v1/vectortile/maps/进出水口',
    type: 'vectortile',
    mapName: '进出水口'
  }, {
    id: '4',
    label: '垃圾堆',
    url: mapUrl + 'iserver/services/map-ZhuanTiJianCe/restjsr/v1/vectortile/maps/垃圾堆',
    type: 'vectortile',
    mapName: '垃圾堆'
  }, {
    id: '5',
    label: '建筑物',
    url: mapUrl + 'iserver/services/map-ZhuanTiJianCe/restjsr/v1/vectortile/maps/建筑物',
    type: 'vectortile',
    mapName: '建筑物'
  }, {
    id: '6',
    label: '水资源监测',
    url: mapUrl + 'iserver/services/map-ZhuanTiJianCe/rest/maps/WQ2019',
    type: 'tile',
    mapName: 'WQ2019'
  }, {
    id: '7',
    label: '生态变化监测',
    children: [
      {
        id: '8',
        label: '2018年生态分布',
        url: mapUrl + 'iserver/services/map-ZhuanTiJianCe/rest/maps/TDLY2018',
        type: 'tile',
        mapName: 'TDLY2018'
      }, {
        id: '9',
        label: '2019年生态分布',
        url: mapUrl + 'iserver/services/map-ZhuanTiJianCe/rest/maps/WQ2019',
        type: 'tile',
        mapName: 'ST2019'
      }
    ]
  }
  ],
  baseLayers: [ // 基础地图服务
    {
      mapName: '矢量',
      url: mapUrl + 'iserver/services/map-NeiMeng/rest/maps/矢量',
      label: '矢量'
    },
    {
      mapName: '影像',
      url: mapUrl + 'iserver/services/map-NeiMeng/rest/maps/影像',
      label: '影像'
    },
    {
      mapName: '地形',
      url: mapUrl + 'iserver/services/map-NeiMeng/rest/maps/地形',
      label: '地形'
    }
  ],
  terrain3DLayer: mapUrl + 'iserver/services/3D-DiXing/rest/realspace/datas/%E5%86%85%E8%92%99DEM@%E5%9C%B0%E5%BD%A2',
  riverLakeFrontLayers: [ // 河湖监测，不同年份河湖岸线地图服务
    {
      mapName: 'Y1988',
      label: '1988', /* 图层名字，时间轴显示名称 */
      url: mapUrl + 'iserver/services/map-HeHuJianCe/restjsr/v1/vectortile/maps/Y1988'
    },
    {
      mapName: 'Y1998',
      label: '1998',
      url: mapUrl + 'iserver/services/map-HeHuJianCe/restjsr/v1/vectortile/maps/Y1998'
    },
    {
      mapName: 'Y2008',
      label: '2008',
      url: mapUrl + 'iserver/services/map-HeHuJianCe/restjsr/v1/vectortile/maps/Y2008'
    },
    {
      mapName: 'Y2018',
      label: '2018',
      url: mapUrl + 'iserver/services/map-HeHuJianCe/restjsr/v1/vectortile/maps/Y2018'
    },
    {
      mapName: 'Section',
      url: mapUrl + 'iserver/services/map-HeHuJianCe/restjsr/v1/vectortile/maps/Section'
    }
  ],
  dynamicImageLayers: [ // 动态监测，影像地图列表
    {
      mapName: 'IMG201801', // 地图名称，与url关联
      url: mapUrl + 'iserver/services/map-ZhuanTiJianCe/rest/maps/IMG201801',
      label: '2018上' /* 时间轴标识符 */
    },
    {
      mapName: 'Y1998',
      url: mapUrl + 'iserver/services/map-HeHuJianCe/rest/maps/IMG1998',
      label: '2018下'
    },
    {
      mapName: 'Y2008',
      url: mapUrl + 'iserver/services/map-HeHuJianCe/rest/maps/IMG2008',
      label: '2019上'
    },
    {
      mapName: 'Y2018',
      url: mapUrl + 'iserver/services/map-HeHuJianCe/rest/maps/IMG2018',
      label: '2019下'
    }
  ],
  riverImageLayers: [ // 河湖监测 影像地图列表
    {
      label: '1988',
      mapName: 'IMG1988', /* 图层名字，时间轴显示名称以上方数据为准 */
      url: mapUrl + 'iserver/services/map-HeHuJianCe/rest/maps/IMG1988'
    },
    {
      label: '1998',
      mapName: 'IMG1998',
      url: mapUrl + 'iserver/services/map-HeHuJianCe/rest/maps/IMG1998'
    },
    {
      label: '2008',
      mapName: 'IMG2008',
      url: mapUrl + 'iserver/services/map-HeHuJianCe/rest/maps/IMG2008'
    },
    {
      label: '2018',
      mapName: 'IMG2018',
      url: mapUrl + 'iserver/services/map-HeHuJianCe/rest/maps/IMG2008'
    }
  ],
  riverSection: {
    label: '河流横切线',
    mapName: 'Section',
    url: mapUrl + 'iserver/services/map-HeHuJianCe/rest/maps/Section'
  },
  threeDimensionalImageLayers: [ // 三维时间轴切换影像服务
    {
      label: '1988',
      mapName: 'IMG1988', /* 图层名字，时间轴显示名称以上方数据为准 */
      url: mapUrl + 'iserver/services/map-HeHuJianCe/rest/maps/IMG1988'
    },
    {
      label: '1998',
      mapName: 'IMG1998',
      url: mapUrl + 'iserver/services/map-HeHuJianCe/rest/maps/IMG1998'
    },
    {
      label: '2008',
      mapName: 'IMG2008',
      url: mapUrl + 'iserver/services/map-HeHuJianCe/rest/maps/IMG2008'
    },
    {
      label: '2018',
      mapName: 'IMG2018',
      url: mapUrl + 'iserver/services/map-HeHuJianCe/rest/maps/IMG2018'
    },
    {
      label: '2019',
      mapName: 'IMG2019',
      url: mapUrl + 'iserver/services/map-HeHuJianCe/rest/maps/IMG2019'
    }
  ],
  mapTwoInit: {
    center: [112.82887835992615, 44.800852846476296],
    zoom: 5,
    projection: 'EPSG:4326',
    resolutions: [
      0.70391441568404422656,
      0.35195720784202211328,
      0.17597860392101105664,
      0.08798930196050552832,
      0.04399465098025276416,
      0.02199732549012638208,
      0.01099866274506319104,
      0.00549933137253159552,
      0.00274966568626579776,
      0.00137483284313289888,
      0.00068741642156644944,
      0.00034370821078322472,
      0.00017185410539161236,
      0.00008592705269580618,
      0.00004296352634790309,
      0.000021481763173951545
    ]
  }
}
