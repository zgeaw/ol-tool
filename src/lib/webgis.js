import "ol/ol.css";
import "bootstrap/dist/css/bootstrap.min.css";
import * as bootstrap from 'bootstrap'
import * as ol from 'ol';
import TileLayer from 'ol/layer/Tile';
// import OSM from 'ol/source/OSM';
import { XYZ, Vector, TileJSON  } from "ol/source";
import { GeoJSON } from 'ol/format'
import * as layer  from 'ol/layer'
import Select from 'ol/interaction/Select';
import {FullScreen, Zoom, OverviewMap, defaults as defaultControls} from 'ol/control.js';
import {
  Circle as CircleStyle,
  Fill,
  Stroke,
  Style,
  Text,
} from 'ol/style.js';

export default class WebGis {
  constructor({id, tooltipConfig = '.ol-zoom-in, .ol-zoom-out, .ol-full-screen-false'}) {
    this.id = id
    this.map = null
    this.tooltipConfig = tooltipConfig
    this.view = new ol.View({
      center: [0, 0], // [121.39444245258065, 31.170587645068945]
      projection: 'EPSG:4326',
      zoom: 1,
      // 限制地图缩放最大级别为14，最小级别为10
      // minZoom: 10,
      // maxZoom: 18
    })
  }
  // 加载天地图
  initTdt(mapKey, callBack) {
    console.log('ol' , ol)    
    // source: new ol.OSM()
    let tdtLayerVec = new TileLayer({
      source: new XYZ({
        url: `http://t{0-7}.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${mapKey}`
      })
    })
    this.map = new ol.Map({
      target: this.id,
      controls: defaultControls().extend([new Zoom({
        zoomInTipLabel: '放大',
        zoomOutTipLabel: '缩小'
      }),
      new FullScreen({
        tipLabel: '全屏'
      }),
      new OverviewMap({
        tipLabel: '概览图',
        collapsed: false
      })]),
      layers: [    
        tdtLayerVec,
        new TileLayer({
          // source: new ol.OSM()
          source: new XYZ({
            url: `http://t{0-7}.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${mapKey}`
          })
        })
      ],
      view: this.view
    })
    this.map.once('postrender', (imgSource) =>{
      // console.log('6666postrender', imgSource)
      document.querySelectorAll(this.tooltipConfig)
      .forEach(el => {
        new bootstrap.Tooltip(el, {
          container: `#${this.id}`,
        });
      });
      if(callBack){
        callBack()
      }  
    })      
  }
  // 获取olMap
  getOlMapObject(){
    return ol
  }
  // 缩放
  setZoom(level){
    this.view.setZoom(level)
  }
  // 设置中心点
  setCenter(center){
    this.view.setCenter(center)
  }
  // 地图放大
  zoomIn(){
    const view = this.map.getView();
    const zoom = this.view.getZoom();
    view.setZoom(zoom + 1);
  }  
  // 地图缩小
  zoomOut(){
    const view = this.map.getView();
    const zoom = this.view.getZoom();
    view.setZoom(zoom - 1);
  }
  // 加载geoJson
  loadGeoJSON(params, callBack){
    const image = new CircleStyle({
      radius: 5,
      fill: '#ff0000',
      stroke: new Stroke({color: 'red', width: 1}),
    });
    const styles = {
      'Point': new Style({
        image: image,
      }),
      'LineString': new Style({
        stroke: new Stroke({
          color: 'green',
          width: 1,
        }),
      }),
      'MultiLineString': new Style({
        stroke: new Stroke({
          color: 'green',
          width: 1,
        }),
      }),
      'MultiPoint': new Style({
        image: image,
      }),
      'MultiPolygon': new Style({
        stroke: new Stroke({
          color: '#333',
          width: 1,
        }),
        fill: new Fill({
          color: 'green',
        }),
      }),
      'Polygon': new Style({
        stroke: new Stroke({
          color: 'blue',
          lineDash: [4],
          width: 3,
        }),
        fill: new Fill({
          color: 'rgba(0, 0, 255, 0.1)',
        }),
      }),
      'GeometryCollection': new Style({
        stroke: new Stroke({
          color: 'magenta',
          width: 2,
        }),
        fill: new Fill({
          color: 'magenta',
        }),
        image: new CircleStyle({
          radius: 10,
          fill: null,
          stroke: new Stroke({
            color: 'magenta',
          }),
        }),
      }),
      'Circle': new Style({
        stroke: new Stroke({
          color: 'red',
          width: 2,
        }),
        fill: new Fill({
          color: 'rgba(255,0,0,0.2)',
        }),
      }),
    };
    const styleFunction = function (feature) {
      // console.log(555, feature)
      return styles[feature.getGeometry().getType()];
    };
    let source = new Vector({
      // ...params,
      loader: (extent, resolution, projection, success, failure) => {
        // const proj = projection.getCode();
        const url = params.url;
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        const onError = () => {
          source.removeLoadedExtent(extent);
          failure();
        }
        xhr.onerror = onError;
        xhr.onload = () => {
          if (xhr.status == 200) {
            const features = source.getFormat().readFeatures(xhr.responseText);
            console.log(56465456, features)
            source.addFeatures(features);
            if(callBack){
              callBack(features)
            }
            success(features);
          } else {
            onError();
          }
        }
        xhr.send();
      },
      format: new GeoJSON(),
    })
    let layerSource = new layer.Vector({
      source,
      style: styleFunction
    })
    this.map.addLayer(layerSource);    
    
    console.log(555, this.map.getView())
    
    // setTimeout(() => {
    //   const feature = source.getFeatures();
    //   console.log(6666, feature)
    // }, 3000)
    
    // const polygon = feature.getGeometry();
    // this.view.fit(polygon, {padding: [170, 50, 30, 150]});
    // this.handlePolygon()
  }
  // 注册点击事件
  handlePolygon(){
    const polygonClick = new Select();
    this.map.addInteraction(polygonClick);
    polygonClick.on('select',(e)=>{
      let polygon = e.selected[0].getGeometry()
      this.view.fit(polygon, {duration: 300, padding: [100, 100, 100, 100]});
      console.log('point',e, polygon, this.view)
    })
  }
}