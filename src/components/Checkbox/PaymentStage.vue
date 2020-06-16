<template>
  <el-checkbox-group v-model="code">
    <el-checkbox v-for="(item,index) in list" :key="index" :label="item.id" name="PaymentStage">
      {{ item.title }}
    </el-checkbox>

  </el-checkbox-group>
</template>

<script>
  import {ProjectPayment} from '@/api'

  export default {
    name: 'PaymentStage',
    props: {
      value: {
        type: Array
      },
      projectId: {
        type: Number,
        default: undefined
      }
    },
    data() {
      return {
        listQuery: {},
        list: []
      }
    },
    computed: {
      code: {
        get() {
          return this.value
        },
        set(val) {
          this.$emit('input', val)
        }
      }
    },
    watch: {
      projectId: {
        handler(newVal, oldVal) {
          this.getList()
        },
        deep: true,
        immediate: true

      }
    },
    methods: {
      // 获取数据
      getList() {
        ProjectPayment.getStageList({projectId: this.projectId}).then(res => {
          this.list = res.data
        })
      }
    }
  }
</script>

<style scoped>

</style>
