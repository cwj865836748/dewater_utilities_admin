<template>
  <div>
    <el-tag v-if="isSetNode" v-for="(item,index) in nodeList" :key="index" closable @click.native="upDateNode(item,index)" @close="closeNodeList(index)">{{item.nodeName}}</el-tag>
    <div id="map" :style="{width: width,height: height}"></div>
    <el-dialog title="设置打卡点" :visible.sync="dialogFormVisible" width="500px" :append-to-body="true" :close-on-click-modal="false">
      <el-form ref="dataForm" label-position="top" :rules="rules" :model="temp">
        <el-row :gutter="60">
          <el-col>
            <el-form-item label="打卡点名称" prop="nodeName">
              <el-input v-model="temp.nodeName" placeholder="请输入打卡点名称" clearable/>
            </el-form-item>
            <el-form-item label="经度" prop="latitude">
              <el-input v-model="temp.latitude" placeholder="请输入经度" clearable/>
            </el-form-item>
            <el-form-item label="纬度" prop="longitude">
              <el-input v-model="temp.longitude" placeholder="请输入纬度" clearable/>
            </el-form-item>
            <el-form-item label="定位地址名称" prop="locateAddress">
              <el-input v-model="temp.locateAddress" placeholder="请输入定位地址名称" clearable/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t('common.cancel') }}
        </el-button>
        <el-button type="primary" @click="addNodeList">
          {{ $t('common.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  const mapIconNo = require('@/assets/images/addr@2x-2.png')
  const mapIconOK = require('@/assets/images/addr@2x-3.png')
  import {validateRequire} from '@/utils/validate'
    export default {
      name: "index",
      props:{
        nodeList:{
          type:Array,
          default:() => {
            return []
          }
        },
        latitude:{
          type:Number,
          default: 24.48405
        },
        longitude:{
          type:Number,
          default:118.03394
        },
        width:{
          type:String,
          default:`100%`
        },
        height:{
          type:String,
          default:`500px`
        },
        isSetNode:{
          type:Boolean,
          default:false
        }
      },
      data() {
        return {
          dialogFormVisible:false,
          rules: {
            nodeName: [
              {required: true, trigger: 'blur', validator: validateRequire, text: '打卡点名称'},
              // {type: 'email', message: this.$t('admin.tip1'), trigger: 'blur'}
            ],
            latitude: [
              {required: true, trigger: 'blur', validator: validateRequire, text: '经度'},
              // {type: 'email', message: this.$t('admin.tip1'), trigger: 'blur'}
            ],
            longitude: [
              {required: true, trigger: 'blur', validator: validateRequire, text: '纬度'},
              // {type: 'email', message: this.$t('admin.tip1'), trigger: 'blur'}
            ],
            locateAddress: [
              {required: true, trigger: 'blur', validator: validateRequire, text: '定位地址名称'},
              // {type: 'email', message: this.$t('admin.tip1'), trigger: 'blur'}
            ]
          },
          temp:{
            nodeName:'',
            latitude:'',
            longitude:'',
            locateAddress:'',
            nodeTime:null
          },
          isAdd:true,
          nodeIndex:0
        }
      },
      methods:{
        init() {
          const that = this
          var center = new qq.maps.LatLng(this.latitude, this.longitude);
          var map = new qq.maps.Map(
            document.getElementById("map"),
            {
              center: center,
              // 缩放级别
              zoom: 17
            }
          )
          let path =[]
          // 创建标记和线
          this.nodeList.length?this.nodeList.forEach(item=>{
            let marker = new qq.maps.Marker({
              // 标记的位置
              position: new qq.maps.LatLng(item.latitude, item.longitude),
              map: map
            });
            var size = new qq.maps.Size(102, 104),
              markerIcon = new qq.maps.MarkerImage(
                item.nodeTime?mapIconOK:mapIconNo,
                size
              );
            marker.setIcon(markerIcon);
            path.push( new qq.maps.LatLng(item.latitude, item.longitude))
          }):new qq.maps.Marker({
            // 标记的位置
            position: center,
            map: map
          })

          this.nodeList.length&&new qq.maps.Polyline({
            map,
            path,
            strokeColor: '#008ffe',
            strokeWeight: 5
          });

          this.isSetNode&&qq.maps.event.addListener(
            map,
            'click',
            function(event) {
              console.log(event)
              that.isAdd=true
              that.dialogFormVisible=true
              that.$nextTick(() => {
                that.temp.nodeName=''
                that.temp.locateAddress=''
                that.$refs['dataForm'].clearValidate()
              })
              that.temp.latitude=event.latLng.lat
              that.temp.longitude=event.latLng.lng
            }
          );
        },
        upDateNode(row,index){
          console.log(row)
          this.dialogFormVisible=true
          this.isAdd=false
          this.nodeIndex=index
          this.temp = JSON.parse(JSON.stringify(row))
        },
        addNodeList(){
          this.$refs['dataForm'].validate((valid) => {
            if (valid) {
                let node = Object.assign({},this.temp)
                this.$emit('getNode',node,this.isAdd,this.nodeIndex)
                this.dialogFormVisible=false
                this.$nextTick(()=>{
                  this.init()
                })
            }
          })
        },
        closeNodeList(index){
           this.$emit('closeNodeList',index)
          this.$nextTick(()=>{
            this.init()
          })
        }
      }

    }
</script>

<style scoped>

</style>
