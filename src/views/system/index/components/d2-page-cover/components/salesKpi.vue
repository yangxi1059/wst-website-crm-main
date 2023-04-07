<template>
    <el-dialog title="销售提成详情" :visible.sync="detailSaleKpiVisible" width="900px" :append-to-body="true" :before-close="close">
        <el-table
            :data="salesData.billArr"
            stripe
            style="width: 100%">
            <el-table-column
            label="订单号"
            width="180">
                <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top">
                        <p><span class="weightFont">主联系人: </span>{{ scope.row.contactName1 }}</p>
                        <p v-if="scope.row.contactName2"><span class="weightFont">副联系人: </span>{{ scope.row.contactName2 }}</p>
                        <p v-if="scope.row.vipRecommenderName"><span class="weightFont">VIP同事推荐人: </span>{{ scope.row.vipRecommenderName }}</p>
                        <p><span class="weightFont">此订单汇率: </span>{{ scope.row.exchangeRate }}</p>
                        <p v-if="scope.row.commissionAmount > 0"><span class="weightFont">佣金金额: </span>{{ scope.row.commissionAmount }}</p>
                        <p v-if="scope.row.discountStatus == 1"><span class="weightFont">是否是折扣订单: </span>是</p>
                        <p v-else><span class="weightFont">是否是折扣订单: </span>否</p>
                        <p v-if="scope.row.discountProportion > 0"><span class="weightFont">折扣比例: </span>{{scope.row.discountProportion}}</p>
                        <div slot="reference" class="name-wrapper">
                            <el-tag size="medium">{{ scope.row.orderId }}</el-tag>
                        </div>
                    </el-popover>
                </template>

            </el-table-column>

            <el-table-column
            prop="realName"
            label="学生名"
            width="">
            </el-table-column>

            <el-table-column
            prop="kpiPeriod"
            label="KPI 月份"
            width="">
            </el-table-column>
            <el-table-column
            width="180"
            label="入账金额（实际到账）">
            <template slot-scope="scope">
                <span > {{scope.row.revenueType?(scope.row.revenueType).toUpperCase():''}}:{{scope.row.revenue}}( {{scope.row.currencyType?(scope.row.currencyType).toUpperCase():''}}:{{scope.row.actualAmount}} )</span>
            </template>
            </el-table-column>
            <el-table-column
            prop="revenueDate"
            label="入账时间"
            width="">
            </el-table-column>
            
            <el-table-column
            label="提成比例"
            width="">
                <template slot-scope="scope">
                    <span v-if="scope.row.billBrokerageRate">{{scope.row.billBrokerageRate}}%</span>
                    <span v-else>空</span>

                </template>
            </el-table-column>
            <el-table-column
            label="分成占比"
            width="">
                <template slot-scope="scope">
                    <span >{{scope.row.kpi || '空'}}</span>
                </template>
            </el-table-column>
            <el-table-column
            label="销售提成"
            width="">
                <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top">
                        <p><span class="weightFont">提成规则: </span>{{ scope.row.brokerageFormula }}</p>
                        <div slot="reference" class="name-wrapper">
                            <el-tag size="medium">{{ scope.row.brokerageAmount }}</el-tag>
                        </div>
                    </el-popover>
                </template>
            </el-table-column>
        </el-table>
        <span slot="footer">
            <el-button @click="close">关 闭</el-button>
        </span>
        </el-dialog>
</template>

<script>
export default {
    name:'detailSaleKpi',
    props:{
        detailSaleKpiVisible: {
            type: Boolean,
            default: false
        },
        salesData:{
            type: Object
        }
    },
     watch:{
        detailSaleKpiVisible: function(val) {
            if (val) {
                this.initPage();
            }
        },
        salesData: function(){

        }
    },
    data(){
        return{
        }
    },
    methods:{
        close(){
            this.$emit('close')
        },
        initPage(){
            console.log(this.salesData,'yx1231531534')
            
        }
    }
}
</script>
<style  scoped>
    .weightFont{
        font-weight: 700;
    }
</style>