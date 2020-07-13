<template>
    <div>
        <h3>page 2</h3>
        <el-input placeholder="请输入内容" v-model="obj.val">
            <template slot="prepend">props</template>
        </el-input>

        <el-input placeholder="请输入内容" v-model="data">
            <template slot="prepend">data</template>
        </el-input>

        <el-button-group>
            <el-button type="primary" icon="el-icon-arrow-left" @click="previous">previous page</el-button>
            <el-button type="primary" @click="toNext">
                nex page
                <i class="el-icon-arrow-right el-icon--right"></i>
            </el-button>
            <el-button @click="() => this.toggle(page3Config)">cache next page: {{ page3Config.cache }}</el-button>
        </el-button-group>
        <el-button-group>
            <el-button type="danger" icon="el-icon-umbrella" @click="event">emit event</el-button>
        </el-button-group>
    </div>
</template>

<script>
import page3 from './page3.vue'

export default {
    name: 'page2',
    props: ['obj'],
    data() {
        return {
            data: '',
            page3Config: {
                cache: true,
                title: 'dog',
                props: {},
                emit: {}
            }
        }
    },
    methods: {
        toNext() {
            this.$parent.skip(page3, this.page3Config)
        },
        previous() {
            this.$parent.skip(-1)
        },
        toggle(obj) {
            obj.cache = !obj.cache
        },
        event() {
            this.$emit('show', 'hello')
        }
    }
}
</script>

<style lang="less" scoped>
/deep/ .el-button-group,
.el-input {
    padding-bottom: 20px;
    width: 70%;
}
</style>
