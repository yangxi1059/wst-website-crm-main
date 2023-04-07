<template>
  <div class="landmark">
    <el-dialog :close-on-click-modal="false"
      width="1000px"
      title="里程碑"
      :visible.sync="landmarkVisible"
      :before-close="landmarkClose"
    >
      <el-radio-group v-model="reverse" class="mb20">
        <el-radio :label="true">倒序</el-radio>
        <el-radio :label="false">正序</el-radio>
      </el-radio-group>
      <el-timeline :reverse="reverse">
        <el-timeline-item
          placement="top"
          size="large"
          type="success"
          v-for="(event, index) in events"
          :key="index"
          :timestamp="event.eventDate"
        >
          <p class="_item-name">{{event.eventTypeName}}</p>
          <p class="item-value" :class="{'item-value2':addEventVisible}">{{event.eventContent}}</p>
        </el-timeline-item>
      </el-timeline>
      <div class="add-event">
        <el-button
          size="mini"
          type="success"
          v-if="!addEventVisible"
          @click="addEventVisible = true"
        >添加里程碑</el-button>
        <el-card v-if="addEventVisible">
          <el-button size="mini" @click="addEventVisible = false">取消添加</el-button>
          <el-form :inline="true" label-width="120px" v-if="addEventVisible">
            <el-form-item label="类型">
              <el-select
                :style="{width:'200px'}"
                size="mini"
                v-model="eventType"
                filterable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in user_event_type"
                  :key="item.itemValue"
                  :label="item.itemName"
                  :value="item.itemValue"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="时间">
              <el-date-picker
                v-model="eventDate"
                type="date"
                :style="{width:'200px'}"
                size="mini"
                placeholder="选择日期"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="金额">
              <el-input-number
                :style="{width:'200px'}"
                size="mini"
                v-model="eventAmount"
                maxlength="180"
                placeholder="根据类型选填"
                :controls="false"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="内容">
              <el-input
                :style="{width:'200px'}"
                size="mini"
                autosize
                type="textarea"
                v-model="eventContent"
                maxlength="180"
                placeholder="限长180字符"
              ></el-input>
            </el-form-item>
            <el-form-item label=" ">
              <el-button size="mini" :style="{width:'200px'}" type="primary" @click="submit">提交</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import api from '@/api/hr.js'
import mixins from '@/plugin/mixins'

export default {
  name: 'landmark',
  mixins: [mixins],
  props: {
    landmarkVisible: {
      type: Boolean,
      default: false
    },
    userId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      reverse: false,
      events: [],
      addEventVisible: false,
      eventType: '',
      eventContent: '',
      eventDate: '',
      eventAmount: '',
      user_event_type: []
    }
  },
  mounted () {},
  watch: {
    landmarkVisible: function (newData, oldData) {
      if (newData) {
        this.Topage()
        this.pageInit()
      }
    }
  },
  methods: {
    async pageInit () {
      this.user_event_type = await this.getDictionary('user_event_type')
    },
    Topage () {
      api.getEventsListByUserId(this.userId).then(res => {
        console.log('里程碑数据', res)
        this.events = res.data
      })
    },
    landmarkClose () {
      this.$emit('close')
      this.clear()
    },
    clear () {
      this.eventType = ''
      this.eventContent = ''
      this.eventDate = ''
      this.addEventVisible = false
    },
    submit () {
      if (!this.eventType.length) {
        this.$message({
          type: 'warning',
          message: '类型不可为空'
        })
        return
      }
      if (!this.eventDate) {
        this.$message({
          type: 'warning',
          message: '时间不可为空'
        })
        return
      }
      if (!this.eventContent.length) {
        this.$message({
          type: 'warning',
          message: '内容不可为空'
        })
        return
      }
      // this.eventDate.length &&this.eventContent.length )
      const data = {
        eventType: this.eventType,
        eventContent: this.eventContent,
        eventDate: this.eventDate,
        eventAmount: this.eventAmount,
        userId: this.userId
      }
      api.setEvents({ addList: [data] }).then(res => {
        console.log(res)
        this.$message({
          type: 'success',
          message: '添加成功'
        })
        this.Topage()
        this.clear()
      })
    }
  }
}
</script>
<style scoped>
.add-event {
  position: absolute;
  top: 20px;
  left: 600px;
  background-color: #fff;
}
.item-value {
  color: #666;
  width: 900px;
}
.item-value2 {
  width: 530px;
}
</style>
