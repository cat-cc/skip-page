import _pick from 'lodash/pick'

export default class TreeNode {
    constructor(config = {}) {
        this.propertys = config.propertys || ['id', 'name']
        this.propertys.$data = config.$data || '$data'
        this.propertys.$children = config.$children || '$children'
        this.propertys.$parent = config.$parent || '$parent'
        this.propertys.$mark = 'NodeMark' //节点标志
        this.propertys.$Level = '$Level' //层级

        this.root = this.pack(config.root)
    }

    pack(data) {
        let node = _pick(data, this.propertys)

        node[this.propertys.$mark] = true //节点标记
        node[this.propertys.$Level] = 0 //节点标记，根节点为0
        node[this.propertys.$data] = data
        node[this.propertys.$children] = []
        node[this.propertys.$parent] = undefined

        node.addNode = child => this.addNode(node, child)
        node.delNode = () => this.delNode(node)
        node.getRoot = () => this.getRoot()
        node.getData = () => this.getData(node)
        node.findNode = judge => this.findNode(judge)
        node.getParent = () => this.getParent(node)
        node.getLevel = () => this.getLevel(node)
        node.getPath = () => this.getPath(this.root, node, true)

        return node
    }
    /**
     *
     * @param { Function(data,Node) } judge
     * @param { node default root } node
     */
    findNode(judge) {
        if (!judge instanceof Function) throw Error('The param of findNode must be Function')
        return this.forEach((data, node) => judge(data, node))
    }
    /**
     *
     * @param {*} run  when _call function return true, then stop and return node
     */
    forEach(_call, node) {
        if (!_call instanceof Function) throw Error('The param of forEach must be Function')
        let _travel = (arrry, count) => {
            for (let i = arrry.length - 1; i >= 0; i--) {
                let item = arrry[i]
                let callRs = _call(this.getData(item), item, count)
                if (callRs) return item

                if (this.hasChildren(item)) {
                    let result = _travel(this.getChildren(item), count + i)
                    if (result) return result
                }
            }
        }
        return _travel([node || this.root], -1)
    }
    /**
     *
     * @param {Node} pnode
     * @param {Node | data} node
     */
    addNode(pnode, node) {
        if (!pnode || !node) throw Error('The param of addNode could not be undefined!')
        if (pnode == node) throw Error('Param pnode eq node is not  allow!')

        if (!this.isNode(node)) node = this.pack(node)

        this.getChildren(pnode).push(node)
        node[this.propertys.$Level] = pnode.getLevel() + 1
        node[this.propertys.$parent] = pnode

        return node
    }
    delNode(node) {
        if (!node) return
        if (node == this.root) throw Error('Removal of root node is not  allow!')

        let pnode = node[this.propertys.$parent]
        let children = this.getChildren(pnode)

        for (let i = children.length - 1; i >= 0; i--) {
            if (children[i] == node) {
                children[i][this.propertys.$parent] = undefined
                return children.splice(i, 1)
            }
        }
    }
    /**
     * 返回两节点的路径
     * @param {Node} pnode
     * @param {Node} son
     * @param {Boolean} notExchangeable
     * @returns 【pnode,...,node】
     */
    getPath(pnode, son, notExchangeable) {
        if (pnode == son) return [pnode]

        if (!notExchangeable && pnode.getLevel() > son.getLevel()) {
            let temp = pnode
            pnode = son
            son = temp
        }
        let path = [son]
        let pn = son
        do {
            pn = pn.getParent()
            path.push(pn)
            if (pn == pnode) return path.reverse()
        } while (pn)

        return []
    }

    isNode(node) {
        return node && node[this.propertys.$mark]
    }
    getRoot() {
        return this.root
    }
    getData(node) {
        if (this.isNode(node)) return node[this.propertys.$data]
    }
    hasChildren(node) {
        let children = node && node[this.propertys.$children]
        return children && children.length > 0
    }
    getLevel(node) {
        return node && node[this.propertys.$Level]
    }
    getChildren(node) {
        return node && node[this.propertys.$children]
    }
    getParent(node) {
        return node && node[this.propertys.$parent]
    }
}
