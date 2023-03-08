# ol-tool openlayers 地图加载工具类

```sh
npm i ol-tool
yarn add ol-tool
```

### 示例 加载天地图

```vue
<template>
  <div id="map"></div>
</template>

<script>
// 加载工具类
import WebGis from "ol-tool";
//加载css
import "ol-tool/dist/webGis.css";

export default {
  data() {
    return {
      view: null,
    };
  },
  methods: {
    init() {
      this.view = new WebGis({ id: "map" });
      // 初始化
      this.view.initTdt("你的天地图key", () => {
        // 设置中心点
        this.view.webgis.setCenter([121.39444245258065, 31.170587645068945]);
        // 设置缩放比例
        this.view.webgis.setZoom(16);
        let params = {
          id: 1,
          url: "geoJsonUrl",
        };
        // 加载geoJson
        this.view.webgis.loadGeoJSON(params, (source) => {
          let feature = source[0].getGeometry().getCoordinates();
          this.view.handlePolygon();
        });
      });
    },
  },
};
</script>
```

## API

## events

|     事件名     | 事件说明     |            类型            |            参数描述或返回值            |
| :------------: | :----------- | :------------------------: | :------------------------------------: |
|    initTdt     | 加载天地图   | Function(mapKey, callBack) | mapKey：天地图 key, callBack：回调函数 |
| getOlMapObject | 获取 olMap   |         Function()         |              返回 Object               |
|    setZoom     | 缩放         |      Function(level)       |     level：地图缩放级别 0 ~ 20 级      |
|   setCenter    | 设置中心点   |   Function(centerArray)    | centerArray：['longitude', 'latitude'] |
|     zoomIn     | 地图放大     |         Function()         |                   -                    |
|    zoomOut     | 地图缩小     |         Function()         |                   -                    |
|  loadGeoJSON   | 加载 geoJson | Function(params, callBack) | params：{id, url}, callBack：回调函数  |
| handlePolygon  | 注册点击事件 |         Function()         |                   -                    |
