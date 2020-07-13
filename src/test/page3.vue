<template>
    <div>
        <h3>page 3</h3>
        <el-input placeholder="请输入内容" v-model="data">
            <template slot="prepend">props Object.value</template>
        </el-input>
        <br />
        <el-button-group>
            <el-button type="primary" icon="el-icon-arrow-left" @click="previous">previous : skip(-1)</el-button>
            <el-button type="primary" icon="el-icon-s-promotion" @click="skipByName">previous : skip('page')</el-button>
            <el-button type="primary" iocn="el-icon-s-home" @click="toMain">main page</el-button>
        </el-button-group>
    </div>
</template>

<script>
export default {
    name: 'page3',
    data() {
        return {
            data: ''
        }
    },
    methods: {
        previous() {
            this.$parent.skip(-1)
        },
        skipByName() {
            this.$parent.skip('page2')
        },
        toMain() {
            this.$parent.skip()
        }
    }
}
</script>

<style lang="less" scoped>
/deep/ el-button-group {
    padding-bottom: 20px;
    width: 70%;
}
/deep/ .el-input {
    padding-bottom: 20px;
    width: 70%;
}
</style>
