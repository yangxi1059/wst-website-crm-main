<!--
 * @Author: 库建华
 * @Date: 2020-03-09 16:06:07
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-01-17 16:15:13
 * @Version:
 * @Description:
 -->
<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :title="'求职Offer图片有码'"
      :visible.sync="settingVisible"
      width="550px"
      :before-close="close"
    >
      <div class="set_container">
        <div class="set_list_content">
          <el-descriptions title="" :column="1" :contentStyle="{flex:1}" size="medium">
            <el-descriptions-item label="毕业于">{{offerData.finishYear}}</el-descriptions-item>
            <el-descriptions-item label="学历">{{offerData.degreeName}}</el-descriptions-item>
            <el-descriptions-item label="学校">{{offerData.schoolChiName}}</el-descriptions-item>
            <el-descriptions-item label="专业">{{offerData.majorName}}</el-descriptions-item>
          </el-descriptions>
          <ul class="set_img_content">
            <li class="set_img_item">
              <div class="mb10">Offer凭证（有码）</div>
              <el-upload
                class="set_img_btn"
                v-if="roleInfo.includes('offer_list_up')"
                action
                :http-request="uploadFileAxios"
                ref="elupload1"
                :limit="1"
                :file-list="fileList"
              >
                <el-button
                class="el-icon-upload"
                slot="trigger"
                size="mini"
                type="primary"
                plain
                @click="signId = offerData.signId;pkId = offerData.pkId"
                >上传图片</el-button>
              </el-upload>
              <el-image
                style="width: 240px; height: 240px"
                fit="contain"
                :src="resultVoucherMosaic"
                :preview-src-list="resultVoucherMosaicList"

              >
                <div slot="error" class="image_slot">
                  未上传Offer凭证（有码）
                </div>
              </el-image>
            </li>
            <li class="set_img_item">
              <div class="mb10">Offer凭证（无码）</div>
              <el-image
                style="width: 240px; height: 240px"
                fit="contain"
                :src="resultVoucher"
                :preview-src-list="resultVoucherList"
              >
                <div slot="error" class="image_slot">
                  未上传Offer凭证（无码）
                </div>
              </el-image>
            </li>
            <li class="set_img_item">
              <div class="mb10">好评图（有码）</div>
              <el-upload
                class="set_img_btn"
                v-if="roleInfo.includes('offer_list_img_up')"
                action
                :http-request="uploadFileAxios1"
                ref="elupload2"
                :limit="1"
                :file-list="fileList"
              >
                <el-button
                class="el-icon-upload"
                slot="trigger"
                size="mini"
                type="primary"
                plain
                @click="signId = offerData.signId;pkId = offerData.pkId"
                >上传图片</el-button>
              </el-upload>
              <el-image
                style="width: 240px; height: 240px"
                fit="contain"
                :src="praiseVoucherMosaic"
                :preview-src-list="praiseVoucherMosaicList"
              >
                <div slot="error" class="image_slot">
                  未上传好评图（有码）
                </div>
              </el-image>
            </li>
            <li class="set_img_item">
              <div class="mb10">好评图（无码）</div>
              <el-image
                style="width: 240px; height: 240px"
                fit="contain"
                :src="praiseVoucher"
                :preview-src-list="praiseVoucherList"
              >
                <div slot="error" class="image_slot">
                  未上传好评图（无码）
                </div>
              </el-image>
            </li>
          </ul>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import mixins from '@/plugin/mixins'
import apiDic from '@/api/dictionary.js'
import api from '@/api/vip.js'
import { mapState } from 'vuex'

import {
  getImgUrl,
  uploadFunBySys
} from '@/libs/file'

