<!--
 模拟ElementUI中的el-switch标签，为switch组件的click事件添加停止事件冒泡属性
-->
<!--
  组件数据更新不及时
-->
<template>
  <div class="container" :class="{'bg-gray': !isToggle, 'bg-blue': isToggle}" @click.stop="handleClick">
    <div :class="{'off': true, 'on': isToggle}" />
  </div>
</template>

<script>
import api from '../../api/index.js'
const {
  postRuleStateChange
} = api

export default {
  props: {
    ruleId: {
      type: Number,
      default: () => -1
    },
    status: {
      type: String,
      default: () => ''
    }
  },
  data() {
    return {
      isToggle: this.status === 'published'
    }
  },
  mounted() {
    console.log(this.isToggle)
  },
  methods: {
    handleClick() {
      // console.log(this.isToggle)
      const option = {
        ruleId: this.ruleId,
        operation: 'off'
      }
      if (!this.isToggle) {
        option.operation = 'on'
      }
      postRuleStateChange(option)
        .then(({ data }) => {
          if (data.status === 'success') {
            this.isToggle = !this.isToggle
            this.$emit('statechange', this.isToggle)
            if (this.isToggle) {
              this.$message('规则开启成功')
            } else {
              this.$message('规则关闭成功')
            }
          } else {
            this.$message('规则状态改变失败')
          }
        })
        .catch(() => this.$message.error('请求发送失败'))
    }
  }
}
</script>

<style lang="scss" scoped>
  .container {
    width: 40px;
    height: 20px;
    border-radius: 10px;
    position: relative;
  }
  .bg-gray {
    background: rgb(220, 223, 230);
  }
  .bg-blue {
    background: rgb(70, 160, 252);
  }
  .off {
    display: inline-block;
    width: 18px;
    height: 18px;
    background: #fff;
    border-radius: 9px;
    position: absolute;
    top: 1px;
    left: 1px;
    transition: all 0.2s ease-in-out;
  }
  .on {
    transform: translateX(20px);
  }
</style>
