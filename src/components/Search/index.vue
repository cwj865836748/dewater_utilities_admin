<!--
  搜索组件封装
  type:0输入框 1选择框 2日期区间 3输入框数字 4特殊选择框
  例子
  searchFields: [
          {type: 0, label: 'common.string', value: '', options: ''},
          {type: 1, label: 'common.sex', value: '', options: Sex},
          {type: 2, label: 'common.createDate', value: '', options: ''},
          {type: 3, label: 'common.number', value: '', options: ''},
          {type: 4, label: 'common.id', value: '', options: ''},
        ],
-->

<template>
  <div v-if="fields.length" class="filter-container">
    <el-form ref="search" :inline="true" size="small" @keyup.enter.native="handleSearch">

      <template v-for="(item,index) in fields">
        <el-form-item v-if="item.type==0" :label="item.label">
          <el-input
            v-model="item.value"
            :placeholder="$t('common.pleaseEnter')"
            clearable
          />
        </el-form-item>

        <el-form-item v-if="item.type==1" :label="item.label">
          <el-select
            v-model="item.value"
            :placeholder="$t('common.pleaseSelect')"
            clearable
            @change="handleSearch"
          >
            <el-option
              v-for="(vo,ko) in item.options"
              :key="ko"
              :label="vo.label"
              :value="vo.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item v-if="item.type==2" :label="item.label">
          <el-date-picker
            v-model="item.value"
            type="datetimerange"
            range-separator="~"
            :start-placeholder="$t('common.startPlhDate')"
            :end-placeholder="$t('common.endPlhDate')"
            clearable
            :editable="false"
            :format="formatDate"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </el-form-item>

        <el-form-item v-if="item.type==3" :label="item.label">
          <el-input
            v-model.number="item.value"
            :placeholder="$t('common.pleaseEnter')"
            clearable
          />
        </el-form-item>

        <el-form-item v-if="item.type==4" :label="item.label">
          <el-select
            v-model="item.value"
            :placeholder="$t('common.pleaseSelect')"
            clearable
            @change="handleSearch"
            filterable
          >

            <el-option
              v-for="(vo,ko) in item.options"
              :key="ko"
              :label="vo.name||vo.title
              ||vo.englishName &&(vo.englishName+'/'+vo.chineseName)
              ||vo.problemCategoryEn&&(vo.problemCategoryEn.title+'/'+vo.problemCategoryZh.title)"

              :value="vo[item.filedValue || 'id']"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="item.type==5" :label="item.label">
          <el-select
            v-model="item.value"
            :placeholder="$t('common.pleaseSelect')"
            clearable
            @change="handleSearch"
            multiple
          >
            <el-option
              v-for="(vo,ko) in item.options"
              :key="ko"
              :label="vo.label"
              :value="vo.value"
            />
          </el-select>
        </el-form-item>
      </template>

      <el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">
          {{ $t('common.search') }}
        </el-button>
        <el-button class="filter-item" type="danger" icon="el-icon-refresh" @click="handleReset">
          {{ $t('common.reset') }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {formatDate} from '@/config/base'

  export default {
    props: {
      fields: {
        type: Array,
        default: null
      }
    },
    data() {
      return {
        formatDate
      }
    },
    mounted() {
    },
    methods: {
      /**
       * 搜索
       */
      handleSearch() {
        this.$emit('change')
      },
      /**
       * 重置
       */
      handleReset() {
        this.fields.map(v => {
          if (v.type == 5) {
            v.value = []
          } else {
            v.value = ''
          }
        })
        this.$emit('change')
      }
    }
  }
</script>