export default {
  name: 'setting',
  mixins: [mixins],
  computed: {
    ...mapState('role', [
      'roleInfo'
    ])
  },
  props: {
    settingVisible: {
      type: Boolean,
      default: false
    },
    offerData: {
      type: Object
    }
  },
  data () {
    return {
      fileList: [],
      company: [],
      division: [],
      city: [],
      apply_season: [],
      resultVoucherMosaic: '',
      praiseVoucherMosaic: '',
      resultVoucher: '',
      praiseVoucher: '',
      resultVoucherMosaicList: [],
      praiseVoucherMosaicList: [],
      resultVoucherList: [],
      praiseVoucherList: [],
      updateOfferData: {},
      checkStatusS: [
        {
          itemName: '未核验',
          itemValue: '0'
        },
        {
          itemName: '已核验',
          itemValue: '1'
        },
        {
          itemName: '未通过',
          itemValue: '2'
        }
      ],
      displayStatusS: [
        {
          itemName: '不显示',
          itemValue: '0'
        },
        {
          itemName: '显示',
          itemValue: '1'
        }
      ],
      common_yes_or_no: [
        {
          itemName: '是',
          itemValue: '1'
        },
        {
          itemName: '否',
          itemValue: '0'
        }
      ],
      rules: {
        checkStatus: [{ required: true, message: '必填', trigger: 'blur' }],
        displayStatus: [{ required: true, message: '必填', trigger: 'blur' }],
        programPeriod: [{ required: true, message: '必填', trigger: 'blur' }],
        offerSalary: [{ required: true, message: '必填', trigger: 'blur' }],
        prepareMonth: [{ required: true, message: '必填', trigger: 'blur' }],
        offerReceiveDate: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        shield: [{ required: true, message: '必填', trigger: 'blur' }],
        company: [{ required: true, message: '必填', trigger: 'blur' }],
        division: [{ required: true, message: '必填', trigger: 'blur' }],
        city: [{ required: true, message: '必填', trigger: 'blur' }],
        applySeason: [{ required: true, message: '必填', trigger: 'blur' }],
        story: [{ required: true, message: '必填', trigger: 'blur' }],
        publicStatus: [{ required: true, message: '必填', trigger: 'blur' }]
      }
    }
  },
  watch: {
    settingVisible: function (val) {
      if (val) {
        console.log(this.offerData, 'yx************')
        this.checkStatus = this.offerData.checkStatus
        this.displayStatus = this.offerData.displayStatus
        this.checkNote = this.offerData.checkNote
        this.initPage()

        if (!this.company.length) {
          this.init()
        }
      }
    }
  },
  methods: {
    init () {
      console.log(this.offerData)
      api.getCompanyList().then(res => {
        console.log('company', res)
        this.company = res.data
      })
      apiDic
        .getDicDropdown(
          'division,city,apply_season'
        )
        .then(res => {
          this.division = res.data.division
          this.city = res.data.city
          this.apply_season = res.data.apply_season
        })
    },
    initPage () {
      this.offerData.resultVoucher =
        this.offerData.resultVoucher || this.offerData.offerVoucher
      this.offerData.resultVoucherMosaic =
        this.offerData.resultVoucherMosaic || this.offerData.offerVoucherMosaic

      getImgUrl(
        this.offerData.resultVoucher,
        url => (this.resultVoucher = url,
        this.resultVoucherList = [url])
      )
      getImgUrl(
        this.offerData.praiseVoucher,
        url => (this.praiseVoucher = url,
        this.praiseVoucherList = [url])
      )
      getImgUrl(
        this.offerData.resultVoucherMosaic,
        url => (this.resultVoucherMosaic = url,
        this.resultVoucherMosaicList = [url]
        )
      )
      getImgUrl(
        this.offerData.praiseVoucherMosaic,
        url => (this.praiseVoucherMosaic = url,
        this.praiseVoucherMosaicList = [url])
      )
    },
    submit () {
    //   this.updateOfferData = {};
      const data = this.updateOfferData
      if (!this.updateOfferData.pkId) {
        this.$message({
          type: 'error',
          message: '请至少上传一张要修改的有码图'
        })
        return
      }
      console.log(data)
      api.updateOfferDetail(data).then(res => {
        console.log(res)
        this.$emit('submit')
        this.clear()
      })
    },
    uploadFileAxios (file, fileList) {
      var testmsg = file.file.name.substring(file.file.name.lastIndexOf('.') + 1)
      const extension = testmsg === 'png'
      const extension2 = testmsg === 'jpg'
      const extension3 = testmsg === 'jpeg'
      if (!extension && !extension2 && !extension3) {
        this.$message({
          message: '上传文件只能是图片（png,jpg,jpeg）!',
          type: 'warning'
        })
        this.$refs.elupload1.clearFiles()
        return false
      }
      this.$loading()
      uploadFunBySys(
        file.file,
        `voucher/offer_list/${this.pkId}`,
        url => {
          console.log(url, 'yxoffer图有码**********')
          getImgUrl(
            url,
            url => (this.resultVoucherMosaic = url)
          )
          this.updateOfferData.pkId = this.pkId
          this.updateOfferData.resultVoucherMosaic = url
          this.fileList = []
          this.$loading().close()
          this.$refs.elupload1.clearFiles()
        }
      )
    },
    uploadFileAxios1 (file, fileList) {
      var testmsg = file.file.name.substring(file.file.name.lastIndexOf('.') + 1)
      const extension = testmsg === 'png'
      const extension2 = testmsg === 'jpg'
      const extension3 = testmsg === 'jpeg'
      if (!extension && !extension2 && !extension3) {
        this.$message({
          message: '上传文件只能是图片（png,jpg,jpeg）!',
          type: 'warning'
        })
        this.$refs.elupload2.clearFiles()
        return false
      }
      this.$loading()
      uploadFunBySys(
        file.file,
        `good_figure/offer_list/${this.pkId}`,
        url => {
          console.log(url, 'yx好评图有码**********')
          getImgUrl(
            url,
            url => (this.praiseVoucherMosaic = url)
          )
          console.log(this.praiseVoucherMosaic)
          this.updateOfferData.pkId = this.pkId
          this.updateOfferData.praiseVoucherMosaic = url
          this.fileList = []
          this.$loading().close()
          this.$refs.elupload2.clearFiles()
        }
      )
    },
    clear () {
      this.resultVoucherMosaic = ''
      this.praiseVoucherMosaic = ''
      this.resultVoucher = ''
      this.praiseVoucher = ''
      this.resultVoucherMosaicList = []
      this.praiseVoucherMosaicList = []
      this.resultVoucherList = []
      this.praiseVoucherList = []
      this.$refs.elupload1.clearFiles()
      this.$refs.elupload2.clearFiles()
      this.updateOfferData = {}
      this.offerData2 = {}
    },
    close () {
      this.clear()
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.set_container{
  display: flex;
  .set_list_content{
    width:550px;
  }
  .set_img_content{
    width:100%;
    .set_img_item{
      position: relative;
      width:50%;
      display: inline-block;
      ::v-deep .image_slot{
        width:100%;
        height:100%;
        background: #eee;
        text-align: center;
        padding-top:45%
      }
    }
    .set_img_btn{
      position:absolute;
      top:0;
      right:15px;
    }
  }
  .set_form_content{
    flex: 1;
  }
}
</style>
