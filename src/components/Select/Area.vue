<template>
  <el-select
    v-model="code"
    filterable
    :filter-method="codeFilter"
    :placeholder="$t('common.pleaseSelect')"
    clearable
    @clear="clear"
    @focus="focus"
  >
    <el-option
      v-for="item in options"
      :key="item.id"
      :label="item.englishName+'/'+item.chineseName"
      :value="item.id"
    >
      <span style="float: left">{{ item.englishName }}</span>
      <span style="float: right; color: #8492a6; font-size: 14px">{{ item.chineseName }}</span>
    </el-option>
  </el-select>
</template>

<script>
  import {Area} from '@/api'

  export default {
    name: '',
    props: {
      value: {
        type: Number
      },
      level: {
        type: Number,
        default: 1
      },
      parentId: {
        type: Number
      }
    },
    data() {
      return {
        listQuery: {
          page: 1,
          limit: 1000,
          hidden: false,
          level: this.level,
          parentId: null
        },
        list: [],
        options: []
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
      parentId: {
        handler(newVal, oldVal) {
          if (newVal == null || (typeof newVal == 'number' && typeof oldVal == 'number')) {
            this.code = null
          }
          if (typeof newVal == 'number') {
            this.getList()
          }
        },
        deep: true,
        immediate: true
      }
    },
    created() {
    },
    methods: {
      // 获取数据
      getList() {
        this.options = this.list = []
        this.listQuery.parentId = this.parentId
        Area.fetchList(this.listQuery).then(res => {
          this.options = this.list = res.data.list
        })
      },
      codeFilter(query = '') {
        query = query.toLowerCase()
        this.options = query ? this.list.filter((item) => {
          return item.englishName.toLowerCase().includes(query) || item.chineseName.includes(query)
        }) : this.list
      },
      clear() {
        this.code = null
        this.codeFilter();
      },
      focus() {
        if (this.code == null) {
          this.codeFilter();
        }
      }
    }
  }
</script>

<style scoped>

</style>
