<template>
    <el-dialog title="团队年度入账详情" :visible.sync="groupKpiVisible" width="900px" :append-to-body="true" :before-close="close">
        <el-table
            :data="teamRevenueArr"
            stripe
            size="mini"
            style="width: 100%">
            <el-table-column
            label="订单号"
            width="180">
                <template slot-scope="scope">
                    <el-tag slot="reference" size="medium">{{ scope.row.orderId }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column
            prop="kpiPeriod"
            label="入账KPI月份"
            width="">
            </el-table-column>
            <el-table-column
            label="入账金额">
            <template slot-scope="scope">
                <span >{{(scope.row.revenueType).toUpperCase()}}:{{scope.row.revenue}}</span>
            </template>
            </el-table-column>
            <el-table-column
            label="入账等值人民币">
            <template slot-scope="scope">
                <span >{{scope.row.totalInCny}}</span>
            </template>
            </el-table-column>
            <el-table-column
            prop="revenueDate"
            label="入账时间"
            width="">
            </el-table-column>
            <el-table-column
            prop="payWay"
            label="付款方式"
            width="">
            </el-table-column>
            <el-table-column
            prop="contact1Name"
            label="主联系人"
            width="">
            </el-table-column>
            <el-table-column
            prop="contact1GroupName"
            label="主联系人所在小组"
            width="">
            </el-table-column>
            <el-table-column
            prop="contact2Name"
            label="副联系人"
            width="">
            </el-table-column>
            <el-table-column
            prop="contact2GroupName"
            label="副联系人所在小组"
            width="">
            </el-table-column>
            <el-table-column
            label="分成占比"
            width="">
                <template slot-scope="scope">
                    <span >{{scope.row.proportion || '空'}}</span>
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
        groupKpiVisible: {
            type: Boolean,
            default: false
        },
        teamRevenueArr:{
            type: Array
        }
    },
     watch:{
        groupKpiVisible: function(val) {
            if (val) {
                this.initPage();
            }
        },
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
        }
    }
}
</script>
<style  scoped>
    .weightFont{
        font-weight: 700;
    }
</style>