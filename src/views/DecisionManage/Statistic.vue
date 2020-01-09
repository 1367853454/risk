<template>
  <div class="statistic-container">
    <el-row :span="24" align="middle">
      <el-col :span="6">
        规则包名：
        <el-select v-model="packageValue" placeholder="全部" size="mini">
          <el-option
            v-for="item in packageList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-col>
      <el-col :span="6">
        流程名称：
        <el-select v-model="processValue" placeholder="全部" size="mini">
          <el-option
            v-for="item in processList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-col>
      <el-col :span="10">
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
      <el-col :span="2" style="text-align: right"><el-button icon="el-icon-search" type="primary" size="small" @click="searchInfo">搜索</el-button></el-col>
    </el-row>
    <el-row :span="24" align="middle" style="padding-top: 20px">
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
      <!--      <el-table-column label="规则代码" />-->
      <el-table-column label="规则名称" prop="ruleName"/>
      <el-table-column label="规则生效日期" prop="updateTime" />
      <el-table-column label="拒绝客户数" prop="rejectCustomers" />
      <el-table-column label="拒绝率" prop="rejectionRate" />
      <el-table-column label="占全部拒绝客户比" prop="percentageOfRejection" />
    </el-table>
  </div>
</template>

<script>
import api from '../../api/decision'
const {
  getPackage,
  getStatistics,
  getPackageParams,
  getFunnel
} = api
export default {
  name: 'DirectivePermission',
  components: { },
  data() {
    return {
      // 搜索条件
      packageValue: '',
      packageList: [],
      processValue: '',
      processList: [],
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
      getFunnel(this.getSearchOption()).then(({ data }) => {

      })
      getPackage(this.getSearchOption()).then(({ data }) => {
        this.rulePackage = data.content
      })
      getStatistics(this.getSearchOption()).then(({ data }) => {
        this.ruleDetail = data.content
      })
      this.packageValue = ''
      this.processValue = ''
      this.countTime = []
    },
    getSearchOption() {
      const option = {}
      if (this.countTime[0]) {
        option['startDate'] = this.countTime[0]
        option['endDate'] = this.countTime[1]
        this.orderTime = []
      }
      option['packageCode'] = this.packageValue
      option['processCode'] = this.processValue
      console.log('option', option)
      return option
    },
    getInitData() {
      // 规则包名称、规则流程名称查询
      this.packageList = []
      this.processList = []
      getPackageParams().then(({ data }) => {
        const processName = data.content.processName
        const packageName = data.content.packageName
        processName.forEach(item => {
          this.processList.push({ value: item.value, label: item.key })
        })
        packageName.forEach(item => {
          this.packageList.push({ value: item.value, label: item.key })
        })
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

