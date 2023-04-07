<template>
  <div class="set-target">
    <el-dialog :close-on-click-modal="false"
      title="Transition"
      :visible.sync="transitionVisible"
      width="1100px"
      :before-close="close"
    >
      <el-form :inline="true" label-width="180px">
        <el-form-item label="目标Track：">
          <el-select
            :style="{width:'300px'}"
            v-model="tracks"
            multiple
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in track"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="目标Location：">
          <el-select
            :style="{width:'300px'}"
            v-model="locations"
            multiple
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in location"
              :key="item.itemValue"
              :label="item.itemName"
              :value="item.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="背景提升：">
          <el-input
            :style="{width:widthHalf}"
            type="textarea"
            :autosize="{ minRows: 2}"
            v-model="background"
            :maxlength="180"
          ></el-input>
        </el-form-item>
        <el-form-item label="学生情况概述：">
          <el-input
            :style="{width:widthHalf}"
            type="textarea"
            :autosize="{ minRows: 2}"
            v-model="situation"
            placeholder="自我定位，性格特点..."
          ></el-input>
        </el-form-item>
        <el-form-item label="其他：">
          <el-input
            :style="{width:widthHalf}"
            type="textarea"
            :autosize="{ minRows: 2}"
            v-model="other"
            placeholder
          ></el-input>
        </el-form-item>
        <div class="create-cant-program-model components-model">
            <div class="program-model-title">父母情况</div>
            <el-form-item label="职业：" prop="parentJob">
              <el-input
                :style="{width:widthHalf}"
                type="textarea"
                :maxlength="180"
                v-model="parentJob"
                :autosize="{ minRows: 3}"
                placeholder="有，请注明公司、职位；  没有，填无。"
                show-word-limit
              ></el-input>
            </el-form-item>
            <el-form-item label="性格类型：" prop="parentPersonality">
              <el-input
                :style="{width:widthHalf}"
                type="textarea"
                :maxlength="180"
                v-model="parentPersonality"
                :autosize="{ minRows: 3}"
                placeholder="有，请注明  没有，填无。"
                show-word-limit
              ></el-input>
            </el-form-item>
            <el-form-item label="父母对小孩的期望：" prop="parentExpectation">
              <el-input
                :style="{width:widthHalf}"
                type="textarea"
                :maxlength="180"
                v-model="parentExpectation"
                :autosize="{ minRows: 3}"
                placeholder="有，请注明；  没有，填无。"
                show-word-limit
              ></el-input>
            </el-form-item>
            <el-form-item label="对小孩人生的介入程度：" prop="parentControl">
              <el-input
                :style="{width:widthHalf}"
                type="textarea"
                :maxlength="180"
                v-model="parentControl"
                :autosize="{ minRows: 3}"
                placeholder="有，请注明；  没有，填无。"

                show-word-limit
              ></el-input>
            </el-form-item>
            <el-form-item label="购买力：" prop="parentPurchasingPower">
              <el-input
                :style="{width:widthHalf}"
                type="textarea"
                :maxlength="180"
                v-model="parentPurchasingPower"
                :autosize="{ minRows: 3}"
                placeholder="有，请注明；  没有，填无。"

                show-word-limit
              ></el-input>
            </el-form-item>
          </div>
          <div class="create-cant-program-model components-model">
            <div class="program-model-title">学生情况</div>
            <el-form-item label="对行业的了解程度：" prop="menteeIndustryLevel">
              <el-input
                :style="{width:widthHalf}"
                type="textarea"
                :maxlength="180"
                v-model="menteeIndustryLevel"
                :autosize="{ minRows: 3}"
                placeholder="有，请注明；  没有，填无。"

                show-word-limit
              ></el-input>
            </el-form-item>
            <el-form-item label="学生心理状态：" prop="menteeMentality">
              <el-input
                :style="{width:widthHalf}"
                type="textarea"
                :maxlength="180"
                v-model="menteeMentality"
                :autosize="{ minRows: 3}"
                placeholder="属于佛系还是相对比较积极的状态，or出现极端心理问题请阐述"

                show-word-limit
              ></el-input>
            </el-form-item>
            <el-form-item label="需要后期综合注意的点：" prop="notice">
              <el-input
                :style="{width:widthHalf}"
                type="textarea"
                :maxlength="180"
                v-model="notice"
                :autosize="{ minRows: 3}"
                placeholder="老师风格偏好，学生当前申请的进度和资源，付款一半上课不能超过XX节..."

                show-word-limit
              ></el-input>
            </el-form-item>
          </div>
      </el-form>
      <span slot="footer" class="dialog-footer mr20">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import apiDic from '@/api/dictionary.js'
