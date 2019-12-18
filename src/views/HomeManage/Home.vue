<template>
  <el-container class="container">
    <!--主题数据展示-->
    <el-main class="main" style="height: 840px">
      <!--今日事件-->
      <el-form :inline="true" size="mini" style="height: 120px">
        <div class="topinit">
          <el-form-item label="今日拒绝事件">
            <p><span class="top-input">{{ rejectEventNumber }}</span></p>
            <p>{{ rejectRate }}</p>
          </el-form-item>
        </div>
        <div class="topinit-for" />
        <div class="topinit">
          <el-form-item label="今日通过事件">
            <p><span class="top-input">{{ passEventNumber }}</span></p>
            <p>{{ passRate }}</p>
          </el-form-item>
        </div>
        <div class="topinit-for" />
        <div class="topinit">
          <el-form-item label="今日事件总量">
            <p><span class="top-input">{{ totalNumber }}</span></p>
          </el-form-item>
        </div>
        <div class="topinit-for" />
        <div class="topinit">
          <el-form-item label="放款金额">
            <p><span class="top-input money">{{ applicationAmount }}</span></p>
          </el-form-item>
        </div>
        <div class="topinit-for" />
        <div class="topinit">
          <el-form-item label="件均额度">
          <br>
            <p><span class="top-input money">{{ averageAmount }}</span></p>
          </el-form-item>
        </div>
        <div class="topinit-for" />
      </el-form>
      <!--搜索按钮部分-->
      <el-form>
        <el-form-item label="统计时间">
          <el-date-picker
            v-model="orderTime"
            size="mini"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
          />
        </el-form-item>
        <div class="button"><el-button icon="el-icon-search" type="primary" size="small" @click="search">查询</el-button></div>
      </el-form>
      <el-form>
        <el-form-item>
          <div class="bottom">
            <div :id="iconId" :class="iconClassName" :style="{height:iconHeight,width:iconWidth}" />
            <div :id="percentageId" :class="percentageClassName" :style="{height:percentageHeight,width:percentageWidth}" />
          </div>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script>
import api from '../../api/HomeManage.js'
import echarts from 'echarts'
import resize from '../../components/Charts/mixins/resize'

