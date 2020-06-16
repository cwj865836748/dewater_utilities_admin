<template>
  <el-select
    v-model="code"
    filterable
    :filter-method="codeFilter"
    :placeholder="$t('common.pleaseSelect')"
    clearable
    @clear="clear"
    @focus="focus"
    :disabled="disabled"
  >
    <el-option
      v-for="item in options"
      :key="item[field]"
      :label="item.englishName+'/'+item.chineseName"
      :value="item[field]"
    >
      <span style="float: left">{{ item.englishName }}</span>
      <span style="float: right; color: #8492a6; font-size: 14px">{{ item.chineseName }}</span>
    </el-option>
  </el-select>
</template>

<script>
  import {Agent} from '@/api'

  export default {
    name: '',
    props: {
      value: {
        type: Number
      },
      generalAgent: { //总代理
        type: Boolean,
        default: undefined
      },
      whetherAgent: { //代理
        type: Boolean,
        default: undefined
      },
      type: {
        type: Number,
        default: 1 //1不加总代 2加总代
      },
      field: {
        type: String,
        default: 'id'
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        listQuery: {},
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
    created() {
      this.getList()
    },
    methods: {
      // 获取数据
      getList() {
        this.listQuery.generalAgent = this.generalAgent
        this.listQuery.whetherAgent = this.whetherAgent
        Agent.select(this.listQuery).then(res => {
          if (this.type == 2) {
            res.data.unshift({id: 0, englishName: 'general Agent', chineseName: '总代理'})
          }
          this.options = this.list = res.data
        })
      },
      codeFilter(query = '') {
        this.options = query ? this.list.filter((item) => {
          return item.englishName.includes(query) || item.chineseName.includes(query)
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