import api from '@/api/vip'
import mixins from '@/plugin/mixins'

export default {
  props: {
    transitionVisible: {
      type: Boolean,
      default: false
    },
    orderId: {
      type: String,
      default: ''
    },
    signId: {
      type: String,
      default: ''
    },
    menteeId: {
      type: String,
      default: ''
    },
    order: {}
  },
  mixins: [mixins],
  data: () => {
    return {
      widthHalf: '300px',
      track: [],
      location: [],
      tracks: [],
      locations: [],
      background: '',
      situation: '',
      other: '',
      parentJob: '',
      parentPersonality: '',
      parentExpectation: '',
      parentControl: '',
      parentPurchasingPower: '',
      menteeIndustryLevel: '',
      menteeMentality: '',
      notice: ''
    }
  },
  watch: {
    transitionVisible: function (val) {
      if (val) {
        if (!this.location.length) {
          this.pageInit()
        }
        this.Topage()
      }
    }
  },
  created () {},
  mounted () {},
  methods: {
    async pageInit () {
      this.track = await this.getDictionary('track')
      this.country = await this.getDictionary('country')
    },
    Topage () {
      api.getTransitionByOrderId(this.orderId).then(res => {
        console.log(res.data, 22222222222222222222)
        if (res.data) {
          this.tracks = []
          this.other = res.data.other || ''
          this.background = res.data.background || ''
          this.situation = res.data.situation || ''
          this.parentJob = res.data.parentJob || ''
          this.parentPersonality = res.data.parentPersonality || ''
          this.parentExpectation = res.data.parentExpectation || ''
          this.parentControl = res.data.parentControl || ''
          this.parentPurchasingPower = res.data.parentPurchasingPower || ''
          this.menteeIndustryLevel = res.data.menteeIndustryLevel || ''
          this.menteeMentality = res.data.menteeMentality || ''
          this.notice = res.data.notice || ''
          this.locations = []
          res.data.trackArr.forEach(v => {
            this.tracks.push(v.track)
          })
          res.data.locationArr.forEach(v => {
            this.locations.push(v.location)
          })
        }
      })
    },
    close () {
      this.$emit('close')
    },
    submit () {
      console.log('submit')
      if (this.order) {
        const data = {
          orderId: this.orderId || '',
          background: this.background || '',
          situation: this.situation || '',
          notice: this.notice || '',
          locationArr: this.locations,
          trackArr: this.tracks,
          parentJob: this.parentJob || '',
          other: this.other || '',
          parentPersonality: this.parentPersonality || '',
          parentExpectation: this.parentExpectation || '',
          parentControl: this.parentControl || '',
          parentPurchasingPower: this.parentPurchasingPower || '',
          menteeIndustryLevel: this.menteeIndustryLevel || '',
          menteeMentality: this.menteeMentality || ''
        }
        api.getUptTransition(data).then(res => {
          console.log('更新', res)
          this.$emit('submit')
        })
      } else {
        const data = {
          orderId: this.orderId || '',
          signId: this.signId || '',
          menteeId: this.menteeId || '',
          background: this.background || '',
          situation: this.situation || '',
          other: this.other || '',
          notice: this.notice || '',
          locationArr: this.locations,
          trackArr: this.tracks,
          parentJob: this.parentJob || '',
          parentPersonality: this.parentPersonality || '',
          parentExpectation: this.parentExpectation || '',
          parentControl: this.parentControl || '',
          parentPurchasingPower: this.parentPurchasingPower || '',
          menteeIndustryLevel: this.menteeIndustryLevel || '',
          menteeMentality: this.menteeMentality || ''
        }
        api.setTransitionDetail(data).then(res => {
          console.log('更新', res)
          this.$emit('submit')
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.components-model{
  padding:20px 0;
}
</style>
