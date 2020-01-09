<template>
  <div class="result-container">
    <el-row style="margin-bottom: 20px;">
      <el-button type="primary" size="mini" @click="$router.go(-1)">返回</el-button>
    </el-row>
    <el-table :data="ruleData" style="width: 100%">
      <el-table-column label="业务" prop="businessName" />
      <el-table-column label="名称" prop="processName" />
      <el-table-column label="描述" prop="processDescribe" />
      <el-table-column label="修改时间" prop="updateTime" />
    </el-table>
    <el-card style="margin-top: 50px;margin-bottom: 30px;" v-loading="isLoading">
      <el-row :span="24" type="flex" align="middle" style="padding: 20px 0">
      <el-col :span="12">
        <div id="graph" style="width: 80%;height:400px;margin-left:10%;"></div>
      </el-col>
      <el-col :span="12">
        <div class="test-result">
          <div class="test-result__item"><div>测试用户数：</div><div>{{ testUserNumber }}</div></div>
          <div class="test-result__item"><div>授信失败数：</div><div>{{ failNumber }}</div></div>
          <div class="test-result__item"><div>授信成功数：</div><div>{{ successNumber }}</div></div>
          <div class="test-result__item"><div>授信成功率：</div><div>{{ successRate }}</div></div>
          <div class="test-result__item"><div>最大授信额度：</div><div>{{ maxCreditAmount }}</div></div>
          <div class="test-result__item"><div>平均授信额度：</div><div>{{ averageCreditAmount }}</div></div>
        </div>
      </el-col>
    </el-row>
    </el-card>
    <el-table :data="lendData" style="width:100%;" v-loading="isLoading">
      <el-table-column label="借款编号" prop="orderCode" />
      <!--      <el-table-column label="对应产品" />-->
      <el-table-column label="客户姓名" prop="fullName" />
      <el-table-column label="手机号码" prop="mobile" />
      <el-table-column label="借款金额" prop="applicationAmount" />
      <el-table-column label="借款期限" prop="termLoan" />
      <el-table-column label="创建时间" prop="createTime" />
      <el-table-column label="模拟结果" prop="simulationResult" />
    </el-table>
  </div>
</template>

<script>
import echarts from 'echarts'
import api from '../../api/decision'
const {
  postRuleSimulation
} = api
export default {
  name: 'SimulationResult',
  data() {
    return {
      ruleData: [],
      testUserNumber: 0,
      failNumber: 0,
      successNumber: 0,
      successRate: '0',
      maxCreditAmount: '0',
      averageCreditAmount: '0',
      lendData: [],
      isLoading: false,
      xData: [],
      passData: [],
      rejectData: [],
      reviewData: []
    }
  },
  watch: {
    '$route': {
      handler() {
        this.getInitData()
      },
      immediate: true
    }
  },
  mounted() {
    const graph = echarts.init(document.querySelector('#graph'))
    var colors = ['#5793f3', '#d14a61', '#675bba']
    const option = {
      color: colors,
      tooltip: {
        trigger: 'none',
        axisPointer: {
          type: 'cross'
        }
      },
      legend: {
        data: ['拒绝', '通过', '复议']
      },
      grid: {
        top: 70,
        bottom: 50
      },
      xAxis: [
        {
          type: 'category',
          axisTick: {
            alignWithLabel: true
          },
          axisLine: {
            onZero: false,
            lineStyle: {
              color: colors[1]
            }
          },
          axisPointer: {
            label: {
              formatter: function(params) {
                return '降水量  ' + params.value(params.seriesData.length ? '：' + params.seriesData[0].data : '')
              }
            }
          },
          data: ['2016-1', '2016-2', '2016-3', '2016-4']
        },
        {
          type: 'category',
          axisTick: {
            alignWithLabel: true
          },
          axisLine: {
            onZero: false,
            lineStyle: {
              color: colors[0]
            },
            splitLine: {
              show: false
            }
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '拒绝',
          type: 'line',
          xAxisIndex: 1,
          smooth: true,
          data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
        },
        {
          name: '通过',
          type: 'line',
          smooth: true,
          data: [3.9, 5.9, 11.1, 18.7, 48.3, 69.2, 231.6, 46.6, 55.4, 18.4, 10.3, 0.7]
        },
        {
          name: '复议',
          type: 'line',
          xAxisIndex: 1,
          smooth: true,
          data: [1.6, 4.9, 8.0, 23.4, 23.7, 60.7, 75.6, 12.2, 28.7, 13.8, 6.0, 12.3]
        }
      ]
    }
    graph.setOption(option)
  },
  methods: {
    getInitData() {
      this.xData = []
      this.passData = []
      this.reviewData = []
      this.rejectData = []
      this.isLoading = true
      this.ruleData = []
      this.testUserNumber = 0
      this.failNumber = 0
      this.successNumber = 0
      this.successRate = 0.0
      this.maxCreditAmount = 0
      this.averageCreditAmount = 0
      this.lendData = []
      this.ruleData = JSON.parse(sessionStorage.getItem('ruleData'))
      const orderCodeList = JSON.parse(sessionStorage.getItem('orderCodeList'))
      const businessCode = JSON.parse(sessionStorage.getItem('businessCode'))
      const processCode = JSON.parse(sessionStorage.getItem('processCode'))
      const triggerLinkEnums = JSON.parse(sessionStorage.getItem('triggerLinkEnums'))
      postRuleSimulation(this.getOrderSearchOption(businessCode, processCode, triggerLinkEnums, orderCodeList))
        .then(({ data }) => {
          if (data.status === 'success') {
            this.testUserNumber = data.content.testUserNumber
            this.failNumber = data.content.failNumber
            this.successNumber = data.content.successNumber
            this.successRate = data.content.successRate
            this.maxCreditAmount = data.content.maxCreditAmount
            this.averageCreditAmount = data.content.averageCreditAmount
            this.lendData = data.content.ruleSimulationListVOList
            this.xData = data.content.xData
            const size = this.lendData.length
            // 我不知道我需要什么了
            for (let i = 0; i < size; i++) {
              if (this.lendData[i].simulationResult === 'REJECT') {
                this.rejectData.push(this.lendData[i].applicationAmount)
              }
              if (this.lendData[i].simulationResult === 'PASS') {
                this.passData.push(this.lendData[i].applicationAmount)
              }
              if (this.lendData[i].simulationResult === 'REVIEW') {
                this.reviewData.push(this.lendData[i].applicationAmount)
              }
            }
          } else if (data.code === 'drools execute fail') {
            this.$message.error('规则引擎执行失败')
          }
        }).catch(err => {
          console.log(err)
          this.$$message.error('请求发送失败')
        }).finally(() => {
          this.isLoading = false
        })
    },
    getOrderSearchOption(businessCode, processCode, triggerLinkEnums, orderCodeList) {
      const option = {}
      option['businessCode'] = businessCode
      option['processCode'] = processCode
      option['triggerLinkEnums'] = triggerLinkEnums
      option['orderCodeList'] = orderCodeList
      console.log('orderCodeList', businessCode)
      console.log('orderCodeList', processCode)
      console.log('orderCodeList', triggerLinkEnums)
      console.log('orderCodeList', orderCodeList)
      return option
    }
  }
}
</script>

<style lang="scss" scoped>
  .result-container{
    padding: 20px;
    font-size: 14px;
  }
  .test-result__item{
    display: flex;
    line-height: 30px;
    color:#606266
  }
  .test-result__item>div:first-child{
    width: 150px;
  }
</style>
