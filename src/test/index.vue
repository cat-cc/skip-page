<template>
    <skip-page ref="skipPage">
        <h3>1：Main page</h3>
        <el-button-group>
            <el-button type="primary" @click="toNext">
                next page
                <i class="el-icon-arrow-right el-icon--right"></i>
            </el-button>
            <el-button @click="() => this.toggle(page2Config)">cache next page : {{ page2Config.cache }}</el-button>
        </el-button-group>
    </skip-page>
</template>

<script>
import page2Component from './page2.vue'
import skipPage from '@/lib/skip-page.vue'

export default {
    name: 'skip-page-test',
    components: { skipPage },
    data() {
        return {
            page2Config: {
                cache: false,
                title: 'cat',
                props: {
                    obj: { val: 'world' }
                },
                emit: {
                    show: p => {
                        this.$message.success('emit--' + p)
                    }
                }
            }
        }
    },
    methods: {
        toggle(obj) {
            obj.cache = !obj.cache
        },
        toNext() {
            this.$refs.skipPage.skip(page2Component, this.page2Config)
        }
    }
}
</script>

<style lang="less" scoped>
/deep/ .go-back {
    top: 25px;
    right: 30px;
}
</style>
