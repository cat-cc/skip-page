<template>
    <article class="skip-page">
        <section v-show="config.showGoBack" class="go-back" :title="config.goBackTitle">
            <el-button
                icon="el-icon-back"
                :disabled="config.disabledGoBack"
                @click="config.goBack()"
                circle
            ></el-button>
        </section>
        <section class="skip-page-component">
            <div v-show="!keepAlive.component">
                <slot></slot>
            </div>
            <keep-alive v-show="keepAlive.component" :include="keepAlive.include">
                <component :is="keepAlive.component" v-bind="keepAlive.props" v-on="keepAlive.emit"></component>
            </keep-alive>
        </section>
        <section class="skip-page-breadcrumb" v-show="config.showBreadcrumb">
            <span v-for="(node, i) in keepAlive.path" :key="i">
                <slot name="separator">
                    <span v-if="i != 0" class="breadcrumb-separator">/</span>
                </slot>
                <span :class="['breadcrumb-text', node == keepAlive.node ? 'is-link' : '']" @click="handlePath(node)">
                    {{ _getBreadcrumbText(node) }}
                </span>
            </span>
        </section>
    </article>
</template>

<script>
import Tree from './tree.js'
import _defaults from 'lodash/defaults'
import _get from 'lodash/get'

export default {
    name: 'skipPage',
    watch: {
        'keepAlive.node': {
            handler: function(node, oldNode) {
                let tree = this.keepAlive.tree
                if (!tree) return
                if (!node) return (this.keepAlive.node = tree.getRoot())

                this.clearPath(node, oldNode)
                this.keepAlive.include = this._getAllName() // Cache list
                this.keepAlive.path = node.getPath()

                this.keepAlive.props = _get(node, 'skipPage.props')
                this.keepAlive.emit = _get(node, 'skipPage.emit')
                this.config.disabledGoBack = node == tree.getRoot()
                this.keepAlive.component = node.getData()
                //this.log()
            },
            immediate: true
        },
        props: {
            handler: function(item) {
                this.config = _defaults(item, this.config)
            },
            immediate: true
        }
    },
    props: {
        props: {
            type: Object
        }
    },
    data() {
        return {
            config: {
                main: '主页',
                goBackTitle: '返回',
                showGoBack: true,
                disabledGoBack: true,
                showBreadcrumb: true,
                goBack: () => {
                    this.skip(-1)
                }
            },
            keepAlive: {
                tree: new Tree({ propertys: ['title', 'name', 'skipPage'] }),
                include: [], //缓存名称列表
                path: [],
                node: null, //当前节点

                component: null,
                props: {},
                emit: {}
            }
        }
    },
    methods: {
        /**
         * @param component {Number | string | Object} 跳转到component
         * @param config:
         * {
               title: 'page title',
               cache: false,
               props: {},
               emit:{}
            }
         */
        skip(component, config) {
            if (component && component.constructor === Object) {
                component.skipPage = config || {}
            }
            if (this._isInteger(component)) this.skipNum(component)
            else this.skipName(component)
        },
        /**
         *
         * @description {以数字 {前进 | 回退} 进行跳转 (暂不支持正数与0)}
         *
         * @todo 赋值当前节点 & 清除不缓存的节点
         *
         * @param num {Number} 前进或后退的层数，负数回退，正数前进
         * @param keepCache 是否缓存，回退有效
         * main-->a.vue-->b.vue
         * ----->>> 前进方向 （下标变大）
         * <<<----- 回退方向 （下标变小）
         */
        skipNum(num) {
            if (num > 0) return

            let tree = this.keepAlive.tree
            let node = this.keepAlive.node
            num = Math.abs(num)

            for (let i = 0; i < num; i++) {
                if (!node) break
                node = tree.getParent(node)
            }

            this.keepAlive.node = node || tree.getRoot()
        },
        skipName(component) {
            let tree = this.keepAlive.tree
            let name = this._getComponentName(component)
            let node = name ? tree.findNode(v => v && v.name == name) : tree.getRoot()

            if (!node) {
                return (this.keepAlive.node = tree.addNode(this.keepAlive.node, component))
            }

            this.keepAlive.node = node
        },
        _isInteger(num) {
            return parseInt(num, 10) === num
        },
        _getComponentName(component = {}) {
            return (typeof component == 'string' && component) || component.name
        },
        _getAllName() {
            let names = []
            this.keepAlive.tree.forEach(v => {
                v && v.name && names.push(v.name)
            })
            return names
        },
        handlePath(node) {
            let component = node.getData()
            this.skip(component)
        },
        clearComponent(component = {}) {
            let tree = this.keepAlive.tree
            let name = this._getComponentName(component)
            let node = tree.findNode(v => v && v.name == name)
            if (node && node != tree.getRoot()) this.keepAlive.tree.delNode(node)
        },
        clearPath(node, oldNode) {
            if (!node || !oldNode) return

            let tree = this.keepAlive.tree
            let path = tree.getPath(node, oldNode, true)
            path.splice(0, 1) // do not remove node

            let clearHead = null
            for (let i = path.length - 1; i >= 0; i--) {
                let cache = _get(path[i], 'skipPage.cache')
                if (cache == true) {
                    clearHead = path[i + 1]
                    break
                }
                clearHead = path[i]
            }
            if (clearHead) tree.delNode(clearHead)
        },
        _getBreadcrumbText(node) {
            let title = _get(node, 'skipPage.title')
            return title || _get(node, 'name') || this.config.main
        },
        log() {
            let repeat = (str, n) => {
                let result = ''
                for (let i = 0; i < n; i++) {
                    result = result + str
                }
                return result
            }
            let rs = ''
            this.keepAlive.tree.forEach((v, n, i) => {
                rs = rs + repeat('*', i + 2) + ((v && v.name) || 'Root')
            })
            /* eslint-disable no-console */
            console.log(rs)
        }
    }
}
</script>
<style lang="less" scoped>
.skip-page {
    position: relative;
    height: 100%;
    width: 100%;

    display: flex;
    box-sizing: border-box;
    flex-direction: column;
}

.skip-page-component {
    flex: 1 1;
}

.skip-page-breadcrumb {
    position: fixed;
    bottom: 4px;
    right: 4px;

    .breadcrumb-text {
        font-size: 14px;
        cursor: pointer;
        &.is-link {
            font-weight: 700;
            color: #303133;
        }
        &:hover {
            color: #66b1ff;
        }
    }
    .breadcrumb-separator {
        font-size: 12px;
    }
}

.go-back {
    position: absolute;
    top: 4px;
    right: 4px;
    z-index: 2;
    /deep/ i {
        font-weight: 900;
        font-size: 16px;
    }
}
</style>
