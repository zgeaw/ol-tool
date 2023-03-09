import './style.less';
import WebGis from './lib'
let webgis = new WebGis({id: 'map'})

// 初始化
webgis.initTdt('2067467061d44dcaccdfa7a6be739aa9', () => {
  // 设置中心点
  webgis.setCenter([121.39444245258065, 31.170587645068945])
  // 设置缩放比例
  webgis.setZoom(16)
  let params = {
    id: 1,
    url: 'http://192.168.2.100:33333/geoserver/caohejing/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=caohejing%3A%E5%A4%A7%E5%9F%BA%E5%86%85-%E6%BC%95%E6%B2%B3%E6%B3%BE%E8%A7%84%E5%88%92%E7%94%A8%E5%9C%B0&maxFeatures=500000&outputFormat=application%2Fjson',
    minZoom: 5,
    maxZoom: 20
  }
  // let options = {
  //   fillColor: '#ff0000',
  //   strokeColor: '#333',
  //   strokeWidth: 3,
  //   strokeLineDash: [5, 5]
  // }
  // 加载geoJson
  webgis.loadGeoJSON(params, source =>{
    let feature = source[0].getGeometry().getCoordinates()
    console.log(6666, feature)
    // webgis.view.fit(source[0].getGeometry())
  })
})
console.log(777, webgis)