const {
  getToday,
  getSearch
} = api
export default {
  mixins: [resize],
  props: {
    iconClassName: {
      type: String,
      default: 'icon'
    },
    iconId: {
      type: String,
      default: 'icon'
    },
    iconWidth: {
      type: String,
      default: '54%'
    },
    iconHeight: {
      type: String,
      default: '420px'
    },
    percentageClassName: {
      type: String,
      default: 'percentage'
    },
    percentageId: {
      type: String,
      default: 'percentage'
    },
    percentageWidth: {
      type: String,
      default: '42%'
    },
    percentageHeight: {
      type: String,
      default: '420px'
    }
  },
  data() {
    return {
      rejectEventNumber: '1283',
      rejectRate: '40.19%',
      passEventNumber: '310',
      passRate: '9.72%',
      totalNumber: '3192',
      applicationAmount: '3,201,989.00',
      averageAmount: '31,726.12',
      orderTime: [],
      passEventNumber_search: '',
      passRate_serach: '',
      rejectEventNumber_search: '',
      rejectRate_search: '',
      reviewEventNumber_search: '',
      reviewRate_search: '',
      staticticsList_search: [],
      totalNumber_search: '',
      icon: null,
      percentage: null,
      xData: [],
      passData: [],
      rejectData: [],
      reviewData: [],
      totalData: []
    }
  },
  mounted() {
    this.getInitData()
  },
  methods: {
    /**
     * 获取今日事件
     */
    getInitData() {
      getToday().then(({ data }) => {
        this.applicationAmount = data.content.applicationAmount
        this.averageAmount = data.content.averageAmount
        this.passEventNumber = data.content.passEventNumber
        this.passRate = data.content.passRate
        this.rejectEventNumber = data.content.rejectEventNumber
        this.rejectRate = data.content.rejectRate
        this.totalNumber = data.content.totalNumber
      })
    },
    search() {
      this.xData = []
      this.passData = []
      this.reviewData = []
      this.rejectData = []
      this.totalData = []
      this.staticticsList_search = []
      let option = {}
      console.log(this.orderTime)
      if (this.orderTime === null || !this.orderTime.length) {
        console.log('this.orderTime.length = 0')
        option = { startDate: '', stopDate: '' }
      } else {
        option = { startDate: this.orderTime[0] || '', stopDate: this.orderTime[1] }
      }
      console.log(option)
      getSearch(option).then(({ data }) => {
        this.passEventNumber_search = data.content.passEventNumber
        this.passRate_serach = data.content.passRate
        this.rejectEventNumber_search = data.content.rejectEventNumber
        this.rejectRate_search = data.content.rejectRate
        this.totalNumber_search = data.content.totalNumber
        this.reviewEventNumber_search = data.content.reviewEventNumber
        this.reviewRate_search = data.content.reviewRate
        this.staticticsList_search = data.content.statisticsList
        const size = this.staticticsList_search.length
        console.log(size)
        for (let i = 0; i < size; i++) {
          this.xData.push(this.staticticsList_search[i].staticticsDate)
          this.passData.push(this.staticticsList_search[i].passEventNumber)
          this.rejectData.push(this.staticticsList_search[i].rejectEventNumber)
          this.totalData.push(this.staticticsList_search[i].totalNumber)
          this.reviewData.push(this.staticticsList_search[i].reviewEventNumber)
          console.log(this.staticticsList_search[i].staticticsDate)
        }
        console.log(this.xData)
        this.initChart()
      })
        .catch((err) => {
          console.log(err.response)
        })
    },
    initChart() {
      this.percentage = echarts.init(document.getElementById(this.percentageId))
      this.percentage.setOption({
        tooltip: {
          trigger: 'item',
          formatter: " '{a}' <br/>{b}: {c} ({d}%) "
        },
        legend: {
          orient: 'vertical',
          x: 'left',
          data: ['拒绝', '通过', '复议']
        },
        series: [
          {
            name: '审核结果',
            type: 'pie',
            selectedMode: 'single',
            radius: [0, '30%'],

            label: {
              normal: {
                position: 'inner'
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              { value: this.rejectEventNumber_search, name: '拒绝', selected: true },
              { value: this.passEventNumber_search, name: '通过' },
              { value: this.reviewEventNumber_search, name: '复议' }
            ]
          },
          {
            name: '审核结果',
            type: 'pie',
            radius: ['40%', '55%'],
            label: {
              normal: {
                formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                backgroundColor: '#eee',
                borderColor: '#aaa',
                borderWidth: 1,
                borderRadius: 4,
                rich: {
                  a: {
                    color: '#999',
                    lineHeight: 22,
                    align: 'center'
                  },
                  hr: {
                    borderColor: '#aaa',
                    width: '100%',
                    borderWidth: 0.5,
                    height: 0
                  },
                  b: {
                    fontSize: 16,
                    lineHeight: 33
                  },
                  per: {
                    color: '#eee',
                    backgroundColor: '#334455',
                    padding: [2, 4],
                    borderRadius: 2
                  }
                }
              }
            },
            data: [
              { value: this.rejectEventNumber_search, name: '拒绝' },
              { value: this.passEventNumber_search, name: '通过' },
              { value: this.reviewEventNumber_search, name: '复议' }
            ]
          }
        ]
      })
      this.icon = echarts.init(document.getElementById(this.iconId))
      this.icon.setOption({
        backgroundColor: '#344b58',
        title: {
          text: '风险事件统计',
          x: '20',
          top: '20',
          textStyle: {
            color: '#fff',
            fontSize: '22'
          },
          subtextStyle: {
            color: '#90979c',
            fontSize: '16'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            textStyle: {
              color: '#fff'
            }
          }
        },
        grid: {
          left: '5%',
          right: '5%',
          borderWidth: 0,
          top: 150,
          bottom: 95,
          textStyle: {
            color: '#fff'
          }
        },
        legend: {
          x: '5%',
          top: '10%',
          textStyle: {
            color: '#90979c'
          },
          data: ['拒绝', '通过', '复议', '总数']
        },
        calculable: true,
        xAxis: [{
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitArea: {
            show: false
          },
          axisLabel: {
            interval: 0

          },
          data: this.xData
        }],
        yAxis: [{
          type: 'value',
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            interval: 0
          },
          splitArea: {
            show: false
          }
        }],
        dataZoom: [{
          show: true,
          height: 30,
          xAxisIndex: [
            0
          ],
          bottom: 30,
          start: 10,
          end: 80,
          handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
          handleSize: '110%',
          handleStyle: {
            color: '#d3dee5'

          },
          textStyle: {
            color: '#fff'
          },
          borderColor: '#90979c'

        }, {
          type: 'inside',
          show: true,
          height: 15,
          start: 1,
          end: 35
        }],
        series: [{
          name: '拒绝',
          type: 'bar',
          stack: 'total',
          barMaxWidth: 35,
          barGap: '10%',
          itemStyle: {
            normal: {
              color: 'rgba(255,144,128,1)',
              label: {
                show: true,
                textStyle: {
                  color: '#fff'
                },
                position: 'insideTop',
                formatter(p) {
                  return p.value > 0 ? p.value : ''
                }
              }
            }
          },
          data: this.rejectData
        }, {
          name: '通过',
          type: 'bar',
          stack: 'total',
          itemStyle: {
            normal: {
              color: 'rgba(0,191,183,1)',
              barBorderRadius: 0,
              label: {
                show: true,
                position: 'top',
                formatter(p) {
                  return p.value > 0 ? p.value : ''
                }
              }
            }
          },
          data: this.passData
        }, {
          name: '复议',
          type: 'bar',
          stack: 'total',
          itemStyle: {
            normal: {
              color: 'rgba(255,230,183,1)',
              barBorderRadius: 0,
              label: {
                show: true,
                position: 'top',
                formatter(p) {
                  return p.value > 0 ? p.value : ''
                }
              }
            }
          },
          data: this.reviewData
        }, {
          name: '总数',
          type: 'line',
          stack: 'total',
          symbolSize: 10,
          symbol: 'circle',
          itemStyle: {
            normal: {
              color: 'rgba(252,230,48,1)',
              barBorderRadius: 0,
              label: {
                show: true,
                position: 'top',
                formatter(p) {
                  return p.value > 0 ? p.value : ''
                }
              }
            }
          },
          data: this.totalData
        }
        ]
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .container {
    padding: 10px;
    box-sizing: border-box;
    .header {
      background:rgb(247, 247, 247);
      padding: 20px;
      // box-sizing:border-box;
      .label {
        width: 30%;
        height: 30px;
        margin-right: 3%;
        box-sizing: border-box;
        float: left;
        .select {
          width: 180px;
        }
      }
    }
  }
  .label {
    font-weight: 500;
  }
  .top-input{
    font-weight: 500;
    font-size: 22px;
  }
  .mylabel{
    display: inline-block;
    text-align: right;
    width: 150px;
  }
  .myInput{
    border: none;
    width: auto;
    height: auto;
  }
  .topinit{
    float: left;
    border: black;
    border-style: solid;
    border-width: 1px;
    width: 18%;
    height: 90px;
  }
  .topinit-for{
    float: left;
    width: 2%;
    height: 90px;
  }
  .button{
    padding: 15px;
    text-align: center;
  }
  .money::before {
    content: "￥";
    color: black;
  }
  .icon{
    float: left;
  }
  .percentage{
    float: left;
  }
  .bottom{
    float: left;
    width: 100%;
    height: 480px;
  }
</style>
