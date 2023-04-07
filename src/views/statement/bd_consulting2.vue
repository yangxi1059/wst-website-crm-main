<!--
 * @Author: 杨曦
 * @Date: 2020-10-30 13:19:34
 * @LastEditors: 杨曦
 * @LastEditTime: 2022-09-06 11:37:41
 * @Version:
 * @Description:
-->
<!--
 * @Author: 杨曦
 * @Date: 2020-10-19 16:31:52
 * @LastEditors: 杨曦
 * @LastEditTime: 2020-11-03 11:09:43
 * @Version:
 * @Description:
-->
<template>
  <d2-container  >
    <div class="sales_conversion"  v-loading.fullscreen.lock="fullscreenLoading">
        <div class="search_page">
            <div class="search">
                <el-date-picker
                    style="width:150px"
                    v-model="beginDate"
                    class="mr10"
                    type="date"
                    size="mini"
                    :clearable="false"
                    value-format="yyyy-MM-dd"
                    placeholder="选择起始日期">
                </el-date-picker>
                <el-date-picker
                    style="width:150px"
                    v-model="endDate"
                    class="mr10"
                    type="date"
                    size="mini"
                    :clearable="false"
                    value-format="yyyy-MM-dd"
                    placeholder="选择截止日期">
                </el-date-picker>
                <el-button
                    class="mr10"
                    style="margin:0 10px 0 0"
                    size="mini"
                    type="success"
                    @click="Topage()"
                >GO</el-button>
            </div>
        </div>
        <div >
          <div style="width:100%">
            <el-card class="box-card mt20" style="width:100%">
              <div slot="header" class="clearfix">
                <span>签约成本</span>
              </div>
              <div >
                  <el-collapse v-model="activeNames3" >
                    <el-collapse-item :title="title10" name="1">
                      <hot-table :settings="settings10"  ref=""  v-if="settings10.data" licenseKey="non-commercial-and-evaluation"></hot-table>
                    </el-collapse-item>
                    <el-collapse-item  :title="title11" name="2">
                      <hot-table :settings="settings11" ref=""  v-if="settings11.data" licenseKey="non-commercial-and-evaluation"></hot-table>
                    </el-collapse-item>
                    <el-collapse-item  :title="title12" name="3">
                      <hot-table :settings="settings12" ref=""  v-if="settings12.data" licenseKey="non-commercial-and-evaluation"></hot-table>
                    </el-collapse-item>

                  </el-collapse>
              </div>
            </el-card>
          </div>
          <div style="width:100%">
            <el-card class="box-card mt20" style="width:100%">
              <div slot="header" class="clearfix">
                <span>获客成本</span>
              </div>
              <div >
                  <el-collapse v-model="activeNames2" >
                    <el-collapse-item :title="title7" name="1">
                      <hot-table :settings="settings7"  ref=""  v-if="settings7.data" licenseKey="non-commercial-and-evaluation"></hot-table>
                    </el-collapse-item>
                    <el-collapse-item  :title="title8" name="2">
                      <hot-table :settings="settings8" ref=""  v-if="settings8.data" licenseKey="non-commercial-and-evaluation"></hot-table>
                    </el-collapse-item>
                    <el-collapse-item  :title="title9" name="3">
                      <hot-table :settings="settings9" ref=""  v-if="settings9.data" licenseKey="non-commercial-and-evaluation"></hot-table>
                    </el-collapse-item>

                  </el-collapse>
              </div>
            </el-card>
          </div>
          <div style="width:100%">
            <el-card class="box-card mt20" style="width:100%">
              <div slot="header" class="clearfix">
                <span>转化率</span>
              </div>
              <div >
                  <el-collapse v-model="activeNames" >
                    <el-collapse-item :title="title" name="1">
                      <hot-table :settings="settings"  ref=""  v-if="settings.data" licenseKey="non-commercial-and-evaluation"></hot-table>
                    </el-collapse-item>
                    <el-collapse-item  :title="title2" name="2">
                      <hot-table :settings="settings2" ref=""  v-if="settings2.data" licenseKey="non-commercial-and-evaluation"></hot-table>
                    </el-collapse-item>
                    <el-collapse-item  :title="title3" name="3">
                      <hot-table :settings="settings3" ref=""  v-if="settings3.data" licenseKey="non-commercial-and-evaluation"></hot-table>
                    </el-collapse-item>

                  </el-collapse>
              </div>
            </el-card>
          </div>
          <div style="width:100%">
            <el-card class="box-card mt20" style="width:100%">
              <div slot="header" class="clearfix">
                <span>ROI</span>
              </div>
              <div >
                  <el-collapse v-model="activeNames1" >
                    <el-collapse-item :title="title4" name="1">
                      <hot-table :settings="settings4"  ref=""  v-if="settings4.data" licenseKey="non-commercial-and-evaluation"></hot-table>
                    </el-collapse-item>
                    <el-collapse-item  :title="title5" name="2">
                      <hot-table :settings="settings5" ref=""  v-if="settings5.data" licenseKey="non-commercial-and-evaluation"></hot-table>
                    </el-collapse-item>
                    <el-collapse-item  :title="title6" name="3">
                      <hot-table :settings="settings6" ref=""  v-if="settings6.data" licenseKey="non-commercial-and-evaluation"></hot-table>
                    </el-collapse-item>

                  </el-collapse>
              </div>
            </el-card>
          </div>
        </div>

    </div>
  </d2-container>
