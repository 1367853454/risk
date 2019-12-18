<template>
  <div class="statistic-container">
    <el-row :span="24" align="middle">
      <el-col :span="12">
        统计时间
        <el-date-picker
          v-model="countTime"
          size="mini"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
        />
      </el-col>
      <el-col :span="2"><el-button type="primary" size="small">今天</el-button></el-col>
      <el-col :span="2"><el-button type="primary" size="small">昨天</el-button></el-col>
      <el-col :span="2"><el-button type="primary" size="small">最近7天</el-button></el-col>
      <el-col :span="6" style="text-align: right"><el-button icon="el-icon-search" type="primary" size="small" @click="searchInfo">搜索</el-button></el-col>
    </el-row>
    <el-row :span="24" align="middle" style="padding-top: 20px">
      <el-col :span="6">
        事件类型
        <el-select v-model="eventType" placeholder="全部事件" size="mini">
          <el-option
            v-for="item in eventTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-col>
      <el-col :span="6">
        机构名称
        <el-select v-model="institution" placeholder="全部机构" size="mini">
          <el-option
            v-for="item in institutionList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-col>
      <el-col :span="6">
        区域
        <el-select v-model="area" placeholder="全部区域" size="mini">
          <el-option
            v-for="item in areaList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-col>
      <el-col :span="6">
        规则包名称
        <el-select v-model="rule" placeholder="全部规则包" size="mini">
          <el-option
            v-for="item in ruleList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-col>
    </el-row>
    <el-table
      :data="rulePackage"
    >
      <el-table-column label="规则包" prop="packageName" />
      <el-table-column label="申请客户数" prop="applicantNumber" />
      <el-table-column label="拒绝客户数" prop="rejectCustomers" />
      <el-table-column label="拒绝率" prop="rejectionRate" />
    </el-table>
    <el-table
      :data="ruleDetail"
    >
      <el-table-column label="规则包" prop="packageName" />
      <el-table-column label="规则代码" />
      <el-table-column label="规则名称" />
      <el-table-column label="规则生效日期" prop="updateTime" />
      <el-table-column label="拒绝客户数" prop="rejectCustomers" />
      <el-table-column label="拒绝率" prop="rejectionRate" />
      <el-table-column label="占全部拒绝客户比" prop="percentageOfRejection" />
    </el-table>
  </div>
</template>

<script>
import api from '../../api/decision'
const { getPackage, getStatistics } = api
export default {
  name: 'DirectivePermission',
  components: { },
  data() {
    return {
      // 搜索条件
      eventType: '',
      eventTypeList: [],
      institution: '',
      institutionList: [],
      area: '',
      areaList: [],
      rule: '',
      ruleList: [],
      countTime: [],
      // 表格数据
      rulePackage: [],
      ruleDetail: []
    }
  },
  created() {
    this.getInitData()
  },
  methods: {
    searchInfo() {
      //
    },
    getInitData() {
      // 获得规则包信息
      getPackage().then(({ data }) => {
        this.rulePackage = data.content
      })
      getStatistics().then(({ data }) => {
        this.ruleDetail = data.content
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.statistic-container {
  padding: 20px;
  font-size: 14px;
}
</style>

