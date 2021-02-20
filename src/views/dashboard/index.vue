<template>
  <div class="dashboard-container">
    <el-row :gutter="40" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-description">
            <div class="card-panel-text">
             已报案数量
            </div>
            <div class="flex-x-between mouse" @click="goCase(4,'today')">
              <div class="card-panel-text-title">今日新增</div>
              <count-to :start-val="0" :end-val="temp.today_total_case" :duration="1600" class="card-panel-num icon-red"/>
            </div>
            <div class="flex-x-between mouse" @click="goCase(4,'month')">
              <div class="card-panel-text-title">本月新增</div>
              <count-to :start-val="0" :end-val="temp.month_total_case" :duration="1600" class="card-panel-num icon-green"/>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-description">
            <div class="card-panel-text">
              待处理数量
            </div>
            <div class="flex-x-between mouse" @click="goCase(0,'today')">
              <div class="card-panel-text-title">今日新增</div>
              <count-to :start-val="0" :end-val="temp.today_wait_handle" :duration="1600" class="card-panel-num icon-red"/>
            </div>
            <div class="flex-x-between mouse" @click="goCase(0,'month')">
              <div class="card-panel-text-title">本月新增</div>
              <count-to :start-val="0" :end-val="temp.month_wait_handle" :duration="1600" class="card-panel-num icon-green"/>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-description">
            <div class="card-panel-text">
              待评价
            </div>
            <div class="flex-x-between mouse" @click="goCase(1,'today')">
              <div class="card-panel-text-title">今日新增</div>
              <count-to :start-val="0" :end-val="temp.today_wait_comment" :duration="1600" class="card-panel-num icon-red"/>
            </div>
            <div class="flex-x-between mouse" @click="goCase(1,'month')">
              <div class="card-panel-text-title">本月新增</div>
              <count-to :start-val="0" :end-val="temp.month_wait_comment" :duration="1600" class="card-panel-num icon-green"/>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-description">
            <div class="card-panel-text">
              已评价
            </div>
            <div class="flex-x-between mouse" @click="goCase(2,'today')">
              <div class="card-panel-text-title">今日新增</div>
              <count-to :start-val="0" :end-val="temp.today_already_comment" :duration="1600" class="card-panel-num icon-red"/>
            </div>
            <div class="flex-x-between mouse" @click="goCase(2,'month')">
              <div class="card-panel-text-title">本月新增</div>
              <count-to :start-val="0" :end-val="temp.month_already_comment" :duration="1600" class="card-panel-num icon-green"/>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-description">
            <div class="card-panel-text">
              巡检数量
            </div>
            <div class="flex-x-between mouse" @click="goInspection('today')">
              <div class="card-panel-text-title">今日新增</div>
              <count-to :start-val="0" :end-val="temp.today_already_patrol" :duration="1600" class="card-panel-num icon-red"/>
            </div>
            <div class="flex-x-between mouse" @click="goInspection('month')">
              <div class="card-panel-text-title">本月新增</div>
              <count-to :start-val="0" :end-val="temp.month_total_already_patrol" :duration="1600" class="card-panel-num icon-green"/>
            </div>
          </div>
        </div>
      </el-col>

    </el-row>
  </div>
</template>

<script>
  import CountTo from 'vue-count-to'
  import {Common} from "@/api";

  export default {
    name: 'Dashboard',
    components: {
      CountTo
    },
    data() {
      return {
        temp: {
          today_total_case: 0,
          today_wait_handle: 0,
          today_wait_comment: 0,
          today_already_patrol: 0,
          month_total_case: 0,
          month_wait_handle: 0,
          month_wait_comment: 0,
          month_total_already_patrol: 0,
          today_already_comment:0,
          month_already_comment:0
        }

      }
    },
    created() {
      this.getStatistics()
    },
    methods: {
      getStatistics() {
        Common.statistics().then(res => {
          this.temp = res.data
        })
      },
      goCase(status,time){
        this.$router.push({
          path:'/case/case',
          query:{
            status,
            time
          }
        })
      },
      goInspection(time){
        this.$router.push({
          path:'/inspection/inspectionList',
          query:{
            time
          }
        })
      }
    }
  }
</script>
<style>

</style>
<style lang="scss" scoped type="text/scss">
  .panel-group {
    margin-top: 18px;

    .card-panel-col {
      margin-bottom: 32px;
    }

    .card-panel {
      height: 140px;
      /*cursor: pointer;*/
      font-size: 12px;
      position: relative;
      overflow: hidden;
      color: #666;
      background: #fff;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
      border-color: rgba(0, 0, 0, .05);

      &:hover {
        .card-panel-icon-wrapper {
          color: #fff;
        }

        .icon-people {
          background: #40c9c6;
        }

        .icon-message {
          background: #36a3f7;
        }

        .icon-money {
          background: #f4516c;
        }

        .icon-shopping {
          background: #34bfa3
        }
      }

      .icon-people {
        color: #40c9c6;
      }

      .icon-message {
        color: #36a3f7;
      }

      .icon-red {
        color: #f4516c;
      }

      .icon-green {
        color: #34bfa3
      }

      .card-panel-icon-wrapper {
        float: left;
        margin: 14px 0 0 14px;
        padding: 16px;
        transition: all 0.38s ease-out;
        border-radius: 6px;
      }

      .card-panel-icon {
        float: left;
        font-size: 48px;
      }

      .card-panel-description {
        /*float: right;*/
        font-weight: bold;
        margin: 26px 26px 0 26px;
        /*margin-left: 0px;*/
        text-align: right;

        .card-panel-text {
          line-height: 18px;
          color: #000;
          font-size: 20px;
          margin-bottom: 18px;
          word-break: keep-all;
          text-align: center;
        }
        .card-panel-text-title {
          line-height: 18px;
          color: #000;
          font-size: 16px;
          margin-bottom: 18px;
          word-break: keep-all;
          text-align: center;
        }

        .card-panel-num {
          font-size: 20px;
        }
      }
    }
  }

  @media (max-width: 550px) {
    .card-panel-description {
      display: none;
    }

    .card-panel-icon-wrapper {
      float: none !important;
      width: 100%;
      height: 100%;
      margin: 0 !important;

      .svg-icon {
        display: block;
        margin: 14px auto !important;
        float: none !important;
      }
    }
  }
  .mouse {
    cursor:pointer;
  }

</style>