</template>

<script>
import mixins from '@/plugin/mixins'
import api from '@/api/sales_assistant'
import Handsontable from 'handsontable'

function getNowFormatDate () {
  var date = new Date()
  var seperator1 = '-'
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var strDate = date.getDate()
  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate
  }
  var currentdate = year + seperator1 + month + seperator1 + strDate
  return currentdate
}
export default {
  mixins: [mixins],
  data () {
    return {
      activeNames: [],
      activeNames1: [],
      activeNames2: [],
      activeNames3: [],
      endDate: getNowFormatDate(),
      fullscreenLoading: false,
      beginDate: `${new Date().getFullYear()}-01-01`,
      consultingData: [],
      exportData: [],
      title: '合作商转化率',
      title2: '校园大使转化率',
      title3: 'WST员工（管辖合作商与校园大使）转化率',
      title4: '合作商ROI',
      title5: '校园大使ROI',
      title6: 'WST员工（管辖合作商与校园大使）ROI',
      title7: '合作商获客成本',
      title8: '校园大使获客成本',
      title9: 'WST员工（管辖合作商与校园大使）获客成本',
      title10: '合作商签约成本',
      title11: '校园大签约成本',
      title12: 'WST员工（管辖合作商与校园大使）签约成本',
      settings: {
        data: [],
        rowHeaders: true,
        stretchH: 'all',
        sortIndicator: true,
        columnSorting: true,
        copyable: false,
        fillHandle: false,
        hiddenColumns: {
          columns: [],
          indicators: false
        },
        readOnly: true,
        colWidths: [25, 25, 25],
        columns: [
          {
            data: 'cooperatorName'
          },
          {
            data: 'uniqueCode'
          },
          {
            data: 'counselorNum'
          },
          {
            data: 'signCount'
          },
          {
            data: 'number'
          }
        ],
        beforeColumnSort: (oldVal, newVal) => {

        },
        colHeaders: [
          '合作商名称',
          '渠道代码',
          '咨询人数',
          '签约人数',
          '签约咨询比（%）'
        ]
      },
      settings2: {
        data: [],
        rowHeaders: true,
        stretchH: 'all',
        sortIndicator: true,
        columnSorting: true,
        copyable: false,
        fillHandle: false,
        colWidths: [25, 25, 25],
        hiddenColumns: {
          columns: [],
          indicators: false
        },
        readOnly: true,
        columns: [
          {
            data: 'ambassadorName'
          },
          {
            data: 'uniqueCode'
          },
          {
            data: 'counselorNum'
          },
          {
            data: 'signCount'
          },
          {
            data: 'number'
          }
        ],
        beforeColumnSort: (oldVal, newVal) => {

        },
        colHeaders: [
          '校园大使名称',
          '校园大使代码',
          '咨询人数',
          '签约人数',
          '签约咨询比（%）'
        ]
      },
      settings3: {
        // height: document.documentElement.clientHeight - 280,
        data: [],
        rowHeaders: true,
        stretchH: 'all',
        sortIndicator: true,
        columnSorting: true,
        copyable: false,
        fillHandle: false,
        // colWidths: [25, 25, 25],
        hiddenColumns: {
          columns: [],
          indicators: false
        },
        readOnly: true,
        columns: [
          {
            data: 'userName'
          },
          {
            data: 'cooperatorCounselorNum'
          },
          {
            data: 'cooperatorCounselorNum1'
          },
          {
            data: 'cooperatorCounselorNum2'
          },
          {
            data: 'cooperatorSignCount'
          },
          {
            data: 'cooperatorNumber'
          },
          {
            data: 'ambassadorCounselorNum'
          },
          {
            data: 'ambassadorSignCount'
          },
          {
            data: 'ambassadorNumber'
          }
        ],
        beforeColumnSort: (oldVal, newVal) => {

        },
        colHeaders: [
          'WST员工',
          '合作商咨询人数',
          '合作商（社团）咨询人数',
          '合作商（其他）咨询人数',
          '合作商签约人数',
          '合作商签约咨询比（%）',
          '校园大使咨询人数',
          '校园大使签约人数',
          '校园大使签约咨询比（%）'
        ]
      },
      settings4: {
        // height: document.documentElement.clientHeight - 280,
        data: [],
        rowHeaders: true,
        stretchH: 'all',
        sortIndicator: true,
        columnSorting: true,
        copyable: false,
        fillHandle: false,
        colWidths: [25, 25, 25],
        hiddenColumns: {
          columns: [],
          indicators: false
        },
        readOnly: true,
        columns: [
          {
            data: 'cooperatorName'
          },
          {
            data: 'uniqueCode'
          },
          {
            data: 'cnyFee'
          },
          {
            data: 'bill'
          }
        ],
        beforeColumnSort: (oldVal, newVal) => {

        },
        colHeaders: [
          '合作商名',
          '渠道代码',
          '支出费用（人民币）',
          '入账金额（人民币）'
        ]
      },
      settings5: {
        // height: document.documentElement.clientHeight - 280,
        data: [],
        rowHeaders: true,
        stretchH: 'all',
        sortIndicator: true,
        columnSorting: true,
        copyable: false,
        fillHandle: false,
        colWidths: [25, 25, 25],
        hiddenColumns: {
          columns: [],
          indicators: false
        },
        readOnly: true,
        columns: [
          {
            data: 'ambassadorName'
          },
          {
            data: 'uniqueCode'
          },
          {
            data: 'cnyFee'
          },
          {
            data: 'bill'
          }
        ],
        beforeColumnSort: (oldVal, newVal) => {

        },
        colHeaders: [
          '校园大使名',
          '渠道代码',
          '支出费用（人民币）',
          '入账金额（人民币）'
        ]
      },
      settings6: {
        // height: document.documentElement.clientHeight - 280,
        data: [],
        rowHeaders: true,
        stretchH: 'all',
        sortIndicator: true,
        columnSorting: true,
        copyable: false,
        fillHandle: false,
        colWidths: [25, 25, 25],
        hiddenColumns: {
          columns: [],
          indicators: false
        },
        readOnly: true,
        columns: [
          {
            data: 'userName'
          },
          {
            data: 'cooperatorCnyFee'
          },
          {
            data: 'ambassadorCnyFee'
          },
          {
            data: 'cooperatorBill'
          },
          {
            data: 'ambassadorBill'
          }
        ],
        beforeColumnSort: (oldVal, newVal) => {

        },
        colHeaders: [
          'WST员工',
          '管辖合作商支出费用（人民币）',
          '管辖校园大使支出费用（人民币）',
          '管辖合作商入账金额（人民币）',
          '管辖校园大使入账金额（人民币）'
        ]
      },
      settings7: {
        // height: document.documentElement.clientHeight - 280,
        data: [],
        rowHeaders: true,
        stretchH: 'all',
        sortIndicator: true,
        columnSorting: true,
        copyable: false,
        fillHandle: false,
        colWidths: [25, 25, 25],
        hiddenColumns: {
          columns: [],
          indicators: false
        },
        readOnly: true,
        columns: [
          {
            data: 'cooperatorName'
          },
          {
            data: 'uniqueCode'
          },
          {
            data: 'cnyFee'
          },
          {
            data: 'counselorNum'
          }
        ],
        beforeColumnSort: (oldVal, newVal) => {

        },
        colHeaders: [
          '合作商名',
          '渠道代码',
          '支出费用（人民币）',
          '咨询人数'
        ]
      },
      settings8: {
        // height: document.documentElement.clientHeight - 280,
        data: [],
        rowHeaders: true,
        stretchH: 'all',
        sortIndicator: true,
        columnSorting: true,
        copyable: false,
        fillHandle: false,
        colWidths: [25, 25, 25],
        hiddenColumns: {
          columns: [],
          indicators: false
        },
        readOnly: true,
        columns: [
          {
            data: 'ambassadorName'
          },
          {
            data: 'uniqueCode'
          },
          {
            data: 'cnyFee'
          },
          {
            data: 'counselorNum'
          }
        ],
        beforeColumnSort: (oldVal, newVal) => {

        },
        colHeaders: [
          '校园大使名',
          '渠道代码',
          '支出费用（人民币）',
          '咨询人数'
        ]
      },
      settings9: {
        // height: document.documentElement.clientHeight - 280,
        data: [],
        rowHeaders: true,
        stretchH: 'all',
        sortIndicator: true,
        columnSorting: true,
        copyable: false,
        fillHandle: false,
        colWidths: [25, 25, 25],
        hiddenColumns: {
          columns: [],
          indicators: false
        },
        readOnly: true,
        columns: [
          {
            data: 'userName'
          },
          {
            data: 'cooperatorCnyFee'
          },
          {
            data: 'ambassadorCnyFee'
          },
          {
            data: 'cooperatorCounselorNum'
          },
          {
            data: 'ambassadorCounselorNum'
          }
        ],
        beforeColumnSort: (oldVal, newVal) => {

        },
        colHeaders: [
          'WST员工',
          '管辖合作商支出费用（人民币）',
          '管辖校园大使支出费用（人民币）',
          '管辖合作商咨询人数',
          '管辖校园大使咨询人数'
        ]
      },
      settings10: {
        // height: document.documentElement.clientHeight - 280,
        data: [],
        rowHeaders: true,
        stretchH: 'all',
        sortIndicator: true,
        columnSorting: true,
        copyable: false,
        fillHandle: false,
        colWidths: [25, 25, 25],
        hiddenColumns: {
          columns: [],
          indicators: false
        },
        readOnly: true,
        columns: [
          {
            data: 'cooperatorName'
          },
          {
            data: 'uniqueCode'
          },
          {
            data: 'cnyFee'
          },
          {
            data: 'signCount'
          }
        ],
        beforeColumnSort: (oldVal, newVal) => {

        },
        colHeaders: [
          '合作商名',
          '渠道代码',
          '支出费用（人民币）',
          '签约人数'
        ]
      },
      settings11: {
        // height: document.documentElement.clientHeight - 280,
        data: [],
        rowHeaders: true,
        stretchH: 'all',
        sortIndicator: true,
        columnSorting: true,
        copyable: false,
        fillHandle: false,
        colWidths: [25, 25, 25],
        hiddenColumns: {
          columns: [],
          indicators: false
        },
        readOnly: true,
        columns: [
          {
            data: 'ambassadorName'
          },
          {
            data: 'uniqueCode'
          },
          {
            data: 'cnyFee'
          },
          {
            data: 'signCount'
          }
        ],
        beforeColumnSort: (oldVal, newVal) => {

        },
        colHeaders: [
          '校园大使名',
          '渠道代码',
          '支出费用（人民币）',
          '签约人数'
        ]
      },
      settings12: {
        // height: document.documentElement.clientHeight - 280,
        data: [],
        rowHeaders: true,
        stretchH: 'all',
        sortIndicator: true,
        columnSorting: true,
        copyable: false,
        fillHandle: false,
        colWidths: [25, 25, 25],
        hiddenColumns: {
          columns: [],
          indicators: false
        },
        readOnly: true,
        columns: [
          {
            data: 'userName'
          },
          {
            data: 'cooperatorCnyFee'
          },
          {
            data: 'ambassadorCnyFee'
          },
          {
            data: 'cooperatorSignCount'
          },
          {
            data: 'ambassadorSignCount'
          }
        ],
        beforeColumnSort: (oldVal, newVal) => {

        },
        colHeaders: [
          'WST员工',
          '管辖合作商支出费用（人民币）',
          '管辖校园大使支出费用（人民币）',
          '管辖合作商签约人数',
          '管辖校园大使签约人数'
        ]
      }
    }
  },
  created () {},
  mounted () {
  },
  methods: {
    Topage () {
      this.settings.data = []
      this.settings2.data = []
      this.settings3.data = []
      if ((new Date(this.endDate)).valueOf() <= (new Date(this.beginDate)).valueOf()) {
        this.$message({
          message: '起始日期不可晚于截止日期',
          type: 'warning'
        })
        return false
      }
      this.fullscreenLoading = true
      let data = {}
      data = {
        endDate: this.endDate,
        beginDate: this.beginDate,
        userId: 'ALL_Data'
      }
      api.getBdConsulting2(data).then(res => {
        console.log(res, 'yx*******')
        const data1 = res.data.cooperatorConversionRate
        const data2 = res.data.ambassadorConversionRate
        const data3 = res.data.manageByConversionRate

        data1.forEach(item => {
          item.number = item.counselorNum ? ((item.signCount / item.counselorNum * 100).toFixed(2)) : 0
        })

        this.title = `合作商转化率 \xa0\xa0\xa0\xa0 转化金额（净入账金额）: ${res.data.cooperatorBill}  转化总人数：${res.data.cooperatorSignTotalCount}`,
        data2.forEach(item => {
          item.number = item.counselorNum ? ((item.signCount / item.counselorNum * 100).toFixed(2)) : 0
        })
        this.title2 = `校园大使转化率 \xa0\xa0\xa0\xa0 转化金额（净入账金额）: ${res.data.ambassadorBill}  转化总人数：${res.data.ambassadorSignTotalCount}`,
        data3.forEach(item => {
          item.cooperatorNumber = item.cooperatorCounselorNum ? ((item.cooperatorSignCount / item.cooperatorCounselorNum * 100).toFixed(2)) : 0
          item.ambassadorNumber = item.ambassadorCounselorNum ? ((item.ambassadorSignCount / item.ambassadorCounselorNum * 100).toFixed(2)) : 0
        })

        this.title4 = `合作商ROI 支出总费用（￥${res.data.cooperatorCnyFee}） 入账总金额（￥${res.data.cooperatorBill}）`
        this.title5 = `校园大使ROI 支出总费用（￥${res.data.ambassadorCnyFee}） 入账总金额（￥${res.data.ambassadorBill}）`
        this.title6 = `WST员工（管辖合作商与校园大使）ROI 合作商支出总费用（￥${res.data.manageByCooperatorCnyFee}） 校园大使支出总费用（￥${res.data.manageByAmbassadorCnyFee}）  合作商入账总金额（￥${res.data.manageByCooperatorBill}）  校园大使入账总费用（￥${res.data.manageByAmbassadorBill}）`
        this.title7 = `合作商获客成本 支出总费用（￥${res.data.cooperatorCnyFee}） 咨询总人数（${res.data.cooperatorCounselorTotalNum}）`
        this.title8 = `校园大使获客成本 支出总费用（￥${res.data.ambassadorCnyFee}） 咨询总人数（${res.data.ambassadorCounselorTotalNum}）`
        this.title9 = `WST员工（管辖合作商与校园大使）获客成本 合作商支出总费用（￥${res.data.manageByCooperatorCnyFee}） 校园大使支出总费用（￥${res.data.manageByAmbassadorCnyFee}）  合作商咨询总人数（${res.data.manageByCooperatorCounselorTotalNum}）  校园大使咨询总人数（${res.data.manageByAmbassadorCounselorTotalNum}）`
        this.title10 = `合作商签约成本 支出总费用（￥${res.data.cooperatorCnyFee}） 签约总人数（${res.data.cooperatorSignTotalCount}）`
        this.title11 = `校园大使签约成本 支出总费用（￥${res.data.ambassadorCnyFee}） 签约总人数（${res.data.ambassadorSignTotalCount}）`
        this.title12 = `WST员工（管辖合作商与校园大使）签约成本 合作商支出总费用（￥${res.data.manageByCooperatorCnyFee}） 校园大使支出总费用（￥${res.data.manageByAmbassadorCnyFee}）  合作商签约总人数（${res.data.manageByCooperatorSignTotalCount}）  校园大使签约总人数（${res.data.manageByAmbassadorSignTotalCount}）`

        this.settings.data = data1
        this.settings2.data = data2
        this.settings3.data = data3
        this.settings4.data = res.data.cooperatorROI
        this.settings5.data = res.data.ambassadorROI
        this.settings6.data = res.data.manageByROI
        this.settings7.data = res.data.cooperatorCounselorCost
        this.settings8.data = res.data.ambassadorCounselorCost
        this.settings9.data = res.data.manageByCounselorCost
        this.settings10.data = res.data.cooperatorSignCost
        this.settings11.data = res.data.ambassadorSignCost
        this.settings12.data = res.data.manageBySignCost
        this.fullscreenLoading = false
      })
    },
    exportFile () { // 导出
      const handsontable = this.$refs.moneyTable.$data.hotInstance
      const fileName = 'BD_咨询报表_'
      const exportPlugin1 = handsontable.getPlugin('exportFile')
      exportPlugin1.downloadFile('csv', {
        bom: true,
        columnHeaders: true,
        exportHiddenColumns: false,
        exportHiddenRows: false,
        fileExtension: 'csv',
        filename: fileName + '[YYYY]-[MM]-[DD]',
        mimeType: 'text/csv',
        rowDelimiter: '\r\n',
        rowHeaders: true
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.sales_conversion{
  overflow: hidden;
  overflow-y: auto;
}
.sales_assistant {

  .upload {
    display: flex;
    align-items: center;
    .el-upload-list__item:first-child {
      margin-top: 0;
    }
  }
}
.el-card_teyx123{
  .el-card__body{
    padding:10px 10px 0 10px !important
  }
}

.elementHeightyx{
  .el-collapse-item__content{
    padding-bottom: 0px;
  }
  .el-collapse-item__wrap{
    border-bottom: none;
  }
}
</style>
