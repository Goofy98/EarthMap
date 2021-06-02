<template>
  <div class="hello">
    <div ref="earthContainer" style="width: 100%; height: 100%">
    </div>
  </div>
</template>

<script>
import lineData from './data.json'
const circular_03 = require('@/images/circular_03.png')
/* eslint-disable */
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() { 
      return {
          message: '页面加载于 ' + new Date().toLocaleString(),
          _earth: undefined, // 注意：Earth和Cesium的相关变量放在vue中，必须使用下划线作为前缀！
          _bgImagery: undefined,
          _viewer: undefined,
          _handler: undefined,
          initChildrenLength: undefined
      };
  },
  mounted() {
    XE.ready().then(() => XE.HTML.loadMapV()).then(()=>{
      const p1 = XE.HTML.loadJS('./XbsjEarth-Plugins/plottingSymbol.js');
      const p2 = XE.HTML.loadJS('./XbsjEarth-Plugins/customPrimitive.js');
      const p3 = XE.HTML.loadJS('./XbsjEarth-Plugins/customPrimitiveImage.js');
      const p5 = XE.HTML.loadJS('./XbsjEarth-Plugins/plottingSymbol2.js');
    //   const p4 = XE.HTML.loadJS('./XbsjEarth-Plugins/three.min.js');
    //   const p6 = XE.HTML.loadJS('./XbsjEarth-Plugins/heatmap.js');
      return Promise.all([p1, p2, p3, p5]);
    }).then(()=>{
      console.log(mapv,'mapv')
      console.log(Cesium,'Cesium')
      this.earthInit()
    })
  },
  methods: {
    earthInit() {
      this._earth = new XE.Earth(this.$refs.earthContainer);
      this._earth.interaction.picking.enabled = true;
      this._earth.weather.atmosphere.enabled = false;
      this._viewer = this._earth.czm.viewer;
      // this._viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
      //     url: 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
      //     subdomains: ['a', 'b', 'c', 'd', 'e'],
      // }));
      var fsBody = `
            // 可以修改的参数
            // 注意shader中写浮点数是，一定要带小数点，否则会报错，比如0需要写成0.0，1要写成1.0
            float _baseHeight = 0.0; // 物体的基础高度，需要修改成一个合适的建筑基础高度
            float _heightRange = 60.0; // 高亮的范围(_baseHeight ~ _baseHeight + _heightRange) 默认是 0-60米
            float _glowRange = 300.0; // 光环的移动范围(高度)

            // 建筑基础色
            float vtxf_height = v_elevationPos.z - _baseHeight;
            float vtxf_a11 = fract(czm_frameNumber / 120.0) * 3.14159265 * 2.0;
            float vtxf_a12 = vtxf_height / _heightRange + sin(vtxf_a11) * 0.1;
            gl_FragColor *= vec4(vtxf_a12, vtxf_a12, vtxf_a12, 1.0);

            // 动态光环
            float vtxf_a13 = fract(czm_frameNumber / 360.0);
            float vtxf_h = clamp(vtxf_height / _glowRange, 0.0, 1.0);
            vtxf_a13 = abs(vtxf_a13 - 0.5) * 2.0;
            float vtxf_diff = step(0.005, abs(vtxf_h - vtxf_a13));
            gl_FragColor.rgb += gl_FragColor.rgb * (1.0 - vtxf_diff);
            `;
      this._earth.sceneTree.root = {
          "children": [
                {
                    "ref": "tileset1",
                    "czmObject": {
                        "xbsjType": "Tileset",
                        "name": "数字工厂-外部简模",
                        "maximumScreenSpaceError": 8,
                        "skipLevelOfDetail": false,
                        "url": "//lab.earthsdk.com/model/27af3f70003311eaae02359b3e5d0653/tileset.json",
                        "xbsjStyle": "var style = {\n    color: \"vec4(0, 0.5, 1.0,1)\"\n}",
                        "xbsjCustomShader": {
                            "fsBody": fsBody,
                        }
                    }
                },
              // {
              //     "czmObject": {
              //       "xbsjType": "Tileset",
              //       "xbsjGuid": "b714f554-3688-435c-8cfd-850192928c62",
              //       "name": "白模测试",
              //       "url": "https://lab.earthsdk.com/model/17a32610d08411eab7a4adf1d6568ff7/tileset.json",
              //       "xbsjPosition": [
              //           2.120551737913437,
              //           0.5451824973577791,
              //           -0.9999999989655769
              //       ],
              //       "xbsjStyle": "var style = {\n    color: \"vec4(0, 0.5, 1.0,1)\"\n}",
              //       "xbsjClippingPlanes": {},
              //       "xbsjCustomShader": {
              //           "fsBody": "\n    // 可以修改的参数\n    // 注意shader中写浮点数是，一定要带小数点，否则会报错，比如0需要写成0.0，1要写成1.0\n    float _baseHeight = 0.0; // 物体的基础高度，需要修改成一个合适的建筑基础高度\n    float _heightRange = 60.0; // 高亮的范围(_baseHeight ~ _baseHeight + _heightRange) 默认是 0-60米\n    float _glowRange = 300.0; // 光环的移动范围(高度)\n\n    // 建筑基础色\n    float vtxf_height = v_elevationPos.z - _baseHeight;\n    float vtxf_a11 = fract(czm_frameNumber / 120.0) * 3.14159265 * 2.0;\n    float vtxf_a12 = vtxf_height / _heightRange + sin(vtxf_a11) * 0.1;\n    gl_FragColor *= vec4(vtxf_a12, vtxf_a12, vtxf_a12, 1.0);\n\n    // 动态光环\n    float vtxf_a13 = fract(czm_frameNumber / 360.0);\n    float vtxf_h = clamp(vtxf_height / _glowRange, 0.0, 1.0);\n    vtxf_a13 = abs(vtxf_a13 - 0.5) * 2.0;\n    float vtxf_diff = step(0.005, abs(vtxf_h - vtxf_a13));\n    gl_FragColor.rgb += gl_FragColor.rgb * (1.0 - vtxf_diff);\n"
              //       }
              //   }
              // },
                {
                    "czmObject": {
                        "xbsjType": "Model",
                        "url": "./model/car.gltf",
                        "minimumPixelSize": 128,
                        "maximumScale": 2000,
                        "xbsjPosition": [
                            2.031362151104802,
                            0.6963997735829957,
                            0
                        ]
                    }
                }
          ]
      }
      this._earth.camera.position = [2.03164809508113, 0.6966244295326638, 1040.2661065255693];
      this._earth.camera.rotation = [3.972507149093452, -0.5205829134298061, 6.28037637077842];
      // this._earth.camera.position = [2.1210391698749964, 0.544944336488856, 822.8789229124824];
      // this._earth.camera.rotation = [5.190679265289419, -0.41493986255762305, 6.280299562599916];
      // this._earth.camera.position = [2.0318085713332255, 0.6906484565329043, 55792.896435757175];
      // this._earth.camera.rotation = [6.128290204901391, -1.1520461574349783, 6.283181299380239];
      this.initChildrenLength = this._earth.sceneTree.root.children.length;
      this._handler = new Cesium.ScreenSpaceEventHandler(this._viewer.scene.canvas);
      this._handler.setInputAction((click)=>{
        console.log(click,'click')
        var clickPosition = this._earth.pickPosition(click.position)
        console.log(clickPosition,'clickPosition')
        var pickedFeature = this._earth.czm.viewer.scene.pick(click.position);
        var name = pickedFeature.getProperty('name')
        console.log(name,'name')
      },Cesium.ScreenSpaceEventType.LEFT_CLICK)
      console.log(lineData,'lineDate')
      // this.earthLineString()
      let lineP = [
        [
          [2.1202907282192385, 0.5450835546419367, 0],
          [2.120125294340532, 0.5453135338319917, 0],
        ],
        [
          [2.1202957282192385, 0.5450835546419367, 0],
          [2.120130294340532, 0.5453135338319917, 0],
        ],
        [
          [2.1203007282192385, 0.5450835546419367, 0],
          [2.120135294340532, 0.5453135338319917, 0],
        ],
      ]
      let lineP2 = [
        [
          [2.0314582606146265, 0.6963013545253198, 0],
          [2.031469244667223, 0.6963946255077302, 0],
          [2.031362151104802, 0.6963997735829957, 0],
          [2.031377732833194, 0.696498381680946, 0],
          [2.0312904184756837, 0.6965021993229831, 0],
        ],
        // [
        //   [2.0314632606146265, 0.6963013545253198, 0],
        //   [2.031474244667223, 0.6963946255077302, 0],
        //   [2.031367151104802, 0.6963997735829957, 0],
        //   [2.031382732833194, 0.696498381680946, 0],
        //   [2.0312954184756837, 0.6965021993229831, 0],
        // ],
      ]
      this.createODLines(this._earth,lineP)
      this.createODLines(this._earth,lineP2)
      this.createODLines3(this._earth)
      let pointData = [
          [[2.1202907282192385, 0.5450835546419367, 1.5], [0.5, 0.8, 1, 2], [50, 50, 1]],
          [[2.120125294340532, 0.5453135338319917, 1.5], [0.5, 0.8, 1, 2], [60, 60, 1.2]],
          [[2.120593634919066, 0.5455039098638930, 1.5], [0.5, 0.8, 1, 2], [40, 40, 0.8]],
          [[2.120633904525988, 0.54481413672139860, 1.5], [0.5, 0.8, 1, 2], [50, 50, 1.5]],
          [[2.1208228652896737, 0.545141073908163, 1.5], [0.5, 0.8, 1, 2], [50, 50, 1.0]],
          [[2.120461948038486, 0.5451830324218808, 1.5], [0.5, 0.8, 1, 2], [50, 50, 1]],
          [[2.1204975918398317, 0.5452978537884561, 1.5], [0.5, 0.8, 1, 2], [50, 50, 1]],
          [[2.1207024221200843, 0.5453525660588958, 1.5], [0.5, 0.8, 1, 2], [50, 50, 1]],
          [[2.1207404597752664, 0.5451854942212021, 1.5], [0.5, 0.8, 1, 2], [50, 50, 1]],
      ]
      let pointE = {
        longitude: 2.120632655403052*180/Math.PI,
        latitude: 0.5451807133365316*180/Math.PI,
        height: 310
      }
      this.addPoint(this._earth,pointE)
      pointData.forEach(([p, c, s]) => {
          this.createBasePoint(this._earth, p, c, s);
      });
    }, 
    //折线动画
    earthLineString() {
      let data = []
      let timeData = []
      let pointData = [
          [[2.1202907282192385, 0.5450835546419367, 1.5], [0.5, 0.8, 1, 2], [50, 50, 1]],
          [[2.120125294340532, 0.5453135338319917, 1.5], [0.5, 0.8, 1, 2], [60, 60, 1.2]],
          [[2.120593634919066, 0.5455039098638930, 1.5], [0.5, 0.8, 1, 2], [40, 40, 0.8]],
          [[2.120633904525988, 0.54481413672139860, 1.5], [0.5, 0.8, 1, 2], [50, 50, 1.5]],
          [[2.1208228652896737, 0.545141073908163, 1.5], [0.5, 0.8, 1, 2], [50, 50, 1.0]],
          [[2.120461948038486, 0.5451830324218808, 1.5], [0.5, 0.8, 1, 2], [50, 50, 1]],
          [[2.1204975918398317, 0.5452978537884561, 1.5], [0.5, 0.8, 1, 2], [50, 50, 1]],
          [[2.1207024221200843, 0.5453525660588958, 1.5], [0.5, 0.8, 1, 2], [50, 50, 1]],
          [[2.1207404597752664, 0.5451854942212021, 1.5], [0.5, 0.8, 1, 2], [50, 50, 1]],
      ]
      let coordinates = []
      for (let i in pointData) {
        console.log(pointData[i][0],'pointData[i][0][0]')
        let po = [pointData[i][0][0]*180/Math.PI, pointData[i][0][1]*180/Math.PI]
        coordinates.push(po)
        timeData.push({
            geometry: {
                type: 'Point',
                coordinates: po
            },
            count: 1,
            time: i
        });
      }
      data.push({
        geometry: {
            type: 'LineString',
            coordinates: coordinates
        },
      })
      console.log(data,timeData,'timeData')
      this._dataSet = new mapv.DataSet(data);

      this._lineOptions = {
          strokeStyle: 'rgba(0,0,0,0.5)',
          // globalCompositeOperation: 'lighter',
          shadowColor: 'rgba(53,57,255,0.2)',
          shadowBlur: 3,
          lineWidth: 3.0,
          draw: 'simple'
      }

      this._mapvLayer = mapv.cesiumMapLayer(this._viewer, this._dataSet, this._lineOptions);
      var dataSet = new mapv.DataSet(timeData);

      var options = {
          fillStyle: 'rgba(255, 250, 250, 1)',
          globalCompositeOperation: "lighter",
          size: 1.5,
          animation: {
              stepsRange: {
                  start: 0,
                  end: pointData.length
              },
              trails: 30,
              duration: 50,
          },
          draw: 'simple'
      }

      var mapvLayer = XE.mixins.mapVLayer(this._viewer, dataSet, options);
    },
    // 轨迹线
    createODLines(earth,p) {
        const odlines = new XE.Obj.ODLines(earth);
        odlines.color = [1,1, 1, 1];

        var busLines = [];
        // p.push(...p, ...p); // 重复路径3次

        let timeDuration = 3.0;
        let moveBaseDuration = 2.0;
        let times = 0
        busLines = p.map(e => {
            console.log(Math.random(),'console.log(Math.random())')
            times = 0.2
            return {
                positions: e.map(ee => [ee[0], ee[1]]),
                color: [1, 1, 1, 5],
                width: 2.0,
                startTime: 0,
                duration: moveBaseDuration + 1.0 * Math.random()
            }
        });

        odlines.data = busLines;
        odlines.timeDuration = timeDuration;
        odlines.playing = true;

        return odlines;
    },
    // 动画线
    createODLines3(earth) {
        const odlines = new XE.Obj.ODLines(earth);
        odlines.color = [1, 0, 0, 1];

        var busLines = [];

        var p =  [
            [ [2.120632655403052, 0.5451807133365316, 310], [2.1202907282192385, 0.5450835546419367, 1.5], ],
            [ [2.120632655403052, 0.5451807133365316, 310], [2.120125294340532, 0.5453135338319917, 1.5], ],
            [ [2.120632655403052, 0.5451807133365316, 310], [2.120593634919066, 0.5455039098638930, 1.5], ],
            [ [2.120632655403052, 0.5451807133365316, 310], [2.120633904525988, 0.54481413672139860, 1.5], ],
            [ [2.120632655403052, 0.5451807133365316, 310], [2.1208228652896737, 0.545141073908163, 1.5], ],
            [ [2.120632655403052, 0.5451807133365316, 310], [2.120461948038486, 0.5451830324218808, 1.5], ],
            [ [2.120632655403052, 0.5451807133365316, 310], [2.1204975918398317, 0.5452978537884561, 1.5], ],
            [ [2.120632655403052, 0.5451807133365316, 310], [2.1207024221200843, 0.5453525660588958, 1.5], ],
            [ [2.120632655403052, 0.5451807133365316, 310], [2.1207404597752664, 0.5451854942212021, 1.5], ],
        ];

        var positionsCollection = p.map(e => {
            const toDegree = 180.0 / Math.PI;
            // Cesium.xbsjCreateTransmitPolyline 根据 首末端点生成弧线，
            // 参数有：
            // startPosition, 端点1
            // endPosition, 端点2
            // minDistance, 计算出的线段的最小间隔距离
            // heightRatio=1.0 弧线高度抬升程度，值越大，抬高得越明显
            // 返回值是cartesian类型的坐标数组
            const cartesians = Cesium.xbsjCreateTransmitPolyline(e[0], e[1], 50.0, 5.0);
            const poss = cartesians.map(ee => {
                const carto = Cesium.Cartographic.fromCartesian(ee);
                return [carto.longitude, carto.latitude, carto.height];
            });

            return poss;
        });

        positionsCollection.push(...positionsCollection);
        positionsCollection.push(...positionsCollection);

        let timeDuration = 6.0;
        let moveBaseDuration = 4.0;

        busLines = positionsCollection.map(e => {
            return {
                positions: e,
                color: [0.5, 0.8, 1.0, 5.0],
                width: 3.0,
                startTime: timeDuration * Math.random(),
                duration: moveBaseDuration + 1.0 * Math.random()
            }
        });

        odlines.data = busLines;
        // odlines.timeDuration = timeDuration;
        odlines.playing = true;
        odlines.loopPlay  = true

        return odlines;
    },
    // 点位
    createCircle(earth) {
        const evalString = `
            Cesium.Resource.createIfNeeded('./images/ht/circular_03.png').fetchImage().then(function(image) {
                console.log('image loaded!');
                p.canvasWidth = 512;
                p.canvasHeight = 512;

                p.drawCanvas(ctx => {
                    ctx.clearRect(0, 0, 512, 512);

                    ctx.beginPath();
                    ctx.strokeStyle = "rgb(255, 255, 255)";
                    // ctx.setLineDash([8, 8]);
                    ctx.lineWidth = 1;
                    ctx.arc(256, 256, 250, 0, Math.PI*2, true);
                    ctx.stroke();

                    ctx.drawImage(image, 0, 0);
                });

                p.color = [0.5, 0.8, 1, 2];
            });
        `;

        const preUpdateEvalString = `
            if (typeof p.xxxAngle === 'undefined') p.xxxAngle = 360.0;
            p.xxxAngle -= 1.0;
            if (p.xxxAngle < 0) {
                p.xxxAngle = 360.0;
            }
            p.rotation[0] = p.xxxAngle / 180.0 * Math.PI;
        `;

        // p.positions = XE.Obj.CustomPrimitive.Geometry.unitSquare.positions;
        // p.sts = XE.Obj.CustomPrimitive.Geometry.unitSquare.sts;
        // p.indices = XE.Obj.CustomPrimitive.Geometry.unitSquare.indices;

        const config = {
            // xbsjType: "CustomPrimitive",
            evalString,
            preUpdateEvalString,
            position: [ 2.1206125026580582, 0.545178729438238, 14.721614698023599 ],
            scale: [ 500, 500, 1 ],
            positions: [ -1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0 ],
            sts: [ 0, 0, 1, 0, 1, 1, 0, 1 ],
            indices: [ 0, 1, 2, 0, 2, 3 ],
            renderState: XE.Obj.CustomPrimitive.getRenderState(true, true),
            color: [ 0.5, 0.8, 1, 2 ],
            canvasWidth: 512,
            canvasHeight: 512,
        }

        var p = new XE.Obj.CustomPrimitive(earth);
        p.xbsjFromJSON(config);

        return p;
    },
    // 点位
    createBasePoint(earth, position, color=[0.5, 0.8, 1, 2], scale=[50, 50, 1]) {
        // const position = [2.1208228652896737,0.545141073908163,1.4957427559874568];
        // const color = [0.5, 0.8, 1, 2];
        // const scale = [50, 50, 1];

        // 底面
        {
            const evalString = `
                p.canvasWidth = 512;
                p.canvasHeight = 512;
                p.drawCanvas(ctx => {
                    var gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
                    gradient.addColorStop(0.1, "rgba(255, 255, 255, 1.0)");
                    gradient.addColorStop(0.2, "rgba(255, 255, 255, 0.0)");
                    gradient.addColorStop(0.3, "rgba(255, 255, 255, 0.9)");
                    gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.0)");
                    gradient.addColorStop(0.9, "rgba(255, 255, 255, 0.2)");
                    gradient.addColorStop(1.0, "rgba(255, 255, 255, 1.0)");

                    ctx.clearRect(0, 0, 512, 512);
                    ctx.beginPath();
                    ctx.arc(256, 256, 256, 0, Math.PI * 2, true);
                    // ctx.fillStyle = "rgb(0, 155, 255)";
                    ctx.fillStyle = gradient;
                    ctx.fill();
                    ctx.restore();
                });
            `;

            const config = {
                evalString,
                position: [...position],
                scale: [...scale],
                positions: [...XE.Obj.CustomPrimitive.Geometry.unitSquare.positions],
                sts: [...XE.Obj.CustomPrimitive.Geometry.unitSquare.sts],
                indices: [...XE.Obj.CustomPrimitive.Geometry.unitSquare.indices],
                renderState: XE.Obj.CustomPrimitive.getRenderState(true, true),
                color: [...color],
                canvasWidth: 512,
                canvasHeight: 512,
            };

            let p = new XE.Obj.CustomPrimitive(earth);
            p.xbsjFromJSON(config);
        }

        // 底面动态辐射波
        {
            const evalString = `
                p.canvasWidth = 512;
                p.canvasHeight = 512;
                p.drawCanvas(ctx => {
                    ctx.clearRect(0, 0, 512, 512);

                    ctx.strokeStyle = "rgb(255, 255, 255)";
                    ctx.setLineDash([80, 80]);
                    ctx.lineWidth = 30;
                    ctx.arc(256, 256, 241, 0, Math.PI * 2, true);
                    ctx.stroke();
                });
            `;

            const preUpdateEvalString = `
                if (typeof p.dAngle === 'undefined') p.dAngle = 0.0;
                if (typeof p.dt === 'undefined') p.dt = 0.01;

                p.dAngle += 10.0;
                if (p.dAngle > 360.0) {
                    p.dAngle = 0.0;
                }
                p.rotation[0] = p.dAngle / 180.0 * Math.PI;

                p.dt += 0.02;
                if (p.dt > 1.0) p.dt = 0.01;

                p.scale[0] = 50 * p.dt;
                p.scale[1] = 50 * p.dt;
            `;

            const config = {
                evalString,
                preUpdateEvalString,
                position: [...position],
                scale: [50, 50, 1],
                positions: [...XE.Obj.CustomPrimitive.Geometry.unitSquare.positions],
                sts: [...XE.Obj.CustomPrimitive.Geometry.unitSquare.sts],
                indices: [...XE.Obj.CustomPrimitive.Geometry.unitSquare.indices],
                renderState: XE.Obj.CustomPrimitive.getRenderState(true, true),
                color: [...color],
                canvasWidth: 512,
                canvasHeight: 512,
            };

            let p = new XE.Obj.CustomPrimitive(earth);
            p.xbsjFromJSON(config);
        }

        // 柱体
        {
            const fragmentShaderSource =
            `
            varying vec3 v_positionEC;
            varying vec3 v_normalEC;
            varying vec2 v_st;
            varying vec4 v_color;
            uniform sampler2D u_image;
            uniform vec4 u_color;
            void main()
            {
                float powerRatio = fract(czm_frameNumber / 30.0) + 1.0;
                float alpha = pow(1.0 - v_st.t, powerRatio);
                gl_FragColor = vec4(u_color.rgb, alpha*u_color.a);
            }
            `;
            const renderState = XE.Obj.CustomPrimitive.getRenderState(true, true);
            renderState.cull.enabled = false;
            const cylinder = XE.Obj.CustomPrimitive.Geometry.createCylinder(0.3, 2.0, 1.0, 6);
            const config = {
                position: [...position],
                scale: [3/50*scale[0], 3/50*scale[1], 300*scale[2]],
                positions: cylinder.positions,
                sts: cylinder.sts,
                indices: cylinder.indices,
                renderState,
                color: [...color],
                canvasWidth: 1.0,
                fragmentShaderSource,
            };

            let p = new XE.Obj.CustomPrimitive(earth);
            p.xbsjFromJSON(config);
        }

        // 柱体粒子
        {
            const fragmentShaderSource =
            `
            varying vec3 v_positionEC;
            varying vec3 v_normalEC;
            varying vec2 v_st;
            varying vec4 v_color;
            uniform sampler2D u_image;
            uniform vec4 u_color;
            void main()
            {
                vec3 positionToEyeEC = -v_positionEC;
                vec3 normalEC = normalize(v_normalEC);
                normalEC = faceforward(normalEC, vec3(0.0, 0.0, 1.0), -normalEC);

                float dt = fract(czm_frameNumber / 90.0);
                vec2 st = fract(vec2(1.0) + v_st - vec2(dt, dt));
                vec4 imageColor = texture2D(u_image, st);

                vec3 diffuse = imageColor.rgb;
                float alpha = imageColor.a;

                diffuse *= v_color.rgb;
                alpha *= v_color.a;

                diffuse *= u_color.rgb;
                alpha *= u_color.a;

                gl_FragColor = vec4(diffuse, alpha * pow(1.0 - v_st.t, 2.0));
            }
            `;

            const evalString = `
                p.canvasWidth = 320;
                p.canvasHeight = 256;
                Cesium.Resource.createIfNeeded('./images/particles.png').fetchImage().then(function(image) {
                    p.drawCanvas(ctx => {
                        ctx.clearRect(0, 0, 32, 256);
                        ctx.drawImage(image, 0, 0);
                    });
                });
            `;

            const renderState = XE.Obj.CustomPrimitive.getRenderState(true, true);
            renderState.cull.enabled = false;
            const cylinder = XE.Obj.CustomPrimitive.Geometry.createCylinder(4.0, 4.0, 1.0, 6);
            const config = {
                fragmentShaderSource,
                evalString,
                position: [...position],
                scale: [3/50*scale[0], 3/50*scale[1], 300*scale[2]],
                positions: cylinder.positions,
                sts: cylinder.sts,
                indices: cylinder.indices,
                color: [...color],
                canvasWidth: 32,
                canvasHeight: 256,
                renderState,
            };

            const p = new XE.Obj.CustomPrimitive(earth);
            p.xbsjFromJSON(config);
        }
    },
    // 标题信息
    addPoint(earth, e) {
        var pinBuilder = new Cesium.XbsjPinBuilder();
        console.log(pinBuilder,'pinBuilder')
        const entity = earth.czm.viewer.entities.add({
            // name: e.Equipment_Name,
            position: Cesium.Cartesian3.fromDegrees(e.longitude, e.latitude, e.height),
            point: {
                pixelSize: 1,
                outlineWidth: 0,
            },
            polyline: {
                positions: [
                    Cesium.Cartesian3.fromDegrees(e.longitude, e.latitude, e.height - 50),
                    Cesium.Cartesian3.fromDegrees(e.longitude, e.latitude, e.height),
                ],
                width: 1.0,
                material: Cesium.Color.BLUE,
                show: false
            },
            billboard: {
                image: circular_03,
                color: new Cesium.Color(1, 1, 1, 1),
                verticalOrigin: Cesium.VerticalOrigin.MIDDLE,
                scale: 0.15,
                show: true,
            },
            label: {
                text:  'test',
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                font: '20px 微软雅黑',
                fillColor: Cesium.Color.WHITE,
                outlineColor: new Cesium.Color(1, 1, 1, 1),
                outlineWidth: 2,
                scale: 1,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER
            }
        });
        return entity;
    }
  },
  // 1.2 资源销毁
  beforeDestroy() {
      // vue程序销毁时，需要清理相关资源
      this._earth = this._earth && this._earth.destroy();
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.hello {
  width: 100%;
  height: 600px;
  background: #000;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
