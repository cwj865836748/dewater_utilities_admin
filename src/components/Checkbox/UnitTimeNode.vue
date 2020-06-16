<template>
  <el-checkbox-group v-model="code">
    <el-checkbox v-for="(item,index) in list" :key="index" :label="item.id" name="UnitTimeNode">
      {{ item.name }}
    </el-checkbox>
  </el-checkbox-group>
</template>

<script>
  import {UnitTimeNode} from '@/api'

  export default {
    name: 'UnitTimeNode',
    props: {
      value: {
        type: Array
      }
    },
    data() {
      return {
        listQuery: {
          commissionTrigger: true
        },
        list: []
      }
    },
    computed: {
      code: {
        get() {
          //移除无效项
          // let arr = []
          // console.log('code-')
          // if (this.value.length > 0) {
          //   arr = this.value.filter((item) => this.list.findIndex(vo => vo.id == item) != -1) || []
          //   if (arr.length != this.value.length) {
          //     this.$emit('input', arr)
          //   }
          // }
          return this.value
        },
        set(val) {
          this.$emit('input', val)
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      // 获取数据
      async getList() {
        await UnitTimeNode.fetchList(this.listQuery).then(res => {
          this.list = res.data
        })
      }
    }
  }
</script>

<style scoped>

</style>
